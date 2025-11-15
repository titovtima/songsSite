<template>
  <YandexMetrika />
  <div ref="scrollDiv" class="overflow-y-auto h-full p-[20px] pb-[100px]">
    <Navbar @click-settings="showSettingsModal = true"/>
    <NuxtPage />
  </div>
  <Settings v-model:show="showSettingsModal"/>
</template>

<script setup lang="ts">
const route = useRoute();
const scrollDiv: Ref<any> = ref(null);

useHead({ link: [{href: '/logo-180.png', rel: 'icon'}] });
watchEffect(() => {
  useHead({link: [{href: 'https://songs.istokspb.org' + route.path, rel: 'canonical'}]});
});

useHead({link: [{rel: 'manifest', href: '/manifest.json'}]})

const showSettingsModal = ref(false);

onMounted(() => {
  useState('mainScrollDiv').value = scrollDiv.value;
  watchScroll();
});

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
