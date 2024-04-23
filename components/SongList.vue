<template>
  <ul>
    <li v-for="song in list">
      <a class="list-ref" :href="'/song/' + song.id" @click.prevent="clickLink(song.id)">{{ song.name }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps(['list']);

const router = useRouter();

function clickLink(songId: number) {
  router.push('/song/' + songId);
}
</script>

<style scoped>
.list-ref {
  @apply text-black;
}
</style>
