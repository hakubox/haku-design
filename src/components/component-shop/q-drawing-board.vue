<template>
  <ComponentBasic class="component-drawing-board" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div class="q-drawing-board-clear" @click="clear">重写</div>
    <canvas class="q-drawing-board" ref="widgetRef" :style="{ height: height + 'px' }"></canvas>
    <span style="font-size: 12px; color: #aaa; padding: 5px 0px">{{ '在空白区域书写' }}</span>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script lang="ts" setup>
import { useAttrs, onMounted, PropType, reactive, watch, ref } from 'vue';
import { getQBasicProps } from '@/tools/common';
import signature from 'signature_pad';

const attrs = useAttrs();
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
});


const state = reactive({
  canvas: null as any,
});

watch(() => props.pencolor, (val, oldVal) => {
  if (val !== oldVal) {
    state.canvas.penColor = val;
  }
});
watch(() => props.pencolor, (val, oldVal) => {
  if (val !== oldVal) {
    state.canvas.penColor = val;
  }
});
watch(() => props.height, (val, oldVal) => {
  if (val !== oldVal) {
    state.canvas.changeSize(undefined, val);
  }
});
watch(() => props.padding, (val, oldVal) => {
  if (val !== oldVal) {
    state.canvas.changeSize(undefined, val);
  }
});

const init = () => {
  let _canvas: HTMLCanvasElement = widgetRef.value as HTMLCanvasElement;
  state.canvas = new signature(_canvas);
  state.canvas.penColor = 'black';
}

const clear = () => {
  if (state.canvas) {
        state.canvas.clear();
      }
}

onMounted(() => {
  init();
});

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
