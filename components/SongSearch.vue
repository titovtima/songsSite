<template>
  <div>
    <input type="text" placeholder="Поиск песни по словам" ref="searchInput" class="w-full border border-gray-400 p-1" 
        v-model="searchValue">
    <SongList :list="displayList"/>
    <div :style="{ display: allSongsDisplayList.length > 0 ? 'block' : 'none'}" style="height: 2px; background: #888; width: 100%;"></div>
    <i :style="{ display: allSongsDisplayList.length > 0 ? 'block' : 'none'}" style="color: #888;">Из других списков</i>
    <SongList :list="allSongsDisplayList"/>
  </div>
</template>

<script setup lang="ts">
import { findWordsInSong, sortSongs } from '~/utils/global';

const searchInput: any = ref(null);
const searchValue = ref('');

const props = defineProps(['searchList']);

const displayList: ComputedRef<Array<any>> = computed(() => {
  if (!searchInput.value || searchValue.value == '') return sortSongs(toValue(props.searchList));
  let searchArr = searchValue.value.split(/[^\p{L}]/gu).filter(w => w.length > 0);
  return sortSongs(toValue(props.searchList).filter((song: any) => findWordsInSong(searchArr, song)));
});
const allSongsData: Ref<Array<any>> = inject('allSongsData', ref([]));
const allSongsDisplayList: ComputedRef<Array<any>> = computed(() => {
  if (!searchInput.value || searchValue.value == '') return [];
  let searchArr = searchValue.value.split(/[^\p{L}]/gu).filter(w => w.length > 0);
  return sortSongs(allSongsData.value.filter((song: { name: string }) => { 
    return findWordsInSong(searchArr, song) && !toValue(displayList).find((song2: { name: string }) => song.name == song2.name); 
  }));
});
</script>

<style scoped>

</style>
