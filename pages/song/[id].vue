<template>
  <h1 class="border-2">
    {{ songData.name ? songData.name : '' }}
  </h1>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";

const route = useRoute();

const songData = ref({});

apiRequests.getSong(Number(route.params.id))
.then(data => {
  useHead({ title: data.name });
  songData.value = data;
});
</script>
