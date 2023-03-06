<template>
  <!-- 画布节点编辑器 -->
  <div
    ref="nodeEditorEl"
    class="canvas-node-action-editor"
    :class="{ show: props.show && !props.component.attrs.lock }"
  >
    <!-- 组件 -->
    <div class="node-action-component">
      <slot></slot>
    </div>
    <!-- 提示文本 -->
    <div
      :class="{
        show: editorState.currentSelectedFirstComponentId === props.component.id && (draggableState.dragConfig.isDrag || state.startDrag) && draggableState.tipConfig.isShow
      }"
      :style="{
        transform: `rotate(${-props.component.attrs.rotate ?? 0}deg)`
      }"
      class="node-action-tip"
      v-html="draggableState.tipConfig.text ?? ' '"
    ></div>
    <!-- 控制器 -->
    <div class="node-action-mark-center"></div>
    <div class="node-action-handle-rotate" @mousedown="e => onStartDrag(e, 'rotate')"></div>
    <div v-show="props.disabledHeight !== true" class="node-action-handle direction-top" @mousedown="e => onStartDrag(e, 'top')"></div>
    <div v-show="props.disabledWidth !== true" class="node-action-handle direction-left" @mousedown="e => onStartDrag(e, 'left')"></div>
    <div v-show="props.disabledWidth !== true" class="node-action-handle direction-right" @mousedown="e => onStartDrag(e, 'right')"></div>
    <div v-show="props.disabledHeight !== true" class="node-action-handle direction-bottom" @mousedown="e => onStartDrag(e, 'bottom')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-top-left" @mousedown="e => onStartDrag(e, 'topleft')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-top-right" @mousedown="e => onStartDrag(e, 'topright')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-bottom-left" @mousedown="e => onStartDrag(e, 'bottomleft')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-bottom-right" @mousedown="e => onStartDrag(e, 'bottomright')"></div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from '@/@types';
import { PropType, onMounted, reactive, computed, ref } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as draggableState, service as draggableService } from '@/modules/draggable-module';
import { Location } from '@/modules/draggable-module/@types';
import message from '@/common/message';
import { onUnmounted } from 'vue';
import { toDecimal } from '@/tools/common';

/** 动作类型（不同方向拖拽及旋转） */
type ActionType = 'rotate' | 'topleft' | 'top' | 'topright' | 'left' | 'right' | 'bottomleft' | 'bottom' | 'bottomright';

/** 组件位置信息 */
interface ComponentRect {
  /** 初始X坐标 */
  startX: number;
  /** 初始Y坐标 */
  startY: number;
  /** 组件X坐标 */
  componentX: number;
  /** 组件Y坐标 */
  componentY: number;
  /** 光标X坐标 */
  x: number;
  /** 光标Y坐标 */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

const props = defineProps({
  /** 组件Id */
  component: {
    type: Object as PropType<Component>,
    required: true,
  },
  /** 是否显示 */
  show: {
    type: Boolean,
    default: false,
  },
  /** 禁用高度 */
  disabledHeight: {
    type: Boolean,
    default: false,
  },
  /** 禁用宽度 */
  disabledWidth: {
    type: Boolean,
    default: false,
  }
});

const state = reactive({
  /** 动作类型（） */
  actionType: undefined as undefined | ActionType,
  /** 操作方向（正向为+，负向为-） */
  direction: 'forward' as 'forward' | 'reverse',
  /** 是否开始拖拽 */
  startDrag: false,
  /** 开始坐标 */
  startLoc: {} as ComponentRect,
  /** 父组件坐标 */
  parentRect: {} as ComponentRect,
  /** 页面坐标 */
  pageRect: {} as DOMRect,
});

const nodeEditorEl = ref<HTMLElement>();

/** 开始拖拽 */
const onStartDrag = (e, actionType: ActionType) => {
  state.actionType = actionType;
  draggableState.dragConfig.isPause = true;
  const rect = nodeEditorEl.value?.getBoundingClientRect();
  
  if (rect) {
    const _canvasPage = editorState.canvasEl.querySelector('.design-form-canvas-page')! as HTMLElement;
    state.pageRect = _canvasPage.getBoundingClientRect();
    state.startLoc = {
      startX: props.component.attrs.x,
      startY: props.component.attrs.y,
      componentX: rect.x,
      componentY: rect.y,
      x: e.pageX,
      y: e.pageY,
      width: rect.width,
      height: rect.height
    };
  } else {
    message.toast('未获取到节点定位', 'error');
  }
  state.startDrag = true;
  setTimeout(() => {
    draggableState.tipConfig.isShow = true;
  }, 20);
};

/** 拖拽方向 */
const actionDirection = {
  top: ['top', 'topleft', 'topright'],
  left: ['left', 'topleft', 'bottomleft'],
  right: ['right', 'topright', 'bottomright'],
  bottom: ['bottom', 'bottomleft', 'bottomright']
};

/** 获取角度 参考：https://blog.csdn.net/qq_34887145/article/details/124584773 */
const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  const angle = Math.atan2(det, dot) / Math.PI * 180
  return (angle + 360) % 360
};

/** 拖拽中 */
const onMoveDrag = (e: MouseEvent) => {
  if (state.startDrag && state.actionType) {
    let _width: number = props.component.attrs.width;
    let _height: number = props.component.attrs.height;
    if (state.actionType === 'rotate') {
      const _centerLocY = state.startLoc.componentY + state.startLoc.height / 2;
      const _centerLocX = state.startLoc.componentX + state.startLoc.width / 2;
      const angle = getAngle({ x: 0, y: -100 }, { x: e.pageX - _centerLocX, y: e.pageY - _centerLocY });
      let _rotate = toDecimal(angle);
      if (_rotate > 42 && _rotate < 48) _rotate = 45;
      else if (_rotate > 87 && _rotate < 93) _rotate = 90;
      else if (_rotate > 132 && _rotate < 138) _rotate = 135;
      else if (_rotate > 177 && _rotate < 183) _rotate = 180;
      else if (_rotate > 222 && _rotate < 228) _rotate = 225;
      else if (_rotate > 267 && _rotate < 273) _rotate = 270;
      else if (_rotate > 312 && _rotate < 318) _rotate = 315;
      else if (_rotate > 357 || _rotate < 3) _rotate = 0;
      props.component.attrs.rotate = _rotate;
      draggableState.tipConfig.text = `${_rotate}°`;
    } else {
      /** 自动吸附坐标 */
      // let adsorbLoc: Location;
      let _x: number = props.component.attrs.x;
      let _y: number = props.component.attrs.y;
      if (actionDirection.top.includes(state.actionType)) {
        _y = e.pageY - state.pageRect.y;
        _height = state.startLoc.componentY + state.startLoc.height - e.pageY;
      } else if (actionDirection.bottom.includes(state.actionType)) {
        _height = e.pageY - state.startLoc.componentY;
      }
      if (actionDirection.left.includes(state.actionType)) {
        _x = e.pageX - state.pageRect.x;
        _width = state.startLoc.componentX + state.startLoc.width - e.pageX;
      } else if (actionDirection.right.includes(state.actionType)) {
        _width = e.pageX - state.startLoc.componentX;
      }
      
      // 保持最小值
      _width = _width < 10 ? 10 : _width;
      _height = _height < 10 ? 10 : _height;

      // 拖拽吸附
      draggableState.alignLines = draggableService.getAlignLines(props.component, {
        x: _x, y: _y, width: _width - 1, height: _height, filter: (direction: 'x' | 'y') => {
          if (direction === 'x') {
            return ['right', 'topright', 'bottomright'].includes(state.actionType!) ? 'end' : 'front';
          } else {
            return ['bottom', 'bottomleft', 'bottomright'].includes(state.actionType!) ? 'end' : 'front';
          }
        }
      });
      const _xLines = draggableState.alignLines.filter(i => i.x !== undefined);
      const _yLines = draggableState.alignLines.filter(i => i.y !== undefined);
      
      if (_yLines.length) {
        if (actionDirection.top.includes(state.actionType)) {
          _height = _y + _height - _yLines[0].y!;
          _y = _yLines[0].y!;
        } else if (actionDirection.bottom.includes(state.actionType)) {
          _height = _yLines[_yLines.length - 1].y! - _y;
        }
      }
      if (_xLines.length) {
        if (actionDirection.left.includes(state.actionType)) {
          _width = _x + _width - _xLines[0].x!;
          _x = _xLines[0].x!;
        } else if (actionDirection.right.includes(state.actionType)) {
          _width = _xLines[_xLines.length - 1].x! - _x;
        }
      }

      _x = toDecimal(_x);
      _y = toDecimal(_y);
      _width = toDecimal(_width);
      _height = toDecimal(_height);

      props.component.attrs.x = _x;
      props.component.attrs.y = _y;
      const _isChangeLoc = !['right', 'bottom', 'bottomright'].includes(state.actionType);
      draggableState.tipConfig.text = (_isChangeLoc ? `x: ${_x} px<br />y: ${_y} px<br />` : '') + `宽: ${_width} px<br />高: ${_height} px`;

      props.component.attrs.width = _width;
      props.component.attrs.height = _height;
    }
  }
};

/** 结束拖拽 */
const onEndDrag = (e: MouseEvent) => {
  if (state.startDrag && state.actionType) {
    state.startDrag = false;
    draggableState.tipConfig.isShow = false;
    state.actionType = undefined;
    draggableState.dragConfig.isPause = false;
    setTimeout(() => {
      draggableState.tipConfig.text = undefined;
    }, 300);
  }
};

onUnmounted(() => {
  document.body.removeEventListener('mousemove', onMoveDrag);
  document.body.removeEventListener('mouseup', onEndDrag);
})

onMounted(async () => {
  document.body.addEventListener('mousemove', onMoveDrag);
  document.body.addEventListener('mouseup', onEndDrag);
});
</script>

<style lang="less" scoped>
.canvas-node-action-editor {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  outline: 1px solid transparent;

  &.show {
    outline-color: #5F81F9;

    > .node-action-mark-center {
      display: block;
    }
    > .node-action-handle {
      display: block;
    }
    > .node-action-handle-rotate {
      display: block;
    }
  }

  > .node-action-component {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    white-space: nowrap;
  }

  > .node-action-mark-center {
    cursor: crosshair;
    position: absolute;
    display: none;
    width: 4px;
    height: 4px;
    top: calc(50% - 1.5px);
    left: calc(50% - 1.5px);
    background-color: #5F81F9;
    z-index: 1000;
  }

  > .node-action-handle-rotate {
    cursor: crosshair;
    position: absolute;
    display: none;
    width: 7px;
    height: 7px;
    top: -30px;
    left: calc(50% - 3px);
    background-color: white;
    outline: 1px solid #5F81F9;
    border-radius: 50%;
    z-index: 1000;

    &:after {
      content: '';
      position: absolute;
      display: block;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
    }
  }

  > .node-action-tip {
    position: absolute;
    display: inline-block;
    left: calc(100% + 6px);
    top: calc(100% + 6px);
    background-color: rgba(0,0,0,0.6);
    color: white;
    padding: 3px 6px;
    border-radius: 4px;
    white-space: nowrap;
    line-height: 16px;
    font-size: 12px;
    transform: scale(0.9);
    transition: opacity 0.12s, visibility 0.12s;
    opacity: 0;
    visibility: hidden;

    &.show {
      opacity: 1;
      visibility: visible;
    }
  }

  > .node-action-handle {
    position: absolute;
    display: none;
    width: 5px;
    height: 5px;
    background-color: white;
    outline: 1px solid #5F81F9;
    z-index: 1000;

    &:after {
      content: '';
      position: absolute;
      display: block;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
    }

    &.direction-top-left {
      cursor: nw-resize;
      top: -3px;
      left: -3px;
    }

    &.direction-top {
      cursor: ns-resize;
      top: -3px;
      left: calc(50% - 2px);
    }

    &.direction-top-right {
      cursor: sw-resize;
      top: -3px;
      right: -3px;
    }

    &.direction-left {
      cursor: w-resize;
      top: calc(50% - 2px);
      left: -3px;
    }

    &.direction-right {
      cursor: w-resize;
      top: calc(50% - 2px);
      right: -3px;
    }

    &.direction-bottom-left {
      cursor: sw-resize;
      bottom: -3px;
      left: -3px;
    }

    &.direction-bottom {
      cursor: ns-resize;
      bottom: -3px;
      left: calc(50% - 2px);
    }

    &.direction-bottom-right {
      cursor: nw-resize;
      bottom: -3px;
      right: -3px;
    }
  }
}
</style>