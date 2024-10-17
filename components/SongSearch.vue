<template>
  <input type="text" placeholder="Поиск песни по словам" ref="searchInput" class="w-full border border-gray-400 p-1">
</template>

<script setup lang="ts">
const searchInput: any = ref(null);
const searchValue = ref('');

const props = defineProps(['searchList']);
const emits = defineEmits(['displayList']);

onMounted(() => {
  searchInput.value.oninput = () => {
    searchValue.value = searchInput.value.value.toLowerCase();
    if (!searchInput.value || searchValue.value == '')
      emits('displayList', props.searchList);
    let searchArr = searchValue.value.split(/[^\p{L}]/gu).filter(w => w.length > 0);
    emits('displayList', props.searchList.filter((song: any) => {
      return searchArr.reduce((acc: boolean, word: string) => {
        if (!acc) return false;
        if (song.name.toLowerCase().includes(word)) return true;
        for (let part of song.parts) {
          if (part.data.toLowerCase().includes(word)) return true;
        }
        for (let perf of song.performances) {
          if (perf.songName && perf.songName.includes(word)) return true;
        }
        return false;
      }, true);
    }).sort((song1: { name: string; }, song2: { name: string; }) => {
      if (song1.name < song2.name) return -1;
      if (song1.name > song2.name) return 1;
      else return 0;
    }));
  }
});
</script>

<style scoped>

</style>