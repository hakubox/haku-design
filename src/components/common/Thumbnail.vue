<template>
  <div :style="{
    width: `${props.width}px`,
    height: `${props.height}px`
  }" class="thumbnail">
    <div :style="{
      width: `${props.contentWidth * props.canvasScale * scale}px`,
      height: `${props.contentHeight * props.canvasScale * scale}px`
    }" class="thumbnail-content">
      <!-- 显示内容列表 -->
      <div :style="{
        top: `${item.attrs.y * props.canvasScale * scale}px`,
        left: `${item.attrs.x * props.canvasScale * scale}px`,
        width: `${item.attrs.width * props.canvasScale * scale}px`,
        height: `${item.attrs.height * props.canvasScale * scale}px`
      }" class="thumbnail-content-item" v-for="item in props.contentList">
      </div>
      
      <div :style="{
        top: `${props.rangeTop * scale}px`,
        left: `${props.rangeLeft * scale}px`,
        width: `${props.rangeWidth * scale}px`,
        height: `${props.rangeHeight * scale}px`
      }" class="thumbnail-bar"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component, ComponentGroup } from '@/@types';
import { computed, PropType, reactive } from 'vue';

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

/** 综合缩放比 */
const scale = computed(() => {
  const widthScale = props.width / props.contentWidth / props.canvasScale;
  const heightScale = props.height / props.contentHeight / props.canvasScale;
  return widthScale < heightScale ? widthScale : heightScale;
});

const state = reactive({
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
  background-color: rgba(0,0,0,0.1);
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0px 0px 10px 4px rgba(0,0,0,0.2);
  z-index: 1;

  > .thumbnail-content {
    position: relative;
    display: block;
    left: 0;
    right: 0;
    background-color: white;

    > .thumbnail-content-item {
      position: absolute;
      display: block;
      left: 0;
      right: 0;
      border-radius: 2px;
      background-color: rgba(51, 122, 183, 0.4);
    }

    > .thumbnail-bar {
      position: absolute;
      display: block;
      left: 0;
      right: 0;
      outline: 1px solid #4d8ce4;
      background-color: rgba(51, 122, 183, 0.2);
      border-radius: 2px;
    }
  }
}
</style>