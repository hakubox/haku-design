<template>
  <ComponentBasic class="component-chart-body component-chart-map" :show="false" v-bind.prop="getQBasicProps({ ...props, ...$attrs, label: '' })">
    <BaseECharts :empty="!props.dataSource?.length" ref="chartRef" :height="props.height" :width="props.width"></BaseECharts>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, PropType } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { registerMap, type ECharts } from 'echarts';
import BaseECharts from './BaseECharts.vue';
import { get } from '@/lib/api';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  dataSource: {
    type: String,
    default: () => '',
  },
  geo: {
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
    type: Array as PropType<{ color: string }[]>,
    default: () => []
  },
});

const chartRef = ref<ECharts>();

const getOption = () => {
  const option = {
    title: props.title,
    legend: props.legend,
    tooltip: {},
    label: props.label,
    visualMap: {
      min: 0,
      max: 50000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: props.color.map(i => i.color),
      }
    },
    series: JSON.parse(props.dataSource ?? [])
  };
  return option;
};

const init = () => {
  chartRef.value?.setOption(getOption());
}

const setOption = () => {
  chartRef.value?.setOption(getOption());
};

/** 注册地图 */
const registerMaps = (name: string, data: string | Record<string, any>) => {
  return new Promise<void>((resolve) => {
    if (typeof data === 'string') {
      get(data).then(d => {
        registerMap(name, d);
        resolve();
      })
    } else {
      registerMap(name, data as any);
      resolve();
    }
  })
}

const loadMap = () => {
  const _mapName = props.geo.substring(props.geo.lastIndexOf('/') + 1, props.geo.lastIndexOf('.'));
  registerMaps(_mapName, props.geo).then(d => {
    setOption();
  });
}

watch([
  props.title, props.legend, props.label, props.color,
], (val, oldVal) => setOption(), { deep: true });
watch(() => props.dataSource, (val, oldVal) => {
  try {
    JSON.parse(props.dataSource ?? []);
    setOption();
  } catch (error) {}
});
watch(() => props.geo, (val, oldVal) => {
  try {
    loadMap();
  } catch (error) {}
});

onMounted(() => {
  loadMap();
});
</script>

<style lang="less" scoped>
@import '../assets/less/index.less';
</style>