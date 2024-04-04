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
const emits = defineEmits(['update:show']);

let oncancel = () => {};
let onconfirm = () => {};

if (process.client) {
  const html = document.documentElement;
  let startFontSize = parseInt(getComputedStyle(html, '').fontSize);
  watch(() => props.show, () => {
    if (props.show)
      startFontSize = parseInt(getComputedStyle(html, '').fontSize);
  });

  oncancel = () => {
    console.log('oncancel');
    html.style.fontSize = startFontSize + 'px';
  }

  onconfirm = () => {
    console.log('onconfirm');
    localStorage.setItem('settings', JSON.stringify({
      fontSize: parseInt(getComputedStyle(html, '').fontSize),
    }));
  }
}
</script>

<style scoped>

</style>
