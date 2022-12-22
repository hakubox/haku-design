<template>
  <div>
    <!-- 目前暂时用于Monaco编辑器测试 -->
    <code-editor style="height: 70vh" language="json" v-model:value="editorJson" @change="valueChange"> </code-editor>
    <hr />
    <hr />
    <hr />
    <button @click="setValue">值改变</button>
    {{ editorJson }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance, reactive, toRefs } from 'vue';

export default defineComponent({
  methods: {
    valueChange(val: string) {
      console.log('值改变', val);
    },
    setValue() {
      this.editorJson = `{ "a": ${this.index++} }`;
    },
  },
  setup() {
    const state = reactive({
      index: 200,
      editorJson: '',
    });

    const { vnode } = getCurrentInstance() as any;

    onMounted(() => {});

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="less"></style>
