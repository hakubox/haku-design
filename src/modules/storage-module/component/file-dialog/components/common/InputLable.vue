<template>
  <Input
    v-if="props.showInput"
    v-model:value="inputValue"
    ref="inputRef"
    type="text"
    size="small"
    v-bind="$attrs"
    @blur="handleSubmit"
    @keyup.enter="handleSubmit"
  />
  <slot v-else></slot>
</template>

<script lang="ts" setup>
/** 可输入的标签 */
import { nextTick, ref, watch, watchEffect } from 'vue';
import { Input } from 'ant-design-vue';

interface IEmits {
  (e: 'submit', value: string): void;
}

const props = defineProps({
  showInput: {
    type: Boolean,
    default: false,
  },
  defaultValue: {
    type: String,
    default: '',
  },
});

const emits = defineEmits<IEmits>();
const inputRef = ref();
const inputValue = ref();

const handleSubmit = () => {
  emits('submit', inputValue.value);
};

watch(() => props.defaultValue, () => {
  inputValue.value = props.defaultValue;
});

watchEffect(() => {
  if (props.showInput) {
    inputValue.value = props.defaultValue;
    nextTick(() => {
      const el = inputRef.value;
      el.focus();
      el.select();
      const suffixStart = inputValue.value.indexOf('.') ?? inputValue.value.length;
      el.setSelectionRange(0, suffixStart);
    });
  }
});
</script>
<style lang="less" scoped></style>
