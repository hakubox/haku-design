<template>
  <div class="width-editor">
    <InputNumber size="small" style="width: 100%" v-model:value="state.inputValue" @change="change">
      <template #addonAfter>
        <Select v-model:value="state.unit" size="small" @change="change" style="width: 60px">
          <SelectOption value="px">px</SelectOption>
          <SelectOption value="%">%</SelectOption>
          <SelectOption value="vw">vw</SelectOption>
          <SelectOption value="vh">vh</SelectOption>
        </Select>
      </template>
    </InputNumber>
  </div>
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { InputNumber, Select, SelectOption } from 'ant-design-vue';
import { PropType } from 'vue';
import { onMounted, reactive, watch } from 'vue';

/** 宽度单位 */
type WidthUnit = 'px' | '%' | 'vw' | 'vh';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  /** 默认单位 */
  defaultUnit: {
    type: String as PropType<WidthUnit>,
    default: 'px'
  }
});

const emit = defineEmits<{
  (event: 'change', val: string): void;
  (event: 'update:value', val: string): void;
}>();

const state = reactive({
  /** 值 */
  inputValue: '',
  /** 后缀 */
  unit: 'px' as WidthUnit,
});

/** 改变值 */
const change = throttle(() => {
  if (state.inputValue + state.unit != props.value) {
    emit('change', state.inputValue + state.unit);
  }
});

/** 初始化 */
const init = () => {
  if (props.defaultUnit) state.unit = props.defaultUnit;
  if (typeof props.value == 'string') {
    const _suffixRegExp = /[^-0-9.]/.exec(props.value);
    if (_suffixRegExp) {
      state.inputValue = props.value.substring(0, _suffixRegExp.index);
      state.unit = props.value.substring(_suffixRegExp.index) as WidthUnit;
    } else {
      state.inputValue = props.value;
    }
  } else {
    state.inputValue = props.value;
  }
};

watch(
  () => props.value,
  (val, oldVal) => {
    if (val !== oldVal) {
      init();
    }
  },
);

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.width-editor {
  :deep(.ant-input-number) {
    font-size: 12px;
    border: none;
  }
}
</style>
