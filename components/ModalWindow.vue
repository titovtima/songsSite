<template>
  <Transition name="show-modal">
    <div v-if="show" class="overlay">
      <div style="padding: 20px; background-color: white; border-radius: 0.5rem; width: 90%; margin-top: 20px; height: min-content;">
        <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px;" :style="{ 'min-height': fixedSize ? '55px' : 'none'}">
          <slot name="title"></slot>
        </h2>
        <p style="margin-bottom: 15px;">
          <slot></slot>
        </p>
        <div :style="{ 'min-height': fixedSize ? '55px' : 'none'}">
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

<style scoped>
.overlay {
  position: fixed;
  display: flex;
  inset: 0px;
  background-color: rgba(17, 17, 17, 0.5);
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>

<style>
.modal-button {
  background-color: #6b7280;
  color: #fff;
  font-weight: 700;
  padding: 5px 7px;
  border-radius: 0.1rem;
  margin-right: 10px;
}

.modal-button:hover {
  background-color: #374151;
}

.show-modal-enter-active, .show-modal-leave-active {
  transition: all 0.3s;
}

.show-modal-enter-from, .show-modal-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
