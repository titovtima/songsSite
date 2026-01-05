<template>
  <div>
    <nav style="overflow: hidden;">
      <ul v-if="navState.onlyMain">
        <li :class="{ active: route.path == '/' }" @click="router.push('/')">главная</li>
      </ul>
      <ul v-else>
        <li :class="{ active: route.path == '/' }" @click="router.push('/')">главная</li>
        <li @click="$emit('clickSettings')">настройки</li>
        <li v-if="false" :class="{ active: route.path.match(/\/songs_lists/) }" @click="listsButtonClick">
          {{ (navState.listId != null) ? 'к списку' : 'списки' }}
        </li>
        <li v-else :class="{ active: route.path.match(/\/songs_list\/1/) }"  @click="router.push('/songs_list/1')">
          детские
        </li>
        <li v-if="canEdit">
          <span v-if="editMode" @click="() => { saveFunction(); }">сохранить</span>
          <span v-else @click="() => { editMode = true; }">редактировать</span>
        </li>
      </ul>
    </nav>
    <div v-if="navState.showCopyLink" style="overflow: hidden;">
      <span ref="copyRef" style="float: right; cursor: pointer;" @click="copyUrlToClipboard">Скопировать ссылку</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['clickSettings']);

const route = useRoute();
const router = useRouter();
const canEdit = useState('canEdit');
const editMode = useState('editMode');
const saveFunction = functionsRefs.saveFunction;

const copyRef = ref();

const navState: any = useState('navigation');

function listsButtonClick() {
  if (navState.value.listId) {
    router.push('/songs_list/' + navState.value.listId);
  } else {
    router.push('/songs_lists');
  }
}

function copyUrlToClipboard() {
  console.log(navigator);
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      copyRef.value.innerHTML = "Скопировано";
      setTimeout(() => {
        copyRef.value.innerHTML = "Скопировать ссылку";
      }, 5000);
    });
  } else {
    let textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
      if (successful) {
        copyRef.value.innerHTML = "Скопировано";
        setTimeout(() => {
          copyRef.value.innerHTML = "Скопировать ссылку";
        }, 5000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
}
</script>

<style scoped>
li {
  float: right;
  cursor: pointer;
  margin-left: 1rem;
}

li.active {
  cursor: default;
  color: #9ca3af;
}
</style>