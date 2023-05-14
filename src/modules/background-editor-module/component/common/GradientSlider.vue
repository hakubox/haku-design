<template>
  <div class="color-picker-slider">
    <div
      ref="slider"
      class="color-picker-slider-content"
      :style="sliderStyle"
      @mousedown.stop="addCursor"
    >
      <div class="color-picker-slider-bg" :style="{ backgroundImage: getBackgroundImage }"></div>
      <div
        :style="{
          left: `${item.progress * 100}%`
        }"
        :class="{
          active: index === props.currentCursorIndex
        }"
        tabindex="-1"
        class="color-picker-slider-bar"
        v-for="(item, index) in props.cursorList"
        @mousedown.stop="$event => setCursor($event, index)"
        @keydown.stop="$event => onKeyDown($event, index)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, reactive, ref } from 'vue';
import type { GradientItem } from '../../index.d';
import { state as backgroundEditorState, service as backgroundEditorService } from '../../';
import { toDecimal } from '@/tools/common';
import { toast } from '@/common/message';
import { getLinearGradientItem } from '@/lib/color/Color';

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
  (event: 'change'): void;
  (event: 'update:value', value: number): void;
  (event: 'update:cursorList', value: GradientItem[]): void;
  (event: 'update:currentCursorIndex', value: number): void;
}>();

const state = reactive({
  /** 是否开始拖拽 */
  isStartDrag: false,
  /** 初始拖拽Y坐标（可以用于拖离渐变条） */
  initDragY: 0,
});

const getBackgroundImage = computed(() => {
  let _str = '';
  const _rgbList = props.cursorList
    .map<[number, string]>(i => [i.progress, `rgba(${i.color.r}, ${i.color.g}, ${i.color.b}, ${i.color.a}) ${i.progress * 100}%` ])
    .sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < _rgbList.length; i++) {
    if (i > 0) _str += ', ';
    _str += _rgbList[i][1];
  }
  return `linear-gradient(90deg, ${_str})`;
});

/** 键盘事件 */
const onKeyDown = (e: KeyboardEvent, index: number) => {
  // 按下退格键
  if (e.code === 'Backspace') {
    removeCursor(index);
  }
};

/** 移除游标 */
const removeCursor = (index: number) => {
  if (props.cursorList.length <= 2) {
    toast('最少保留2个渐变节点');
    return;
  }
  emit('update:currentCursorIndex', index > 0 ? index - 1 : index + 1);
  props.cursorList.splice(index, 1);
  emit('change');
}

/** 添加游标 */
const addCursor = (e: MouseEvent) => {
  let _cursorList = props.cursorList;

  const rect = slider.value!.getBoundingClientRect();
  const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), rect.width);
  const _progress = toDecimal(_cursorLeft / slider.value!.offsetWidth, 3);

  let prev: GradientItem | undefined;
  let next: GradientItem | undefined;
  for (let i = 0; i < props.cursorList.length - 1; i++) {
    prev = props.cursorList[i];
    next = props.cursorList[i + 1];
    if (prev.progress <= _progress && next.progress >= _progress) {
      break;
    }
  }
  let color;
  // 计算颜色
  if (prev && next) {
    color = getLinearGradientItem(prev.color, next.color, (_progress - prev.progress) / (next.progress - prev.progress) * 100);
  } else {
    color = { r: 255, g: 255, b: 255, a: 0 };
  }
  
  
  _cursorList.push({ color, progress: _progress });
  _cursorList = _cursorList.sort((a, b) => a.progress - b.progress);
  const _index = _cursorList.findIndex(i => i.progress === _progress);
  emit('change');
  emit('update:cursorList', _cursorList);
  emit('update:currentCursorIndex', _index);
}

const setCursor = (e: MouseEvent, index: number) => {
  state.isStartDrag = true;
  state.initDragY = e.pageY;
  emit('change');
  emit('update:currentCursorIndex', index);
};

const drag = (e) => {
  if (state.isStartDrag && props.currentCursorIndex >= 0) {
    if (Math.abs(state.initDragY - e.pageY) > 100) {
      removeCursor(props.currentCursorIndex);
      state.isStartDrag = false;
    } else {
      const rect = slider.value!.getBoundingClientRect();
      const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), rect.width);
      props.cursorList[props.currentCursorIndex].progress = toDecimal(_cursorLeft / slider.value!.offsetWidth, 3);
      emit('change');
    }
  }
};

const endDrag = () => {
  state.isStartDrag = false;
};

onUnmounted(() => {
  document.body.removeEventListener('mousemove', drag);
  document.body.removeEventListener('mouseup', endDrag);
});

onMounted(() => {
  document.body.addEventListener('mousemove', drag);
  document.body.addEventListener('mouseup', endDrag);
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
