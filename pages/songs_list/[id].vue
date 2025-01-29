<template>
  <div>
    <h1 class="header">{{ listInfo ? listInfo.name : 'Список песен' }}</h1>
    <RightsView style="margin-bottom: 1rem;" :owner="listRights ? listRights.owner : null" />
    <SongSearch :search-list="songsData"
      @remove-song="song => {songsData = songsData.filter(s => s.id != song.id); songsInfo = songsInfo.filter(s => s.id != song.id)}"/>
    <div style="display: flex; margin-top: 1rem;" v-if="editMode">
      <span style="flex: 0 1 max-content; cursor: pointer; margin-right: 1rem;" ref="addSongClick">+ добавить песню</span>
      <input style="flex: 1 1 max-content; padding: 0 0.5rem;" ref="addSongInput" type="text" list="add-song-list">
      <datalist id="add-song-list">
        <option v-for="song of chooseAddSongList">{{ song.name }}</option>
      </datalist>
    </div>
    <!-- <SongList :list="displayList" :nav-list="route.params.id" class="mt-5"
      @remove="song => {songsData = songsData.filter(s => s.id != song.id); songsInfo = songsInfo.filter(s => s.id != song.id)}"/> -->
  </div>
</template>

<script setup lang="ts">
import apiRequests from "~/utils/apiRequests";
import { findInSong, cloneWithDepth } from "~/utils/global";

const route = useRoute();

const listInfo: Ref<any> = ref(null);
const songsInfo: Ref<Array<any>> = ref([]);
const songsData: Ref<Array<any>> = ref([]);
const allSongsData: Ref<Array<any>> = ref([]);
provide('allSongsData', allSongsData);
const searchedList: any = ref(null);
const listIdInt = Number(route.params.id);
const displayList = computed(() => {
  let list = songsInfo.value;
  if (songsData.value && songsData.value.length != 0)
    list = songsData.value;
  if (songsData.value && songsData.value.length != 0 && searchedList.value != null)
    list = searchedList.value;
  return list.sort((song1: { name: string; }, song2: { name: string; }) => {
    if (song1.name < song2.name) return -1;
    if (song1.name > song2.name) return 1;
    else return 0;
  });
});

try {
  listInfo.value = await apiRequests.getListInfo(listIdInt);
} catch (e) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Список не найден'
  });
}
useHead({ title: listInfo.value.name });

const userData: Ref<any> = useState('userData');
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

if (import.meta.client) {
  apiRequests.getListSongsInfo(Number(route.params.id))
    .then(response => { songsInfo.value = response.list; });
  apiRequests.getListData(Number(route.params.id))
    .then(response => { songsData.value = response.list; });
  apiRequests.getAllSongs()
    .then(response => { allSongsData.value = response.list; });
}

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
          songsData.value.push(song);
          addSongInput.value.value = '';
        }
      });
    }, 100);
  }
});

const saveFunction = functionsRefs.saveFunction;
saveFunction.value = () => {
  let data = cloneWithDepth(listInfo.value, 1);
  data.list = songsData.value.map(song => song.id);
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
