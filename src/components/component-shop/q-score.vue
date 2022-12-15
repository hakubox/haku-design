<template>
  <q-basic class="component-score" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <Rate
      :count="count"
      :disabled="disabled"
      :color="color"
      :allow-half="allowHalf"
      :size="size"
      :modelValue="value"
      @change="changeValue"
    />
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { defineComponent, PropType } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { Rate } from 'vant';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
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
  (event: 'update:value', val: string): void;
}>();

const changeValue = (val) => {
  emit('update:value', val);
};
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-score {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.van-radio-group {
}
</style>
