<template>
  <ul>
    <li v-for="key in showKeys" :class="{ active: key == toValue(selectedKey) }"
        @click="$emit('update:keyShift', (keys.indexOf(key) + 24 - original) % 12)">
      {{ keyName(key) }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import pkg from '@titovtima/music-theory';
const { getCircleKeys, keyName } = pkg;

const props = defineProps(['original', 'keyShift']);
defineEmits(['update:keyShift']);

const keys = getCircleKeys();

const majorKeys = keys.filter(key => key.mode == '');
const minorKeys = keys.filter(key => key.mode == 'm');

const showKeys = (keys[props.original].mode == '') ? majorKeys : minorKeys;
const selectedKey = computed(() => keys[(props.original + props.keyShift) % 12 + ((props.original < 12) ? 0 : 12)]);
</script>

<style scoped>
li {
  font-family: 'JBMusic', monospace;
  @apply inline-block border-b-[1px] border-black ml-1 min-w-[1.25rem] cursor-pointer;
}

li.active {
  @apply font-bold border-b-2 cursor-default;
}
</style>
