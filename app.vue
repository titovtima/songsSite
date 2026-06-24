<template>
  <YandexMetrika />
  <div ref="scrollDiv" style="overflow-y: auto; height: 100%; padding: 20px;">
    <Navbar @click-settings="showSettingsModal = true"/>
    <NuxtPage />
  </div>
  <Settings v-model:show="showSettingsModal"/>
</template>

<script setup lang="ts">
import { localStoragePrecachedStatusKey, precachePages } from './utils/global';

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

  document.body.style.height = '100dvh';

  let status = localStorage.getItem(localStoragePrecachedStatusKey);
  console.log('precache pages status', status);
  if (status == null || new Date().getTime() - Number(status) >= 1000 * 60 * 60 * 24 * 10) {
    precachePages(false);
  }
});

function watchScroll() {
  if (useState('watchScroll').value) {
    let oldScroll = sessionStorage.getItem(route.path + ':ScrollTop');
    console.log(oldScroll);
    if (oldScroll && Number(oldScroll)) {
      scrollDiv.value.scrollTop = Number(oldScroll);
    }

    scrollDiv.value.addEventListener('scroll', () => {
      if (useState('watchScroll').value) {
        sessionStorage.setItem(route.path + ':ScrollTop', scrollDiv.value.scrollTop.toString());
      }
    });
  }
}

// function setAndWatchScroll() {
//   const scrollDiv: Ref<any> = useState('mainScrollDiv');
//   let oldScroll = sessionStorage.getItem(route.path + ':ScrollTop');
//   console.log(oldScroll);
//   if (oldScroll && Number(oldScroll)) {
//     scrollDiv.value.scrollTop = Number(oldScroll);
//   }
//   useState('watchScroll').value = true;
// }
</script>

<style>
body {
  background: #F4F4F4;
  height: 100dvh;
  overflow: hidden;
  --bg-color: #f4f4f4;
  --second-color: #fff;
}

#__nuxt {
  height: 100%;
}
</style>
