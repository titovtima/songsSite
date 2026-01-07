<template>
  <SelectList v-if="selectMode" :deselect="deselect" :options="keys.map(key => keyName(key))" style="display: inline;"
    :selected="selected ? keyName(keys[selected]) : null" @select-option="selectName"/>
  <span v-else @click="selectMode = true" style="font-family: 'JBMusic';">
    {{ selected ? keyName(keys[selected]) : 'none' }}
  </span>
</template>

<script setup lang="ts">
import musicTheory from '@titovtima/music-theory';
const { getCircleKeys, keyName } = musicTheory;

const props = defineProps({
  selected: [Number,  null],
  deselect: {
    type: Boolean,
    default: false,
  },
  selectMode: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['update:selected']);

const selectMode = ref(props.selectMode);

const keys = getCircleKeys();

function selectName(name: string | null) {
  emit('update:selected', name ? keys.findIndex(key => keyName(key) == name) : null);
  selectMode.value = false;
}
</script>
