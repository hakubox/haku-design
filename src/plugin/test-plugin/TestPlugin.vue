<template>
  <div class="test-plugin">
    <div class="test-plugin-title">内容：{{ state.text }}</div>
    <div class="test-plugin-body"><input v-model="state.text" /></div>
    <div class="test-plugin-body">当前组件数量：{{ editorService.getComponentCount() }}</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { service as editorService } from '@/modules/editor-module';

const state = reactive({
  text: '文本内容',
});
</script>
<style lang="less">
.test-plugin {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > .test-plugin-title {
    color: red;
  }

  > .test-plugin-body {
  }
}
</style>
