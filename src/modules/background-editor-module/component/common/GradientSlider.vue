<template>
  <div class="color-picker-slider">
    <div class="color-picker-slider-body">
      <div
        ref="slider"
        class="color-picker-slider-content"
        :style="sliderStyle"
        @mousedown.stop="addCursor"
      >
        <div class="color-picker-slider-bg" :style="{ backgroundImage: getBackgroundImage }"></div>
        <div
          :style="{
            '--leave': dragHook.config.currentCursorLeaveWidth,
            left: `${item.progress * 100}%`
          }"
          :class="{
            active: index === props.currentCursorIndex
          }"
          tabindex="-1"
          class="color-picker-slider-bar"
          v-for="(item, index) in props.gradientBackground.gradientList"
          @mousedown.stop="$event => setCursor($event, index)"
          @keydown.stop="$event => onKeyDown($event, index)"
        >
        </div>
      </div>
      <!-- 工具栏 -->
      <div class="color-picker-slider-tools">
        <div class="color-picker-slider-tool" tooltip="翻转渐变" @click="flipGradient">
          <i class="iconfont icon-change"></i>
        </div>
        <div class="color-picker-slider-tool" tooltip="旋转90°" @click="rotate90">
          <i class="iconfont icon-refresh"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, reactive, ref } from 'vue';
import type { AppLinearGradientBackground, AppConicGradientBackground, AppRadialGradientBackground, GradientItem } from '../../index.d';
import { state as backgroundEditorState, service as backgroundEditorService } from '../../';
import { toDecimal } from '@/tools/common';
import { toast } from '@/common/message';
import { getLinearGradientItem } from '@/lib/color/Color';
import { useDragHook } from '@/tools/drag';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  sliderStyle: {
    type: Object as PropType<Record<string, any>>,
  },
  /** 渐变背景 */
  gradientBackground: {
    type: Object as PropType<AppLinearGradientBackground | AppRadialGradientBackground | AppConicGradientBackground>,
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
  (event: 'update:gradientBackground', value: GradientItem[]): void;
  (event: 'update:currentCursorIndex', value: number): void;
}>();

const state = reactive({
  
});

const rotate90 = () => {
  backgroundEditorService.rotate90Gradient(props.gradientBackground);
  emit('change');
};

/** 翻转背景 */
const flipGradient = () => {
  const _gradientList = [] as GradientItem[];
  for (let i = props.gradientBackground.gradientList.length - 1; i >= 0; i--) {
    const item = props.gradientBackground.gradientList[i];
    _gradientList.push({
      ...item,
      progress: 1 - item.progress
    })
  }
  props.gradientBackground.gradientList = _gradientList;
  emit('change');
}

const getBackgroundImage = computed(() => {
  let _str = '';
  const _rgbList = props.gradientBackground.gradientList
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
  if (props.gradientBackground.gradientList.length <= 2) {
    toast('最少保留2个渐变节点');
    return;
  }
  emit('update:currentCursorIndex', index > 0 ? index - 1 : index + 1);
  props.gradientBackground.gradientList.splice(index, 1);
  emit('change');
}

/** 添加游标 */
const addCursor = (e: MouseEvent) => {
  let _cursorList = props.gradientBackground.gradientList;

  const rect = slider.value!.getBoundingClientRect();
  const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), rect.width);
  const _progress = toDecimal(_cursorLeft / slider.value!.offsetWidth, 3);

  let prev: GradientItem | undefined;
  let next: GradientItem | undefined;
  for (let i = 0; i < props.gradientBackground.gradientList.length - 1; i++) {
    prev = props.gradientBackground.gradientList[i];
    next = props.gradientBackground.gradientList[i + 1];
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
  props.gradientBackground.gradientList = _cursorList;
  emit('change');
  emit('update:currentCursorIndex', _index);
}

const setCursor = (e: MouseEvent, index: number) => {
  dragHook.isStart.value = true;
  dragHook.config.initDragY = e.pageY;
  emit('change');
  emit('update:currentCursorIndex', index);
};

/** 拖拽钩子 */
const dragHook = useDragHook({
  config: {
    /** 初始拖拽Y坐标（可以用于拖离渐变条） */
    initDragY: 0,
    /** 光标离轴长度 */
    currentCursorLeaveWidth: 0,
  },
  drag(e, config) {
    if (props.currentCursorIndex >= 0) {
      // 小动画效果
      // if (Math.abs(state.initDragY - e.pageY) > 30) {

      // }
      if (Math.abs(config.initDragY - e.pageY) > 50) {
        removeCursor(props.currentCursorIndex);
        dragHook.isStart.value = false;
      } else {
        const rect = slider.value!.getBoundingClientRect();
        const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), rect.width);
        props.gradientBackground.gradientList[props.currentCursorIndex].progress = toDecimal(_cursorLeft / slider.value!.offsetWidth, 3);
        emit('change');
      }
    }
  }
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
  border-radius: 10px;

  > .color-picker-slider-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > .color-picker-slider-tools {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      > .color-picker-slider-tool {
        position: relative;
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 26px;
        height: 26px;
        padding: 4px;
        border-radius: 4px;
        transition: 0.15s;

        &:hover {
          background-color: rgba(0,0,0,0.08);

          &:before {
            transform: translate(25%, 0px);
            opacity: 1.0;
            visibility: visible;
            z-index: 9;
          }

          &:after {
            transform: translate(-50%, 0px) rotate(45deg);
            opacity: 1.0;
            visibility: visible;
            z-index: 8;
          }
        }

        &:before {
          content: attr(tooltip);
          pointer-events: none;
          position: absolute;
          bottom: calc(100% + 6px);
          right: 0%;
          transform: translate(25%, 4px);
          display: inline-block;
          visibility: hidden;
          opacity: 0.0;
          padding: 3px 10px;
          background-color: #333333;
          color: white;
          border-radius: 4px;
          transition: 0.15s;
          font-size: 12px;
          font-weight: normal;
          white-space: nowrap;
          z-index: 0;
        }

        &:after {
          content: '';
          pointer-events: none;
          position: absolute;
          display: block;
          bottom: calc(100% + 3px);
          right: calc(50% - 7px);
          width: 8px;
          height: 8px;
          border-radius: 2px;
          transform: translate(-50%, 4px) rotate(45deg);
          visibility: hidden;
          opacity: 0.0;
          background-image: linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(51,51,51,1) 51%);
          transition: 0.18s;
          z-index: -1;
        }

        + .color-picker-slider-tool {
          margin-left: 4px;
        }
      }
    }

    > .color-picker-slider-content {
      user-select: none;
      position: relative;
      top: 0px;
      left: 0px;
      width: 80%;
      margin-right: 20px;
      height: 12px;
      border-radius: 10px;
      z-index: 1;

      &:before {
        content: '';
        pointer-events: none;
        position: absolute;
        top: 0px;
        left: 0px;
        width: calc(100% + 12px);
        height: 100%;
        border-radius: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
      }

      > .color-picker-slider-bg {
        pointer-events: none;
        user-select: none;
        position: absolute;
        top: 0px;
        left: 0px;
        width: calc(100% + 12px);
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
}
</style>
