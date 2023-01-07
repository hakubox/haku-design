<template>
  <div v-if="props.readonly" class="component-picker-preview editor-preview">
    <span v-if="state.inputValue" class="component-picker-txt">{{ getTxt }}</span>
    <span v-else class="component-picker-empty">[未选择]</span>
  </div>
  <Select
    v-else
    style="width: 100%"
    class="component-picker"
    placeholder="请选择组件"
    :size="size"
    :options="componentList"
    :allowClear="false"
    :showSearch="true"
    :dropdownMatchSelectWidth="false"
    v-model:value="state.inputValue"
    @change="change"
  >
    <template #option="option">
      <div class="component-option" @mouseenter="componentMouseEnter(option.value)" @mouseout="componentMouseOut()">
        <i :class="option.icon" style="color: #888; font-size: 13px;"></i>
        &nbsp;{{ option.label }}
      </div>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { Select } from 'ant-design-vue';
import { computed, onMounted, onUnmounted, PropType, reactive, useAttrs, watch } from 'vue';

const props = defineProps({
  /** 是否仅表单项 */
  isFormItem: {
    type: Boolean,
    default: false,
  },
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
    type: String,
  },
});

const state = reactive({
  /** 绑定值 */
  inputValue: '' as undefined | string,
});

const emit = defineEmits<{
  (event: 'update:value', val: string | undefined): void;
  (event: 'change', val: string | undefined): void;
}>();

const attrs = useAttrs();

const componentList = computed(() => {
  return editorState.pages.map((page) => ({
    label: page.pageTitle,
    options: editorService.getAllFormItem(page.children)
      .filter((i, index) => {
        return !props.isFormItem || props.isFormItem && i.isFormItem && (attrs.filter ? (attrs.filter as Function)(i, index) : true);
      })
      .map((i) => ({
        value: i.attrs.id,
        label: i.attrs.name || i.title,
        icon: editorState.menuComponents.find(o => o.name === i.name)?.icon ?? '',
      })),
  })) ?? [];
});

const component = computed(() => {
  return editorService.findComponent(state.inputValue);
});

/** 获取文本 */
const getTxt = computed(() => {
  if (!state.inputValue) {
    return '[未选择组件]';
  } else {
    return component.value?.attrs?.name ?? '[未找到组件]';
  }
});

/** DOM节点缓存 */
let domCache: Record<string, HTMLElement> = {};

/** 组件光标移动上去 */
const componentMouseEnter = (componentId: string) => {
  let _dom;
  if (domCache[componentId]) {
    _dom = domCache[componentId];
  } else {
    _dom = document.querySelector(`.design-form-canvas-page.app-canvas [component-id="${componentId}"]`);
    domCache[componentId] = _dom;
  }
  if (_dom) {
    _dom.classList.add('highlight');
  }
};

const componentMouseOut = () => {
  const _domList = Array.from(document.querySelectorAll(`.design-form-canvas-page.app-canvas [component-id].highlight`));
  domCache = {};
  if (_domList?.length) _domList.forEach(i => {
    i.classList.remove('highlight');
  });
};

const search = (inputValue: string, treeNode: any) => {
  return ('' + treeNode.data.props.value).includes(inputValue) || treeNode.data.props.title.includes(inputValue);
};
/** 改变值 */
const change = (val) => {
  emit('update:value', state.inputValue);
  emit('change', state.inputValue);
};

watch(() => props.value, () => {
  if (state.inputValue !== props.value) {
    state.inputValue = props.value;
  }
});

onMounted(() => {
  state.inputValue = props.value;
});

onUnmounted(() => {
  domCache = {};
});
</script>

<style lang="less" scoped></style>
