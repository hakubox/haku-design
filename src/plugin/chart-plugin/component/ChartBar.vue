<template>
  <ComponentBasic class="component-chart-body component-chart-bar" :show="false" v-bind.prop="getQBasicProps({ ...props, ...$attrs, label: '' })">
    <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="props.height" :width="props.width"></BaseECharts>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, useAttrs } from 'vue';
import { getQBasicProps } from '@/tools/common';
import type { ECharts } from 'echarts';
import BaseECharts from './BaseECharts.vue';
import { PropType } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  dataSource: {
    type: String,
    default: () => '',
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  title: {
    type: Object,
    default: () => ({ show: false })
  },
  legend: {
    type: Object,
    default: () => ({ show: false })
  },
  xAxis: {
    type: Object,
    default: () => ({ show: false })
  },
  yAxis: {
    type: Object,
    default: () => ({ show: false })
  },
  label: {
    type: Object,
    default: () => ({ show: false })
  },
  grid: {
    type: Object,
    default: () => ({ show: false })
  },
  color: {
    type: Array as PropType<{ color: string }[]>,
    default: () => []
  }
});

const chartRef = ref<ECharts>();

const getOption = () => {
  const option = {
    title: props.title,
    legend: props.legend,
    tooltip: {},
    grid: props.grid,
    padding: [0, 0, 0, 0],
    label: props.label,
    xAxis: props.xAxis,
    yAxis: props.yAxis,
    color: props.color.map(i => i.color),
    series: JSON.parse(props.dataSource ?? []).map(i => ({
      type: i.type ?? 'bar',
      name: i.name,
      data: i.data ?? [],
      colorBy: i.colorBy
    }))
  };
  return option;
};

const init = () => {
  chartRef.value?.setOption(getOption());
}

const setOption = () => {
  chartRef.value?.setOption(getOption());
};

watch([
  props.title, props.legend, props.xAxis, props.yAxis, props.label, props.grid, props.color
], (val, oldVal) => setOption(), { deep: true });
watch(() => props.dataSource, (val, oldVal) => {
  try {
    JSON.parse(props.dataSource ?? []);
    setOption();
  } catch (error) {}
});

onMounted(() => {
  init();
});

defineExpose({
  
})
</script>

<style lang="less" scoped>
@import '../assets/less/index.less';
</style>