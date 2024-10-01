<template>
  <nav class="overflow-hidden">
    <ul>
      <li :class="{ active: route.path == '/' }" @click="router.push('/')">главная</li>
      <li @click="$emit('clickSettings')">настройки</li>
      <li v-if="false" :class="{ active: route.path.match(/\/songs_lists/) }" @click="listsButtonClick">
        {{ (navState.listId != null) ? 'к списку' : 'списки' }}
      </li>
      <li v-else :class="{ active: route.path.match(/\/songs_list\/1/) }"  @click="router.push('/songs_list/1')">
        детские
      </li>
      <li v-if="isAuthorized">
        <span v-if="editMode" @click="() => { editMode = false; }">сохранить</span>
        <span v-else @click="() => { editMode = true; }">редактировать</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineEmits(['clickSettings']);

const route = useRoute();
const router = useRouter();
const isAuthorized = ref(false);
const editMode = useState('editMode', () => false);

const navState: any = useState('navigation', () => { return { listId: null, prev: null }; });

apiRequests.checkAuthorized().then(() => { isAuthorized.value = true; }).catch(() => {});

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