<template>
  <ComponentBasic class="component-chart-bar" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="props.height"></BaseECharts>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, defineOptions } from 'vue';
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
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        data: JSON.parse(props.dataSource),
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
