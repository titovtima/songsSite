<template>
  <div class="rootDiv" style="margin: 1rem 0; padding: 0.5rem; background-color: #fff;">
    <div v-if="!editMode">
      <div v-if="data.isOriginal || data.isMain"><b>{{ (data.isOriginal) ? 'Оригинал' : 'Источник' }}</b></div>
      <div>
        <span>{{ (data.artists && data.artists.length > 0) ? data.artists.map((a: any) => a.name).join(', ') : 'Неизвестный исполнитель' }}</span> - 
        <span>{{ data.songName }}</span>
      </div>
      <div v-if="data.album">Альбом: {{ data.album }}<span v-if="data.date">({{ data.date }})</span></div>
      <div v-else-if="data.date">Дата: {{ data.date }}</div>
      <a v-if="data.link" :href="data.link" style="color: rgb(0, 102, 204);">{{ data.link }}</a>
      <audio controls v-if="data.audio" preload="metadata" style="display: block;" :src="apiRequests.getAudioLink(data.audio)"></audio>
      <div v-if="data.lang && data.lang != 'rus'">Язык: {{ (langNames as any)[data.lang] }}</div>
      <div v-if="data.key != null">Тональность: {{ musicTheory.keyName(musicTheory.getCircleKeys()[data.key % 24]) }}</div>
      <div v-if="data.bpm">Темп: {{ data.bpm }}</div>
      <pre v-if="data.extra">{{ data.extra }}</pre>
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
        <div style="display: grid; grid-template-columns: max-content auto; row-gap: 0.5rem; padding-bottom: 0.5rem;">
          <label style="align-self: center;">Исполнитель:</label>
          <StringsListInput v-model:list="artistsNamesList" allow-spaces @update:list="parseArtistInput()"/>
          <label style="align-self: center;">Название:</label>
          <input type="text" v-model="data.songName" style="min-width: 5rem; background-color: var(--second-color);"
                @input="(e: any) => { e.target.size = e.target.value.length + 1 }"/>
          <label>Альбом:</label>
          <input type="text" v-model="data.album" style="min-width: 5rem; background-color: var(--second-color);"
                @input="(e: any) => { e.target.size = e.target.value.length + 1 }"/>
          <label style="align-self: center;">Ссылка:</label>
          <input style="display: block; width: 100%; background-color: var(--second-color);" type="text" placeholder="ссылка" v-model="data.link"/>
        </div>
        <input ref="loadFile" name="file" type="file" accept="audio/mpeg"/>
        <audio ref="audioInEdit" style="display: block;" controls></audio>
        <div style="display: grid; grid-template-columns: max-content auto; row-gap: 0.5rem; margin-top: 0.5rem;">
          <label>Язык:</label>
          <div>
            <select v-model="data.lang" style="background-color: var(--second-color);">
              <option></option>
              <option v-for="lang of langList">{{ lang }}</option>
            </select>
          </div>
          <label>Дата:</label>
          <input v-model="data.date" style="background-color: var(--second-color);"/>
          <label>Тональность:</label>
          <KeySwitch v-model:original="data.key"/>
          <label>Темп:</label>
          <input type="number" v-model="data.bpm" style="background-color: var(--second-color);"/>
          <label>Доп:</label>
          <textarea v-model="data.extra" style="background-color: var(--second-color); field-sizing: content;"></textarea>
        </div>
      </div>
      <div style="flex: 0 1 2rem; margin-left: 1rem;">
        <button style="display: block; aspect-ratio: 1/1; width: 2rem; margin: 0.5rem 0;" 
            @click="() => { $emit('updateOrder', { perf: data, action: 'delete' }); }">
          <img src="/assets/svg/cross2.svg"/>
        </button>
        <button v-if="data.ord > 1" style="display: block; aspect-ratio: 1/1; width: 2rem; margin: 0.5rem 0;" 
            @click="() => { $emit('updateOrder', { perf: data, action: 'up'}); }">
          <img src="/assets/svg/arrow_up.svg"/>
        </button>
        <button style="display: block; aspect-ratio: 1/1; width: 2rem; margin: 0.5rem 0;" 
            @click="() => { $emit('updateOrder', { perf: data, action: 'down'}); }">
          <img src="/assets/svg/arrow_down.svg"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import musicTheory from '@titovtima/music-theory';

const props = defineProps(['data']);
defineEmits(['updateOrder']);

const editMode = useState('editMode');

const loadFile: Ref<any> = ref(null);
const formLoadingFile: Ref<any> = ref(null);
const audioInEdit: Ref<any> = ref(null);

const langNames = { 'rus': 'русский', 'eng': 'английский', 'fin': 'финский', 'swe': 'шведский', 'heb': 'иврит' };
const langList: string[] = [];
for (let lang in langNames) langList.push(lang);

const artistsNamesList: Ref<string[]> = ref(props.data.artists.map((a: any) => a.name));

let allArtistsList: any[] = [];

apiRequests.getArtistsList().then(response => {
  allArtistsList = response;
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

let artistInputTimeout = setTimeout(() => {}, 1);
function parseArtistInput() {
  clearTimeout(artistInputTimeout);
  artistInputTimeout = setTimeout(() => {
    let artists: any[] = [];
    artistsNamesList.value.forEach(name => {
      let artist = allArtistsList.find(value => value.name == name);
      if (artist) {
        artists.push(artist);
      } else {
        artists.push({id: -1, name: name});
      }
    });
    props.data.artists = artists;
  }, 5000);
}
</script>

<style scoped>
.rootDiv {
  --bg-color: #fff;
  --second-color: #f4f4f4;
}

input {
  padding: 0 0.2rem;
  width: auto;
}
</style>
