<template>
  <ul v-bind="$attrs">
    <li v-for="option in options" :class="{ active: selected == option }"
        @click="() => {
          if (selected == option && deselect) $emit('selectOption', null);
          else $emit('selectOption', option);
        }">
      {{ option }}
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  options: (string | null)[],
  selected: string | null,
  deselect: boolean
}>();

defineEmits(['selectOption']);
</script>

<style scoped>
li {
  display: inline-block;
  border-bottom: 1px solid black;
  margin-left: 0.25rem;
  min-width: 1.25rem;
  cursor: pointer;
}

li.active {
  font-weight: 700;
  border-bottom-width: 2px;
  cursor: default;
}
</style>
