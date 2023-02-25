<template>
  <ComponentBasic class="component-score-group" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div class="component-score-group-item" v-for="(item, index) in options" :key="index">
      <label>{{ item.label }}</label>
      <Rate
        :count="count"
        :disabled="disabled || item.disabled"
        :color="color"
        :allow-half="allowHalf"
        :size="size"
        :modelValue="value[index]"
        @change="changeValue($event, index)"
      />
    </div>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { PropType } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { Rate } from 'vant';

const props = defineProps({
  value: {
    type: Array as PropType<Number[]>,
    default: () => [],
  },
  options: {
    type: Array as PropType<Record<string, any>>,
    default: () => [],
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
  color: {
    type: String,
    default: '#FFD21E',
    required: true,
  },
  count: {
    type: Number,
    default: 5,
    required: true,
  },
  size: {
    type: String,
    default: '20px',
    required: true,
  },
  allowHalf: {
    type: Boolean,
    default: false,
    required: true,
  }
});

const emit = defineEmits<{
  (event: 'update:value', val: any[]): void;
}>();

const changeValue = (val, index) => {
  let vals = new Array(props.options.length).fill(0);
  for (let i = 0; i < props.value.length; i++) {
    vals[i] = props.value[i] ?? 0;
  }
  vals[index] = val;
  emit('update:value', vals);
}
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-score-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > .component-score-group-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
  }
}

.van-radio-group {
}
</style>
