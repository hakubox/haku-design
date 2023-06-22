<template>
  <ComponentBasic class="component-drawing-board" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div class="q-drawing-board-clear" @click="clear">重写</div>
    <canvas class="q-drawing-board" ref="widgetRef" :style="{ height: height - 80 + 'px' }"></canvas>
    <span style="font-size: 12px; color: #aaa; padding: 5px 0px">{{ '在空白区域书写' }}</span>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { useAttrs, onMounted, PropType, reactive, watch, ref, onUnmounted } from 'vue';
import { getQBasicProps } from '@/tools/common';
import signature from 'signature_pad';
import bus, { GlobalBusType } from '@/tools/bus';

defineOptions({
  inheritAttrs: false,
});

const widgetRef = ref();

const props = defineProps({
  /** 内边距 */
  padding: {
    type: Array as PropType<any>,
    default: () => [0, 0, 0, 0] as [number, number, number, number],
  },
  /** 高度 */
  height: {
    type: Number,
    default: 200,
  },
  /** 设置笔的颜色 */
  pencolor: {
    type: String,
    default: '',
  },
  /** 设置笔的宽度 */
  penMinWidth: {
    type: Number,
    default: 0.5,
  },
  /** 设置笔的宽度 */
  penMaxWidth: {
    type: Number,
    default: 0.5,
  },
  /** 速度权重 */
  velocityFilterWeight: {
    type: Number,
    default: 0.7
  }
});

const state = reactive({
  canvas: null as any,
});

watch(
  () => props.pencolor,
  (val, oldVal) => {
    if (val !== oldVal) {
      state.canvas.penColor = val;
    }
  },
);
watch(
  () => props.pencolor,
  (val, oldVal) => {
    if (val !== oldVal) {
      state.canvas.penColor = val;
    }
  },
);
watch(
  () => props.height,
  (val, oldVal) => {
    if (val !== oldVal) {
      state.canvas.changeSize(undefined, val);
    }
  },
);
watch(
  () => props.padding,
  (val, oldVal) => {
    if (val !== oldVal) {
      state.canvas.changeSize(undefined, val);
    }
  },
);

const init = () => {
  if (state.canvas) state.canvas.clear();
  setTimeout(() => {
    const _rect = widgetRef.value.getBoundingClientRect();
    widgetRef.value.width = _rect.width;
    widgetRef.value.height = _rect.height;
    const _canvas: HTMLCanvasElement = widgetRef.value as HTMLCanvasElement;
    state.canvas = new signature(_canvas);
    state.canvas.minWidth = props.penMinWidth;
    state.canvas.maxWidth = props.penMaxWidth;
    state.canvas.penColor = 'black';
  }, 150);
};

const clear = () => {
  if (state.canvas) {
    state.canvas.clear();
  }
};

function resizeCanvas() {
  if (widgetRef.value && state.canvas) {
    const ratio =  Math.max(window.devicePixelRatio || 1, 1);
    widgetRef.value.width = widgetRef.value.offsetWidth * ratio;
    widgetRef.value.height = widgetRef.value.offsetHeight * ratio;
    widgetRef.value.getContext("2d").scale(ratio, ratio);
    state.canvas.clear();
  }
}

const onResize = () => {
  resizeCanvas();
  init();
};

onMounted(() => {
  bus.$on(GlobalBusType.onPageResize, onResize);
  init();
});

onUnmounted(() => {
  bus.$off(GlobalBusType.onPageResize, onResize);
  state.canvas.clear();
  state.canvas = undefined;
})
</script>

<style lang="less" scoped>
.component-drawing-board {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.q-drawing-board {
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8fafc;
}
.q-drawing-board-clear {
  position: absolute;
  top: 56px;
  right: 24px;
  font-size: 14px;
  color: #1e445c;
  background: #e2e8ef;
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
}
</style>
