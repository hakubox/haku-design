<template>
  <div v-if="props.readonly" class="variable-editor-preview editor-preview">
    {{ state.inputValue }}
  </div>
  <TreeSelect v-else
    v-model:value="state.inputValue"
    v-model:treeExpandedKeys="state.extendNodes"
    v-model:searchValue="state.searchTxt"
    placeholder="请选择页面变量"
    searchPlaceHolder="搜索变量"
    class="variable-picker"
    dropdown-class-name="variable-picker-dropdown"
    @change="change"
    :size="size"
    :tree-line="{ showLeafIcon: false }"
    :tree-data="variableState.getVarTree"
    :allowClear="true"
    :showSearch="true"
    :filterTreeNode="search"
    :dropdownStyle="{
      maxHeight: '500px',
    }"
    style="width: 100%;"
  >
    <template #title="item">
      <template v-if="item.selectable === false">
        <span class="variable-group-option" @click="expandNode(item)">
          <i class="iconfont icon-box" style="margin-right: 5px;"></i>
          {{ item.title }}
        </span>
      </template>
      <template v-else>
        <span class="variable-option">
          <span v-if="showType === 'normal'" :class="`variable-option-type type-${item.type}`">{{ getValueType(item.type) }}</span>
          <span class="variable-option-description">{{ item.title }}</span>
          <span v-if="showType === 'normal'" class="variable-option-name">{{ item.value }}</span>
        </span>
      </template>
    </template>
  </TreeSelect>
</template>

<script lang="ts" setup>
import { reactive, PropType, onMounted, watch } from 'vue';
import { getValueType, state as variableState, service as variableService } from '@/modules/variable-module';
import { TreeSelect } from 'ant-design-vue';

const props = defineProps({
  /** 当前变量 */
  value: {
    type: String,
    default: '',
  },
  /** 显示类型 */
  showType: {
    type: String as PropType<'normal' | 'simple'>,
    default: 'normal',
  },
  /** 筛选变量类型 */
  type: {
    type: String,
    default: 'any',
  },
  size: {
    type: String as PropType<'large' | 'small'>,
    default: 'default',
    required: true,
  },
  readonly: {
    type: Boolean,
    deafult: false
  }
});

const emit = defineEmits<{
  (event: 'change', val: string): void;
  (event: 'update:value', val: string): void;
}>();

const state = reactive({
  /** 搜索文本 */
  searchTxt: '',
  /** 真实值 */
  inputValue: '',
  extendNodes: [] as string[],
});

const expandNode = (item) => {
  const _index = state.extendNodes.indexOf(item.value);
  if (_index >= 0) {
    state.extendNodes.splice(_index, 1);
  } else {
    state.extendNodes.push(item.value);
  }
};

/** 搜索项 */
const search = (inputValue: string, treeNode: any) => {
  return ('' + treeNode.props.value).includes(inputValue) || treeNode.props.title.includes(inputValue);
};
/** 初始化 */
const init = () => {
  state.inputValue = props.value;

  if (!state.extendNodes.length) {
    variableState.getVarTree.forEach(i => {
      if (i.children?.length) {
        state.extendNodes.push(i['value']);
      }
    });
  }
};

/** 改变值 */
const change = () => {
  emit('change', state.inputValue);
};

watch(() => props.value, (val) => {
  if (props.value !== val) {
    init();
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
</style>
