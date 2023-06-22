<template>
  <div v-if="props.readonly" class="select-picker-preview editor-preview">
    <span v-if="state.inputValue" class="select-picker-txt">{{ getTxt }}</span>
    <span v-else class="select-picker-empty">[未选择]</span>
  </div>
  <Select v-else
    class="select-picker"
    :size="props.size"
    :value="state.inputValue"
    :options="props.options"
    :mode="props.mode"
    @change="change"
  >
  </Select>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Select } from 'ant-design-vue';
import { onMounted, PropType, reactive, watch } from 'vue';


const props = defineProps({
  /** 组件尺寸 */
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [String, Array] as PropType<string | string[]>,
    required: true,
  },
  /** 选项 */
  options: {
    type: Array as PropType<{ label: string, value: string }[]>,
    default: () => []
  },
  /** 选择模式 */
  mode: {
    type: String as PropType<"multiple" | "tags" | undefined>,
    default: undefined
  },
});

const emit = defineEmits<{
  (event: 'update:value', val: string | string[]): void;
  (event: 'change', val: string | string[]): void;
}>();

const state = reactive({
  /** 值 */
  inputValue: '' as string | string[],
});

/** 改变值 */
const change = (val) => {
  emit('update:value', val);
  emit('change', val);
};

/** 获取文本 */
const getTxt = computed(() => {
  const _item = props.options.find(i => i.value === state.inputValue);
  return _item ? _item.label : '——';
});

watch(() => props.value, (val, oldVal) => {
  if (state.inputValue !== props.value) {
    state.inputValue = props.value;
  }
});

onMounted(() => {
  state.inputValue = props.value;
});

</script>

<style lang="less">
.select-picker {

}
</style>