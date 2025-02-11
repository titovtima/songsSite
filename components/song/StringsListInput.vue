<template>
  <div class="rootDiv" style="background-color: var(--second-color);">
    <StringListInputInner v-for="string in localList" :value="string"
        @remove="() => { localList = localList.filter(value => value != string); console.log('localList', localList); $emit('update:list', localList); }"/>
    <span contenteditable @keydown="event => { keydown(event); }" class="editable-span px-0.5"></span>
  </div>
</template>

<script setup lang="ts">
// TODO: redesign for long lists

const props = defineProps({
  list: Array<string>,
  allowSpaces: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:list']);

const localList: Ref<string[]> = ref(props.list ? props.list : []);

function keydown(event: any) {
  let elem: any = event.target;
  if (event.key == 'Enter' || (event.key == 'Space' && !props.allowSpaces)) {
    event.preventDefault();
    let string: string = elem.textContent.trim();
    if (!localList.value.includes(string)) {
      localList.value.push(string);
      emit('update:list', localList.value);
    }
    elem.textContent = '';
  } else if (event.key == 'Backspace') {
    if (elem.textContent.length == 0 && localList.value.length > 0 && !event.repeat) {
      localList.value.pop();
      emit('update:list', localList.value);
    }
  }
}
</script>

<style scoped>
.rootDiv {
  display: flex;
  padding: 0.25rem 0;
}

.rootDiv > * {
  flex: 0 0 max-content;
}

.rootDiv > .editable-span {
  flex: 1 1 max-content;
}
</style>
