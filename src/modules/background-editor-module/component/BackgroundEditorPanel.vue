<template>
  <div
    class="gradient-editor-panel"
    :class="{ visible: backgroundEditorState.isShow && backgroundEditorState.currentBackground.show }"
    ref="gradientEditorPanel"
    @mousedown.stop
  >
    <!-- 带有背景的矩形 -->
    <!-- <div class="test-rect" ref="testRect" :style="{
      top: `${component.x}px`,
      left: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      mixBlendMode: backgroundEditorState.currentBackground.blendType
    }">
      <div class="bg-panel" :style="state.parentLayerStyle">
        <div class="bg-panel-layer" :style="state.innerLayerStyle"></div>
      </div>
    </div> -->

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      class="bg-gradient-editor-svg"
      v-if="
        backgroundEditorState.currentBackground.type === 'linear-gradient' || 
        backgroundEditorState.currentBackground.type === 'radial-gradient' || 
        backgroundEditorState.currentBackground.type === 'conic-gradient'
      "
    >
      <!-- 圆环 -->
      <ellipse
        v-if="
          backgroundEditorState.currentBackground.type === 'radial-gradient' ||
          backgroundEditorState.currentBackground.type === 'conic-gradient'
        "
        :cx="currentComponent.x + backgroundEditorState.currentBackground.x1"
        :cy="currentComponent.y + backgroundEditorState.currentBackground.y1"
        :rx="backgroundEditorState.currentBackground.radius"
        :ry="backgroundEditorState.currentBackground.ovalityRatio * backgroundEditorState.currentBackground.radius"
        stroke="#FFFFFF"
        stroke-width="3"
        fill="rgba(0,0,0,0)"
        :style="{
          transform: `rotate(${backgroundEditorService.getRotate(backgroundEditorState.currentBackground)}deg)`,
          transformOrigin: `${currentComponent.x + backgroundEditorState.currentBackground.x1}px ${currentComponent.y + backgroundEditorState.currentBackground.y1}px`
        }"
      />
      <!-- AB点连线 -->
      <line
        :x1="currentComponent.x + backgroundEditorState.currentBackground.x1"
        :y1="currentComponent.y + backgroundEditorState.currentBackground.y1"
        :x2="currentComponent.x + backgroundEditorState.currentBackground.x2"
        :y2="currentComponent.y + backgroundEditorState.currentBackground.y2"
        stroke-width="2"
        stroke="#FFFFFF"
      />
      <!-- 椭圆侧边点 -->
      <circle
        fill="#FFFFFF"
        :cx="currentComponent.x - (backgroundEditorState.currentBackground.radius * backgroundEditorState.currentBackground.ovalityRatio - currentComponent.width / 2)"
        :cy="currentComponent.y + backgroundEditorState.currentBackground.y1"
        v-if="backgroundEditorState.currentBackground.type === 'radial-gradient'"
        r="4"
        @mousedown="$event => dragSlidePointHook.startDrag($event)"
        :style="{
          transform: `rotate(${backgroundEditorService.getRotate(backgroundEditorState.currentBackground) - 90}deg)`,
          transformOrigin: `${currentComponent.x + backgroundEditorState.currentBackground.x1}px ${currentComponent.y + backgroundEditorState.currentBackground.y1}px`
        }"
      />
      <!-- A点 -->
      <circle
        fill="#FFFFFF"
        :cx="currentComponent.x + backgroundEditorState.currentBackground.x1"
        :cy="currentComponent.y + backgroundEditorState.currentBackground.y1"
        r="4"
        @mousedown="$event => dragPointHook.startDrag($event, { isStartNode: true })"
      />
      <!-- B点 -->
      <circle
        fill="#FFFFFF"
        :cx="currentComponent.x + backgroundEditorState.currentBackground.x2"
        :cy="currentComponent.y + backgroundEditorState.currentBackground.y2"
        r="4"
        @mousedown="$event => dragPointHook.startDrag($event, { isStartNode: false })"
      />
    </svg>

    <template v-if="
      backgroundEditorState.currentBackground.type === 'linear-gradient' || 
      backgroundEditorState.currentBackground.type === 'radial-gradient' || 
      backgroundEditorState.currentBackground.type === 'conic-gradient'
    ">
      <!-- <div class="mark-point" :style="{
        top: `${state.pointA.y}px`,
        left: `${state.pointA.x}px`,
      }"></div> -->
      
      <div
        class="bg-panel-gradien-item"
        tabindex="-1"
        :class="{ 
          active: backgroundEditorState.currentGradientItemIndex === index,
          disabled: dragPointHook.isStart.value || dragSlidePointHook.isStart.value
        }"
        :style="{
          '--item-color': `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, ${item.color.a})`,
          left: `${backgroundEditorState.gradientListItemLocs?.[index]?.x}px`,
          top: `${backgroundEditorState.gradientListItemLocs?.[index]?.y}px`,
          transform: `rotate(${backgroundEditorState.gradientListItemLocs?.[index]?.rotate}deg)`,
        }"
        @keydown.stop="$event => onKeyDown($event, index)"
        v-for="(item, index) in backgroundEditorState.currentBackground.gradientList"
      >
        <svg
          class="bg-panel-gradien-item-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          @mousedown="$event => setCursor($event, index)"
        >
          <path
            d="M513.024 1024h-1.024c-17.92 0-34.816-7.168-47.104-20.48-9.728-10.24-97.28-102.912-184.832-219.648C162.304 625.664 102.4 499.2 102.4 409.088 102.4 183.296 286.208 0 512 0s409.6 183.296 409.6 409.088c0 54.784-20.992 121.856-62.976 199.68-39.936 74.752-100.352 161.792-179.712 258.048l-0.512 0.512-117.76 134.144c-11.776 14.336-29.184 22.528-47.616 22.528z m-1.024-423.936c105.984 0 191.488-86.016 191.488-191.488S617.984 217.6 512 217.6 320 303.104 320 409.088s86.016 190.976 192 190.976z"
            :fill="backgroundEditorState.currentGradientItemIndex === index ? '#3662EC' : '#FFFFFF'"
          ></path>
        </svg>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { StyleValue, onMounted, onUnmounted, reactive, computed, ref, watch } from 'vue';
import { 
  state as backgroundEditorState, 
  service as backgroundEditorService, 
  type GradientRectInfo
} from '@/modules/background-editor-module'
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { toast } from '@/common/message';
import { toDecimal, distance, getPerpendicularPoint } from '@/tools/common';
import { useDragHook } from '@/tools/drag';
import bus from '@/tools/bus';
import { Component } from '@/@types';

const state = reactive({
  /** 内部层样式 */
  innerLayerStyle: { } as StyleValue,
  parentLayerStyle: { } as StyleValue,

  pointA: {} as { x: number; y: number; },

  /** 椭圆侧边点 */
  slidePoint: { x: 0, y: 0 } as { x: number; y: number; },
  /** 拖拽渐变色的游标栏 */
  dragSlider: {
    width: 0,
    height: 0,
  },
  /** 组件节点 */
  componentEl: {} as HTMLElement
});

const gradientEditorPanel = ref<HTMLElement>();

bus.$on('background_editor_change', () => {
  refreshStyle();
});

const currentComponent = computed(() => {
  const component = editorState.currentSelectedComponents.find(i => !i.isGroup) as Component | undefined;
  if (component) {
    return component.attrs as unknown as { x: number, y: number, width: number, height: number };
  } else {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
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
  if (
    backgroundEditorState.currentBackground.type !== 'color' && 
    backgroundEditorState.currentBackground.type !== 'image' && 
    backgroundEditorState.currentBackground.type !== 'conic-gradient'
  ) {
    if (backgroundEditorState.currentBackground.gradientList.length <= 2) {
      toast('最少保留2个渐变节点');
      return;
    }
    backgroundEditorState.currentGradientItemIndex = index > 0 ? index - 1 : index + 1;
    backgroundEditorState.currentBackground.gradientList.splice(index, 1);
    refreshStyle();
  }
}

/** 添加游标 */
const addCursor = (e: MouseEvent) => {
  if (
    backgroundEditorState.currentBackground.type !== 'color' && 
    backgroundEditorState.currentBackground.type !== 'image' && 
    backgroundEditorState.currentBackground.type !== 'conic-gradient'
  ) {
    let _cursorList = backgroundEditorState.currentBackground.gradientList;

    const rect = gradientEditorPanel.value!.getBoundingClientRect();
    const _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left - 5), rect.width);

    const _progress = toDecimal(_cursorLeft / state.dragSlider.width, 3);
    _cursorList.push({ color: { r: 255, g: 255, b: 255, a: 0 }, progress: _progress });
    _cursorList = _cursorList.sort((a, b) => a.progress - b.progress);
    const _index = _cursorList.findIndex(i => i.progress === _progress);
    backgroundEditorState.currentBackground.gradientList = _cursorList;
    backgroundEditorState.currentGradientItemIndex = _index;
    refreshStyle();
  }
}

const setCursor = (e: MouseEvent, index: number) => {
  backgroundEditorState.currentGradientItemIndex = index;
  dragCursorHook.startDrag(e, { initDragY: e.pageY });
  refreshStyle();
};

/** 拖拽游标钩子 */
const dragCursorHook = useDragHook({
  config: {
    /** 初始化拖拽Y坐标 */
    initDragY: 0
  },
  drag(e) {
    if (
      backgroundEditorState.currentGradientItemIndex >= 0 && 
      backgroundEditorState.currentBackground.type !== 'color' && 
      backgroundEditorState.currentBackground.type !== 'image'
    ) {
      // console.log('Math.abs(dragCursorHook.config.initDragY - e.pageY)', Math.abs(dragCursorHook.config.initDragY - e.pageY));
      // if (Math.abs(dragCursorHook.config.initDragY - e.pageY) > 100) {
      //   removeCursor(backgroundEditorState.currentGradientItemIndex);
      //   dragCursorHook.isStart = false;
      // } else {
        const rect = gradientEditorPanel.value!.getBoundingClientRect();

        const a = [currentComponent.value.x + backgroundEditorState.currentBackground.x1, currentComponent.value.y + backgroundEditorState.currentBackground.y1] as [number, number];
        const b = [currentComponent.value.x + backgroundEditorState.currentBackground.x2, currentComponent.value.y + backgroundEditorState.currentBackground.y2] as [number, number];
        const c = [e.pageX - rect.left, e.pageY - rect.top] as [number, number];
        
        const _point1 = getPerpendicularPoint(a, b, c);
        if (_point1.ratio >= 0 && _point1.ratio <= 1) {
          backgroundEditorState.currentBackground.gradientList[backgroundEditorState.currentGradientItemIndex].progress = _point1.ratio;
        }
        refreshStyle();
      // }
    }
  }
});

/** 拖拽椭圆侧边点钩子 */
const dragSlidePointHook = useDragHook({
  drag(e) {
    if (backgroundEditorState.currentBackground.type === 'radial-gradient') {
      const { x1, y1 } = backgroundEditorState.currentBackground;
      const _point1 = getPerpendicularPoint([ x1, y1 ], [ state.slidePoint.x, state.slidePoint.y ], [ e.offsetX - currentComponent.value.x, e.offsetY - currentComponent.value.y ]);
      const _distance = distance({ x: _point1.x, y: _point1.y }, { x: x1, y: y1 });
      backgroundEditorState.currentBackground.ovalityRatio = _distance / backgroundEditorState.currentBackground.radius;
      refreshStyle();
    }
  }
});

/** 拖拽点钩子 */
const dragPointHook = useDragHook({
  config: {
    isStartNode: false
  },
  drag(e) {
    if (
      backgroundEditorState.currentBackground.type === 'linear-gradient' || 
      backgroundEditorState.currentBackground.type === 'radial-gradient' || 
      backgroundEditorState.currentBackground.type === 'conic-gradient'
    ) {
      if (dragPointHook.config.isStartNode) {
        const _distanceX = backgroundEditorState.currentBackground.x2 - backgroundEditorState.currentBackground.x1;
        const _distanceY = backgroundEditorState.currentBackground.y2 - backgroundEditorState.currentBackground.y1;
        backgroundEditorState.currentBackground.x1 = e.offsetX - currentComponent.value.x;
        backgroundEditorState.currentBackground.y1 = e.offsetY - currentComponent.value.y;
        
        if (backgroundEditorState.currentBackground.type === 'radial-gradient' || backgroundEditorState.currentBackground.type === 'conic-gradient') {
          backgroundEditorState.currentBackground.x2 = backgroundEditorState.currentBackground.x1 + _distanceX;
          backgroundEditorState.currentBackground.y2 = backgroundEditorState.currentBackground.y1 + _distanceY;
        }
      } else {
        backgroundEditorState.currentBackground.x2 = e.offsetX - currentComponent.value.x;
        backgroundEditorState.currentBackground.y2 = e.offsetY - currentComponent.value.y;
      }
      if (backgroundEditorState.currentBackground.type === 'radial-gradient' || backgroundEditorState.currentBackground.type === 'conic-gradient') {
        backgroundEditorState.currentBackground.radius = distance(
          { x: backgroundEditorState.currentBackground.x1, y: backgroundEditorState.currentBackground.y1 },
          { x: backgroundEditorState.currentBackground.x2, y: backgroundEditorState.currentBackground.y2 }
        );
      }
      refreshStyle();
    }
  }
});

/** 刷新样式 */
const refreshStyle = () => {
  if (state.componentEl) {
    let _gradientBgRect = undefined as GradientRectInfo | undefined;
    if (backgroundEditorState.currentBackground.type === 'linear-gradient') {
      console.log('state.componentEl.offsetWidth', state.componentEl.offsetWidth);
      console.log('state.componentEl.offsetHeight', state.componentEl.offsetHeight);
      _gradientBgRect = backgroundEditorService.getLinearGradientRectInfo(
        backgroundEditorState.currentBackground,
        state.componentEl.offsetWidth, 
        state.componentEl.offsetHeight
      );
      const points = [] as { x: number, y: number, rotate: number }[];
      for (let i = 0; i < backgroundEditorState.currentBackground.gradientList.length; i++) {
        const item = backgroundEditorState.currentBackground.gradientList[i];
        const _point = backgroundEditorService.getPointLocByLine(
          backgroundEditorState.currentBackground.x1,
          backgroundEditorState.currentBackground.y1,
          backgroundEditorState.currentBackground.x2,
          backgroundEditorState.currentBackground.y2,
          item.progress
        );
        
        points.push({
          x: currentComponent.value.x + _point.x,
          y: currentComponent.value.y + _point.y,
          rotate: _gradientBgRect.rotate,
        });
      }
      backgroundEditorState.gradientListItemLocs = points;
      
      state.dragSlider.width = _gradientBgRect.maxX - _gradientBgRect.minX;
      state.dragSlider.height = _gradientBgRect.maxY - _gradientBgRect.minY;
    } else if (backgroundEditorState.currentBackground.type === 'radial-gradient') {
      _gradientBgRect = backgroundEditorService.getRadialGradientRectInfo(
        backgroundEditorState.currentBackground,
        state.componentEl.offsetWidth, 
        state.componentEl.offsetHeight
      );
      const { x1, y1, x2, y2 } = backgroundEditorState.currentBackground;
      const points = [] as { x: number, y: number, rotate: number }[];
      for (let i = 0; i < backgroundEditorState.currentBackground.gradientList.length; i++) {
        const item = backgroundEditorState.currentBackground.gradientList[i];
        const _point = backgroundEditorService.getPointLocByLine(x1, y1, x2, y2, item.progress);
        
        points.push({
          x: currentComponent.value.x + _point.x,
          y: currentComponent.value.y + _point.y,
          rotate: _gradientBgRect.rotate,
        });
      }
      backgroundEditorState.gradientListItemLocs = points;
      
      state.dragSlider.width = _gradientBgRect.maxX - _gradientBgRect.minX;
      state.dragSlider.height = _gradientBgRect.maxY - _gradientBgRect.minY;
      
      const slidePoint = backgroundEditorService.getSlidePoint(x1, y1, x2, y2);

      state.slidePoint.x = slidePoint.x;
      state.slidePoint.y = slidePoint.y;
    } else if (backgroundEditorState.currentBackground.type === 'conic-gradient') {
      _gradientBgRect = backgroundEditorService.getConicGradientRectInfo(
        backgroundEditorState.currentBackground,
        state.componentEl.offsetWidth, 
        state.componentEl.offsetHeight
      );
      const { x1, y1, x2, y2 } = backgroundEditorState.currentBackground;
      const points = [] as { x: number, y: number, rotate: number }[];
      for (let i = 0; i < backgroundEditorState.currentBackground.gradientList.length; i++) {
        const item = backgroundEditorState.currentBackground.gradientList[i];
        const _point = backgroundEditorService.getPointLocByLine(x1, y1, x2, y2, item.progress);
        
        points.push({
          x: currentComponent.value.x + _point.x,
          y: currentComponent.value.y + _point.y,
          rotate: _gradientBgRect.rotate,
        });
      }
      backgroundEditorState.gradientListItemLocs = points;
      
      state.dragSlider.width = _gradientBgRect.maxX - _gradientBgRect.minX;
      state.dragSlider.height = _gradientBgRect.maxY - _gradientBgRect.minY;

      // 旋转渐变暂时未配置椭圆
      // const slidePoint = backgroundEditorService.getSlidePoint(x1, y1, x2, y2);
      // state.slidePoint.x = slidePoint.x;
      // state.slidePoint.y = slidePoint.y;
    }

    const backgroundStyle = backgroundEditorService.getBackgroundStyle(
      backgroundEditorState.currentBackground, 
      state.componentEl.offsetWidth, 
      state.componentEl.offsetHeight,
      backgroundEditorService.getComponentAttrs(),
      _gradientBgRect
    );
    if (backgroundStyle) {
      backgroundEditorState.currentBackground.parentStyle = backgroundStyle.parentStyle as Record<string, string>;
      backgroundEditorState.currentBackground.innerStyle = backgroundStyle.innerStyle as Record<string, string>;
    }
  }
}

watch(() => backgroundEditorState.isShow && backgroundEditorState.currentBackground.show, () => {
  const _components = editorState.currentSelectedComponents.find(i => !i.isGroup);
  if (_components) {
    const _dom = editorState.canvasPanelEl.querySelector<HTMLElement>(`[component-id="${_components.id}"]`);
    if (_dom) {
      state.componentEl = _dom;
    }
  }
});

onMounted(() => {
  dragCursorHook.init();
  dragPointHook.init();
  dragSlidePointHook.init();

  refreshStyle();
});

onUnmounted(() => {
  dragCursorHook.destory();
  dragPointHook.destory();
  dragSlidePointHook.destory();
});
</script>

<style lang="less" scoped>
.gradient-editor-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  visibility: hidden;
  opacity: 0.0;

  &.visible {
    visibility: visible;
    opacity: 1.0;
  }

  > .mark-point {
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.4);
    border: 3px solid white;
    z-index: 999;
  }

  > .bg-panel-gradien-item {
    position: absolute;
    left: 0px;
    top: 0px;
    transform-origin: center bottom;

    &.disabled {
      pointer-events: none;
    }

    &.active {

      &:after {
        // border: 1px solid #666;
      }
    }

    &:before {
      content: '';
      pointer-events: none;
      position: absolute;
      top: -24px;
      left: -6.5px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
      background-size: 8px 8px;
      // border: 1px solid #BBB;
      z-index: 1;
    }

    &:after {
      content: '';
      pointer-events: none;
      position: absolute;
      top: -24px;
      left: -6.5px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--item-color);
      // border: 1px solid #BBB;
      z-index: 1;
    }

    > .bg-panel-gradien-item-icon {
      position: absolute;
      top: -26px;
      left: -10.5px;
      filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.3));
    }
  }

  > .bg-gradient-editor-svg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    > line {
      cursor: default;
      filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.5));
    }
    > circle {
      cursor: pointer;
      filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.5));
    }
    > ellipse {
      pointer-events: none;
      cursor: pointer;
      filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.5));
    }
  }
}
</style>