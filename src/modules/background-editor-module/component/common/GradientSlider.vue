<template>
  <div class="color-picker-slider">
    <div ref="slider" class="color-picker-slider-content" :style="sliderStyle">
      <div class="color-picker-slider-bg" :style="{ backgroundImage: getBackgroundImage() }"></div>
      <div
        :style="{
          left: `${item.progress * 100}%`
        }"
        :class="{
          active: index === props.currentCursorIndex
        }"
        class="color-picker-slider-bar"
        tabindex="-1"
        v-for="(item, index) in props.cursorList"
        @mousedown="state.isStartDrag = true;"
        @focus="startDrag(index)"
        @blur="emit('update:currentCursorIndex', -1)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, reactive, ref } from 'vue';
import type { GradientItem } from '../../index.d';
import { toDecimal } from '@/tools/common';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  sliderStyle: {
    type: Object as PropType<Record<string, any>>,
  },
  /** 游标列表 */
  cursorList: {
    type: Array as PropType<GradientItem[]>,
    required: true
  },
  /** 当前游标索引 */
  currentCursorIndex: {
    type: Number,
    required: true
  },
});

/** 控件画布 */
const slider = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'input', value: number): void;
  (event: 'update:value', value: number): void;
  (event: 'update:currentCursorIndex', value: number): void;
}>();

const state = reactive({
  /** 是否开始拖拽 */
  isStartDrag: false,
});

const getBackgroundImage = () => {
  const _rgbStr = props.cursorList.sort((a, b) => a.progress - b.progress)
    .map(i => `rgba(${i.color.r}, ${i.color.g}, ${i.color.b}, ${i.color.a}) ${i.progress * 100}%`)
    .join(', ');
  return `linear-gradient(90deg, ${_rgbStr})`;
}

const startDrag = (index: number) => {
  emit('update:currentCursorIndex', index);
  state.isStartDrag = true;
};

const drag = (e) => {
  if (state.isStartDrag && props.currentCursorIndex >= 0) {
    const rect = slider.value!.getBoundingClientRect();
    const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), (rect.width));
    props.cursorList[props.currentCursorIndex].progress = toDecimal(_cursorLeft / (slider.value!.offsetWidth), 3);
  }
};

const endDrag = () => {
  state.isStartDrag = false;
};

/** 初始化 */
const init = () => {
  document.body.addEventListener('mousemove', drag);
  document.body.addEventListener('mouseup', endDrag);
};

onUnmounted(() => {
  document.body.removeEventListener('mousemove', drag);
  document.body.removeEventListener('mouseup', endDrag);
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.color-picker-slider {
  user-select: none;
  position: relative;
  display: block;
  width: 100%;
  height: 12px;
  border-radius: 10px;

  &:before {
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
  }

  > .color-picker-slider-content {
    user-select: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: calc(100% - 10px);
    height: 100%;
    border-radius: 10px;

    > .color-picker-slider-bg {
      pointer-events: none;
      user-select: none;
      position: absolute;
      top: 0px;
      left: 0px;
      width: calc(100% + 10px);
      height: 100%;
      border-radius: 10px;
    }

    > .color-picker-slider-bar {
      user-select: none;
      position: absolute;
      cursor: default;
      top: 0px;
      left: 0px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: transparent;
      border: 2px solid #f8f8f8;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.3), 0px 1px 3px inset rgba(0, 0, 0, 0.3);

      &.active {
        transform: scale(1.2);
      }
    }
  }
}
</style>
