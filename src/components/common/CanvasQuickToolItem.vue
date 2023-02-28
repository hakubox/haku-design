<template>
  <div
    :class="[props.config.type === 'tool' ? 'canvas-quick-tool' : 'canvas-quick-split', {
      disabled: props.config.disabled,
      haschild: props.config.children?.length
    }]"
    @click="callback(props.config.fn)"
  >
    <i class="iconfont" :class="props.config.icon"></i>
    <span v-if="props.config.title && !props.config.children?.length" class="canvas-quick-tool-title">{{ props.config.title }}</span>
    <div class="canvas-quick-tool-group" v-if="props.config.children?.length">
      <div class="canvas-quick-tool-group-content">
        <CanvasQuickToolItem
          v-for="detail in props.config.children"
          :config="detail"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component } from '@/@types';
import { reactive, computed, type PropType } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { AppType } from '@/@types/enum';
import type { CanvasQuickTool } from '@/@types/canvas-quick-tool';

const props = defineProps({
  config: {
    type: Object as PropType<CanvasQuickTool>,
    required: true,
  }
});

const state = reactive({
});

/** 统一回调函数 */
const callback = (fn) => {
  const component = editorState.currentSelectedComponent;
  const parent = component ? editorService.findParentComponent(component.id) : undefined;
  if (component && parent) fn(component, parent);
};
</script>

<style lang="less" scoped>
</style>