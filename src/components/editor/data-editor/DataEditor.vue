<template>
  <div v-if="props.readonly" class="data-editor-preview editor-preview">
    <span class="editor-preview-prefix" :class="state.inputValue.type">{{ getTypeLabel }}</span> {{ getTxt }}
  </div>
  <div v-else class="data-editor">
    <Dropdown>
      <div class="data-editor-type" @click.prevent>
        {{ getTypeLabel }}
        <DownOutlined />
      </div>
      <template #overlay>
        <Menu @click="selectType">
          <SubMenu key="data" title="数据">
            <MenuItem key="data-string">文本</MenuItem>
            <MenuItem key="data-number">数字</MenuItem>
            <MenuItem key="data-boolean">真假</MenuItem>
            <!-- <MenuItem key="date">日期</MenuItem> -->
          </SubMenu>
          <MenuItem key="data-component">组件</MenuItem>
          <MenuItem key="data-component-option">子选项</MenuItem>
          <MenuItem key="data-variable">变量</MenuItem>
        </Menu>
      </template>
    </Dropdown>
    <label class="data-editor-content" @click.prevent>
      <!-- 文本 -->
      <TextEditor type="text" v-if="props.value.type === 'data-string'" v-model:value="state.inputValue.value" @change="changeValue" />
      <!-- 数字 -->
      <NumberEditor type="number" v-else-if="props.value.type === 'data-number'" v-model.number:value="state.inputValue.value" @change="changeValue" />
      <!-- 真假 -->
      <SwitchEditor v-else-if="props.value.type === 'data-boolean'" v-model:value="state.inputValue.value" size="20px" @change="changeValue" />
      <!-- 日期 -->
      <!-- <input type="date" v-if="props.value.type === 'data-date'" v-model="state.inputValue.value" @change="changeValue" /> -->

      <!-- 组件 -->
      <ComponentPicker v-else-if="props.value.type === 'data-component'" size="small" v-model:value="state.inputValue.value" @change="changeValue"></ComponentPicker>
      <!-- 组件选项 -->
      <ComponentOptionPicker v-else-if="props.value.type === 'data-component-option'" size="small" v-model:value="state.inputValue.value" @change="changeValue"></ComponentOptionPicker>
      <!-- 变量 -->
      <VariablePicker v-else-if="props.value.type === 'data-variable'" size="small" v-model:value="state.inputValue.value" @change="changeValue"></VariablePicker>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { type DataEditorValue } from '@haku-design/core/@types/data-editor-value';
import { DownOutlined } from '@ant-design/icons-vue';
import { Dropdown, Menu, MenuItem, message, SubMenu } from 'ant-design-vue';
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
import { onMounted, PropType, reactive, watch, computed } from 'vue';
import { service as formFillService } from '@haku-design/form-fill';
import ComponentPicker from '../component-picker/ComponentPicker.vue';
import ComponentOptionPicker from '../component-option-picker/ComponentOptionPicker.vue';
import VariablePicker from '../variable-picker/VariablePicker.vue';
import TextEditor from '../text-editor/TextEditor.vue';
import NumberEditor from '../number-editor/NumberEditor.vue';
import SwitchEditor from '../switch-editor/SwitchEditor.vue';

const props = defineProps({
  value: {
    type: Object as PropType<DataEditorValue>,
    default: () => ({ dataOrigin: 'data-editor', type: 'data-string', value: undefined, config: {} })
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const state = reactive({
  inputValue: {} as DataEditorValue,
});

const emit = defineEmits<{
  (event: 'update:value', val: DataEditorValue): void;
  (event: 'change', val: DataEditorValue): void;
}>();

const getTypeLabel = computed(() => {
  switch (state.inputValue.type) {
    case 'data-string': return '文本';
    case 'data-number': return '数字';
    case 'data-boolean': return '真假';
    case 'data-date': return '日期';
    case 'data-component': return '组件';
    case 'data-component-option': return '子选项';
    case 'data-variable': return '变量';
    default: return '——';
  }
});

/** 修改值 */
const changeValue = (val) => {
  if (state.inputValue.type === 'data-component') {
    state.inputValue.value = val;
  } else if (state.inputValue.type === 'data-component-option') {
    state.inputValue.value = val;
  } else if (state.inputValue.type === 'data-variable') {
    state.inputValue.value = val;
  } else {
    state.inputValue.value = val;
  }
  emit('change', state.inputValue);
};

/** 选择类型 */
const selectType = ({ item, key, keyPath }: MenuInfo): void => {
  if (!key) {
    message.error('类型不能为空');
    return;
  }
  let _val: any = undefined;
  if (key === 'variable') {
    _val = '';
  } else if (key === 'component') {
    _val = '';
  }
  emit('change', {
    dataOrigin: 'data-editor',
    type: key as DataEditorValue['type'],
    value: _val,
    config: {}
  });
};

const getTxt = computed(() => {
  return formFillService.getOriginDataLabel(state.inputValue);
});

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.inputValue = props.value;
  }
});

onMounted(() => {
  state.inputValue = props.value;
});
</script>

<style lang="less" scoped>

.editor-preview-prefix {
  cursor: default;
  display: inline-block;
  background-color: white;
  // border: 1px solid white;
  padding: 0px 6px;
  border-radius: 3px;
  margin-right: 4px;
  font-size: 12px;

  &.data-string {
    color: #cf1322;
    background: #fff1f0;
    border-color: #ffa39e;
  }
  &.data-number {
    color: #389e0d;
    background: #f6ffed;
    border-color: #b7eb8f;
  }
  &.data-boolean {
    color: #d46b08;
    background: #fff7e6;
    border-color: #ffd591;
  }
  &.data-date {
    color: #08979c;
    background: #e6fffb;
    border-color: #87e8de;
  }
  &.data-component {
    color: #c41d7f;
    background: #fff0f6;
    border-color: #ffadd2;
  }
  &.data-component-option {
    color: #531dab;
    background: #f9f0ff;
    border-color: #d3adf7;
  }
  &.data-variable {
    color: #096dd9;
    background: #e6f7ff;
    border-color: #91d5ff;
  }
}

// 数据编辑器
.data-editor {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #F7F9FC;
  border-radius: 3px;

  // 数据编辑器类型
  > .data-editor-type {
    flex-grow: 0;
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-width: 50px;
    font-size: 12px;
    padding-left: 8px;

    > .anticon {
      margin-left: 4px;
      margin-right: 2px;
    }

    &:after {
      content: '';
      position: relative;
      display: inline-block;
      width: 0px;
      height: 20px;
      border-left: 1px solid #CCC;
      padding-left: 6px;
      margin-left: 6px;
    }
  }

  // 数据编辑器内容
  > .data-editor-content {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 2px;
    overflow: hidden;
    text-overflow: ellipsis;

    > input {
      flex-grow: 1;
      flex-shrink: 1;
      border: none;
      height: 26px;
      font-size: 12px;
      background-color: #F7F9FC;
    }

    > :deep(.ant-select) {
      flex-grow: 1;
      width: 100%;
    }
  }
}
</style>