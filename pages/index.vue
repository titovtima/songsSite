<template>
  <div>
    <a v-if="isAuthorised" href="/song/new?edit=true" class="block mb-2">+ добавить песню</a>
    <SongSearch :search-list="toValue(mainListData)" @display-list="(list) => searchedList = list"/>
    <SongList :list="toValue(displayList)" class="mt-5"/>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import {toValue} from "vue";

useHead({title: 'Песни церкви «Источник жизни»'});

const mainListInfo = ref([]);
const mainListData = ref([]);
const searchedList: any = ref(null);
const displayList = computed(() => {
  if (!mainListData.value || mainListData.value.length == 0 || searchedList.value == null)
    return mainListInfo.value;
  return searchedList.value.sort((song1: { name: string; }, song2: { name: string; }) => {
    if (song1.name < song2.name) return -1;
    if (song1.name > song2.name) return 1;
    else return 0;
  });
});

const userData = useState('userData');
const isAuthorised = computed(() => !!userData.value);

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
