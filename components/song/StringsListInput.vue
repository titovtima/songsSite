<template>
  <div class="rootDiv">
    <StringListInputInner v-for="string in localList" :value="string"
        @remove="() => { localList = localList.filter(value => value != string); $emit('update:list', localList) }"/>
    <span contenteditable @input="event => { input(event); }" class="editable-span px-0.5"></span>
  </div>
</template>

<script setup lang="ts">
// TODO: redesign for long lists

const props = defineProps(['list']);
const emit = defineEmits(['update:list']);

const localList: globalThis.Ref<string[]> = ref(props.list);

function input(event: Event) {
  let elem: any = event.target;
  if (elem.textContent.length > 0 && elem.textContent.at(-1).trim().length == 0) {
    let string: string = elem.textContent.slice(0, -1);
    if (!localList.value.includes(string)) {
      localList.value.push(string);
      emit('update:list', localList.value);
    }
    elem.textContent = '';
  }
}
</script>

<style scoped>
.rootDiv {
  display: flex;
}

.rootDiv > * {
  flex: 0 0 max-content;
}

.rootDiv > .editable-span {
  flex: 1 1 max-content;
}
</style>
