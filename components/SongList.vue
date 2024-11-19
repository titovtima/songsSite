<template>
  <ul>
    <li v-for="song in list">
      <button v-if="editMode" class="aspect-square w-4 my-2" 
          @click="() => { $emit('remove', song); }">
        <img src="/assets/svg/cross2.svg"/>
      </button> 
      <a class="list-ref" :href="'/song/' + song.id" @click.prevent="clickLink(song.id)">{{ song.name }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps(['list']);
defineEmits(['remove']);

const router = useRouter();

const editMode = useState('editMode');

function clickLink(songId: number) {
  router.push('/song/' + songId);
}
</script>

<style scoped>
.list-ref {
  @apply text-black;
}
</style>
