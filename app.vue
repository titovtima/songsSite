<template>
  <YandexMetrika />
  <div class="overflow-y-auto h-[100vh] p-[20px]">
    <Navbar @click-settings="showSettingsModal = true"/>
    <NuxtPage />
  </div>
  <Settings v-model:show="showSettingsModal"/>
</template>

<script setup lang="ts">
// localStorage.removeItem('username');
// localStorage.removeItem('password');

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
}
</style>
