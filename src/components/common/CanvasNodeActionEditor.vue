<template>
  <!-- 画布节点编辑器 -->
  <div
    ref="nodeEditorEl"
    class="canvas-node-action-editor"
    :class="{ global: props.global, show: props.show && (props.global || !props.global && !props.components[0].attrs.lock) }"
    :style="props.global ? {
      width: `${editorState.currentRangeEditorRect.width}px`,
      height: `${editorState.currentRangeEditorRect.height}px`,
      top: `${editorState.currentRangeEditorRect.y}px`,
      left: `${editorState.currentRangeEditorRect.x}px`,
      transform: `rotate(${editorState.currentRangeEditorRect.rotate || 0}deg)`
    } : {}"
  >
    <!-- 组件 -->
    <div class="node-action-component" :class="{
      'auto-width': !props.global && props.components[0].attrs.autowidth,
      'auto-height': !props.global && props.components[0].attrs.autoheight,
    }">
      <slot></slot>
    </div>
    <!-- 提示文本 -->
    <div
      :class="{
        show: ((props.global && !isSingle) || (!isSingle && !props.global && editorState.currentSelectedFirstComponentId === props.components[0].id))
          && (draggableState.dragConfig.isDrag || state.startDrag) && draggableState.tipConfig.isShow
      }"
      :style="{
        transform: `rotate(${(isSingle ? -editorState.currentRangeEditorRect.rotate : -props.components[0].attrs.rotate) ?? 0}deg)`
      }"
      class="node-action-tip"
      v-html="draggableState.tipConfig.text ?? ' '"
    ></div>
    <!-- 控制器 -->
    <div class="node-action-mark-center"></div>
    <div v-show="props.disabledRotate !== true" class="node-action-handle-rotate" @mousedown.stop="e => onStartDrag(e, 'rotate')"></div>
    <div v-show="props.disabledHeight !== true" class="node-action-handle direction-top" @mousedown.stop="e => onStartDrag(e, 'top')"></div>
    <div v-show="props.disabledWidth !== true" class="node-action-handle direction-left" @mousedown.stop="e => onStartDrag(e, 'left')"></div>
    <div v-show="props.disabledWidth !== true" class="node-action-handle direction-right" @mousedown.stop="e => onStartDrag(e, 'right')"></div>
    <div v-show="props.disabledHeight !== true" class="node-action-handle direction-bottom" @mousedown.stop="e => onStartDrag(e, 'bottom')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-top-left" @mousedown.stop="e => onStartDrag(e, 'topleft')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-top-right" @mousedown.stop="e => onStartDrag(e, 'topright')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-bottom-left" @mousedown.stop="e => onStartDrag(e, 'bottomleft')"></div>
    <div v-show="props.disabledWidth !== true && props.disabledHeight !== true" class="node-action-handle direction-bottom-right" @mousedown.stop="e => onStartDrag(e, 'bottomright')"></div>
  </div>
</template>
<script lang="ts" setup>
import type { Component } from '@/@types';
import { PropType, onMounted, reactive, computed, ref, watch } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as draggableState, service as draggableService } from '@/modules/draggable-module';
import message from '@/common/message';
import { onUnmounted } from 'vue';
import { getAngle, toDecimal } from '@/tools/common';
import { getHeight, getWidth } from '@/common/component-handle';

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
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 已选择组件坐标集合 */
  componentRects: { id: string, x: number, y: number, width: number, height: number, rotate: number }[];
}

const props = defineProps({
  /** 对应组件 */
  components: {
    type: Array as PropType<Component[]>,
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
  },
  /** 禁用旋转 */
  disabledRotate: {
    type: Boolean,
    default: false,
  },
  /** 是否为公共选框（多选） */
  global: {
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

/** 拖拽方向 */
const actionDirection = {
  top: ['top', 'topleft', 'topright'],
  left: ['left', 'topleft', 'bottomleft'],
  right: ['right', 'topright', 'bottomright'],
  bottom: ['bottom', 'bottomleft', 'bottomright']
};

const nodeEditorEl = ref<HTMLElement>();

const isSingle = computed(() => props.components.length === 1);

const getX = computed(() => {
  if (isSingle.value) {
    return props.components[0].attrs.x;
  } else {
    return editorState.currentRangeEditorRect.x;
  }
});
const getY = computed(() => {
  if (isSingle.value) {
    return props.components[0].attrs.y;
  } else {
    return editorState.currentRangeEditorRect.y;
  }
});
const getComponentWidth = computed(() => {
  if (isSingle.value) {
    return getWidth(props.components[0]);
  } else {
    return editorState.currentRangeEditorRect.width;
  }
});
const getComponentHeight = computed(() => {
  if (isSingle.value) {
    return getHeight(props.components[0]);
  } else {
    return editorState.currentRangeEditorRect.height;
  }
});

/** 开始拖拽 */
const onStartDrag = (e, actionType: ActionType) => {
  state.actionType = actionType;
  draggableState.dragConfig.isPause = true;
  const rect = nodeEditorEl.value?.getBoundingClientRect();
  
  if (rect) {
    const _canvasPage = editorState.canvasEl.querySelector('.design-form-canvas-page')! as HTMLElement;
    state.pageRect = _canvasPage.getBoundingClientRect();
    state.startLoc = {
      startX: getX.value,
      startY: getY.value,
      componentX: rect.x,
      componentY: rect.y,
      width: rect.width,
      height: rect.height,
      componentRects: editorState.currentSelectedComponents.map(i => ({
        id: i.id, x: i.attrs.x, y: i.attrs.y, width: i.attrs.width, height: i.attrs.height, rotate: i.attrs.rotate
      }))
    };
  } else {
    message.toast('未获取到节点定位', 'error');
  }
  state.startDrag = true;
  setTimeout(() => {
    draggableState.tipConfig.isShow = true;
  }, 20);
};

/** 拖拽中 */
const onMoveDrag = (e: MouseEvent) => {
  if (state.startDrag && state.actionType) {
    let _width: number = getComponentWidth.value;
    let _height: number = getComponentHeight.value;
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
      editorState.currentRangeEditorRect.rotate = _rotate;
      draggableState.tipConfig.text = `${_rotate}°`;
    } else {
      /** 自动吸附坐标 */
      // let adsorbLoc: Location;
      let _x: number = getX.value;
      let _y: number = getY.value;
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
      if (props.components.length === 1) {
        draggableState.alignLines = draggableService.getAlignLines(props.components[0], {
          x: _x, y: _y, width: _width - 1, height: _height, filter: (direction: 'x' | 'y') => {
            if (direction === 'x') {
              return ['right', 'topright', 'bottomright'].includes(state.actionType!) ? 'end' : 'front';
            } else {
              return ['bottom', 'bottomleft', 'bottomright'].includes(state.actionType!) ? 'end' : 'front';
            }
          }
        });
      } else {
        draggableState.alignLines = draggableService.getAlignLinesByRect({
          x: _x, y: _y, width: _width - 1, height: _height, filter: (direction: 'x' | 'y') => {
            if (direction === 'x') {
              return ['right', 'topright', 'bottomright'].includes(state.actionType!) ? 'end' : 'front';
            } else {
              return ['bottom', 'bottomleft', 'bottomright'].includes(state.actionType!) ? 'end' : 'front';
            }
          }
        });
      }
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
      const _isChangeLoc = !['right', 'bottom', 'bottomright'].includes(state.actionType);

      const widthRatio = _width / state.startLoc.width;
      const heightRatio = _height / state.startLoc.height;

      if (props.global) {
        for (let i = 0; i < editorState.currentSelectedComponents.length; i++) {
          const _component = editorState.currentSelectedComponents[i];
          const _rect = state.startLoc.componentRects[i];

          _component.attrs.x = _x + (_rect.x - _x) * widthRatio;
          _component.attrs.y = _y + (_rect.y - _y) * heightRatio;
          _component.attrs.width = _rect.width * widthRatio;
          _component.attrs.height = _rect.height * heightRatio;
        }

        editorState.currentRangeEditorRect.x = _x;
        editorState.currentRangeEditorRect.y = _y;
        editorState.currentRangeEditorRect.width = _width;
        editorState.currentRangeEditorRect.height = _height;
        draggableState.tipConfig.text = (_isChangeLoc ? `
        x: ${_x} px<br />
        y: ${_y} px<br />` : '') + `
        宽: ${_width} px<br />
        高: ${_height} px`;

      } else {
        props.components[0].attrs.x = _x;
        props.components[0].attrs.y = _y;
        props.components[0].attrs.width = _width;
        props.components[0].attrs.height = _height;
        draggableState.tipConfig.text = (_isChangeLoc ? `x: ${_x} px<br />y: ${_y} px<br />` : '') + `宽: ${_width} px<br />高: ${_height} px`;
      }
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

watch(() => editorState.currentSelectedIds, (newVal, oldVal) => {
  if (newVal.length > 1) {
    const { x, y, width, height } = editorService.getSelectedComponentRect();
    editorState.currentRangeEditorRect.x = x;
    editorState.currentRangeEditorRect.y = y;
    editorState.currentRangeEditorRect.width = width;
    editorState.currentRangeEditorRect.height = height;
  } else {
    editorState.currentRangeEditorRect.x = 0;
    editorState.currentRangeEditorRect.y = 0;
    editorState.currentRangeEditorRect.width = 0;
    editorState.currentRangeEditorRect.height = 0;
  }
});

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

  // 多选时的样式
  &.global {
    top: initial;
    left: initial;
    right: initial;
    bottom: initial;
  }

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
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    &.auto-width {
      align-items: flex-start;
      white-space: nowrap;
    }
    &.auto-height {
      justify-content: flex-start;

      > :deep(.component-item) {
        height: initial;
      }
    }
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
    user-select: none;
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