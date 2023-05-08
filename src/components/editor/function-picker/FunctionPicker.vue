<template>
  <Select
    v-model:value="state.inputValue"
    placeholder="请选择页面函数"
    @change="change"
    :size="size"
    :options="functionList"
    class="variable-picker"
    :allowClear="true"
    :showSearch="true"
    ref="editor"
  >
  </Select>
</template>

<script lang="ts" setup>
import { computed, inject, PropType, reactive, ref } from 'vue';
import { FormScript } from '@haku-design/core/@types';
import { Select } from 'ant-design-vue';

const props = defineProps({
  /** 当前变量 */
  value: {
    type: String,
    default: '',
    required: true,
  },
  /** 筛选变量类型 */
  type: {
    type: String,
    default: 'any',
    required: true,
  },
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'change', value: any): void;
}>();

const state = reactive({
  /** 真实值 */
  inputValue: '',
});
/** 表单变量 */
const formScriptComment = inject('formScriptComment') as Record<string, any>;
/** 表单变量 */
const formScript = inject('formScript') as FormScript;
/** 获取函数列表 */
const functionList = computed(() => {
  const _formScriptComment = formScriptComment;
  return Object.entries(formScript.methods).map(([key, value]) => ({
    label: _formScriptComment[key] ? _formScriptComment[key] + ': ' + key : key,
    value: key,
  })) as Array<Record<string, any>>;
});

const search = (inputValue: string, treeNode: any) => {
  return ('' + treeNode.data.props.value).includes(inputValue) || treeNode.data.props.title.includes(inputValue);
};
/** 初始化 */
const init = () => {
  state.inputValue = props.value;
};
/** 改变值 */
const change = () => {
  emit('change', state.inputValue);
};
</script>

<style lang="less" scoped></style>
