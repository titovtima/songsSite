<template>
  <nav class="overflow-hidden">
    <ul>
      <li :class="{ active: route.path == '/' }" @click="router.push('/')">главная</li>
      <li @click="$emit('clickSettings')">настройки</li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineEmits(['clickSettings'])

const route = useRoute()
const router = useRouter()
</script>

<style scoped>
li {
  @apply float-right cursor-pointer ml-4;
}

li.active {
  @apply cursor-default text-gray-400;
}
</style>