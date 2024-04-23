<template>
  <ul>
    <li v-for="list in lists">
      <a class="list-ref" :href="'/song/' + list.id" @click.prevent="clickLink(list.id)">{{ list.name }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";

const router = useRouter();

const lists: any = ref([]);

useHead({title: 'Песни церкви «Источник жизни» | Списки песен'});

apiRequests.getAllListsInfo().then(result => lists.value = result.list);

function clickLink(listId: number) {
  router.push('/songs_list/' + listId);
}
</script>

<style scoped>

</style>