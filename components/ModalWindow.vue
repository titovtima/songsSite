<template>
  <Transition name="show-modal">
    <div v-if="show" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex w-full h-full justify-center">
      <div class="p-[20px] bg-white rounded-lg shadow-md w-[90%] mt-[20px] h-min">
        <h2 class="text-lg font-bold mb-[15px]" :class="{ 'min-h-[55px]': fixedSize }">
          <slot name="title"></slot>
        </h2>
        <p class="mb-[15px]">
          <slot></slot>
        </p>
        <div :class="{ 'min-h-[55px]': fixedSize }">
          <slot name="buttons">
            <button class="modal-button" @click="buttonClick(() => { $emit('confirm') })">Сохранить</button>
            <button class="modal-button" @click="buttonClick(() => { $emit('cancel') })">Отмена</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// defineProps(['show', 'fixedSize']);
defineProps({
  show: Boolean,
  fixedSize: Boolean
});
const emit = defineEmits(['close', 'cancel', 'confirm', 'update:show']);

function buttonClick(callback: () => void) {
  emit('update:show', false);
  callback();
}
</script>

<style>
.modal-button {
  @apply bg-gray-500 hover:bg-gray-700 text-white font-bold py-[5px] px-[5px] rounded-sm mr-[10px];
}

.show-modal-enter-active, .show-modal-leave-active {
  transition: all 0.3s;
}

.show-modal-enter-from, .show-modal-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
