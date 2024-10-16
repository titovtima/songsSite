<template>
  <div class="rootDiv">
    <div v-if="!editMode">
      <div v-if="data.isOriginal || data.isMain"><b>{{ (data.isOriginal) ? 'Оригинал' : 'Источник' }}</b></div>
      <div><span>{{ data.artist ? data.artist.name : 'Неизвестный исполнитель' }}</span> - <span>{{ data.songName }}</span></div>
      <a v-if="data.link" :href="data.link" style="color: rgb(0, 102, 204);">{{ data.link }}</a>
      <audio controls v-if="data.audio" :src="apiRequests.getAudioLink(data.audio)"></audio>
    </div>
    <div v-else style="display: flex;">
      <div style="flex: 1 1 max-content; width: 100%;">
        <label style="display: flex; align-items: center;">
          <input type="checkbox" v-model="data.isOriginal"/>
          <span style="margin-left: 0.5rem;">оригинал</span>
        </label>
        <label style="display: flex; align-items: center;">
          <input type="checkbox" v-model="data.isMain">
          <span style="margin-left: 0.5rem;">источник</span>
        </label>
        <div>
          <input ref="artistInput" type="text" style="min-width: 7rem;" placeholder="исполнитель" :value="data.artist.name"
              @input="parseArtistInput"/>
          <span> - </span>
          <input type="text" placeholder="название" v-model="data.songName" style="min-width: 5rem;"
              @input="(e: any) => { e.target.size = e.target.value.length + 1 }"/>
        </div>
        <input style="display: block; width: 100%;" type="text" placeholder="ссылка" v-model="data.link"/>
        <input ref="loadFile" name="file" type="file" accept="audio/mpeg"/>
        <audio ref="audioInEdit" controls></audio>
      </div>
      <div style="flex: 0 1 2rem; margin-left: 1rem;">
        <button class="block aspect-square w-8 my-2" 
            @click="() => { $emit('delete'); }">
          <img src="/assets/svg/cross2.svg"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['data']);
defineEmits(['delete']);

const editMode = useState('editMode');

const loadFile: Ref<any> = ref(null);
const formLoadingFile: Ref<any> = ref(null);
const audioInEdit: Ref<any> = ref(null);

let artistsList: any[] = [];

apiRequests.getArtistsList().then(response => {
  artistsList = response;
});

onMounted(() => {
  watch(editMode, () => {
    if (editMode.value) {
      setTimeout(() => {
        if (props.data.audio)
          audioInEdit.value.src = apiRequests.getAudioLink(props.data.audio);

        let windowURL = window.URL || window.webkitURL;
        loadFile.value.addEventListener('change', async () => {
          let file: File = loadFile.value.files[0];
          
          apiRequests.postAudio(file).then(response => {
            props.data.audio = response.uuid;
          }).catch((e) => { 
            console.log(e);
            alert('Ошибка при загрузке файла');
          });
          if (windowURL) {
            let url = windowURL.createObjectURL(file);
            audioInEdit.value.src = url;
          }
        });
      }, 200);
    }
  }, {immediate: true});
});

const artistInput: Ref<any> = ref(null);
function parseArtistInput() {
  artistInput.value.size = artistInput.value.value.length + 1;
  let name = artistInput.value.value.trim();
  let artist = artistsList.find(value => value.name == name);
  if (artist) {
    props.data.artist = artist;
  } else {
    props.data.artist = {id: -1, name: name};
  }
}
</script>

<style scoped>
.rootDiv {
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #fff;
}

input {
  padding: 0 0.2rem;
  width: auto;
}
</style>
