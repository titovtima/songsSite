<template>
  <ModalWindow :show="show" v-on:update:show="(newShow) => $emit('update:show', newShow)"
               ref="modal" id="settings" @cancel="oncancel" @confirm="onconfirm" fixed-size>
    <template #title>Настройки</template>
    <ChangeFontSize ref="changeFontSize" class="bg-gray-100 px-[5px]"/>
    <div class="bg-gray-200 py-[5px] h-min min-h-[155px]">
      <div class="text-center h-[72px] leading-[72px]">Система обозначений</div>
      <div class="inline-block w-1/2 text-center">
        <label class="cursor-pointer">
          <input class="align-middle mr-[5px] cursor-pointer" type="radio" name="notation" value="English"
                 v-model="notationInput">
          английская<br>
          (B - си, B♭ - си бемоль)
        </label>
      </div>
      <div class="inline-block w-1/2 text-center">
        <label class="cursor-pointer">
          <input class="align-middle mr-[5px] cursor-pointer" type="radio" name="notation" value="German"
                 v-model="notationInput">
          немецкая<br>
          (H - си, B - си бемоль)
        </label>
      </div>
    </div>
    <a href="https://songs.titovtima.ru/"
       class="block bg-gray-100 px-[5px] h-[75px] leading-[75px] overflow-y-hidden overflow-x-auto whitespace-nowrap">
      Перейти на старую версию
    </a>
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

const settings: any = useCookie('settings', {path: '/'});
const notationInput = ref('English');

if (process.client) {
  let html = document.documentElement;
  if (!settings.value) {
    settings.value = {
      fontSize: parseInt(getComputedStyle(html, '').fontSize),
      notation: 'English',
    }
  }
  notationInput.value = settings.value.notation;
  watch(notationInput, (value) => settings.value.notation = value);
  watch(() => settings.value.fontSize, () => {
    useHead({htmlAttrs: {style: `font-size: ${settings.value.fontSize}px`}});
  }, {immediate: true});
}

if (settings.value) {
  useHead({htmlAttrs: {style: `font-size: ${settings.value.fontSize}px`}});
}

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
