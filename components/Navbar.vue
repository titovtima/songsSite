<template>
  <nav class="overflow-hidden">
    <ul>
      <li :class="{ active: route.path == '/' }" @click="router.push('/')">главная</li>
      <li @click="$emit('clickSettings')">настройки</li>
      <li :class="{ active: route.path == '/songs_lists' }" @click="listsButtonClick">
        {{ (navState.listId != null) ? 'к списку' : 'списки' }}
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineEmits(['clickSettings'])

const route = useRoute();
const router = useRouter();

const navState: any = useState('navigation', () => { return { listId: null, prev: null }; });

function listsButtonClick() {
  if (navState.value.listId) {
    router.push('/songs_list/' + navState.value.listId);
  } else {
    router.push('/songs_lists');
  }
}
</script>

<style scoped>
li {
  @apply float-right cursor-pointer ml-4;
}

li.active {
  @apply cursor-default text-gray-400;
}
</style>