<template>
  <ComponentBasic class="component-chart-line" :show="false" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="props.height"></BaseECharts>
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
    type: Number,
    default: 200,
  },
  /** 绑定数据 */
  position: {
    type: String,
    default: '',
  },
  /** 设置颜色 */
  color: {
    type: String,
    default: '',
  },
  /** 显示图例 */
  legend: {
    type: Boolean,
    default: true,
  },
});

const chartRef = ref<ECharts>();

const init = () => {
  const option = {
    title: {
      text: props.title
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'line',
        data: JSON.parse(props.dataSource),
        color: props.color
      }
    ]
  };
  chartRef.value?.setOption(option);
}

watch(() => [props.position, props.position], (val, oldVal) => {
  if (val !== oldVal) {
    init();
  }
});

watch(() => props.color, (val, oldVal) => {
  console.log(val)
  if (val !== oldVal) {
    init();
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '../assets/less/index.less';
</style>