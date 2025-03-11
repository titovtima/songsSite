<template>
  <div>
    <NuxtLink v-if="isAuthorised" to="/song/new?edit=true" class="block mb-2">+ добавить песню</NuxtLink>
    <SongSearch :search-list="mainListData" global-search-header="Детские"/>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import { userData } from "~/utils/global";

useHead({title: 'Песни церкви «Источник жизни»'});

const mainListInfo = ref([]);
const mainListData = ref([]);
const allSongsData: Ref<Array<any>> = ref([]);
provide('allSongsData', allSongsData);

const isAuthorised = computed(() => !!userData.value);

if (import.meta.client) {
  apiRequests.getMainListInfo()
    .then(response => {
      mainListInfo.value = response.list;
    });
  let listInfoPromise = apiRequests.getMainList()
    .then(response => { mainListData.value = response.list; });
  provide('loadListPromise', listInfoPromise);
  let allSongsPromise = apiRequests.getAllSongs()
    .then(response => { allSongsData.value = response.list; });
  provide('loadAllSongsPromise', allSongsPromise);
}
</script>
