<template>
  <ComponentBasic class="component-chart-body component-chart-radar" :show="false" v-bind.prop="getQBasicProps({ ...props, ...$attrs, label: '' })">
    <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="props.height" :width="props.width"></BaseECharts>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue';
import { getQBasicProps } from '@/tools/common';
import type { ECharts } from 'echarts';
import BaseECharts from './BaseECharts.vue';

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
  label: {
    type: Object,
    default: () => ({ show: false })
  },
  color: {
    type: String
  }
});

const chartRef = ref<ECharts>();

const getOption = () => {
  const option = {
    title: props.title,
    legend: props.legend,
    tooltip: {},
    label: props.label,
    series: JSON.parse(props.dataSource ?? []).map(i => ({
      type: i.type ?? 'radar',
      name: i.name,
      data: i.data ?? [],
      color: i.color ?? props.color
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
  props.title, props.legend, props.label,
], (val, oldVal) => setOption(), { deep: true });
watch(() => props.color, (val, oldVal) => setOption());

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '../assets/less/index.less';
</style>