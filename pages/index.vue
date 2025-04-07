<template>
  <div>
    <NuxtLink v-if="isAuthorised" to="/song/new?edit=true" class="block mb-2">+ добавить песню</NuxtLink>
    <SongSearch :search-list="mainListData" global-search-header="Детские"/>
  </div>
</template>

<script setup lang="ts">
import { getMainListData } from "~/utils/getData";
import { userData } from "~/utils/global";

useHead({title: 'Песни церкви «Источник жизни»'});

const mainListData = import.meta.client ? getMainListData() : ref([]);

const isAuthorised = computed(() => !!userData.value);
</script>
