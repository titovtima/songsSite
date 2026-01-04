<template>
  <div>
    <h1 class="header" :contenteditable="editMode" @input="(event: any) => { songData.name = event.target.textContent; }">
      {{ songData.name ? songData.name : '' }}
    </h1>
    <div style="display: flex; justify-content: center;">
      <button class="type-button" ref="textTypeButton" style="flex: 1 0 0; margin: 0 0.5rem;"
              :class="{ active: view == 'Text', hidden: toValue(textParts).length == 0 && !editMode }">Текст
      </button>
      <button class="type-button" ref="chordsTypeButton" style="flex: 1 0 0; margin: 0 0.5rem;"
              :class="{ active: view == 'Chords', hidden: toValue(chordsParts).length == 0 && !editMode }">Аккорды
      </button>
      <button class="type-button" ref="chordsTextTypeButton" style="flex: 1 0 0; margin: 0 0.5rem;"
              :class="{ active: view == 'ChordsText', hidden: toValue(chordsTextParts).length == 0 && !editMode }">
        Аккорды в тексте
      </button>
    </div>
    <RightsView v-model:data="songRights" :owner="songRights ? songRights.owner : null"/>
    <div v-if="songRights && editMode"><div style="display: flex; flex-direction: row;">
      <label style="display: flex; align-items: center;">
        Приватная
        <input style="margin: 0 0.25rem;" type="checkbox" :disabled="!editMode || !userData.isAdmin"
            :checked="!songData.public" @change="(event: any) => songData.public = !event.target.checked"/>
      </label>
      <label v-if="userData.isAdmin" style="display: flex; align-items: center; margin-left: 1.25rem;">
        В основном списке
        <input style="margin: 0 0.25rem;" type="checkbox" :disabled="!editMode" v-model="songData.inMainList"/>
      </label>
    </div></div>
    <div v-else-if="songRights && !songData.public">Приватная</div>
    <KeySwitch v-if="songData.key != null || editMode" v-model:original="songData.key" style="margin-top: 0.5rem;"/>
    <SelectList v-if="langList.length > 0" :deselect="false" :options="langList" :selected="currentLang" @select-option="option => {console.log(option); return currentLang = option}"/>
    <div style="overflow-x: auto;" class="parts-list">
      <div style="overflow-x: hidden; min-width: min-content;">
        <SongPart edit-mode v-for="part in viewParts" :data="part" :general-key="songData.key"
            @update-order="(event) => { updatePartsOrder(event); }"/>
        <div v-if="editMode" style="display: flex; align-items: center; flex-direction: column">
          <button style="margin-bottom: 1.25rem; padding: 0.5rem; background-color: #fff;" @click="() => { addPart(); }">
            Добавить часть
          </button>
        </div>
      </div>
    </div>
    <div>
      <SongPerformance v-for="perf in songData.performances" :data="perf"
          @update-order="(event) => { updatePerformancesOrder(event); }"/>
      <div v-if="editMode" style="margin: 1rem 0; padding: 0.5rem; background-color: #fff;"
          @click="songData.performances.push(
            {id: -1,
             artists: [],
             songName: songData.name,
             audio: null,
             extra: null,
             album: null,
             lang: null,
             date: null,
             key: null,
             bpm: null,
             ord: songData.performances.length + 1,
             isMain: false,
             isOriginal: false,
             link: ''})">Добавить источник</div>
    </div>
    <div>
      <pre v-if="!editMode" style="padding: 0.5rem; width: 100%; overflow-x: auto;" ref="extraText">{{ 
        toValue(songData).extra 
      }}</pre>
      <textarea v-else v-model="songData.extra" style="field-sizing: content; padding: 0.5rem; width: 100%; overflow-x: auto;">
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectList from "~/components/SelectList.vue";
import apiRequests from "~/utils/apiRequests";
import { getSongData, type Song } from "~/utils/getData";
import { getTransposedText } from "~/utils/global";

const route = useRoute();
const router = useRouter();
const songId = String(route.params.id);

const textTypeButton: any = ref(null);
const chordsTypeButton: any = ref(null);
const chordsTextTypeButton: any = ref(null);

const songData: Ref<Song> = ref(emptySong);
const songRights: Ref<any> = ref(null);
provide('rights', songRights);
const canEdit = useState('canEdit');
watch(songRights, (rights, oldRights) => {
  if (oldRights == null) {
    apiRequests.checkAuthorized().then(() => {
      canEdit.value = userData.value.isAdmin || userData.value.username == rights.owner ||
        rights.writers.includes(userData.value.username);
    }).catch(() => {});
  }
});

const langList = computed(() => {
  let result = uniqueFromArr(songData.value.parts.filter(part => part.type == view.value).map(part => part.lang));
  if (currentLang.value == null) {
    if (result.length > 0) {
      if (result.includes('rus'))
        currentLang.value = 'rus';
      else
        currentLang.value = result[0];
    }
  }
  return result;
});
const currentLang: Ref<string | null> = ref(null);

const view = useCookie('view', {path: '/', maxAge: 3600 * 24 * 365 * 100});
if (!view.value)
  view.value = 'Text';

const textParts = computed(() => songData.value.parts.filter((part: { type: string; }) => part.type == 'Text'));
const chordsParts = computed(() => songData.value.parts.filter((part: { type: string; }) => part.type == 'Chords'));
const chordsTextParts = computed(() => songData.value.parts
  .filter((part: { type: string; }) => part.type == 'ChordsText'));
const viewParts = computed(() => {
  return songData.value.parts.filter(part => part.type == view.value && 
    (part.lang == currentLang.value || part.lang == undefined || part.lang == null || editMode.value || currentLang.value == null))
    .sort(part => part.ord);
});

const editMode: Ref<boolean> = useState('editMode');
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
  try {
    await apiRequests.checkAuthorized();
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Песня не найдена'
    });
  }
  songData.value.name = 'Новая песня';
  songRights.value = {
    owner: userData.value.username,
    writers: [],
    readers: [],
  };
} else {
  try {
    let [data, loadPromise] = getSongData(Number(songId));
    await loadPromise;
    songData.value = data.value;
  } catch (e) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Песня не найдена'
    });
  }
  songData.value.performances.sort((p1: any, p2: any) => p1.ord - p2.ord);
  songData.value.parts.sort((p1: any, p2: any) => p1.ord - p2.ord);

  apiRequests.getSongRights(Number(songId))
    .then(response => {
      songRights.value = response;
    }).catch(() => {});
}

useHead({title: songData.value.name});

// definePageMeta({
//   middleware: (to, from) => {
//     const navState: any = useState('navigation');
//     if (from.name == 'songs_list-id' && to.name == 'song-id') {
//       navState.value.listId = Number(from.params.id);
//     }
//   }
// });

watch(editMode, () => {
  if (editMode.value) {
    keyShift.value = 0;
  }
});

const extraText: any = ref(null);
onMounted(() => {
  (useState('mainScrollDiv').value as any).scrollTop = 0;
  document.cookie = "view=ChordsText; path=/song/; max-age=0";
  textTypeButton.value.onclick = () => {
    view.value = 'Text';
  }
  chordsTypeButton.value.onclick = () => {
    view.value = 'Chords';
  }
  chordsTextTypeButton.value.onclick = () => {
    view.value = 'ChordsText';
  }
  if (songData.value.extra != null)
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
    songData.value.parts.push({type: 'Text', data: '', name: '', key: null, ord: ord + 1, lang: null});
  } else if (view.value == 'Chords') {
    let ord = toValue(chordsParts).reduce((acc: number, value: any) => Math.max(acc, value.ord), 0);
    songData.value.parts.push({type: 'Chords', data: '', name: '', key: null, ord: ord + 1, lang: null});
  } else {
    let ord = toValue(chordsTextParts).reduce((acc: number, value: any) => Math.max(acc, value.ord), 0);
    songData.value.parts.push({type: 'ChordsText', data: '', name: '', key: null, ord: ord + 1, lang: null});
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

function updatePerformancesOrder(event: any) {
  let perfList = songData.value.performances.filter((value: any) => value.ord != event.perf.ord)
  if (event.action == 'up') {
    event.perf.ord -= 1.5;
    perfList.push(event.perf);
  } else if (event.action == 'down') {
    event.perf.ord += 1.5;
    perfList.push(event.perf);
  }
  perfList.sort((a: any, b: any) => a.ord - b.ord);
  for (let i = 0; i < perfList.length; i++) {
    perfList[i].ord = i + 1;
  }
  songData.value.performances = perfList;
}

const saveFunction = functionsRefs.saveFunction;
saveFunction.value = () => {
  let numberSongId = Number(songId);
  if (numberSongId) {
    console.log('saving data', songData.value);
    apiRequests.postSong(songId, songData.value)
      .then(() => apiRequests.getSong(numberSongId).then(response => { songData.value = response; editMode.value = false; }))
      .catch(() => { alert('Не удалось сохранить песню'); });
    console.log('saving rights', songRights.value);
    apiRequests.postSongRights(numberSongId, songRights.value);
  } else if (songId == 'new') {
    console.log('saving data', songData.value);
    apiRequests.postSong(songId, songData.value)
      .then(response => {
        let newSongId = response.id;
        songRights.value.songId = newSongId;
        console.log('saving rights', songRights.value);
        apiRequests.postSongRights(newSongId, songRights.value);
        router.push('/song/' + newSongId);
      })
      .catch(() => {
        alert('Не удалось сохранить песню');
      });
  } else {
    alert('Wrong song id');
  }
}
</script>

<style scoped>
.type-button {
  padding: 0.75rem;
  background-color: #fff;
  display: inline-block;
}

.type-button.hidden {
  display: none;
}

.type-button.active {
  border: 1px solid #000;
  font-weight: 700;
}

.header {
  text-align: center;
  font-size: 2.25rem;
  overflow-x: auto;
  padding: 1.25rem;
}

@media (aspect-ratio < 1.2) {
  .header {
    font-size: 1.5rem;
  }
}

textarea {
  overflow-x: auto;
  white-space: nowrap;
}
</style>
