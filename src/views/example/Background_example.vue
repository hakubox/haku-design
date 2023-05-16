<template>
  <div>
    <!-- 目前暂时用于背景选择器测试 -->
    <BackgroundEditorDialog class="dialog1" @change="onBackgroundChange" />

    {{ backgroundEditorState.currentBackground }} <br />

    <div class="gradient-editor-panel" ref="gradientEditorPanel">

      <div class="test-rect" :style="{
        top: `200px`,
        left: `200px`,
        mixBlendMode: 'normal',
        backgroundColor: 'red'
      }"></div>

      <div class="test-rect" :style="{
        top: `200px`,
        left: `0px`,
        mixBlendMode: 'normal',
        backgroundColor: 'blue'
      }"></div>
      
      <!-- 带有背景的矩形 -->
      <div class="test-rect" ref="testRect" :style="{
        top: `${backgroundEditorState.component.x}px`,
        left: `${backgroundEditorState.component.y}px`,
        mixBlendMode: backgroundEditorState.currentBackground.blendType
      }">
        <div class="bg-panel">
          <div class="bg-panel-layer" :style="state.innerLayerStyle"></div>
        </div>
      </div>

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
          :cx="backgroundEditorState.component.x + backgroundEditorState.currentBackground.x1"
          :cy="backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1"
          :rx="backgroundEditorState.currentBackground.radius"
          :ry="backgroundEditorState.currentBackground.ovalityRatio * backgroundEditorState.currentBackground.radius"
          stroke="#FFFFFF"
          stroke-width="3"
          fill="rgba(0,0,0,0)"
          :style="{
            transform: `rotate(${backgroundEditorService.getRotate(backgroundEditorState.currentBackground)}deg)`,
            transformOrigin: `${backgroundEditorState.component.x + backgroundEditorState.currentBackground.x1}px ${backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1}px`
          }"
        />
        <!-- AB点连线 -->
        <line
          :x1="backgroundEditorState.component.x + backgroundEditorState.currentBackground.x1"
          :y1="backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1"
          :x2="backgroundEditorState.component.x + backgroundEditorState.currentBackground.x2"
          :y2="backgroundEditorState.component.y + backgroundEditorState.currentBackground.y2"
          stroke-width="2"
          stroke="#FFFFFF"
        />
        <!-- 椭圆侧边点 -->
        <circle
          fill="#FFFFFF"
          :aaa="backgroundEditorState.currentBackground.radius"
          :bbb="backgroundEditorState.component.width / 2"
          :cx="backgroundEditorState.component.x - (backgroundEditorState.currentBackground.radius * backgroundEditorState.currentBackground.ovalityRatio - backgroundEditorState.component.width / 2)"
          :cy="backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1"
          v-if="backgroundEditorState.currentBackground.type === 'radial-gradient'"
          r="4"
          @mousedown="$event => startDragSlidePoint($event, true)"
          :style="{
            transform: `rotate(${backgroundEditorService.getRotate(backgroundEditorState.currentBackground) - 90}deg)`,
            transformOrigin: `${backgroundEditorState.component.x + backgroundEditorState.currentBackground.x1}px ${backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1}px`
          }"
        />
        <!-- A点 -->
        <circle
          fill="#FFFFFF"
          :cx="backgroundEditorState.component.x + backgroundEditorState.currentBackground.x1"
          :cy="backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1"
          r="4"
          @mousedown="$event => startDragPoint($event, true)"
        />
        <!-- B点 -->
        <circle
          fill="#FFFFFF"
          :cx="backgroundEditorState.component.x + backgroundEditorState.currentBackground.x2"
          :cy="backgroundEditorState.component.y + backgroundEditorState.currentBackground.y2"
          r="4"
          @mousedown="$event => startDragPoint($event, false)"
        />
      </svg>

      <template v-if="
        backgroundEditorState.currentBackground.type === 'linear-gradient' || 
        backgroundEditorState.currentBackground.type === 'radial-gradient' || 
        backgroundEditorState.currentBackground.type === 'conic-gradient'
      ">
        <div class="mark-point" :style="{
          top: `${state.pointA.y}px`,
          left: `${state.pointA.x}px`,
        }"></div>
        <!-- <div class="mark-point" :style="{
          top: `${state.pointB.y}px`,
          left: `${state.pointB.x}px`,
        }"></div>
        <div class="mark-point" :style="{
          backgroundColor: '#00CCCC',
          top: `${state.pointC.y}px`,
          left: `${state.pointC.x}px`,
        }"></div> -->
        
        <div
          class="bg-panel-gradien-item"
          tabindex="-1"
          :class="{ 
            active: backgroundEditorState.currentGradientItemIndex === index,
            disabled: state.dragConfig.isStart
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

    <!-- {{ backgroundEditorState.currentBackground }} -- -->
    <!-- <div style="position: absolute;left: 20vw;top: 35vh;">
      x1: <Slider v-model:value="state.x1" :min="-500" :max="500" /><input type="number" v-model.number="state.x1" style="width: 150px;" /><br />
      y1: <Slider v-model:value="state.y1" :min="-500" :max="500" /><input type="number" v-model.number="state.y1" style="width: 150px;" /><br />
      x2: <Slider v-model:value="state.x2" :min="-500" :max="500" /><input type="number" v-model.number="state.x2" style="width: 150px;" /><br />
      y2: <Slider v-model:value="state.y2" :min="-500" :max="500" /><input type="number" v-model.number="state.y2" style="width: 150px;" />
    </div>
    
    <div class="test-rect2" :style="getBackground()">
      <div class="test-rect-layer"
        :style="getInnerLayerStyle2()"
      ></div>
    </div> -->

    <!-- <div class="wrap">
      <div class="left"></div>
      <div class="right"></div>    
    </div> -->

  </div>
</template>

<script lang="ts" setup>
import BackgroundEditorDialog from '@/modules/background-editor-module/component/BackgroundEditorDialog.vue';
import { onMounted, reactive, ref } from 'vue';
import { 
  state as backgroundEditorState, 
  service as backgroundEditorService, 
  type AppBackground, 
  type GradientItem, 
  type GradientRectInfo
} from '@/modules/background-editor-module'
import { Slider } from 'ant-design-vue';
import { onUnmounted } from 'vue';
import { toast } from '@/common/message';
import { toDecimal, distance } from '@/tools/common';
// import { cloneLoop } from '@/lib/clone';

const state = reactive({
  x1: -50,
  y1: 0,
  x2: 0,
  y2: 150,

  /** 拖拽配置 */
  dragConfig: {
    /** 开始拖拽 */
    isStart: false,
    isStartPoint: false,
    x: 0,
    y: 0,
  },
  /** 内部层样式 */
  innerLayerStyle: { } as Record<string, any>,

  pointA: {} as { x: number; y: number; },
  pointB: {} as { x: number; y: number; },
  pointC: {} as { x: number; y: number; },

  /** 椭圆侧边点 */
  slidePoint: { x: 0, y: 0 } as { x: number; y: number; },
  /** 拖拽侧边点配置 */
  dragSlideConfig: {
    /** 开始拖拽 */
    isStart: false,
    isStartPoint: false,
    x: 0,
    y: 0,
  },
  /** 拖拽游标配置 */
  dragCursorConfig: {
    isStart: false,
    /** 初始化拖拽Y点（用于判断是否拽离） */
    initDragY: 0,
  },
  /** 拖拽渐变色的游标栏 */
  dragSlider: {
    width: 0,
    height: 0,
  }
});

const testRect = ref<HTMLElement>();





const gradientEditorPanel = ref<HTMLElement>();

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
  state.dragCursorConfig.isStart = true;
  state.dragCursorConfig.initDragY = e.pageY;
  backgroundEditorState.currentGradientItemIndex = index;
  refreshStyle();
};

const drag = (e) => {
  if (
    backgroundEditorState.currentBackground.type !== 'color' && 
    backgroundEditorState.currentBackground.type !== 'image'
  ) {
    if (state.dragCursorConfig.isStart && backgroundEditorState.currentGradientItemIndex >= 0) {
      // console.log('Math.abs(state.dragCursorConfig.initDragY - e.pageY)', Math.abs(state.dragCursorConfig.initDragY - e.pageY));
      // if (Math.abs(state.dragCursorConfig.initDragY - e.pageY) > 100) {
      //   removeCursor(backgroundEditorState.currentGradientItemIndex);
      //   state.dragCursorConfig.isStart = false;
      // } else {
        const rect = gradientEditorPanel.value!.getBoundingClientRect();

        const a = [backgroundEditorState.component.x + backgroundEditorState.currentBackground.x1, backgroundEditorState.component.y + backgroundEditorState.currentBackground.y1] as [number, number];
        const b = [backgroundEditorState.component.x + backgroundEditorState.currentBackground.x2, backgroundEditorState.component.y + backgroundEditorState.currentBackground.y2] as [number, number];
        const c = [e.pageX - rect.left, e.pageY - rect.top] as [number, number];
        
        const _point1 = getPerpendicularPoint(a, b, c);
        if (_point1.ratio >= 0 && _point1.ratio <= 1) {
          backgroundEditorState.currentBackground.gradientList[backgroundEditorState.currentGradientItemIndex].progress = _point1.ratio;
        }
        refreshStyle();
      // }
    }
  }
};

const endDrag = () => {
  state.dragCursorConfig.isStart = false;
};

onUnmounted(() => {
  document.body.removeEventListener('mousemove', drag);
  document.body.removeEventListener('mouseup', endDrag);
});

onMounted(() => {
  document.body.addEventListener('mousemove', drag);
  document.body.addEventListener('mouseup', endDrag);
});

/** 获取垂点代码 */
function getPerpendicularPoint(a: [number, number], b: [number, number], c: [number, number]): { ratio: number, x: number, y: number } {
  // 已知A, B, P三点坐标
  const [x1, y1] = a;
  const [x2, y2] = b;
  const [x3, y3] = c;

  // 向量
  // AP = (x0-x1, y0-y1)
  // AB = (x2-x1, y2-y1)
  // 计算AP在AB方向上的投影长度
  // 投影*|AB|
  const dist1 = (x3-x1) * (x2-x1) + (y3-y1) * (y2-y1);
  // |AB| * |AB|
  const dist2 = (x2-x1) ** 2 + (y2 - y1) ** 2;

  // AD = 投影 / |AB| * AB
  const ratio = dist1 / dist2;
  const x4 = x1 + ratio * (x2 - x1);
  const y4 = y1 + ratio * (y2 - y1);
  return { x: x4, y: y4, ratio };
}

const startDragSlidePoint = (e: MouseEvent, isStartPoint: boolean) => {
  state.dragSlideConfig.isStart = true;
  state.dragSlideConfig.isStartPoint = isStartPoint;
  state.dragSlideConfig.x = e['layerX'];
  state.dragSlideConfig.y = e['layerY'];
}

const startDragPoint = (e: MouseEvent, isStartPoint: boolean) => {
  state.dragConfig.isStart = true;
  state.dragConfig.isStartPoint = isStartPoint;
  state.dragConfig.x = e['layerX'];
  state.dragConfig.y = e['layerY'];
}

const dragPoint = (e: MouseEvent) => {
  if (state.dragSlideConfig.isStart && backgroundEditorState.currentBackground.type === 'radial-gradient') {
    const { x1, y1 } = backgroundEditorState.currentBackground;
    const _point1 = getPerpendicularPoint([ x1, y1 ], [ state.slidePoint.x, state.slidePoint.y ], [ e.offsetX - backgroundEditorState.component.x, e.offsetY - backgroundEditorState.component.y ]);
    const _distance = distance({ x: _point1.x, y: _point1.y }, { x: x1, y: y1 });
    backgroundEditorState.currentBackground.ovalityRatio = _distance / backgroundEditorState.currentBackground.radius;
    refreshStyle();
  }

  if (state.dragConfig.isStart && (
    backgroundEditorState.currentBackground.type === 'linear-gradient' || 
    backgroundEditorState.currentBackground.type === 'radial-gradient' || 
    backgroundEditorState.currentBackground.type === 'conic-gradient'
  )) {
    if (state.dragConfig.isStartPoint) {
      backgroundEditorState.currentBackground.x1 = e.offsetX - backgroundEditorState.component.x;
      backgroundEditorState.currentBackground.y1 = e.offsetY - backgroundEditorState.component.y;
    } else {
      backgroundEditorState.currentBackground.x2 = e.offsetX - backgroundEditorState.component.x;
      backgroundEditorState.currentBackground.y2 = e.offsetY - backgroundEditorState.component.y;
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
const endDragPoint = () => {
  state.dragConfig.isStart = false;
  state.dragSlideConfig.isStart = false;
}

const onBackgroundChange = () => {
  refreshStyle();
};

const refreshStyle = () => {
  if (testRect.value) {
    let _gradientBgRect = undefined as GradientRectInfo | undefined;
    if (backgroundEditorState.currentBackground.type === 'linear-gradient') {
      _gradientBgRect = backgroundEditorService.getLinearGradientRectInfo(
        backgroundEditorState.currentBackground,
        testRect.value.offsetWidth, 
        testRect.value.offsetHeight
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
          x: backgroundEditorState.component.x + _point.x,
          y: backgroundEditorState.component.y + _point.y,
          rotate: _gradientBgRect.rotate,
        });
      }
      backgroundEditorState.gradientListItemLocs = points;
      
      state.dragSlider.width = _gradientBgRect.maxX - _gradientBgRect.minX;
      state.dragSlider.height = _gradientBgRect.maxY - _gradientBgRect.minY;
    } else if (backgroundEditorState.currentBackground.type === 'radial-gradient') {
      _gradientBgRect = backgroundEditorService.getRadialGradientRectInfo(
        backgroundEditorState.currentBackground,
        testRect.value.offsetWidth, 
        testRect.value.offsetHeight
      );
      const { x1, y1, x2, y2 } = backgroundEditorState.currentBackground;
      const points = [] as { x: number, y: number, rotate: number }[];
      for (let i = 0; i < backgroundEditorState.currentBackground.gradientList.length; i++) {
        const item = backgroundEditorState.currentBackground.gradientList[i];
        const _point = backgroundEditorService.getPointLocByLine(
          x1,
          y1,
          x2,
          y2,
          item.progress
        );
        
        points.push({
          x: backgroundEditorState.component.x + _point.x,
          y: backgroundEditorState.component.y + _point.y,
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
        testRect.value.offsetWidth, 
        testRect.value.offsetHeight
      );
      const { x1, y1, x2, y2 } = backgroundEditorState.currentBackground;
      const points = [] as { x: number, y: number, rotate: number }[];
      for (let i = 0; i < backgroundEditorState.currentBackground.gradientList.length; i++) {
        const item = backgroundEditorState.currentBackground.gradientList[i];
        const _point = backgroundEditorService.getPointLocByLine(x1, y1, x2, y2, item.progress);
        
        points.push({
          x: backgroundEditorState.component.x + _point.x,
          y: backgroundEditorState.component.y + _point.y,
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

    

    state.innerLayerStyle = backgroundEditorService.getBackgroundStyle(
      backgroundEditorState.currentBackground, 
      testRect.value.offsetWidth, 
      testRect.value.offsetHeight,
      _gradientBgRect
    );
  } else {
    return {};
  }
}

onMounted(() => {
  document.addEventListener('mousemove', dragPoint);
  document.addEventListener('mouseup', endDragPoint);

  refreshStyle();
});

onUnmounted(() => {
  document.removeEventListener('mousemove', dragPoint);
  document.removeEventListener('mouseup', endDragPoint);
});
</script>

<style lang="less">

// .wrap {
//   filter: contrast(20);
//   background: #fff;
//   overflow: hidden;
//   padding:10px;
// }
// .left,.right {
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   filter: blur(6px);
// }
// .left {
//   background-color: black;
//   position:absolute;
//   left:0;animation: move 10s infinite alternate;
// }
// @keyframes move{
//   100% {
//     left:250px;
//   }
// }
// .right {
//   background-color: red;
//   margin-left:120px;
// }

.haku-dialog.dialog1 {
  left: 200px;
  top: 150px;
}

.gradient-editor-panel {
  position: absolute;
  top: 20%;
  left: 30%;
  width: 50vw;
  height: 80vh;

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

.test-rect {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 200px;
  height: 200px;
  border: 1px solid #999;

  > .bg-panel {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    > .bg-panel-layer {
      pointer-events: none;
      position: absolute;
      top: 0px;
      left: 0px;
    }
  }

}
</style>
