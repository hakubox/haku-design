<template>
  <div>
    <!-- 目前暂时用于背景选择器测试 -->
    <BackgroundEditorDialog class="dialog1" />


  </div>
</template>

<script lang="ts" setup>
import BackgroundEditorDialog from '@/modules/background-editor-module/component/BackgroundEditorDialog.vue';
import { onUnmounted, onMounted, reactive, ref } from 'vue';

onMounted(() => {
});

onUnmounted(() => {
});
</script>

<style lang="less">

.haku-dialog.dialog1 {
  left: 200px;
  top: 150px;
}
</style>
