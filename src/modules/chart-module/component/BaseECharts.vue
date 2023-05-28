<template>
  <div class="basic-echart">
    <div ref="echartEl" class="basic-echart-body"></div>
    <Empty class="basic-echart-empty" v-if="props.empty" description="图表暂无数据" />
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted, nextTick } from 'vue';
import { init as echartInit, type ECharts } from 'echarts';
import { throttle } from '@/tools/common';
import { useElementSize } from '@vueuse/core';
import { Empty } from 'vant';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  /** 是否为空 */
  empty: {
    type: Boolean,
    default: false,
  },
});

let chart: ECharts;

const echartEl = ref<HTMLElement>();
const state = reactive({
});

const { width, height } = useElementSize(echartEl);

const init = () => {
  if (!chart) {
    if (echartEl.value) {
      chart = echartInit(echartEl.value);
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
};

watch([width, height], () => {
  resize(width.value, height.value);
});

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
  position: relative;
  width: 100%;
  height: 200px;

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
    width: 100%;
    height: 200px;
  }
}
</style>
