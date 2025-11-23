<template>
  <ModalWindow v-bind="$attrs" v-model:show="showInfo" fixed-size>
    <template #title>Пользователь</template>
    <div>{{ userData.username }}</div>
    <div>
      Email:
      <span v-if="!editEmail" @click="editEmail = true">{{ userData.email }}</span>
      <span v-else>
        <input ref="inputEmail" type="email" style="padding: 0.1rem; border: 1px solid black;"/>
        <button ref="saveEmail" @click.prevent="changeEmail" style="margin-left: 0.5rem;">Сохранить</button>
      </span>
    </div>
    <template #buttons>
      <button class="modal-button" @click="onconfirm">Выйти</button>
      <button class="modal-button" @click="oncancel">Назад</button>
    </template>
  </ModalWindow>
  <SignIn v-model:show="showSignIn"/>
</template>

<script setup lang="ts">
import { userData } from "~/utils/global";

const props = defineProps(['show']);
const emit = defineEmits(['update:show']);

const inputEmail = ref();
const saveEmail = ref();

const showSignIn = ref(false);
const showInfo = ref(false);
const editEmail = ref(false);

function onconfirm() {
  document.cookie = apiRequests.tokenCookie + '=0; max-age=0; path=/';
  userData.value = null;
  window.location.reload();
}

function oncancel() {
  editEmail.value = false;
  emit('update:show', false);
}

function changeEmail() {
  let newEmail = inputEmail.value.value;
  apiRequests.changeEmail(newEmail)
    .then(res => {
      console.log(res);
      editEmail.value = false;
      userData.value.email = newEmail;
    })
    .catch(err => {
      console.log(err);
      alert('Ошибка сохранения email :(');
    });
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
