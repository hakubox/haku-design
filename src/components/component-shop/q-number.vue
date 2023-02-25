<template>
  <ComponentBasic
    class="component-number"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
  >
    <Stepper
      :disabled="props.disabled"
      :max="props.max"
      :min="props.min"
      :step="props.step"
      :decimal-length="props.decimalLength"
      :default-value="props.defaultValue"
      :input-width="props.inputWidth"
      :change="props.value"
      @change="changeValue"
    />
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import { Stepper } from 'vant';
import { getQBasicProps } from '@/tools/common';
import { PropType, reactive, ref, toRefs } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: [Number, undefined] as PropType<number | undefined>,
    default: undefined,
  },
  max: {
    type: [Number, undefined] as PropType<number | undefined>,
    default: undefined,
  },
  step: {
    type: Number as PropType<number>,
    default: 1,
  },
  defaultValue: {
    type: [Number, undefined] as PropType<number | undefined>,
    default: undefined,
  },
  decimalLength: {
    type: Number as PropType<number>,
    default: 1,
  },
  inputWidth: {
    type: String,
    default: '60px'
  }
});

const emit = defineEmits<{
  (event: 'update:value', value: number | undefined): void;
}>();

const state = reactive({
  inputValue: undefined as number | undefined,
});

const changeValue = (val) => {
  emit('update:value', val);
};
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-number {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
