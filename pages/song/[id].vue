<template>
  <div class="overflow-y-auto h-[100vh] p-[20px]">
    <img src="/home.png" alt="на главную" @click="router.push('/')" class="home-button"/>
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
    <div class="parts-list overflow-x-auto">
      <div class="overflow-x-hidden min-w-min">
        <SongPart v-for="part in viewParts" :data="part"/>
      </div>
    </div>
    <pre class="p-2 w-full overflow-x-auto">{{ toValue(songData).extra }}</pre>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import {toValue} from "vue";

const route = useRoute();
const router = useRouter();

const textTypeButton: any = ref(null);
const chordsTypeButton: any = ref(null);
const chordsTextTypeButton: any = ref(null);

const songData: any = ref({parts: []});
const view = ref('Text');
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
});
</script>

<style scoped>
.type-button {
  @apply p-3 bg-white inline-block w-[90%]
}

.type-button.hidden {
  display: none;
}

.type-button.active {
  @apply border-black border font-bold
}

.type-button-wrap {
  @apply w-1/3 inline-block text-center
}

.home-button {
  @apply h-[80px];
}

.header {
  @apply text-center text-6xl overflow-x-auto p-5;
}

@media (aspect-ratio < 1.2) {
  .home-button {
    @apply h-[50px];
  }

  .header {
    @apply text-2xl;
  }
}
</style>
