<template>
  <ModalWindow v-bind="$attrs" v-model:show="showInfo" fixed-size>
    <template #title>Пользователь</template>
    {{ userData.username }}
    <template #buttons>
      <button class="modal-button" @click="onconfirm">Выйти</button>
      <button class="modal-button" @click="oncancel">Назад</button>
    </template>
  </ModalWindow>
  <SignIn v-model:show="showSignIn"/>
</template>

<script setup lang="ts">
const props = defineProps(['show']);
const emit = defineEmits(['update:show']);

const showSignIn = ref(false);
const showInfo = ref(false);
const userData: any = useState('userData');

function onconfirm() {
  document.cookie = apiRequests.tokenCookie + '=0; max-age=0; path=/';
  useState('userData').value = null;
  window.location.reload();
}

function oncancel() {
  emit('update:show', false);
}

onMounted(() => {
  watch(() => props.show, () => {
    showSignIn.value = props.show && !userData.value;
    showInfo.value = props.show && !showSignIn.value;
  });

  watch(showSignIn, () => {
    if (!showSignIn.value)
      emit("update:show", false);
  });
});
</script>
