<template>
  <div>
    <!-- 目前暂时用于Monaco编辑器测试 -->
    <code-editor style="height: 70vh" language="json" v-model:value="state.editorJson" @change="valueChange"> </code-editor>

    <button @click="setValue">值改变</button>
    {{ state.editorJson }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

const state = reactive({
  editorJson: '',
});

const setValue = () => {

};

const valueChange = () => {

};

onMounted(() => {
});
</script>

<style lang="less">
</style>
