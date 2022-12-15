<template>
  <div class="dimension-config">
    <a-table row-key="dimensionId" :pagination="false" size="small" :columns="tableColumns()" :dataSource="value">
      <template #emptyText>
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE">
          <template #description>
            <span style="display: inline-block; margin-bottom: 10px">暂无维度</span><br />
            <a-button type="primary" @click="addRow()">
              <template #icon><PlusOutlined /></template>
              创建新维度
            </a-button>
          </template>
        </a-empty>
      </template>

      <template #bodyCell="{ column, index }">
        <template v-if="column.dataIndex === 'dimensionFactor'">
          <a-input-number
            :defaultValue="1"
            style="width: 60px"
            :min="0"
            :max="10"
            :step="0.1"
            v-model:value="value![index]['dimensionFactor']"
          ></a-input-number>
        </template>
        <template v-if="column.dataIndex === 'dimensionTitle'">
          <a-input v-model:value="value![index]['dimensionTitle']"></a-input>
        </template>
        <template v-if="column.dataIndex === 'dimensionQuestions'">
          <a-select
            v-model:value="value![index]['dimensionQuestions']"
            mode="multiple"
            :allowClear="true"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择题型"
            class="combobox-dimension"
            :options="componentList"
          >
            <template #maxTagPlaceholder></template>
            <template #option="option">
              <div class="component-option" @mouseenter="componentMouseEnter(option.value)" @mouseout="componentMouseOut()">
                <i :class="option.icon" style="color: #888; font-size: 13px;"></i>
                &nbsp;{{ option.label }}
              </div>
            </template>
            <template #tagRender>
              {{ getQuestionsLabel(index) }}
            </template>
          </a-select>
        </template>

        <template v-if="column.dataIndex === 'operation'">
          <a-button type="primary" size="small" @click="addRow(index)">
            <template #icon><PlusOutlined /></template>
          </a-button>
          <a-button type="primary" size="small" danger @click="removeRow(index)" style="margin-left: 6px">
            <template #icon><DeleteOutlined /></template>
          </a-button>
          <a-dropdown :trigger="['click']">
            <a-button size="small" style="margin-left: 6px">
              <template #icon><ToolOutlined /></template>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item :disabled="index == 0" key="1" @click="moveUp(index)"><ArrowUpOutlined />上移</a-menu-item>
                <a-menu-item :disabled="index == value.length - 1" key="2" @click="moveDown(index)"
                  ><ArrowDownOutlined />下移</a-menu-item
                >
                <a-menu-divider />
                <a-menu-item key="2" @click="copyRow(index)"><CopyOutlined />复制</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, PropType, reactive, toRefs, useAttrs } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { Empty } from 'ant-design-vue';
import { createModelId } from '@/tools/common';

const props = defineProps({
  /** 当前值 */
  value: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
});

const attrs = useAttrs();

/** 状态管理 */
const state = reactive({
  /** 配置列 */
  columns: [
    { name: 'dimensionId', title: 'Id', visible: false },
    { name: 'dimensionFactor', title: '权重', width: '17%' },
    { name: 'dimensionTitle', title: '名称', width: '25%' },
    { name: 'dimensionQuestions', title: '关联问题' },
  ] as Record<string, any>[],
});

const emit = defineEmits<{
  (event: 'update:value', value: any): void;
  (event: 'change', value: any): void;
}>();

/** 组件列表 */
const componentList = computed(() => {
  return editorState.pages.map((page) => ({
    label: page.pageTitle,
    options: page.children
      .filter((i, index) => {
        return attrs.filter ? (attrs.filter as Function)(i, index) : true;
      })
      .map((i) => ({
        value: i.attrs.id,
        label: i.attrs.name || i.title,
        icon: editorState.menuComponents.find(o => o.name === i.name)?.icon ?? '---',
      })),
  }));
});

/** 组件光标移动上去 */
const componentMouseEnter = (componentId: string) => {
  const _dom = document.querySelector(`.design-form-canvas-page.app-canvas [component-id="${componentId}"]`);
  if (_dom) {
    _dom.classList.add('highlight');
  }
};
const componentMouseOut = () => {
  const _domList = [ ...document.querySelectorAll(`.design-form-canvas-page.app-canvas [component-id].highlight`) ];
  if (_domList?.length) _domList.forEach(i => {
    i.classList.remove('highlight');
  });
};
/** 获取题目显示的标签文本 */
const getQuestionsLabel = (index: number) => {
  if (!props.value[index]['dimensionQuestions'] || !props.value[index]['dimensionQuestions'].length) {
    return '暂无数据';
  }
  const _list: { id: string; index: number }[][] = [];
  editorService.getAllFormItem().forEach((item, qIndex) => {
    if (props.value[index]['dimensionQuestions'].includes(item.id)) {
      const _item = { id: item.id, index: qIndex };
      if (qIndex === 0 || !_list.length) {
        _list.push([_item]);
      } else {
        let _lastItem = _list[_list.length - 1];
        if (_lastItem.length && _lastItem[_lastItem.length - 1].index === qIndex - 1) {
          _lastItem.push(_item);
        } else {
          _list.push([_item]);
        }
      }
    }
  });
  if (!_list.length) return '暂无数据';
  return _list
    .filter((i) => i.length)
    .map((i) => {
      if (i.length === 1) {
        return `${i[0].index + 1}`;
      } else {
        return `${i[0].index + 1}-${i[0].index + i.length}`;
      }
    })
    .join(', ');
};
/** 新增行 */
const addRow = (index = 0) => {
  const re = [...props.value.slice(0, index), { dimensionId: createModelId() }, ...props.value.slice(index)];
  emit('update:value', re);
  emit('change', re);
};
/** 复制行 */
const copyRow = (index) => {
  const re = [
    ...props.value.slice(0, index),
    { ...props.value[index], dimensionId: createModelId() },
    ...props.value.slice(index),
  ];
  emit('update:value', re);
  emit('change', re);
};
/** 删除行 */
const removeRow = (index) => {
  const re = [...props.value.slice(0, index), ...props.value.slice(index + 1)];
  emit('update:value', re);
  emit('change', re);
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
};
/** 返回表格列 */
const tableColumns = () => {
  return (state.columns || [])
    .filter((i) => i.visible !== false)
    .map((i) => ({
      title: i.title,
      key: i.name,
      dataIndex: i.name,
      width: i.width,
      fixed: i.fixed,
    }))
    .concat([
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
:deep(.ant-table.ant-table-small) {
  > .ant-table-content {
    .ant-table-body {
      margin: 0px;

      > table {
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

:deep(.ant-select-selection-overflow-item-rest) {
  > .ant-select-selection-item {
    background-color: white;
    border: none;
    padding-left: 0px;
    padding-right: 0px;
    margin-right: 0px;

    > .ant-select-selection-item-content {
    }
  }
}
</style>
