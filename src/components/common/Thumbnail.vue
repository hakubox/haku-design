<template>
  <div :style="{
    width: `${props.width}px`,
    height: `${props.height}px`
  }" class="thumbnail">
    <div :style="{
      width: `${props.contentWidth * props.canvasScale * scale}px`,
      height: `${props.contentHeight * props.canvasScale * scale}px`
    }" class="thumbnail-body">
      <div class="thumbnail-content" :style="{
        zoom: scale,
      }">
        <DesignCanvas
          :style="{
            width: `${editorState.appConfig.width}px`,
            height: `${editorState.appConfig.height}px`,
          }"
          :isPreview="true"
          :isReadonly="true"
          :showEditor="false"
          :showButton="false"
        />
      </div>
      
      <div
        :style="{
          top: `${props.rangeTop * scale}px`,
          left: `${props.rangeLeft * scale}px`,
          width: `${getRangeWidth * scale}px`,
          height: `${getRangeHeight * scale}px`
        }"
        class="thumbnail-bar"
        @mousedown.stop.prevent="onMouseDown"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component, ComponentGroup } from '@/@types';
import { computed, onMounted, onUnmounted, PropType, reactive } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import DesignCanvas from "@/components/module/DesignCanvas.vue";

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
  children: Rect;
}

const props = defineProps({
  /** 画布缩放倍数 */
  canvasScale: {
    type: Number,
    default: 1
  },
  /** 预览图宽度 */
  width: {
    type: Number,
    default: 120
  },
  /** 预览图高度 */
  height: {
    type: Number,
    default: 80
  },
  /** 内容宽度（非显示宽度） */
  contentWidth: {
    required: true,
    type: Number,
  },
  /** 内容高度（非显示高度） */
  contentHeight: {
    required: true,
    type: Number,
  },
  /** 选框宽度（非显示宽度） */
  rangeWidth: {
    required: true,
    type: Number,
  },
  /** 选框高度（非显示高度） */
  rangeHeight: {
    required: true,
    type: Number,
  },
  /** 选框左边距（非显示宽度） */
  rangeLeft: {
    required: true,
    type: Number,
  },
  /** 选框上边距（非显示高度） */
  rangeTop: {
    required: true,
    type: Number,
  },
  /** 内容列表 */
  contentList: {
    type: Array as PropType<(Component | ComponentGroup)[]>,
    default: () => []
  }
});

const emit = defineEmits<{
  (event: 'drag', x: number, y: number): void;
  (event: 'update:rangeTop', value: number): void;
  (event: 'update:rangeLeft', value: number): void;
}>();

const state = reactive({
  /** 拖拽状态 */
  dragState: {
    isStart: false,
    originX: 0,
    originY: 0,
    x: 0,
    y: 0,
  },
});

/** 综合缩放比 */
const scale = computed(() => {
  const widthScale = (props.width - 2) / props.contentWidth / props.canvasScale;
  const heightScale = (props.height - 2) / props.contentHeight / props.canvasScale;
  return widthScale < heightScale ? widthScale : heightScale;
});

const onMouseDown = (e: MouseEvent) => {
  state.dragState.isStart = true;
  state.dragState.originX = props.rangeLeft;
  state.dragState.originY = props.rangeTop;
  state.dragState.x = e.pageX;
  state.dragState.y = e.pageY;
};

const onMouseMove = (e: MouseEvent) => {
  if (state.dragState.isStart) {
    let _x = state.dragState.originX + (e.pageX - state.dragState.x) / scale.value;
    let _y = state.dragState.originY + (e.pageY - state.dragState.y) / scale.value;
    if (_x < 0) _x = 0;
    else if (_x > props.contentWidth * props.canvasScale - getRangeWidth.value) _x = props.contentWidth * props.canvasScale - getRangeWidth.value;
    if (_y < 0) _y = 0;
    else if (_y > props.contentHeight * props.canvasScale - getRangeHeight.value) _y = props.contentHeight * props.canvasScale - getRangeHeight.value;
    emit('update:rangeLeft', _x);
    emit('update:rangeTop', _y);
    emit('drag', _x, _y);
  }
};

const getRangeWidth = computed(() => {
  return props.rangeWidth > props.contentWidth * props.canvasScale ? props.contentWidth * props.canvasScale : props.rangeWidth;
});

const getRangeHeight = computed(() => {
  return props.rangeHeight > props.contentHeight * props.canvasScale ? props.contentHeight * props.canvasScale : props.rangeHeight;
});

const onMouseUp = (e: MouseEvent) => {
  state.dragState.isStart = false;
  state.dragState.x = 0;
  state.dragState.y = 0;
  state.dragState.originX = 0;
  state.dragState.originY = 0;
};

onMounted(() => {
  document.body.addEventListener('mousemove', onMouseMove);
  document.body.addEventListener('mouseup', onMouseUp);
});

onUnmounted(() => {
  document.body.removeEventListener('mousemove', onMouseMove);
  document.body.removeEventListener('mouseup', onMouseUp);
});

</script>

<style lang="less" scoped>
.thumbnail {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  right: 30px;
  top: 20px;
  background-color: #E5E5E5;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0px 0px 10px 4px rgba(0,0,0,0.2);
  z-index: 1;

  > .thumbnail-body {
    position: relative;
    display: block;
    left: 0;
    right: 0;
    background-color: white;

    > .thumbnail-content {
      position: relative;
      display: block;

      &:after {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    > .thumbnail-bar {
      cursor: grab;
      position: absolute;
      display: block;
      left: 0;
      right: 0;
      outline: 1px solid #4d8ce4;
      background-color: rgba(51, 122, 183, 0.2);
      box-shadow: 0px 0px 4px 2px rgba(0,0,0,0.15);
      border-radius: 2px;

      &:active {
        cursor: grabbing;
      }
    }
  }
}
</style>