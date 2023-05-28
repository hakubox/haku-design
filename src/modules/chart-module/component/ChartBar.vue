<template>
  <div>
    <!-- <span style="display: block; font-size: 16px; font-weight: bold;">props</span> <span style="font-size: 12px;line-height: 10px;">{{ props }}</span> <br /> -->
    <!-- <span style="display: block; font-size: 16px; font-weight: bold;">$attrs</span> <span style="font-size: 12px;line-height: 10px;">{{ attrs.legend }}</span> -->
    <ComponentBasic class="component-chart-bar" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
      <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="attrs.height"></BaseECharts>
    </ComponentBasic>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, useAttrs } from 'vue';
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
});

const attrs = useAttrs();

const chartRef = ref<ECharts>();

const getOption = () => {
  const _gridPadding = (attrs.chartPadding as number[]).length ? (attrs.chartPadding as number[])[0] : [];
  const option = {
    title: attrs.title,
    legend: attrs.legend,
    tooltip: {},
    grid: {
      top: `${_gridPadding[0]}px`,
      right: `${_gridPadding[1]}px`,
      bottom: `${_gridPadding[2]}px`,
      left: `${_gridPadding[3]}px`,
    },
    padding: [0, 0, 0, 0],
    xAxis: {
      type: (attrs.xAxis as any)?.type ?? 'category',
      ...(attrs.xAxis as any)
    },
    yAxis: {
      type: (attrs.yAxis as any)?.type ?? 'value',
      ...(attrs.yAxis as any)
    },
    series: JSON.parse(props.dataSource ?? []).map(i => ({
      type: i.type ?? 'bar',
      name: i.name,
      data: i.data ?? [],
      color: i.color ?? attrs.color
    }))
  };
  return option;
};

const init = () => {
  chartRef.value?.setOption(getOption());
}

watch([attrs.position, attrs.position], (val, oldVal) => {
  init();
});

watch(() => attrs, (val, oldVal) => {
  chartRef.value?.setOption(getOption());
}, {
  deep: true
});
onMounted(() => {
  init();
});
</script>
