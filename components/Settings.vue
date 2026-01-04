<template>
  <ModalWindow v-bind="$attrs" :show="show" v-on:update:show="(newShow) => $emit('update:show', newShow)"
               ref="modal" id="settings" @cancel="oncancel" @confirm="onconfirm" fixed-size>
    <template #title>Настройки</template>
    <ChangeFontSize ref="changeFontSize" style="background-color: #f3f4f6; padding: 0 5px;"/>
    <div style="background-color: #e5e7eb; padding: 5px 0; height: min-content; min-height: 155px;">
      <div style="text-align: center; height: 72px; line-height: 72px;">Система обозначений</div>
      <div style="display: inline-block; width: 50%; text-align: center;">
        <label style="cursor: pointer;">
          <input style="vertical-align: middle; margin-right: 5px; cursor: pointer;" type="radio" name="notation" value="English"
                 v-model="notationInput">
          английская<br>
          (B - си, B♭ - си бемоль)
        </label>
      </div>
      <div style="display: inline-block; width: 50%; text-align: center;">
        <label style="cursor: pointer;">
          <input style="vertical-align: middle; margin-right: 5px; cursor: pointer;" type="radio" name="notation" value="German"
                 v-model="notationInput">
          немецкая<br>
          (H - си, B - си бемоль)
        </label>
      </div>
    </div>
    <div style="background-color: #f3f4f6; padding: 0 5px; height: 75px; line-height: 75px;
          overflow-x: hidden; overflow-y: auto; white-space: nowrap; cursor: pointer;"
        @click="oncancel(); $emit('update:show', false); showAuthInfo = true;">
      <div v-if="loggedIn" style="line-height: inherit;">{{ userData.username }}</div>
      <div v-else style="line-height: inherit;">Войти в аккаунт</div>
    </div>
  </ModalWindow>
  <AuthInfo v-model:show="showAuthInfo" :user-data="userData"/>
</template>

<script setup lang="ts">
import { getSettings, userData } from '~/utils/global';

const changeFontSize: any = ref(null);
const modal: any = ref(null);

defineProps(['show']);
const emit = defineEmits(['update:show']);

// if (process.client) {
//   document.cookie = "settings=kds; path=/; max-age=-1";
// }

const settings = getSettings();
const notationInput = ref('English');

const showAuthInfo = ref(false);
const loggedIn = ref(false);

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
