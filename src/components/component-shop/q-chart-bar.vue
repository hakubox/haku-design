<template>
  <ComponentBasic class="component-chart-bar" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="props.height"></BaseECharts>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, useAttrs } from 'vue';
import { getQBasicProps } from '@/tools/common';
import type { ECharts } from 'echarts';
import BaseECharts from '@/components/common/BaseECharts.vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  title: {
    type: String,
    default: () => '',
  },
  dataSource: {
    type: String,
    default: () => '',
  },
  /** 高度 */
  height: {
    type: String,
    default: '200px',
  },
  /** 绑定数据 */
  position: {
    type: String,
    default: '',
  },
  /** 显示图例 */
  legend: {
    type: Boolean,
    default: true,
  },
});

const attrs = useAttrs();

const chartRef = ref<ECharts>();

const getOption = () => {
  const option = {
    title: {
      text: props.title
    },
    legend: {},
    tooltip: {},
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: JSON.parse(props.dataSource),
        color: attrs.color
      }
    ]
  };
  return option;
};

const init = () => {
  chartRef.value?.setOption(getOption());
}

watch(() => [props.position, props.position], (val, oldVal) => {
  if (val !== oldVal) {
    init();
  }
});

watch(() => attrs.color, (val, oldVal) => {
  console.log(val)
  if (val !== oldVal) {
    // init();
    chartRef.value?.setOption(getOption());
  }
});
onMounted(() => {
  init();
});
</script>
