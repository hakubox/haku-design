<template>
  <ComponentBasic class="component-single-line" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div v-if="isPrint" class="component-single-line-printmode">{{ value }}</div>
    <input
      v-else
      type="text"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :value="value"
      @input="changeValue"
    />
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { inject, PropType, reactive } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { Component } from '@/@types';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  component: {
    type: Object as PropType<Component>,
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
  maxlength: {
    type: Number,
    default: -1,
  },
});

/** 是否为打印 */
const isPrint = inject<boolean>('isPrint', false);

const emit = defineEmits<{
  (event: 'update:value', val: any): void;
}>();

const state = reactive({
});

const changeValue = (e) => {
  emit('update:value', e.target.value);
};
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';
@import '/src/assets/less/print-variable.less';

.component-single-line {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  // 打印模式
  > .component-single-line-printmode {
    display: block;
    width: 100%;
    height: 39px;
    border-bottom: @print-border;
    transform: scaleY(0.5);
  }

  > input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid @q-border-color;
    background-color: @q-bg-color;
    padding: 5px 10px;
    border-radius: 6px;
  }
}
</style>