<template>
  <ul>
    <li v-for="song in list">
      <a class="list-ref" :href="'/song/' + song.id">{{ song.name }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps(['list'])
</script>

<style scoped>
.list-ref {
  @apply text-black
}
</style>
