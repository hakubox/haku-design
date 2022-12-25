<template>
  <div>
    <!-- 目前暂时用于Monaco编辑器测试 -->
    <code-editor style="height: 70vh" language="json" v-model:value="state.editorJson" @change="valueChange"> </code-editor>
    <hr />
    <hr />
    <hr />
    <button @click="setValue">值改变</button>
    {{ state.editorJson }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted, getCurrentInstance, reactive, toRefs } from 'vue';

const state = reactive({
  index: 200,
  editorJson: '',
});

const valueChange = (val: string) => {
  console.log('值改变', val);
};
const setValue = () => {
  state.editorJson = `{ "a": ${state.index++} }`;
};
</script>

<style lang="less"></style>
