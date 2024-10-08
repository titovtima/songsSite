<template>
  <ModalWindow :show="show" v-on:update:show="(newShow) => $emit('update:show', newShow)"
    @cancel="oncancel" @confirm="onconfirm" fixed-size>
    <template #title>
      Войти
    </template>
    <label>
      Имя пользователя
      <input ref="username" type="text"/>
    </label>
    <label>
      Пароль
      <input ref="password" type="password"/>
    </label>
    <template #buttons>
      <button class="modal-button" @click.prevent="onconfirm">Войти</button>
      <button class="modal-button" @click="oncancel">Назад</button>
    </template>
  </ModalWindow>
</template>

<script setup lang="ts">
const props = defineProps(['show']);
const emit = defineEmits(['update:show']);

const username: any = ref(null);
const password: any = ref(null);

async function onconfirm() {
  apiRequests.login(username.value.value, password.value.value)
    .then(() => {
      window.location.reload();
    })
    .catch(() => { alert('Не удалось войти'); });
}

function oncancel() {
  emit('update:show', false);
}
</script>

<style scoped>
input {
  border-radius: 0.2rem;
  border: black solid 1px;
}
</style>
