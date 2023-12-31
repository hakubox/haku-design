<template>
  <div class="model-list-editor">
    <Table
      :row-key="rowKey"
      :pagination="false"
      size="small"
      :childrenColumnName="childrenField"
      :columns="tableColumns()"
      :scroll="scroll"
      :dataSource="value"
    >
      <template #headerCell="{ title, column }">
        <template v-if="column.dataIndex === 'operation'">
          <Tooltip>
            <template #title>新增行</template>
            <Button type="primary" @click="addRow(value?.length)" size="small">
              <template #icon><plus-outlined /></template>
            </Button>
          </Tooltip>
        </template>
        <template v-else>
          {{ title }}
        </template>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-for="col in columns" :key="col.name">
          <template v-if="column.dataIndex === col.name && col.buttonEditorText">
            <Popover placement="topRight" :title="col.buttonEditorText" arrow-point-at-center trigger="click">
              <template #content>
                <div style="width: 800px">
                  <component
                    :ref="component.id"
                    v-bind="Object.assign({}, record.attrs || {}, col.attrs || {})"
                    :value="value[index][col.name]"
                    :is="editorState.propertyEditors[col.editor].component"
                    @change="(val) => changeValue(val, index, col.name)"
                  >
                    <!-- <template v-for="slot in Object.keys(editorState.propertyEditors[col.editor].slot)" :key="slot" #[slot]>
                      <component
                        v-for="(detailComponent, index3) in editorState.propertyEditors[col.editor].slot[slot]"
                        :key="slot + detailComponent.component + index3"
                        v-bind="detailComponent.attrs"
                        :is="detailComponent.component"
                      >
                        {{ detailComponent.html }}
                        <template v-for="detailSlot in Object.keys(detailComponent.slot)" #[detailSlot]>
                          <component
                            v-for="(detail2Component, index4) in detailComponent.slot[detailSlot]"
                            :key="detailSlot + detail2Component.component + index4"
                            v-bind="detail2Component.attrs"
                            :is="detail2Component.component"
                          >
                            {{ detail2Component.html }}
                          </component>
                        </template>
                      </component>
                    </template> -->
                  </component>
                </div>
              </template>
              <Button size="small" type="primary">
                <template #icon><form-outlined /></template>
              </Button>
            </Popover>
          </template>
          <component
            :ref="component.id"
            v-else-if="column.dataIndex === col.name && !col.buttonEditorText"
            v-bind="Object.assign({}, record.attrs || {}, col.attrs || {})"
            :value="getValue(value, index, col.name)"
            :is="editorState.propertyEditors[col.editor].component"
            :openThrottle="false"
            @change="(val) => changeValue(val, index, col.name)"
          >
            <template v-for="slot in Object.keys(editorState.propertyEditors[col.editor].slot) || []" :key="slot" #[slot]>
              <component
                v-for="(detailComponent, index3) in editorState.propertyEditors[col.editor].slot[slot]"
                :key="slot + detailComponent.component + index3"
                v-bind="detailComponent.attrs"
                :is="detailComponent.component"
              >
                {{ detailComponent.html }}
                <template v-for="detailSlot in Object.keys(detailComponent.slot)" #[detailSlot]>
                  <component
                    v-for="(detail2Component, index4) in (detailComponent.slot as Record<string, any[]>)[detailSlot]"
                    :key="detailSlot + detail2Component.component + index4"
                    v-bind="detail2Component.attrs"
                    :is="detail2Component.component"
                  >
                    {{ detail2Component.html }}
                  </component>
                </template>
              </component>
            </template>
          </component>
        </template>

        <template v-if="column.dataIndex === 'operation'">
          <Button type="primary" size="small" @click="addRow(index)">
            <template #icon><PlusOutlined /></template>
          </Button>
          <Button type="primary" size="small" danger @click="removeRow(index)" style="margin-left: 6px">
            <template #icon><DeleteOutlined /></template>
          </Button>
          <Dropdown :trigger="['click']">
            <Button size="small" style="margin-left: 6px">
              <template #icon><ToolOutlined /></template>
            </Button>
            <template #overlay>
              <Menu>
                <MenuItem :disabled="index == 0" key="1" @click="moveUp(index)"><ArrowUpOutlined />上移</MenuItem>
                <MenuItem :disabled="index == value.length - 1" key="2" @click="moveDown(index)"><ArrowDownOutlined />下移</MenuItem>
                <MenuDivider />
                <MenuItem key="2" @click="copyRow(index)"><CopyOutlined />复制</MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { PropType, reactive, watch } from 'vue';
import { ComponentPropertyEditor } from '@haku-design/core';
import { Button, Dropdown, Menu, MenuDivider, MenuItem, Popover, Table, Tooltip, message } from 'ant-design-vue';
import { state as editorState } from '@/modules/editor-module';
import { throttle } from '@/tools/common';
import type { Component } from '@haku-design/core';

const props = defineProps({
  /** 当前值 */
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
    required: true,
  },
  /** 删除判断函数 */
  onRemove: {
    type: Function,
  },
  /** splice函数 */
  onChange: {
    type: Function,
    required: true,
  },
  /** 主列名 */
  rowKey: {
    type: String,
    default: 'value',
  },
  /** 是否为树状表格 */
  isTree: {
    type: Boolean,
    default: false,
  },
  /** 子项对应字段 */
  childrenField: {
    type: String,
    default: 'children',
  },
  /** 绑定组件 */
  component: {
    type: Object as PropType<Component>,
    required: true,
  },
  /** 表格滚动条配置 */
  scroll: {
    type: Object as PropType<any>,
  },
  /** 配置列 */
  columns: {
    type: Object as PropType<
      {
        name: string;
        title: string;
        fixed?: 'left' | 'right';
        default?: any;
        width?: string;
        attrs: Record<string, any>;
        editor: ComponentPropertyEditor;
        visible?: boolean | ((component: Component) => boolean);
        /** 编辑按钮文本 */
        buttonEditorText?: string;
      }[]
    >,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'update:value', value: any[]): void;
  (event: 'change', value: any[]): void;
}>();

const state = reactive({
  /** 是否全屏 */
  fullscreen: false,
});

/** 改变值 */
const changeValue = throttle((val: any, index: number, name: string) => {
  const _newVal = [...props.value];
  if (val.target) {
    console.warn('属性值包含val.target', val);
    return;
  }
  _newVal[index][name] = val;
  // emit('update:value', _newVal);
  emit('change', _newVal);
}, 500, { leading: true, trailing: true });

watch(() => props.isTree, (val, oldVal) => {
  if (val !== oldVal) {
    emit('change', []);
  }
});

const getValue = (value, index: number, name: string) => {
  const _val = value[index][name];
  if (_val === undefined) {
    const _col = props.columns.find(i => i.name === name);
    if (_col) {
      const _defaultValue = _col?.default ? typeof _col.default === 'function' ? _col.default() : _col.default : undefined;
      value[index][name] = _defaultValue;
      return _defaultValue;
    } else return _val;
  } else return _val;
};

/** 新增行 */
const addRow = (index) => {
  const _item = {};
  props.columns.forEach((i) => {
    if (i.default) _item[i.name] = i.default;
  });
  let _value = props.value;
  if (!_value) _value = [];
  const re = [..._value.slice(0, index), _item, ..._value.slice(index)];
  emit('update:value', re);
  emit('change', re);
  // this.onChange?.(this.component, index, 0, 1);
};

/** 复制行 */
const copyRow = (index) => {
  const _item = props.value[index];
  props.columns.forEach((i) => {
    if (props.rowKey === i.name) {
      if (i.default) _item[i.name] = i.default;
    } else if (_item[i.name] === undefined) {
      if (i.default) _item[i.name] = i.default;
    }
  });
  const re = [...props.value.slice(0, index), { ...props.value[index] }, ...props.value.slice(index)];
  emit('update:value', re);
  emit('change', re);
  // this.onChange?.(this.component, index, 0, 1);
};

/** 删除行 */
const removeRow = (index) => {
  const _re = props.onRemove?.(props.value, index, props.component);
  if (_re !== false) {
    const re = [...props.value.slice(0, index), ...props.value.slice(index + 1)];
    emit('update:value', re);
    emit('change', re);
    // this.onChange?.(this.component, index, 1, 0);
  } else {
    message.warning('无法删除，请确认后重试');
  }
};

/** 上移行 */
const moveUp = (index) => {
  const re = [
    ...props.value.slice(0, index - 1),
    props.value[index],
    props.value[index - 1],
    ...props.value.slice(index + 1),
  ];
  emit('update:value', re);
  emit('change', re);
  // this.onChange?.(this.component, index);
};

/** 下移行 */
const moveDown = (index) => {
  const re = [
    ...props.value.slice(0, index),
    props.value[index + 1],
    props.value[index],
    ...props.value.slice(index + 2),
  ];
  emit('update:value', re);
  emit('change', re);
  props.onChange?.(props.component, index);
};

const tableColumns = () => {
  return (props.columns || []).filter((i) => {
    if (typeof i.visible === 'boolean') return i.visible !== false;
    else if (i.visible) return i.visible(props.component);
    else return true;
  }).map((i) => ({
    title: i.title,
    key: i.name,
    dataIndex: i.name,
    width: i.width,
    fixed: i.fixed,
  })).concat([
    {
      title: '编辑',
      key: 'operation',
      dataIndex: 'operation',
      width: '100px',
      fixed: undefined,
    },
  ]);
};
</script>

<style lang="less" scoped>
:deep(.ant-table) {
  .ant-table-content {
    // .ant-table-body {
      // margin: 0px;

    > table {
      > thead.ant-table-thead {
        > tr {
          > th {
            padding: 4px 8px;
            font-size: 12px;
          }
        }
      }

      > tbody.ant-table-tbody {
        > tr.ant-table-row {
          > td {
            padding: 4px 2px;

            .ant-input.text-editor {
              padding: 4px 6px;
            }

            .ant-input-number {
              > .ant-input-number-input-wrap {
                > .ant-input-number-input {
                  padding: 0 6px;
                }
              }
            }
          }
        }
      }
    }
    // }

    table.ant-table-fixed {
      > thead.ant-table-thead {
        > tr {
          > th {
            padding: 4px;
          }
        }
      }

      > tbody.ant-table-tbody {
        > tr.ant-table-row {
          > td {
            padding: 4px;
          }
        }
      }
    }
  }
}
</style>
