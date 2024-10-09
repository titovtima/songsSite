<template>
  <div>
    <h1 class="header" :contenteditable="editMode" @input="(event: any) => { songData.name = event.target.textContent; }">
      {{ songData.name ? songData.name : '' }}
    </h1>
    <div>
      <div class="type-button-wrap">
        <button class="type-button" ref="textTypeButton"
                :class="{ active: view == 'Text', hidden: toValue(textParts).length == 0 && !editMode }">Текст
        </button>
      </div>
      <div class="type-button-wrap">
        <button class="type-button" ref="chordsTypeButton"
                :class="{ active: view == 'Chords', hidden: toValue(chordsParts).length == 0 && !editMode }">Аккорды
        </button>
      </div>
      <div class="type-button-wrap">
        <button class="type-button" ref="chordsTextTypeButton"
                :class="{ active: view == 'ChordsText', hidden: toValue(chordsTextParts).length == 0 && !editMode }">
          Аккорды в тексте
        </button>
      </div>
    </div>
    <div class="song-rights" v-if="songRights && editMode">
      <label>Владелец:</label>
      <input type="text" v-model="newSongRights.owner" :disabled="!editMode || (songRights.owner != userData.username && !userData.isAdmin)"/>
      
      <label>Редакторы:</label>
      <StringsListInput v-if="editMode" v-model:list="newSongRights.writers"/>
      <div v-else>{{ songRights.writers.join(',') }}</div>
      
      <label>Читатели:</label>
      <StringsListInput v-if="editMode" v-model:list="newSongRights.readers"/>
      <div v-else>{{ songRights.readers.join(',') }}</div>
    </div>
    <div v-if="songRights && editMode" class="flex mt-2">
      <label class="flex" style="align-items: center;">
        Приватная
        <input class="mx-1" type="checkbox" :disabled="!editMode || !userData.isAdmin"
            :checked="!songData.public" @change="(event: any) => songData.public = !event.target.checked"/>
      </label>
      <label v-if="userData.isAdmin" class="ml-5 flex" style="align-items: center;">
        В основном списке
        <input class="mx-1" type="checkbox" :disabled="!editMode" v-model="songData.inMainList"/>
      </label>
    </div>
    <KeySwitch v-if="songData.key != null || editMode" v-model:original="songData.key" class="mt-2"/>
    <div class="parts-list overflow-x-auto">
      <div class="overflow-x-hidden min-w-min">
        <SongPart edit-mode v-for="part in viewParts" :data="part" :general-key="songData.key"
            @update-order="(event) => { updatePartsOrder(event); }"/>
        <div style="display: flex; align-items: center; flex-direction: column">
          <button class="mb-5 p-2 bg-white" :class="{ hidden: !editMode }" @click="() => { addPart(); }">
            Добавить часть
          </button>
        </div>
      </div>
    </div>
    <div>
      <audio controls v-for="audio in songData.audios" :src="apiRequests.apiUrl + '/audio/' + audio">аудио</audio>
    </div>
    <div>
      <pre v-if="!editMode" class="p-2 w-full overflow-x-auto" ref="extraText">{{ 
        toValue(songData).extra 
      }}</pre>
      <textarea v-else v-model="songData.extra" class="p-2 w-full overflow-x-auto"
          @input="(event: any) => fitTextareaHeight(event.target)"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import { fitTextareaHeight, getTransposedText } from "~/utils/global";

const route = useRoute();
const router = useRouter();
const songId = String(route.params.id);

const textTypeButton: any = ref(null);
const chordsTypeButton: any = ref(null);
const chordsTextTypeButton: any = ref(null);

const songData: any = ref({parts: [], audios: []});
const songRights: any = ref(null);
const newSongRights: any = ref({owner: '', writers: [], readers: []});
const userData: any = useState('userData');
const canEdit = useState('canEdit');
watch(songRights, rights => {
  newSongRights.value = rights;
  apiRequests.checkAuthorized().then(() => {
    canEdit.value = userData.value.isAdmin || userData.value.username == rights.owner ||
      rights.writers.includes(userData.value.username);
  }).catch(() => {});
});
const view = useCookie('view', {path: '/song/'});
if (!view.value)
  view.value = 'Text';

const textParts = computed(() => songData.value.parts.filter((part: { type: string; }) => part.type == 'Text'));
const chordsParts = computed(() => songData.value.parts.filter((part: { type: string; }) => part.type == 'Chords'));
const chordsTextParts = computed(() => songData.value.parts
  .filter((part: { type: string; }) => part.type == 'ChordsText'));
const viewParts = computed(() => {
  if (view.value == 'Text') return toValue(textParts).sort((value: any) => value.ord);
  else if (view.value == 'Chords') return toValue(chordsParts).sort((value: any) => value.ord);
  else return toValue(chordsTextParts).sort((value: any) => value.ord);
});

const editMode: any = useState('editMode');
if (route.query['edit']) {
  watch(userData, () => {
    editMode.value = true;
  }, {once: true});
}

const keyShift = useState('keyShift');
const shiftOriginalKey: any = useState('shiftOriginalKey');

watch(shiftOriginalKey, (shift: any) => {
  songData.value.parts.forEach((part: any) => {
    if (editMode.value && shift.shift != 0 && part.type != 'Text' && (part.key != null || songData.value.key != null)) {
      part.data = getTransposedText(part.data, shift.original, shift.shift, part.type == 'ChordsText');
    }
  })
});

if (songId == 'new') {
  songData.value = {
    name: 'Новая песня',
    parts: [],
    audios: [],
    performances: [],
    key: null,
    public: false,
    inMainList: true,
  };
  songRights.value = {
    owner: '',
    writers: [],
    readers: [],
  };
  apiRequests.checkAuthorized().then(() => {
    songRights.value.owner = userData.value.username;
  }).catch(() => {
    throw createError({
      statusCode: 404,
      statusMessage: 'Песня не найдена'
    });
  });
} else {
  try {
    songData.value = await apiRequests.getSong(Number(songId));
  } catch (e) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Песня не найдена'
    });
  }

  apiRequests.getSongRights(Number(songId))
    .then(response => {
      songRights.value = response;
    }).catch(() => {});
}

useHead({title: songData.value.name});

definePageMeta({
  middleware: (to, from) => {
    const navState: any = useState('navigation');
    if (from.name == 'songs_list-id' && to.name == 'song-id') {
      navState.value.listId = Number(from.params.id);
    }
  }
});

watch(editMode, () => {
  if (editMode.value) {
    keyShift.value = 0;
  }
});

const extraText: any = ref(null);
onMounted(() => {
  textTypeButton.value.onclick = () => {
    view.value = 'Text';
  }
  chordsTypeButton.value.onclick = () => {
    view.value = 'Chords';
  }
  chordsTextTypeButton.value.onclick = () => {
    view.value = 'ChordsText';
  }
  makeLinksInString(extraText.value, songData.value.extra);
});

function makeLinksInString(elem: any, string: string) {
  if (!string) return;
  const linkStart = 'https://';
  let index = string.indexOf(linkStart);
  let endLink = 0;
  elem.innerHTML = '';
  while (index !== -1) {
    elem.append(string.substring(endLink, index));
    endLink = string.split('').findIndex((value, ind) =>
      ind >= index + linkStart.length && [' ', ',', ';', ')', '(', '\n'].some(it => it === value));
    if (endLink === -1)
      endLink = string.length;
    let linkString = string.substring(index, endLink);
    let link = document.createElement('a');
    link.append(linkString);
    link.href = linkString;
    link.target = '_blank';
    link.style.color = '#06c';
    elem.append(link);
    index = string.indexOf(linkStart, endLink);
  }
  elem.append(string.substring(endLink));
}

function addPart() {
  if (view.value == 'Text') {
    let ord = toValue(textParts).reduce((acc: number, value: any) => Math.max(acc, value.ord), 0);
    songData.value.parts.push({type: 'Text', data: '', name: '', key: null, ord: ord + 1});
  } else if (view.value == 'Chords') {
    let ord = toValue(chordsParts).reduce((acc: number, value: any) => Math.max(acc, value.ord), 0);
    songData.value.parts.push({type: 'Chords', data: '', name: '', key: null, ord: ord + 1});
  } else {
    let ord = toValue(chordsTextParts).reduce((acc: number, value: any) => Math.max(acc, value.ord), 0);
    songData.value.parts.push({type: 'ChordsText', data: '', name: '', key: null, ord: ord + 1});
  }
}

function updatePartsOrder(event: any) {
  let partsList = songData.value.parts.filter((value: any) => value.type != event.part.type || value.ord != event.part.ord);
  if (event.action == 'up') {
    event.part.ord -= 1.5;
    partsList.push(event.part);
  } else if (event.action == 'down') {
    event.part.ord += 1.5;
    partsList.push(event.part);
  }
  let textPartsList = partsList.filter((value: any) => value.type == 'Text');
  textPartsList.sort((a: any, b: any) => a.ord - b.ord);
  for (let i = 0; i < textPartsList.length; i++) {
    textPartsList[i].ord = i + 1;
  }
  let chordsPartsList = partsList.filter((value: any) => value.type == 'Chords');
  chordsPartsList.sort((a: any, b: any) => a.ord - b.ord);
  for (let i = 0; i < chordsPartsList.length; i++) {
    chordsPartsList[i].ord = i + 1;
  }
  let chordsTextPartsList = partsList.filter((value: any) => value.type == 'ChordsText');
  chordsTextPartsList.sort((a: any, b: any) => a.ord - b.ord);
  for (let i = 0; i < chordsTextPartsList.length; i++) {
    chordsTextPartsList[i].ord = i + 1;
  }
  songData.value.parts = textPartsList.concat(chordsPartsList).concat(chordsTextPartsList);
}

const saveFunction = functionsRefs.saveFunction;
saveFunction.value = () => {
  let numberSongId = Number(songId);
  if (numberSongId) {
    console.log('saving data', songData.value);
    apiRequests.postSong(songId, songData.value);
    console.log('saving rights', newSongRights.value);
    apiRequests.postSongRights(numberSongId, newSongRights.value);
  } else if (songId == 'new') {
    console.log('saving data', songData.value);
    apiRequests.postSong(songId, songData.value)
      .then(response => {
        console.log(response);
        let newSongId = response.id;
        newSongRights.value.songId = newSongId;
        console.log('saving rights', newSongRights.value);
        apiRequests.postSongRights(newSongId, newSongRights.value);
        router.push('/song/' + newSongId);
      });
  } else {
    alert('Wrong song id');
  }
}
</script>

<style scoped>
.type-button {
  @apply p-3 bg-white inline-block w-[90%];
}

.type-button.hidden {
  display: none;
}

.type-button.active {
  @apply border-black border font-bold;
}

.type-button-wrap {
  @apply w-1/3 inline-block text-center;
}

.header {
  @apply text-center text-4xl overflow-x-auto p-5;
}

@media (aspect-ratio < 1.2) {
  .header {
    @apply text-2xl;
  }
}

.song-rights {
  display: grid;
  grid-template-columns: max-content auto;
}

.song-rights > * {
  margin-top: 0.5rem;
}

.song-rights > div, .song-rights > input {
  background: #fff;
}
</style>
