<template>
  <YandexMetrika />
  <NuxtPwaManifest />
  <div ref="scrollDiv" class="overflow-y-auto h-full p-[20px] pb-[100px]">
    <Navbar @click-settings="showSettingsModal = true"/>
    <NuxtPage />
    <div>
      <button v-if="canInstall" @click="installPWA">Install App</button>
    </div>  </div>
  <Settings v-model:show="showSettingsModal"/>
</template>

<script setup lang="ts">
import { useHead, useNuxtApp } from '#app';
import { ref, onMounted } from 'vue';

const route = useRoute();
const scrollDiv: Ref<any> = ref(null);
const { $pwa } = useNuxtApp();
const canInstall = ref(false);

useHead({ link: [{href: '/favicon.ico', rel: 'icon'}] });
watchEffect( () => {
  useHead({link: [{href: 'https://songs.istokspb.org' + route.path, rel: 'canonical'}]});
});

const showSettingsModal = ref(false);

onMounted(() => {
  if ($pwa && $pwa.showInstallPrompt) {
    canInstall.value = $pwa.showInstallPrompt;
  }
  useState('mainScrollDiv').value = scrollDiv.value;
  watchScroll();
});

const installApp = () => {
  if ($pwa && $pwa.install) {
    $pwa.install();
    canInstall.value = false; // Скрываем баннер после попытки установки
  }
};

function watchScroll() {
  scrollDiv.value.addEventListener('scroll', () => {
    if (useState('watchScroll').value) {
      sessionStorage.setItem(route.path + ':ScrollTop', scrollDiv.value.scrollTop.toString());
    }
  });
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
  --bg-color: #f4f4f4;
  --second-color: #fff;
}

#__nuxt {
  height: 100%;
}
</style>
