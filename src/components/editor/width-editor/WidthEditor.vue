<template>
  <div class="length-editor">
    <InputNumber size="small" style="width: 100%" v-model:value="state.inputValue" @change="change">
      <template #addonAfter>
        <Select v-model:value="state.suffix" size="small" @change="change" style="width: 60px">
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
import { onMounted, reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (event: 'change', val: string): void;
  (event: 'update:value', val: string): void;
}>();

let state = reactive({
  /** 值 */
  inputValue: '',
  /** 后缀 */
  suffix: 'px',
});

/** 改变值 */
const change = throttle(() => {
  if (state.inputValue + state.suffix != props.value) {
    emit('change', state.inputValue + state.suffix);
  }
});

/** 初始化 */
const init = () => {
  if (typeof props.value == 'string') {
    let _suffixRegExp = /[^-0-9.]/.exec(props.value);
    if (_suffixRegExp) {
      state.inputValue = props.value.substring(0, _suffixRegExp.index);
      state.suffix = props.value.substring(_suffixRegExp.index);
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

.length-editor {
  :deep(.ant-input-number) {
    font-size: 12px;
  }
}
</style>
