<template>
  <div class="root" v-if="data && editMode">
    <label>Владелец:</label>
    <input type="text" v-model="data.owner" :disabled="!editMode || (owner != userData.username && !userData.isAdmin)"/>
    
    <label>Редакторы:</label>
    <StringsListInput v-if="editMode" v-model:list="data.writers"/>
    <div v-else>{{ data.writers.join(',') }}</div>
    
    <label>Читатели:</label>
    <StringsListInput v-if="editMode" v-model:list="data.readers"/>
    <div v-else>{{ data.readers.join(',') }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['owner']);

const data: Ref<any> = inject('rights', ref(null));

const editMode = useState('editMode');
const userData: Ref<any> = useState('userData');
</script>

<style scoped>
.root {
  display: grid;
  grid-template-columns: max-content auto;
}

.root > * {
  margin-top: 0.5rem;
}

.root > div, .root > input {
  background: #fff;
}
</style>
