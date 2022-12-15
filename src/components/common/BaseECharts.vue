<template>
  <div class="basic-echart" :style="{ height: props.height }">
    <div ref="echartEl" class="basic-echart-body" :style="{ height: props.height }"></div>
    <Empty class="basic-echart-empty" v-if="props.empty" description="图表暂无数据" />
  </div>
</template>
<script lang="ts" setup>
import { throttle } from '@/tools/common';
import * as echarts from 'echarts';
import { defineProps, watch, ref, reactive, onMounted, nextTick } from 'vue';
import { useElementSize } from '@vueuse/core';
import { Empty } from 'vant';

const props = defineProps({
  /** 是否为空 */
  empty: {
    type: Boolean,
    default: false,
  },
  /** 图表高度 */
  height: {
    type: String,
    default: '200px',
  },
});

const echartEl = ref<HTMLElement>();
const state = reactive({
  chart: undefined as unknown as echarts.ECharts,
});

const { width, height } = useElementSize(echartEl);

const init = () => {
  if (!state.chart) {
    if (echartEl.value) {
      state.chart = echarts.init(echartEl.value);
    }
  }
};

/** 获得ECharts实例 */
const getChart = () => state.chart;
/** 更新ECharts配置 */
const setOption = (option) => {
  state.chart.setOption(option);
};
/** 重置大小 */
const resize = (width: number, height: number) => {
  state.chart.resize({ width, height });
};

/** 高度改变事件 */
const changeHeight = throttle((val) => {
  nextTick(() => {
    if (echartEl.value) {
      resize(echartEl.value.offsetWidth, echartEl.value.offsetHeight);
    }
  });
});

watch(() => props.height, changeHeight);

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
