<template>
  <div class="m-5 bg-white p-3">
    <div class="text-xl border-b border-black font-bold" v-if="data.name">
      {{ data.name }}
    </div>
    <pre class="text-base" ref="mainContent" :class="{ chords: data.type != 'Text' }">{{ data.data }}</pre>
  </div>
</template>

<script setup lang="ts">
defineProps(['data']);
</script>

<style scoped>
.chords {
  font-family: JBMusic, monospace;
}
</style>
