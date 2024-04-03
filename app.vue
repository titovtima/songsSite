<template>
  <YandexMetrika />
  <NuxtPage />
  <ChangeFontSize class="fixed bottom-[5px] right-[5px]" />
</template>

<script setup>
// localStorage.removeItem('username');
// localStorage.removeItem('password');

useHead({ link: [{href: '/angel.jpg', rel: 'icon'}] });
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
