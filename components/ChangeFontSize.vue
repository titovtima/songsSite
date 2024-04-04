<template>
  <div :class="{ 'min-h-[95px]': isMobile }" class="relative">
    <h3>Размер шрифта</h3>
    <div v-if="isMobile" class="bottom-0 absolute">
      <img ref="plus" src="/plus-button.png" alt="увеличить"/>
      <img ref="minus" src="/minus-button.png" alt="уменьшить"/>
    </div>
    <span v-else>
      <img ref="plus" src="/plus-button.png" alt="увеличить"/>
      <img ref="minus" src="/minus-button.png" alt="уменьшить"/>
    </span>
  </div>
</template>

<script setup lang="ts">
const {isMobile} = useDevice();

const plus: any = ref(null);
const minus: any = ref(null);

const maxFontSize = isMobile ? 30 : 48;
if (process.client) {
  const html = document.documentElement;

  onMounted(() => {
    plus.value.onclick = () => {
      html.style.fontSize =
        Math.min(parseInt(getComputedStyle(html, '').fontSize) + 2, maxFontSize) + 'px';
    }
    minus.value.onclick = () => {
      html.style.fontSize = Math.max(parseInt(getComputedStyle(html, '').fontSize) - 2, 6) + 'px';
    }
  });
}
</script>

<style scoped>
img {
  @apply m-[15px] w-[50px] inline-block cursor-pointer;
}

@media (aspect-ratio < 1) {
  img {
    @apply m-[5px] w-[30px];
  }
}

@media (aspect-ratio > 1) {
  h3 {
    @apply inline-block w-[350px];
  }
}
</style>
