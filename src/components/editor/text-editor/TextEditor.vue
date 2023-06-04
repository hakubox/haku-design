<template>
  <div v-if="props.readonly" class="text-editor-preview editor-preview">
    {{ state.inputValue }}
  </div>
  <Input
    v-else
    class="text-editor"
    :class="{ disabled: $attrs.disabled }"
    :disabled="($attrs.disabled as boolean)"
    :placeholder="placeholder"
    v-model:value="state.inputValue"
    @change="input"
  >
    <slot name="suffix"></slot>
  </Input>
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { Input } from 'ant-design-vue';
import { onMounted, reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '',
  },
  /** 是否开启节流事件 */
  openThrottle: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (event: 'update:value', val: string): void;
  (event: 'change', val: string): void;
}>();

const state = reactive({
  inputValue: '',
});

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.inputValue = val;
  }
});

/** 改变值 */
const input = props.openThrottle ? throttle(() => {
  if (state.inputValue !== props.value) {
    emit('change', state.inputValue);
  }
}) : () => {
  if (state.inputValue !== props.value) {
    emit('change', state.inputValue);
  }
};

onMounted(() => {
  state.inputValue = props.value;
});
</script>

<style lang="less" scoped>

.text-editor {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  
  background-color: var(--editor-bg-color) !important;
  border: 1px solid var(--editor-bg-color) !important;
  border-radius: 3px;
  height: 30px;
  width: calc(100%);
  transition: 0.3s;

  &:hover {
    &:not(.disabled) {
      border-color: var(--primary-hover-border-color) !important;
      border-right-width: 1px;
    }
  }

  &:focus-within {
    box-shadow: 0px 0px 0px 2px var(--primary-hover-background-color);
  }

  > :deep(input) {
    width: 100%;
    border: none;
    vertical-align: top;
    line-height: 18px;
    padding-left: 0px;
    color: rgba(0, 0, 0, 0.85);
    // font-size: 12px;
    border-radius: 3px;
    background-color: transparent;

    &[disabled] {
      cursor: not-allowed;
    }

    &::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #ccc;
    }
  }
}
</style>
