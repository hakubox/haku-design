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

const state = reactive({
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

:deep(textarea.textarea-editor) {
  background-color: var(--editor-bg-color) !important;
  border-color: var(--editor-bg-color) !important;
  padding: 3px 7px;

  &:hover {
    &:not(.disabled) {
      border-color: var(--primary-hover-border-color) !important;
    }
  }

  &:focus-within {
    box-shadow: 0px 0px 0px 2px var(--primary-hover-background-color);
  }
}
</style>
