<template>
  <YandexMetrika />
  <div class="overflow-y-auto h-[100vh] p-[20px]">
    <Navbar @click-settings="showSettingsModal = true"/>
    <NuxtPage />
  </div>
  <Settings v-model:show="showSettingsModal"/>
</template>

<script setup>
// localStorage.removeItem('username');
// localStorage.removeItem('password');

useHead({ link: [{href: '/angel.jpg', rel: 'icon'}] });

const showSettingsModal = ref(false);

if (process.client) {
  let html = document.documentElement;
  let settings = localStorage.getItem('settings');
  if (settings)
    settings = JSON.parse(settings);
  else {
    settings = {
      fontSize: parseInt(getComputedStyle(html, '').fontSize)
    }
  }
  html.style.fontSize = settings.fontSize + 'px';
}
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
