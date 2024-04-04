<template>
  <Transition name="show-modal">
    <div v-if="show" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex w-full h-full items-center justify-center">
      <div class="p-[20px] bg-white rounded-lg shadow-md w-[90%] align-middle">
        <h2 class="text-lg font-bold mb-4">
          <slot name="title"></slot>
        </h2>
        <p class="mb-4">
          <slot></slot>
        </p>
        <slot name="buttons">
          <button @click="buttonClick(() => { $emit('confirm') })">Сохранить</button>
          <button @click="buttonClick(() => { $emit('cancel') })">Отмена</button>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps(['show']);
const emit = defineEmits(['close', 'cancel', 'confirm', 'update:show']);

function buttonClick(callback: () => void) {
  emit('update:show', false);
  callback();
}
</script>

<style scoped>
button {
  @apply bg-gray-500 hover:bg-gray-700 text-white font-bold py-[10px] px-[20px] rounded-sm m-2;
}

.show-modal-enter-active, .show-modal-leave-active {
  transition: all 1s;
}

.show-modal-enter-from, .show-modal-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
