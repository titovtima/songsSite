<template>
  <div v-if="status == 'checked'">
    <label>
      Новый пароль
      <br v-if="isMobile"/>
      <input ref="input" type="password"/>
    </label>
    <br/>
    <button @click="submit" 
      style="padding: 0.5rem; background-color: #bbb; line-height: 100%; border-radius: 0.5rem; margin-top: 0.5rem;">Сохранить</button>
  </div>
  <div v-else-if="status == 'saved'" style="text-align: center; width: 100%; padding: 2rem; font-size: 1.5rem;">
    Пароль обновлён <br/>
    <a href="/">Вернуться на главную</a>
  </div>
  <div v-else-if="status == 'error saving'" style="text-align: center; width: 100%; padding: 2rem; font-size: 1.5rem;">
    Ошибка при обновлении пароля. Попробуйте ещё раз <br/>
    <a href="/">Вернуться на главную</a>
  </div>
  <div v-else-if="status == 'error checking'" style="text-align: center; width: 100%; padding: 2rem; font-size: 1.5rem;">
    Ошибка. Попробуйте ещё раз <br/>
    <a href="/">Вернуться на главную</a>
  </div>
  <div v-else style="text-align: center; width: 100%; padding: 2rem; font-size: 1.5rem;">
    Проверка адреса
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const userId = route.params['userId'];
const token = route.params['token'];

const {isMobile} = useDevice();

const input = useTemplateRef('input');

const status = ref('cheking');

if (typeof userId != 'string' || typeof token != 'string') {
  status.value = 'error checking';
  throw createError({
    statusCode: 404,
    message: 'Страница не найдена',
  });
}

try {
  await apiRequests.resetPassword(userId, token, null)
    .then(() => {
      status.value = 'checked';
    });
} catch(e) {
  status.value = 'error checking';
  throw createError({
    statusCode: 404,
    message: 'Страница не найдена',
  });
};

function submit() {
  let password = input.value?.value;
  if (typeof userId != 'string' || typeof token != 'string' || password == null) return;
  apiRequests.resetPassword(userId, token, password)
  .then(() => status.value = 'saved')
  .catch(error => {
    console.log(error);
    if (error.status == 400) {
      alert('Пароль должен сожержать от 6 до 128 символов\na-zA-Zа-яА-Я0-9_#?!@$%^&*-');
      if (input.value)
        input.value.value = '';
    } else {
      status.value = 'error saving';
    }
  });
}
</script>
