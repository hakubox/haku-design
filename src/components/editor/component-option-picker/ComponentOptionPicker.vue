<template>
  <div v-if="props.readonly" class="component-option-picker-preview editor-preview">
    <span v-if="state.inputValue" class="component-option-picker-txt">{{ getTxt }}</span>
    <span v-else class="component-option-picker-empty">[未选择]</span>
  </div>
  <Cascader v-else
    class="component-option-picker"
    v-model:value="state.inputValue"
    :options="componentList"
    :size="size"
    placeholder="请选择"
    @change="change"
  >
  </Cascader>
</template>

<script lang="ts" setup>
import { service as editorService } from '@haku-design/editor';
import { Cascader } from 'ant-design-vue';
import { computed, PropType, reactive, watch, useAttrs } from 'vue';


const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<'small' | 'middle' | 'large'>,
    default: 'middle',
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const state = reactive({
  /** 绑定值 */
  inputValue: [] as string[],
});

const emit = defineEmits<{
  (event: 'change', val: string): void;
}>();

const attrs = useAttrs();

const componentList = computed(() => {
  return editorService.getAllFormItem().filter(i => i.attrs.options?.length).map((i) => ({
    value: i.attrs.id,
    label: i.attrs.name || i.title,
    icon: editorService.menuComponents.find(o => o.name === i.name)?.icon ?? '',
    children: i.attrs.options?.length && i.attrs.options.map(o => ({
      value: o.value,
      label: o.label
    }))
  }));
});

const getTxt = computed(() => {
  return state.inputValue;
});

const search = (inputValue: string, treeNode: any) => {
  return ('' + treeNode.data.props.value).includes(inputValue) || treeNode.data.props.title.includes(inputValue);
};
/** 改变值 */
const change = (val, options) => {
  emit('change', state.inputValue.join('|'));
};

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.inputValue = val.split('|');
  }
});
</script>

<style lang="less" scoped></style>
