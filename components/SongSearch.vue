<template>
  <div>
    <input type="text" placeholder="Поиск песни по словам" ref="searchInput" class="w-full border border-gray-400 p-1">
    <SongList :list="displayList"/>
    <div :style="{ display: allSongsDisplayList.length > 0 ? 'block' : 'none'}" style="height: 2px; background: #888; width: 100%;"></div>
    <i :style="{ display: allSongsDisplayList.length > 0 ? 'block' : 'none'}" style="color: #888;">
      {{ globalSearchHeader ? globalSearchHeader : 'Из других списков' }}
    </i>
    <SongList :list="allSongsDisplayList"/>
  </div>
</template>

<script setup lang="ts">
import { findWordsInSong, sortSongs } from '~/utils/global';

const searchInput: any = ref(null);

const props = defineProps(['searchList', 'globalSearchHeader']);
const displayList: Ref<Array<any>> = ref([]);
const allSongsDisplayList: Ref<Array<any>> = ref([]);

const allSongsData: Ref<Array<any>> = inject('allSongsData', ref([]));

watch(() => props.searchList, () => { updateLists(); });

onMounted(() => {
  searchInput.value.oninput = () => {
    updateLists();
  }
});

function updateLists() {
  let searchValue: string = searchInput.value.value.toLowerCase();
  if (!searchInput.value || searchValue == '')
    displayList.value = props.searchList;
  let searchArr = searchValue.split(/[^\p{L}]/gu).filter(w => w.length > 0);
  displayList.value = sortSongs(toValue(props.searchList).filter((song: any) => findWordsInSong(searchArr, song)));
  allSongsDisplayList.value = sortSongs(allSongsData.value.filter((song: { name: string }) => { 
    return findWordsInSong(searchArr, song) && !toValue(displayList).find((song2: { name: string }) => song.name == song2.name); 
  }));
}

</script>

<style scoped>

</style>
