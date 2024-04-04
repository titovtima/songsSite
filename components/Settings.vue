<template>
  <ModalWindow :show="show" v-on:update:show="(newShow) => $emit('update:show', newShow)"
               ref="modal" id="settings" @cancel="oncancel" @confirm="onconfirm">
    <template #title>Настройки</template>
    <ChangeFontSize ref="changeFontSize" class="bg-gray-100 px-[5px]"/>
  </ModalWindow>
</template>

<script setup lang="ts">
const changeFontSize: any = ref(null);
const modal: any = ref(null);

const props = defineProps(['show']);
defineEmits(['update:show']);

// if (process.client) {
//   document.cookie = "settings=kds; path=/; max-age=-1";
// }

const settings: any = useCookie('settings', { path: '/' });

if (process.client) {
  let html = document.documentElement;
  if (!settings.value) {
    settings.value = {
      fontSize: parseInt(getComputedStyle(html, '').fontSize)
    }
  }
}

watch(() => settings.value.fontSize, () => {
  useHead({ htmlAttrs: { style: `font-size: ${settings.value.fontSize}px` }});
}, { immediate: true });

let oncancel = () => {};
let onconfirm = () => {};

if (process.client) {
  let savedSettings = settings.value;

  oncancel = () => {
    settings.value = savedSettings;
  }

  onconfirm = () => {
    savedSettings = settings.value;
  }
}
</script>

<style scoped>

</style>
