<!-- 颜色选择器滑块 -->
<template>
  <div class="color-picker-slider">
    <div ref="slider" class="color-picker-slider-content" :style="sliderStyle" @mousedown="startDrag">
      <div :style="{ left: cursorLeft + 'px' }" class="color-picker-slider-bar"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toDecimal } from '@/tools/common';
import { useDragHook } from '@/tools/drag';
import { computed, onMounted, onUnmounted, PropType, reactive, ref, defineModel } from 'vue';

/** 绑定value */
const modelValue = defineModel<number>('value', { required: true, default: 0 });

const props = defineProps({
  sliderStyle: {
    type: Object as PropType<Record<string, any>>,
  },
  max: {
    type: Number,
    default: 100,
  },
});

/** 控件画布 */
const slider = ref<HTMLElement>();

const startDrag = (e) => {
  dragHook.startDrag(e);
  dragHook.drag(e);
};

/** 拖拽钩子 */
const dragHook = useDragHook({
  drag(e) {
    const rect = slider.value!.getBoundingClientRect();
    const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), (rect.width - 10));
    const _value = toDecimal((_cursorLeft / (slider.value!.offsetWidth - 10)) * props.max, 3);
    modelValue.value = _value;
  }
});

/** 游标离左侧距离 */
const cursorLeft = computed(() => {
  if (slider.value) return (slider.value.offsetWidth - 10) * modelValue.value / props.max - 1;
  else return 0;
});

onMounted(() => {
  dragHook.init();
});

onUnmounted(() => {
  dragHook.destory();
});
</script>

<style lang="less" scoped>
.color-picker-slider {
  user-select: none;
  position: relative;
  display: block;
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);

  &:before {
    content: '';
  }

  > .color-picker-slider-content {
    user-select: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-radius: 10px;

    > .color-picker-slider-bar {
      pointer-events: none;
      user-select: none;
      position: absolute;
      cursor: default;
      top: 0px;
      left: 0px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: transparent;
      border: 2px solid #f8f8f8;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.3), 0px 1px 3px inset rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
