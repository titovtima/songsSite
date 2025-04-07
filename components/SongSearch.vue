<template>
  <div>
    <input type="text" placeholder="Поиск песни по словам" ref="searchInput" class="w-full border border-gray-400 p-1">
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
  let interval = setInterval(() => {
    try {
      setAndWatchScroll();
      clearInterval(interval);
    } catch (e) {}
  }, 100);
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
  if (oldSearchText) {
    searchInput.value.value = oldSearchText;
  }
  searchInput.value.addEventListener('input', () => {
    sessionStorage.setItem(route.path + ':SearchText', searchInput.value.value);
  })
}


function setAndWatchScroll() {
  const scrollDiv: Ref<any> = useState('mainScrollDiv');
  let oldScroll = sessionStorage.getItem(route.path + ':ScrollTop');
  if (oldScroll && Number(oldScroll)) {
    scrollDiv.value.scrollTop = Number(oldScroll);
  }
  useState('watchScroll').value = true;
}
</script>
