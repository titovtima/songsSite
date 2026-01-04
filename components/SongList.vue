<template>
  <ul>
    <ClientOnly>
      <li v-for="song in list">
        <button v-if="editMode" style="aspect-ratio: 1/1; width: 1rem; margin: 0.5rem 0;"
            @click="() => { $emit('remove', song); }">
          <img src="/assets/svg/cross2.svg"/>
        </button> 
        <a class="list-ref" :href="'/song/' + song.id" @click.prevent="clickLink(song.id)">{{ song.name }}</a>
      </li>
    </ClientOnly>
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
  text-decoration: none;
  color: #000;
}
</style>
