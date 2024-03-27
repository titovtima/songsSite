<template>
  <div class="overflow-y-auto h-[100vh]">
    <h1 class="text-center text-6xl overflow-x-auto p-5">
      {{ songData.name ? songData.name : '' }}
    </h1>
    <div>
      <div class="type-button-wrap">
        <button class="type-button" ref="textTypeButton" :class="{ active: view === 'Text' }">Текст</button>
      </div>
      <div class="type-button-wrap">
        <button class="type-button" ref="chordsTypeButton" :class="{ active: view === 'Chords' }">Аккорды</button>
      </div>
      <div class="type-button-wrap">
        <button class="type-button" ref="chordsTextTypeButton" :class="{ active: view === 'ChordsText' }">
          Аккорды в тексте
        </button>
      </div>
    </div>
    <div class="parts-list">
      <SongPart v-for="part in viewParts" :data="part"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import {toValue} from "vue";

const route = useRoute();

const textTypeButton: any = ref(null);
const chordsTypeButton: any = ref(null);
const chordsTextTypeButton: any = ref(null);

const songData: any = ref({parts: []});
const view = ref('Text');
const textParts = computed(() => songData.value.parts.filter((part: { type: any; }) => part.type == 'Text'));
const chordsParts = computed(() => songData.value.parts.filter((part: { type: any; }) => part.type == 'Chords'));
const chordsTextParts = computed(() => songData.value.parts.filter((part: {
  type: any;
}) => part.type == 'ChordsText'));
const viewParts = computed(() => {
  if (view.value == 'Text') return toValue(textParts);
  else if (view.value == 'Chords') return toValue(chordsParts);
  else return toValue(chordsTextParts);
})

apiRequests.getSong(Number(route.params.id))
  .then(data => {
    useHead({title: data.name});
    songData.value = data;
  });

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

.type-button.active {
  @apply border-black border font-bold
}

.type-button-wrap {
  @apply w-1/3 inline-block text-center
}
</style>
