<template>
  <div>
    <h1 class="header">
      {{ songData.name ? songData.name : '' }}
    </h1>
    <div>
      <div class="type-button-wrap">
        <button class="type-button" ref="textTypeButton"
                :class="{ active: view == 'Text', hidden: toValue(textParts).length == 0 }">Текст
        </button>
      </div>
      <div class="type-button-wrap">
        <button class="type-button" ref="chordsTypeButton"
                :class="{ active: view == 'Chords', hidden: toValue(chordsParts).length == 0 }">Аккорды
        </button>
      </div>
      <div class="type-button-wrap">
        <button class="type-button" ref="chordsTextTypeButton"
                :class="{ active: view == 'ChordsText', hidden: toValue(chordsTextParts).length == 0 }">
          Аккорды в тексте
        </button>
      </div>
    </div>
    <KeySwitch v-if="view != 'Text' && songData.key != null" :original="songData.key" v-model:key-shift="keyShift" class="mt-2"/>
    <div class="parts-list overflow-x-auto">
      <div class="overflow-x-hidden min-w-min">
        <SongPart v-for="part in viewParts" :data="part" v-model:key-shift="keyShift" :general-key="songData.key"/>
      </div>
    </div>
    <div>
      <audio controls v-for="audio in songData.audios" :src="apiRequests.apiUrl + '/audio/' + audio">аудио</audio>
    </div>
    <pre class="p-2 w-full overflow-x-auto" ref="extraText">{{ toValue(songData).extra }}</pre>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";

const route = useRoute();

const textTypeButton: any = ref(null);
const chordsTypeButton: any = ref(null);
const chordsTextTypeButton: any = ref(null);

const songData: any = ref({parts: [], audios: []});
const view = useCookie('view', {path: '/song/'});
if (!view.value)
  view.value = 'Text';
const keyShift = ref(0);
const textParts = computed(() => songData.value.parts.filter((part: { type: string; }) => part.type == 'Text'));
const chordsParts = computed(() => songData.value.parts.filter((part: { type: string; }) => part.type == 'Chords'));
const chordsTextParts = computed(() => songData.value.parts
  .filter((part: { type: string; }) => part.type == 'ChordsText'));
const viewParts = computed(() => {
  if (view.value == 'Text') return toValue(textParts);
  else if (view.value == 'Chords') return toValue(chordsParts);
  else return toValue(chordsTextParts);
});

try {
  songData.value = await apiRequests.getSong(Number(route.params.id));
} catch (e) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Песня не найдена'
  });
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
</style>
