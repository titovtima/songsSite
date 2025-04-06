<template>
  <ModalWindow :show="show" v-on:update:show="(newShow) => $emit('update:show', newShow)"
    @cancel="oncancel" @confirm="onconfirm" fixed-size>
    <template #title>
      <span @click="register = false" style="cursor: pointer;"
        :style="{'text-decoration': register ? 'none' : 'underline'}">Войти</span>
      <span @click="register = true" style="cursor: pointer; margin-left: 2rem;" 
        :style="{'text-decoration': register ? 'underline' : 'none'}">Зарегистрироваться</span>
    </template>
    <div v-if="register" style="display: grid; grid-template-columns: max-content auto; gap: 0.5rem;">
      <label>
        Имя пользователя
      </label>
      <input ref="username_reg" type="text" autocomplete="username"/>
      <label>
        Email
      </label>
      <input ref="email_reg" type="email" autocomplete="email"/>
      <label>
        Пароль
      </label>
      <input ref="password_reg" type="password" autocomplete="password"/>
    </div>
    <div v-else>
      <label>
        Имя пользователя
        <input ref="username_login" type="text" autocomplete="username"/>
      </label>
      <label>
        Пароль
        <input ref="password_login" type="password" autocomplete="password"/>
      </label>
    </div>
    <template #buttons>
      <button v-if="register" class="modal-button" @click.prevent="onconfirm">Зарегистрироваться</button>
      <button v-else class="modal-button" @click.prevent="onconfirm">Войти</button>
      <button class="modal-button" @click="oncancel">Назад</button>
    </template>
  </ModalWindow>
</template>

<script setup lang="ts">
const props = defineProps(['show']);
const emit = defineEmits(['update:show']);

const username_login: Ref<any> = ref(null);
const password_login: Ref<any> = ref(null);
const username_reg: Ref<any> = ref(null);
const email_reg: Ref<any> = ref(null);
const password_reg: Ref<any> = ref(null);

const register: Ref<boolean> = ref(false);

async function onconfirm() {
  if (register.value) {
    let username = username_reg.value.value.trim();
    let password = password_reg.value.value.trim();
    apiRequests.register(username, email_reg.value.value.trim(), password)
      .then(async () => {
        await apiRequests.login(username, password)
          .then(() => { window.location.reload(); })
          .catch(() => { alert('Ошибка входа после успешной регистрации. Попробуйте войти ещё раз'); });
      })
      .catch(response => {
        if (response == 1) {
          alert('Имя пользователя должно содержать от 3 до 64 символов\na-zA-Zа-яА-Я0-9_.@-\n' +
                'Пароль должен сожержать от 6 до 128 символов\na-zA-Zа-яА-Я0-9_#?!@$%^&*-');
        } else if (response == 2) {
          alert('Такое имя пользователя уже занято');
        } else {
          alert('Ошибка регистрации. Можете попробовать ещё раз');
        }
      })
  } else {
    apiRequests.login(username_login.value.value.trim(), password_login.value.value.trim())
      .then(() => {
        window.location.reload();
      })
      .catch(() => { alert('Не удалось войти'); });
  }
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
