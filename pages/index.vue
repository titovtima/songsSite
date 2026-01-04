<template>
  <div>
    <ClientOnly>
      <NuxtLink v-if="isAuthorised" to="/song/new?edit=true" 
        style="display: inline-block; margin-bottom: 0.5rem; text-decoration: none; color: #000">+ добавить песню</NuxtLink>
    </ClientOnly>
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
