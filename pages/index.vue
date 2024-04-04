<template>
  <div>
    <input type="text" placeholder="Поиск песни по словам" ref="searchInput" class="w-full border border-gray-400 p-1">
    <SongList :list="toValue(displayList)" class="mt-5"/>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import {toValue} from "vue";

useHead({title: 'Песни Церкви "Источник Жизни"'});

const searchInput: any = ref(null);
const searchValue = ref('');
onMounted(() => {
  searchInput.value.oninput = () => {
    searchValue.value = searchInput.value.value.toLowerCase();
  }
});

const mainListInfo = ref([]);
const mainListData = ref([]);
const displayList = computed(() => {
  if (!searchInput.value || mainListData.value.length == 0 || searchValue.value == '')
    return mainListInfo.value;
  let searchArr = searchValue.value.split(/[^\p{L}]/gu).filter(w => w.length > 0);
  console.log(`filtering by `, searchArr);
  return mainListData.value.filter((song: any) => {
    return searchArr.reduce((acc: boolean, word: string) => {
      if (!acc) return false;
      if (song.name.toLowerCase().includes(word)) return true;
      for (let part of song.parts) {
        if (part.data.toLowerCase().includes(word)) return true;
      }
      return false;
    }, true)
  }).sort((song1: { name: string; }, song2: { name: string; }) => {
    if (song1.name < song2.name) return -1;
    if (song1.name > song2.name) return 1;
    else return 0;
  });
});

if (process.client) {
  apiRequests.getMainListInfo()
    .then(response => {
      mainListInfo.value = response.list.sort((song1: { name: string; }, song2: { name: string; }) => {
        if (song1.name < song2.name) return -1;
        if (song1.name == song2.name) return 0;
        if (song1.name > song2.name) return 1;
      });
    });
  apiRequests.getMainList()
    .then(response => {
      mainListData.value = response.list;
    });
}
</script>
