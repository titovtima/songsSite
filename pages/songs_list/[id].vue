<template>
  <div>
    <h1 class="header"><ClientOnly>{{ listData ? listData.name : 'Список песен' }}</ClientOnly></h1>
    <RightsView style="margin-bottom: 1rem;" :owner="listRights ? listRights.owner : null" />
    <SongSearch :search-list="songsData"
      @remove-song="song => {listData.list = listData.list.filter(id => id != song.id);}"/>
    <div style="display: flex; margin-top: 1rem;" v-if="editMode">
      <span style="flex: 0 1 max-content; cursor: pointer; margin-right: 1rem;" ref="addSongClick">+ добавить песню</span>
      <input style="flex: 1 1 max-content; padding: 0 0.5rem;" ref="addSongInput" type="text" list="add-song-list">
      <datalist id="add-song-list">
        <option v-for="song of chooseAddSongList">{{ song.name }}</option>
      </datalist>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import { getAllSongsData, getListData } from "~/utils/getData";
import { findInSong, cloneWithDepth, userData } from "~/utils/global";

const route = useRoute();

const listIdInt = Number(route.params.id);
const [listData, loadPromise] = getListData(listIdInt);
const allSongsData = getAllSongsData();
const songsData = computed(() => allSongsData.value.filter(song => listData.value.list.includes(song.id)));

try {
  await loadPromise;
} catch (e) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Список не найден'
  });
}
useHead({ title: listData.value.name });

const editMode = useState('editMode');
const canEdit = useState('canEdit');

const listRights: Ref<any> = ref(null);
apiRequests.getListRights(listIdInt).then(response => {
  listRights.value = response;
  canEdit.value = userData.value.isAdmin || userData.value.username == listRights.value.owner ||
    listRights.value.writers.includes(userData.value.username);
}).catch(() => {});
provide('rights', listRights);

const chooseAddSongList: Ref<Array<any>> = ref([]);
const addSongInput: Ref<any> = ref(null);
const addSongClick: Ref<any> = ref(null);

watch(editMode, () => {
  if (editMode.value) {
    setTimeout(() => {
      addSongInput.value.addEventListener('input', () => {
        chooseAddSongList.value = (addSongInput.value.value == '' ? allSongsData.value 
          : allSongsData.value.filter(song => findInSong(addSongInput.value.value, song)))
          .filter(song => !(songsData.value.find(song2 => song.name == song2.name)));
      });
      addSongClick.value.addEventListener('click', () => {
        let song = allSongsData.value.find(song => song.name == addSongInput.value.value);
        if (song) {
          listData.value.list.push(song.id);
          addSongInput.value.value = '';
        }
      });
    }, 100);
  }
});

const saveFunction = functionsRefs.saveFunction;
saveFunction.value = () => {
  let data = cloneWithDepth(listData.value, 1);
  apiRequests.postListData(String(listIdInt), data).then(() => { window.location.reload(); });
}
</script>

<style scoped>
.header {
  @apply text-center text-4xl overflow-x-auto p-5;
}

@media (aspect-ratio < 1.2) {
  .header {
    @apply text-2xl;
  }
}
</style>
