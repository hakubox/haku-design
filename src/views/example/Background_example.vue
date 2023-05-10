<template>
  <div>
    <!-- 目前暂时用于背景选择器测试 -->
    <BackgroundEditorDialog class="dialog1" :value="state.value">

    </BackgroundEditorDialog>

    {{ state.value }}
  </div>
</template>

<script lang="ts" setup>
import { AppBackground } from '@/modules/background-editor-module';
import BackgroundEditorDialog from '@/modules/background-editor-module/component/BackgroundEditorDialog.vue';
import { onMounted, reactive, ref } from 'vue';
// import { cloneLoop } from '@/lib/clone';

const state = reactive({
  /** 背景 */
  value: {} as AppBackground,
});

onMounted(() => {
});
</script>

<style lang="less">
.haku-dialog.dialog1 {
  left: 100px;
  top: 100px;
}
</style>
