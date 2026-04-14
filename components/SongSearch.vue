<template>
  <div>
    <input type="text" placeholder="Поиск песни по словам" ref="searchInput"
      style="width: 100%; border: 1px solid #9ca3af; padding: 0.25rem;">
    <SongList :list="displayList" @remove="song => $emit('remove-song', song)"/>
    <div :style="{ display: allSongsDisplayList.length > 0 ? 'block' : 'none'}" style="height: 2px; background: #888; width: 100%;"></div>
    <i :style="{ display: allSongsDisplayList.length > 0 ? 'block' : 'none'}" style="color: #888;">
      {{ globalSearchHeader ? globalSearchHeader : 'Из других списков' }}
    </i>
    <SongList :list="allSongsDisplayList"/>
  </div>
</template>

<script setup lang="ts">
import { getAllSongsData } from '~/utils/getData';
import { findWordsInSong, sortSongs } from '~/utils/global';

const searchInput: Ref<any> = ref(null);

const props = defineProps(['searchList', 'globalSearchHeader']);
defineEmits(['remove-song']);
const displayList: Ref<Array<any>> = ref(sortSongs(props.searchList));
const allSongsDisplayList: Ref<Array<any>> = ref([]);

const route = useRoute();

const allSongsData = getAllSongsData(); 

watch(() => props.searchList, () => { updateLists(); });

onMounted(() => {
  searchInput.value.oninput = () => {
    updateLists();
  }
  setAndWatchSearchText();
  useState('watchScroll').value = true;
  // setScroll();
  // let interval = setInterval(() => {
  //   try {
  //     setScroll();
  //     clearInterval(interval);
  //   } catch (e) {}
  // }, 1000);
});

function updateLists() {
  let searchValue: string = searchInput.value.value.toLowerCase();
  if (!searchInput.value || searchValue == '') {
    displayList.value = sortSongs(props.searchList);
    allSongsDisplayList.value = [];
  } else {
    let searchArr = searchValue.split(/[^\p{L}]/gu).filter(w => w.length > 0);
    displayList.value = sortSongs(toValue(props.searchList).filter((song: any) => findWordsInSong(searchArr, song)));
    allSongsDisplayList.value = sortSongs(allSongsData.value.filter((song: { name: string }) => { 
      return findWordsInSong(searchArr, song) && !toValue(displayList).find((song2: { name: string }) => song.name == song2.name); 
    }));
  }
}

function setAndWatchSearchText() {
  let oldSearchText = sessionStorage.getItem(route.path + ':SearchText');
  let oldSearchTextTime: any = sessionStorage.getItem(route.path + ':SearchTextTime');
  if (oldSearchTextTime) oldSearchTextTime = Number(oldSearchTextTime);
  console.log(oldSearchText, oldSearchTextTime);
  console.log(new Date().getTime(), new Date().getTime() - oldSearchTextTime);
  if (oldSearchTextTime && ((new Date().getTime() - oldSearchTextTime) < 1000 * 60 * 15)) {
    if (oldSearchText) {
      searchInput.value.value = oldSearchText;
      sessionStorage.setItem(route.path + ':SearchTextTime', new Date().getTime().toString());
      updateLists();
    }
    setTimeout(() => {
      setScroll();
    }, 1000);
  }
  // setAndWatchScroll();
  searchInput.value.addEventListener('input', () => {
    sessionStorage.setItem(route.path + ':SearchText', searchInput.value.value);
    sessionStorage.setItem(route.path + ':SearchTextTime', new Date().getTime().toString());
  })
}

function setScroll() {
  const scrollDiv: Ref<any> = useState('mainScrollDiv');
  let oldScroll = sessionStorage.getItem(route.path + ':ScrollTop');
  console.log(oldScroll);
  if (oldScroll && Number(oldScroll)) {
    scrollDiv.value.scrollTop = Number(oldScroll);
  }
}
</script>
