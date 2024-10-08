<template>
  <span class="p-0.5 bg-gray-200 mx-0.5">
    <span contenteditable>{{ value }}</span>
    <img src="/assets/svg/cross.svg" @click="$emit('remove')" class="w-1.5 mx-0.5 inline"/>
  </span>
</template>

<script setup lang="ts">
defineProps(['value']);
defineEmits(['remove']);
</script>
