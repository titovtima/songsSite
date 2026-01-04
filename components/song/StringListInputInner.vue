<template>
  <span style="padding: 0.1rem; margin: 0 0.1rem; background-color: var(--bg-color);">
    <span>{{ value }}</span>
    <img src="/assets/svg/cross.svg" @click="$emit('remove')" style="display: inline; width: 0.4rem; margin: 0 0.1rem;"/>
  </span>
</template>

<script setup lang="ts">
defineProps(['value']);
defineEmits(['remove']);
</script>
