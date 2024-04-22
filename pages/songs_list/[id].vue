<template>
  <div>
    <h1 class="header">{{ listInfo ? listInfo.name : 'Список песен' }}</h1>
    <SongSearch :search-list="toValue(songsData)" @display-list="(list) => searchedList = list"/>
    <SongList :list="toValue(displayList)" class="mt-5"/>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";

const route = useRoute();

const listInfo: any = ref(null);
const songsInfo = ref([]);
const songsData = ref([]);
const searchedList: any = ref(null);
const displayList = computed(() => {
  let list = songsInfo.value;
  if (songsData.value && songsData.value.length != 0 && searchedList.value != null)
    list = searchedList.value;
  return list.sort((song1: { name: string; }, song2: { name: string; }) => {
    if (song1.name < song2.name) return -1;
    if (song1.name > song2.name) return 1;
    else return 0;
  });
});

try {
  listInfo.value = await apiRequests.getListInfo(Number(route.params.id));
} catch (e) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Список не найден'
  });
}
useHead({ title: listInfo.value.name });

if (process.client) {
  apiRequests.getListSongsInfo(Number(route.params.id))
    .then(response => { songsInfo.value = response.list; });
  apiRequests.getListData(Number(route.params.id))
    .then(response => { songsData.value = response.list; });
}
</script>

<style scoped>
.header {
  @apply text-center text-4xl overflow-x-auto p-5;
}

@media (aspect-ratio < 1.2) {
  .header {
    @apply text-2xl;
  }
}
</style>
