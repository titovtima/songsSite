<template>
  <div class="my-5 bg-white p-3 w-full min-w-min">
    <div class="text-xl border-b border-black font-bold" v-if="data.name">
      {{ data.name }}
    </div>
    <KeySwitch v-if="data.key" :original="data.key" class="mb-2"
               :key-shift="keyShift" @update:key-shift="(kShift) => $emit('update:keyShift', kShift)"/>
    <pre class="text-base" ref="mainContent" :class="{ chords: data.type != 'Text' }">{{
        (data.type == 'Text' || originalKey == null) ? data.data :
          chordsTextToString(transposeChordsText(changeChordsTextNotation(chordsTextFromPlainText(data.data, 'English'),
            settings.notation, data.type == 'ChordsText'),
            keys[originalKey], keys[(originalKey + keyShift) % 12 + ((originalKey < 12) ? 0 : 12)], data.type == 'ChordsText' ))
      }}</pre>
  </div>
</template>

<script setup lang="ts">
import pkg from '@titovtima/music-theory';
const { getCircleKeys, chordsTextToString, transposeChordsText, chordsTextFromPlainText, changeChordsTextNotation } = pkg;

const props = defineProps(['data', 'keyShift', 'generalKey']);
defineEmits(['update:keyShift']);

const settings: any = useCookie('settings');

const keys = getCircleKeys();

const originalKey = computed(() => (props.data.key != null) ? props.data.key : props.generalKey);
</script>

<style scoped>
.chords {
  font-family: JBMusic, monospace;
}
</style>
