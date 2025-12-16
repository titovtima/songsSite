<template>
  <div ref="partDiv" class="flex my-5 bg-white p-3 w-full min-w-min">
    <div style="flex: 1 1 max-content; width: 100%;">
      <div class="text-xl border-b border-black font-bold" v-if="data.name || editMode">
        <span v-if="!editMode" class="p-1">{{ data.name }}</span>
        <input v-else type="text" class="w-full p-1" v-model="data.name">
      </div>
      <KeySwitch v-if="data.key != null || editMode" v-model:original="data.key" :edit="editMode" class="mb-1"/>
      <input v-if="editMode" type="text" v-model="data.lang">
      <div v-if="!editMode">
        <pre class="text-base p-1" ref="mainContent" :class="{ chords: data.type != 'Text' }">{{
          toValue(getTransposedPartText(originalKey, keyShift))
        }}</pre>
      </div>
      <div v-else>
        <textarea ref="contentTextarea" v-model="data.data" class="w-full p-1" :class="{ chords: data.type != 'Text' }"
            @input="event => fitTextareaHeight(event.target)"></textarea>
      </div>
    </div>
    <div v-if="editMode" style="flex: 0 1 2rem; margin-left: 1rem;">
      <button class="block aspect-square w-8 my-2" 
          @click="() => { $emit('updateOrder', { part: data, action: 'delete'}); }">
        <img src="/assets/svg/cross2.svg"/>
      </button>
      <button v-if="data.ord > 1" class="block aspect-square w-8 my-2"
          @click="() => { $emit('updateOrder', { part: data, action: 'up'}); }">
        <img src="/assets/svg/arrow_up.svg"/>
      </button>
      <button class="block aspect-square w-8 my-2"
          @click="() => { $emit('updateOrder', { part: data, action: 'down'}); }">
        <img src="/assets/svg/arrow_down.svg"/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fitTextareaHeight, getTransposedText } from '~/utils/global';

const props = defineProps(['data', 'generalKey']);
defineEmits(['updateOrder']);

const editMode = useState('editMode');
const keyShift = useState('keyShift', () => 0);
const partDiv: any = ref(null);
const mainContent: any = ref(null);
const contentTextarea: any = ref(null);

const originalKey = computed(() => (props.data.key != null) ? props.data.key : props.generalKey);

watch([editMode, () => props.data], () => {
  if (editMode.value) {
    setTimeout(() => {
      fitTextareaHeight(contentTextarea.value);
    }, 10);
  }
});

watch(() => props.data.lang, () => {
  if (props.data.lang && props.data.lang.length == 0)
    props.data.lang = null;
});

onMounted(() => {
  if (editMode.value) {
    fitTextareaHeight(contentTextarea.value);
  }
});

function getTransposedPartText(original: number, shift: number) {
  return (props.data.type == 'Text' || toValue(originalKey) == null) ? props.data.data :
    getTransposedText(props.data.data, original, shift, props.data.type == 'ChordsText');
}
</script>

<style scoped>
.chords {
  font-family: JBMusic, monospace;
}

textarea {
  overflow-x: auto;
  white-space: nowrap;
}
</style>
