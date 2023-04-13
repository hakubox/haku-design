<template>
  <Textarea
    class="textarea-editor"
    v-model:value="state.inputValue"
    :disabled="($attrs.disabled as boolean)"
    @change="change"
    :placeholder="placeholder"
  />
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { Textarea } from 'ant-design-vue';
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
  inputValue: '',
});

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.inputValue = val;
  }
});

/** 初始化 */
const init = () => {
  state.inputValue = props.value;
};
/** 改变值 */
const change = throttle(() => {
  if (state.inputValue !== props.value) {
    emit('change', state.inputValue);
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

:deep(.textarea-editor) {
  background-color: #f7f9fc;
  border: 1px solid #f7f9fc;

  &:hover {
    &:not(.disabled) {
      border-color: fadeout(@primary-color, 20%) !important;
      border-width: 1px !important;
    }
  }
}
</style>
