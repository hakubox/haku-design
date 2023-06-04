<template>
  <div class="basic-echart">
    <div ref="echartEl" class="basic-echart-body"
      :class="{ 'echart-canvas': editorState.appConfig.appType === AppType.canvas }"
      :style="{ height: props.height + 'px' }"
    ></div>
    <Empty class="basic-echart-empty" v-if="props.empty" description="图表暂无数据" />
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted } from 'vue';
import { init as echartInit, type ECharts } from 'echarts';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { throttle } from '@/tools/common';
import { Empty } from 'vant';
import { AppType } from '@haku-design/core';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  /** 是否为空 */
  empty: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  }
});

let chart: ECharts;

const echartEl = ref<HTMLElement>();
const state = reactive({
});

const init = () => {
  if (!chart) {
    if (echartEl.value) {
      chart = echartInit(echartEl.value as HTMLCanvasElement);
    }
  }
};

/** 获得ECharts实例 */
const getChart = () => chart;
/** 更新ECharts配置 */
const setOption = (option) => {
  chart.setOption(option);
};
/** 重置大小 */
const resize = (width: number, height: number) => {
  chart.resize({ width, height });
  // chart.setOption({ width, height });
};

watch(() => [props.width, props.height], throttle(() => {
  resize(props.width, props.height);
}, 15));

onMounted(() => {
  init();
});

defineExpose({
  getChart,
  setOption,
  resize,
  get chart() { return chart },
  set chart(chartOption) { chart = chartOption },
});
</script>

<style lang="less" scoped>
.basic-echart {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  width: 100%;

  > .basic-echart-empty {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }

  > .basic-echart-body {
    position: relative;
    // flex-grow: 1;
    // width: 100%;
    // height: 100%;

    &.echart-canvas {

      // > :deep(div:first-child) {
      //   height: 100% !important;
      // }
    }

  }
}
</style>
