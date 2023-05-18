<template>
  <div class="color-picker-slider">
    <div ref="slider" class="color-picker-slider-content" :style="sliderStyle" @mousedown="startDrag">
      <div :style="{ left: cursorLeft + 'px' }" class="color-picker-slider-bar"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, reactive, ref } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
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

const emit = defineEmits<{
  (event: 'input', value: number): void;
  (event: 'update:value', value: number): void;
}>();

const state = reactive({
  /** 是否开始拖拽 */
  isStartDrag: false,
});

const startDrag = (e) => {
  state.isStartDrag = true;
  drag(e);
};

const drag = (e) => {
  if (state.isStartDrag && slider.value?.offsetWidth !== undefined) {
    const rect = slider.value!.getBoundingClientRect();
    const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left), rect.width);
    const _value = Math.round((_cursorLeft / slider.value.offsetWidth) * props.max);
    emit('input', _value);
    emit('update:value', _value);
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

/** 游标离左侧距离 */
const cursorLeft = computed(() => {
  return ((slider.value?.offsetWidth || 0) * props.value) / props.max - 8;
});

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
  border-radius: 3px;
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
    border-radius: 3px;

    > .color-picker-slider-bar {
      user-select: none;
      position: absolute;
      cursor: default;
      top: -2px;
      left: -7px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #f8f8f8;
      box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
