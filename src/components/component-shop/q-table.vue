<template>
  <ComponentBasic v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div class="component-table" :class="{ loading: props.loading }">
      <Loading class="component-table-loading" v-if="props.loading" />
      <Empty v-if="!dataSource.length" description="暂无数据">
        <Button round size="small" type="primary" style="padding: 6px 20px" @click="addRow">添加数据</Button>
      </Empty>
      <div v-else-if="editorState.appConfig.deviceType === 'mobile' && props.useCard" class="component-card-list">
        <ul class="card-list-body">
          <li
            v-for="row in props.dataSource"
            :key="row[props.rowKey]"
            class="card-item"
            :class="{ selected: isSelected(row[props.rowKey]), [props.rowClassName]: true }"
          >
            <div v-if="props.rowSelection" class="card-item-selection" @click="selectItem(row[props.rowKey])">
              <div class="card-item-selection-btn">
                <check-square-filled
                  v-if="isSelected(row[props.rowKey])"
                  :style="{ fontSize: '24px', color: '#5A6FFF' }"
                />
                <border-outlined v-else :style="{ fontSize: '24px', color: '#979797' }" />
              </div>
            </div>
            <div class="card-item-content">
              <template v-for="column in props.columns" :key="column.name">
                <div v-if="column.name !== 'action'" class="card-item-detail">
                  <label class="card-item-detail-label">{{ column.title }}</label>
                  <label class="card-item-detail-value">
                    <slot name="bodyCell" v-bind="{ text: row[column.name], column: column, record: row }">
                      <span v-if="column.readonly">{{ row[column.name] }}</span>
                      <input v-else type="text" v-model="row[column.name]" />
                    </slot>
                  </label>
                </div>
              </template>
              <div v-if="useAction" class="card-item-actions">操作按钮</div>
            </div>
          </li>
        </ul>
        <!-- <div
          v-if="props.pagination !== false && (props.pagination.total || 0) > (props.pagination.defaultPageSize || 0)"
          class="component-card-list-pagination"
        >
          <Pagination
            v-if="props.pagination !== false"
            v-model:current="props.pagination!.current"
            v-model:page-size="props.pagination!.pageSize"
            :total="props.pagination.total"
            simple
            @change="pageChange"
          />
        </div> -->
      </div>
      <div class="component-table-list" v-else>
        <table class="table-body">
          <thead>
            <tr>
              <th v-for="column in props.columns" :key="column.name">
                {{ column.title }}
              </th>
              <th v-if="useAction">操作按钮</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in props.dataSource" :key="row[props.rowKey]">
              <td v-for="column in props.columns" :key="column.name">
                <slot name="bodyCell" v-bind="{ text: row[column.name], column: column, record: row }">
                  <span v-if="column.readonly">{{ row[column.name] }}</span>
                  <input v-else type="text" v-model="row[column.name]" />
                </slot>
              </td>
              <td v-if="useAction">操作按钮</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
    components: { Loading }
};
</script>
<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import { state as editorState } from '@/modules/editor-module';
import { getQBasicProps } from '@/tools/common';
import { Button, Empty, Loading } from 'vant';

const emit = defineEmits<{
  (event: 'update:value', value: string): void;
  (event: 'update:dataSource', value: Record<string, any>[]): void;
}>();

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 在移动端上是否使用卡片模式展示 */
  useCard: {
    type: Boolean,
    default: true,
  },
  /** 是否可操作 */
  useAction: {
    type: Boolean,
    default: true,
  },
  /** 加载中 */
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** 分页器设置 */
  pagination: {
    type: Object as PropType<false | any>,
    required: false,
    default: () => ({}),
  },
  /** 表格行类名（移动端为卡片类名） */
  rowClassName: {
    type: String,
    required: false,
    default: '',
  },
  /** 列表是否可选择配置 */
  rowSelection: {
    type: Boolean,
    default: false,
  },
  /** 数据主键 */
  rowKey: {
    type: String,
    default: 'key',
  },
  /** 表格列 */
  columns: {
    type: Array as PropType<{ name: string; title: string; readonly?: boolean }[]>,
    required: true,
    default: () => [],
  },
  /** 数据源 */
  dataSource: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
    default: () => [],
  },
});

const state = reactive({
  /** 已选中行 */
  selectedRowKeys: [] as string[],
});

/** 翻页改变事件 */
// const change = (
//   pagination: TablePaginationConfig,
//   filters?: Record<string, FilterValue | null>,
//   sorter?: SorterResult<any> | SorterResult<any>[],
//   extra?: TableCurrentDataSource<any>,
// ) => {
//   if (props.useCard) {
//     // emit('change', pagination, filters, sorter, extra);
//   } else {
//     // emit('change', pagination, filters, sorter, extra);
//   }
// };

/** 页面切换 */
// const pageChange = (page, pageSize) => {
//   change({ current: page, pageSize });
// };

/** 修改值 */
const changeValue = (e) => {
  emit['update:value'](e.target.value);
};

/** 选择行 */
const selectItem = (key) => {
  const _index = state.selectedRowKeys.findIndex((i) => i === key);
  if (_index >= 0) {
    state.selectedRowKeys.splice(_index, 1);
  } else {
    state.selectedRowKeys.push(key);
  }
};

/** 添加新行 */
const addRow = () => {
  // emit["update:dataSource"]([...props.dataSource, {}]);
  emit('update:dataSource', [...props.dataSource, {}]);
};

/** 是否选中行 */
const isSelected = (key) => {
  return state.selectedRowKeys.includes(key);
};
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-table {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  > .van-empty {
    width: 100%;
  }

  // 卡片列表形式
  .component-card-list {
    position: relative;
    padding: 0px 0px;
    width: 100%;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.45);
      opacity: 0;
      transition: 0.15s;
      visibility: hidden;
    }

    &.loading {
      &:after {
        opacity: 1;
        visibility: visible;
      }

      > .component-card-list-loading {
        visibility: visible;
        opacity: 1;
      }
    }

    > .component-card-list-loading {
      position: absolute;
      left: 50%;
      top: 200px;
      transform: translate(-50%, -50%);
      visibility: hidden;
      opacity: 0;
      transition: 0.15s;
      z-index: 9;
    }
    > .component-card-list-pagination {
      margin-top: 20px;
      margin-bottom: 20px;
      > .ant-pagination {
        text-align: center;
      }
    }
    > .card-list-body {
      margin-bottom: 0px;
      padding-left: 0px;
      // overflow-y: auto;
      // overflow-x: hidden;
      // max-height: calc(100vh - 50px);

      > .card-item {
        position: relative;
        list-style: none;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        padding: 11px;

        &.selected {
          border-color: #396fff;
          border-width: 2px;
          padding: 10px;

          > .card-item-selection {
            top: 0px;
            right: 0px;
          }
        }
        + .card-item {
          margin-top: 15px;
        }

        > .card-item-selection {
          position: absolute;
          display: inline-block;
          line-height: 1;
          top: 1px;
          right: 1px;
          padding: 12px;

          > .card-item-selection-btn {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
          }
        }

        > .card-item-content {
          > .card-item-actions {
            text-align: right;
            margin-top: 10px;

            &:empty {
              margin-top: 5px;
            }

            :deep(button) {
              background: rgba(57, 111, 255, 0.05);
              border: 1px solid #396fff;
              padding: 0px 8px;
              height: 30px;
              font-size: 13px;

              + button {
                margin-left: 8px;
              }
            }
          }
          > .card-item-detail {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            + .card-item-detail {
              margin-top: 6px;
            }
            > .card-item-detail-label {
              display: inline-block;
              white-space: nowrap;
              font-size: 13px;
              color: #777777;
              min-width: 90px;

              &:after {
                content: ':';
                display: inline-block;
                margin-left: 4px;
              }
            }

            > .card-item-detail-value {
              font-size: 13px;
              color: #333333;
              font-weight: 500;
              // text-align: right;
              width: 100%;

              &:empty {
                &:before {
                  content: '无数据';
                  color: #aaa;
                  font-style: italic;
                  font-size: 12px;
                }
              }

              > input {
                border: 1px solid #ddd;
                width: 100%;
              }
            }
          }
        }
      }
    }
  }

  // 表格形式
  .component-table-list {
    width: 100%;

    > .table-body {
      width: 100%;

      > thead {
        background-color: #eee;

        > tr {
          > th {
            text-align: center;
            padding: 4px 6px;
          }
        }
      }

      > tbody {
        > tr {
          &:nth-child(2n) {
            background-color: #f5f5f5;
          }

          > td {
            > input {
              width: 100%;
              border: 1px solid #ddd;
            }
          }
        }
      }
    }
  }
}
</style>
