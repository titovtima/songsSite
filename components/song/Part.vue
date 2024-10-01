<template>
  <div ref="partDiv" class="my-5 bg-white p-3 w-full min-w-min">
    <div class="text-xl border-b border-black font-bold" v-if="data.name">
      <span v-if="!editMode">{{ data.name }}</span>
      <input v-else type="text" class="w-full" v-model="data.name">
    </div>
    <KeySwitch v-if="data.key != null || editMode" v-model:original="data.key" :edit="editMode" class="mb-1"/>
    <div v-if="!editMode">
      <pre class="text-base" ref="mainContent" :class="{ chords: data.type != 'Text' }">{{
        toValue(getTransposedText(originalKey, keyShift))
      }}</pre>
    </div>
    <div v-else>
      <textarea ref="contentTextarea" v-model="data.data" class="w-full" :class="{ chords: data.type != 'Text' }" @input="event => fitTextareaHeight(event.target)"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import musicTheory from '@titovtima/music-theory';
const { getCircleKeys, chordsTextToString, transposeChordsText, chordsTextFromPlainText, changeChordsTextNotation, keyName } = musicTheory;
import { fitTextareaHeight } from '~/utils/global';

const props = defineProps(['data', 'generalKey']);
defineEmits(['update:keyShift']);

const editMode = useState('editMode');
const keyShift = useState('keyShift', () => 0);
const shiftOriginalKey: any = useState('shiftOriginalKey');
// const edit = ref(false);
const partDiv: any = ref(null);
const mainContent: any = ref(null);
const contentTextarea: any = ref(null);

const settings: any = useCookie('settings');

const keys = getCircleKeys();
const originalKey = computed(() => (props.data.key != null) ? props.data.key : props.generalKey);

watch(shiftOriginalKey, (shift: any) => {
  if (editMode.value && shift.shift != 0 && props.data.type != 'Text' && toValue(originalKey) != null) {
    props.data.data = getTransposedText(shift.original, shift.shift);
  }
});

watch(editMode, () => {
  if (editMode.value) {
    setTimeout(() => {
      fitTextareaHeight(contentTextarea.value);
    }, 10);
  }
});

onMounted(() => {
  if (editMode.value) {
    fitTextareaHeight(contentTextarea.value);
  }
});

function getTransposedText(original: number, shift: number) {
  return (props.data.type == 'Text' || toValue(originalKey) == null) ? props.data.data :
    chordsTextToString(transposeChordsText(
      changeChordsTextNotation(
        chordsTextFromPlainText(props.data.data, 'English'),
        settings.notation,
        props.data.type == 'ChordsText'),
      keys[toValue(original)],
      keys[(toValue(original) + shift) % 12 + ((toValue(original) < 12) ? 0 : 12)],
      props.data.type == 'ChordsText' ));
}

// function clickStartEdit(event: Event) {
//   if (editMode.value) { 
//     edit.value = true;
//     setTimeout(() => {
//       window.addEventListener('click', clickCloseEdit);
//       event.stopPropagation();
//       fitTextareaHeight(contentTextarea.value);
//     }, 50);
//   }
// }

// function clickCloseEdit(event: Event) {
//   if (partDiv.value) {
//     if (!partDiv.value.contains(event.target)) {
//       edit.value = false;
//       window.removeEventListener('click', clickCloseEdit);
//     }
//   } else {
//     window.removeEventListener('click', clickCloseEdit);
//   }
// }
</script>

<style scoped>
.chords {
  font-family: JBMusic, monospace;
}
</style>
