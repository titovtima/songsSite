<template>
  <ModalWindow v-bind="$attrs" :show="show" v-on:update:show="(newShow) => $emit('update:show', newShow)"
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
    <div class="bg-gray-200 px-[5px] h-[75px] leading-[75px] overflow-y-hidden overflow-x-auto whitespace-nowrap"
        @click="oncancel(); $emit('update:show', false); showAuthInfo = true;">
      <div v-if="loggedIn">{{ userData.username }}</div>
      <div v-else>Войти в аккаунт</div>
    </div>
  </ModalWindow>
  <AuthInfo v-model:show="showAuthInfo" :user-data="userData"/>
</template>

<script setup lang="ts">
const changeFontSize: any = ref(null);
const modal: any = ref(null);

defineProps(['show']);
const emit = defineEmits(['update:show']);

// if (process.client) {
//   document.cookie = "settings=kds; path=/; max-age=-1";
// }

const settings: any = useCookie('settings', {path: '/'});
const notationInput = ref('English');

const showAuthInfo = ref(false);
const loggedIn = ref(false);
const userData: any = useState('userData');

watch(showAuthInfo, () => {
  if (!showAuthInfo.value)
    emit("update:show", true);
});
watch(userData, () => { loggedIn.value = !!userData.value });

if (import.meta.client) {
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

if (import.meta.client) {
  let savedSettings = settings.value;

  oncancel = () => {
    settings.value = savedSettings;
  }

  onconfirm = () => {
    savedSettings = settings.value;
  }
}

apiRequests.checkAuthorized().catch(() => {});
</script>

<style scoped>

</style>
