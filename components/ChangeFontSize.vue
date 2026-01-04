<template>
  <div v-if="isMobile" style="position: relative; min-height: 95px;">
    <h3>Размер шрифта</h3>
    <div style="bottom: 0; position: absolute; line-height: 0;">
      <img ref="plus" src="/plus-button.png" alt="увеличить"/>
      <img ref="minus" src="/minus-button.png" alt="уменьшить"/>
    </div>
  </div>
  <div v-else style="display: flex; flex-direction: row; align-items: center;">
    <h3>Размер шрифта</h3>
    <span>
      <img ref="plus" src="/plus-button.png" alt="увеличить"/>
      <img ref="minus" src="/minus-button.png" alt="уменьшить"/>
    </span>
  </div>
</template>

<script setup lang="ts">
import { getSettings } from '~/utils/global';
const {isMobile} = useDevice();

const plus: any = ref(null);
const minus: any = ref(null);

const settings = getSettings();

const maxFontSize = isMobile ? 30 : 48;
onMounted(() => {
  plus.value.onclick = () => {
    settings.value.fontSize = Math.min(settings.value.fontSize + 2, maxFontSize);
  }
  minus.value.onclick = () => {
    settings.value.fontSize = Math.max(settings.value.fontSize - 2, 6);
  }
});
</script>

<style scoped>
img {
  margin: 15px;
  width: 50px;
  display: inline-block;
  cursor: pointer;
}

.rootDiv {
  min-height: 45px;
}

@media (aspect-ratio < 1) {
  img {
    margin: 5px;
    width: 30px;
  }

  .rootDiv {
    min-height: 95px;
    line-height: 95px;
  }
}

@media (aspect-ratio > 1) {
  h3 {
    display: inline-block;
    width: 350px;
  }
}
</style>
