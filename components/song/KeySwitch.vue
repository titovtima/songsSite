<template>
  <ul v-bind="$attrs">
    <li v-for="key in toValue(showKeys)" :class="{ active: key == toValue(selectedKey) }"
        @click="() => { clickKey(key); }">
      {{ keyName(key, settings.notation) }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getSettings } from '~/utils/global';
import musicTheory from '@titovtima/music-theory';
const { getCircleKeys, keyName } = musicTheory;

const props = defineProps(['original']);
const emit = defineEmits(['update:original']);

const settings = getSettings();
const editMode = useState('editMode');
const keyShift = useState('keyShift', () => 0);
const shiftOriginalKey = useState('shiftOriginalKey');

const keys = getCircleKeys();

const majorKeys = keys.filter(key => key.mode == '');
const minorKeys = keys.filter(key => key.mode == 'm');

const showKeys = computed(() => props.original != null ? ((keys[props.original].mode == '') ? majorKeys : minorKeys) : keys);
const selectedKey = computed(() => props.original == null ? null : 
    keys[(props.original + keyShift.value) % 12 + ((props.original < 12) ? 0 : 12)]);

watch(shiftOriginalKey, (shift: any) => {
  if (editMode.value && props.original != null && shift.shift != 0) {
    emit('update:original', (props.original + shift.shift) % 12 + ((props.original < 12) ? 0 : 12));
  }
});

function clickKey(key: any) {
  if (editMode.value) {
    if (props.original != null) {
      if (keys.indexOf(key) == props.original) {
        emit('update:original', null);
      } else {
        shiftOriginalKey.value = { original: props.original, shift: (keys.indexOf(key) + 24 - props.original) % 12 };
      }
    } else {
      emit('update:original', keys.indexOf(key));
    }
  } else {
    keyShift.value = (keys.indexOf(key) + 24 - props.original) % 12;
  }
}
</script>

<style scoped>
li {
  display: inline-block;
  border-bottom: 1px solid black;
  margin-left: 0.25rem;
  min-width: 1.25rem;
  cursor: pointer;
}

li.active {
  font-weight: 700;
  border-bottom: 2px solid black;
  cursor: default;
}
</style>
