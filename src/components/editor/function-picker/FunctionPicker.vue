<template>
  <a-select
    v-model="inputValue"
    placeholder="请选择页面函数"
    @change="change"
    :size="size"
    :options="functionList"
    class="variable-picker"
    :allowClear="true"
    :showSearch="true"
    ref="editor"
  >
  </a-select>
</template>

<script lang="ts">
import { FormScript } from '@/@types';
import { computed, defineComponent, inject, PropType, ref } from 'vue';

export default defineComponent({
  name: 'FunctionPicker',
  props: {
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
      type: String as PropType<'large' | 'default' | 'small'>,
      default: 'default',
      required: true,
    },
  },
  methods: {
    search(inputValue: string, treeNode: any) {
      return ('' + treeNode.data.props.value).includes(inputValue) || treeNode.data.props.title.includes(inputValue);
    },
    /** 初始化 */
    init() {
      this.inputValue = this.value;
    },
    /** 改变值 */
    change() {
      this.$emit('input', this.inputValue);
    },
  },
  mounted() {
    this.init();
  },
  setup() {
    /** 真实值 */
    let inputValue = ref('');

    /** 表单变量 */
    let formScriptComment = inject('formScriptComment') as Record<string, any>;
    /** 表单变量 */
    let formScript = inject('formScript') as FormScript;

    const functionList = computed(() => {
      let _formScriptComment = formScriptComment;
      return Object.entries(formScript.methods).map(([key, value]) => ({
        label: _formScriptComment[key] ? _formScriptComment[key] + ': ' + key : key,
        value: key,
      })) as Array<Record<string, any>>;
    });

    return {
      inputValue,
      functionList,
    };
  },
});
</script>

<style lang="less" scoped></style>
