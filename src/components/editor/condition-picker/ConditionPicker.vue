<template>
  <div class="select-picker" v-if="props.readonly">
    <span v-if="state.inputValue" class="component-picker-txt">{{ getTxt }}</span>
    <span v-else class="component-picker-empty">[未选择]</span>
  </div>
  <a-select v-else
    v-model:value.sync="state.inputValue"
    @change="change"
    :size="size"
    :options="conditionList"
    class="condition-picker"
    :showSearch="false"
    :allowClear="false"
    ref="editor"
    style="width: 100%"
  >
  </a-select>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, toRefs, watch } from 'vue';

const props = defineProps({
  /** 值类型 */
  valueType: {
    type: String as PropType<'string' | 'select' | 'number' | 'else'>,
    default: 'string',
    required: true,
  },
  /** 参考选择项 */
  selectOptions: {
    type: Array as PropType<{ value: string; label: string }[]>,
    default: () => [],
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false
  },
  /** 值 */
  value: {
    type: String,
    default: '',
  },
  /** 尺寸 */
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'update:value', val: string): void;
  (event: 'change', val: string): void;
}>();

const state = reactive({
  /** 绑定值 */
  inputValue: '',
});

// switch (props.valueType) {
//   case 'string':
//     emit('change', '=');
//     break;
//   case 'select':
//     emit('change', props.selectOptions[0].value);
//     break;
//   case 'else':
//     emit('change', '=');
//     break;
//   default:
//     break;
// }

const conditionList = computed(() => {
  switch (props.valueType) {
    case 'string':
      return [
        { value: '=', label: '等于' },
        { value: '!=', label: '不等于' },
        { value: '>', label: '大于' },
        { value: '>=', label: '大于等于' },
        { value: '<', label: '小于' },
        { value: '<=', label: '小于等于' },
        { value: 'like', label: '包含' },
        { value: 'notlike', label: '不包含' },
        { value: 'empty', label: '为空' },
        { value: 'notempty', label: '不为空' },
        { value: 'startwith', label: '以__开头' },
        { value: 'endwith', label: '以__结尾' },
      ];
    case 'select':
      return [...props.selectOptions];
    case 'number':
      return [
        { value: '=', label: '等于' },
        { value: '!=', label: '不等于' },
        { value: '>', label: '大于' },
        { value: '>=', label: '大于等于' },
        { value: '<', label: '小于' },
        { value: '<=', label: '小于等于' },
        { value: 'empty', label: '为空' },
        { value: 'notempty', label: '不为空' },
      ];
    case 'else':
      return [
        { value: 'empty', label: '为空' },
        { value: 'notempty', label: '不为空' },
      ];
    default:
      return [];
  }
});

const getTxt = computed(() => {
  const _item = conditionList.value.find(i => i.value === state.inputValue);
  return _item ? _item.label : '——';
});

/** 改变值 */
const change = (val) => {
  emit('update:value', state.inputValue);
  emit('change', state.inputValue);
}

const search = (inputValue: string, treeNode: any) => {
  return ('' + treeNode.data.props.value).includes(inputValue) || treeNode.data.props.title.includes(inputValue);
}

watch(() => props.value, (val, oldVal) => {
  if (state.inputValue !== props.value) {
    state.inputValue = props.value;
  }
});

onMounted(() => {
  state.inputValue = props.value;
});

</script>

<style lang="less" scoped></style>
