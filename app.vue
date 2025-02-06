<template>
  <YandexMetrika />
  <div class="overflow-y-auto h-full p-[20px] pb-[100px]">
    <Navbar @click-settings="showSettingsModal = true"/>
    <NuxtPage />
  </div>
  <Settings v-model:show="showSettingsModal"/>
</template>

<script setup lang="ts">
const route = useRoute();
useHead({ link: [{href: '/angel.jpg', rel: 'icon'}] });
watchEffect( () => {
  useHead({link: [{href: 'https://songs.istokspb.org' + route.path, rel: 'canonical'}]});
});

const showSettingsModal = ref(false);
</script>

<style>
*, pre {
  font-family: 'Anonymous Pro', ui-monospace, SFMono-Regular, monospace;
}

body {
  background: #F4F4F4;
  height: 100vh;
  overflow: hidden;
  --bg-color: #f4f4f4;
  --second-color: #fff;
}

#__nuxt {
  height: 100%;
}
</style>
