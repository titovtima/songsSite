<template>
  <div>
    <span v-for="(key, index) in keysList" style="background-color: var(--second-color); padding: 0.25rem; margin-right: 0.25rem;">
      <SelectShowKey deselect :selected="key" @update:selected="newKey => updateKey(index, newKey)"/>
    </span>
    <span style="background-color: var(--second-color); padding: 0.25rem; margin-right: 0.25rem;" 
        @click="() => addKeyStatus = !addKeyStatus">
      <SelectShowKey v-if="addKeyStatus" deselect select-mode :selected="null" 
        @update:selected="newKey => { updateKey(keysList.length, newKey); }"/>
      <span v-else>+</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { numberToList, listToNumber } from '~/utils/global';

const props = defineProps<{
  keys: number | null
}>();

const emit = defineEmits<{
  'update:keys': [keys: number | null]
}>();

const addKeyStatus = ref(false);

const keysList: Ref<number[]> = ref(numberToList(props.keys, 24));

// watch(() => props.keys, () => {
//   keysList.value = numberToList(props.keys);
// });

function updateKey(index: number, key: number | null) {
  if (key == null) {
    keysList.value = keysList.value.filter((_, i) => i != index);
  } else {
    if (index >= keysList.value.length) {
      keysList.value.push(key);
    } else {
      keysList.value[index] = key;
    }
  }
  emit('update:keys', listToNumber(keysList.value, 24))
}
</script>
