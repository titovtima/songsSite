<template>
  <div ref="partDiv" style="display: flex; gap: 1rem; margin: 1.25rem 0; background: white; padding: 0.75rem; width: 100%;"
      :style="{ 'max-width': editMode ? 'calc(100vw - 40px)' : 'none', 'min-width': editMode ? '0' : 'min-content' }">
    <div style="flex: 1 1 max-content;" :style="{ 'max-width': editMode ? 'calc(100% - 3rem)' : 'none' }">
      <div style="font-size: 1.25rem; border-bottom: 1px solid black; font-weight: 700;" v-if="data.name || editMode">
        <span v-if="!editMode" style="padding: 0.25rem;">{{ data.name }}</span>
        <input v-else type="text" style="width: 100%; padding: 0.25rem;" v-model="data.name">
      </div>
      <KeySwitch v-if="data.key != null || editMode" v-model:original="data.key" :edit="editMode" style="margin-bottom: 0.25rem;"/>
      <input v-if="editMode" type="text" v-model="data.lang">
      <div v-if="!editMode">
        <pre style="font-size: 1rem; padding: 0.25rem;" ref="mainContent">{{
          toValue(getTransposedPartText(originalKey, keyShift))
        }}</pre>
      </div>
      <div v-else>
        <textarea v-model="data.data" style="padding: 0.25rem; field-sizing: content; min-width: 100%; max-width: 100%;">
        </textarea>
      </div>
    </div>
    <div v-if="editMode" style="flex: 0 1 2rem;">
      <button style="display: block; aspect-ratio: 1/1; width: 2rem; margin: 0.5rem 0; background: none;" 
          @click="() => { $emit('updateOrder', { part: data, action: 'delete'}); }">
        <img src="/assets/svg/cross2.svg"/>
      </button>
      <button v-if="data.ord > 1" style="display: block; aspect-ratio: 1/1; width: 2rem; margin: 0.5rem 0; background: none;" 
          @click="() => { $emit('updateOrder', { part: data, action: 'up'}); }">
        <img src="/assets/svg/arrow_up.svg"/>
      </button>
      <button style="display: block; aspect-ratio: 1/1; width: 2rem; margin: 0.5rem 0; background: none;" 
          @click="() => { $emit('updateOrder', { part: data, action: 'down'}); }">
        <img src="/assets/svg/arrow_down.svg"/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTransposedText } from '~/utils/global';

const props = defineProps(['data', 'generalKey']);
defineEmits(['updateOrder']);

const editMode = useState('editMode');
const keyShift = useState('keyShift', () => 0);

const originalKey = computed(() => (props.data.key != null) ? props.data.key : props.generalKey);

watch(() => props.data.lang, () => {
  if (props.data.lang && props.data.lang.length == 0)
    props.data.lang = null;
});

function getTransposedPartText(original: number, shift: number) {
  return (props.data.type == 'Text' || toValue(originalKey) == null) ? props.data.data :
    getTransposedText(props.data.data, original, shift, props.data.type == 'ChordsText');
}
</script>

<style scoped>
textarea {
  overflow-x: auto;
  white-space: nowrap;
}
</style>
