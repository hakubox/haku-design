<template>
  <div class="data-source-config">
    <Empty v-if="!dataSourceState.dataSourceList.length" description="暂无数据源" :style="{ marginTop: '20vh' }">
      <Dropdown :trigger="['click']">
        <Button type="primary" style="margin-top: 10px">
          <template #icon
            ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
          /></template>
          添加数据源
        </Button>
        <template #overlay>
          <Menu>
            <MenuItem
              v-for="item in dataSourceTypes.filter((i) => i.enabled)"
              :key="item.type"
              @click="addNewDataSource(item)"
            >
              {{ item.title }}
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </Empty>
    <template v-else>
      <ul class="data-source-config-list">
        <li class="data-source-item" v-for="(item, index) in dataSourceState.dataSourceList" :key="index">
          <div class="data-source-item-header">
            <i :class="item.icon"></i>
            <span class="data-source-item-title" :class="{ 'blank-remark': !item.remark }">
              {{ item.title }}
            </span>
            <div class="data-source-item-tools">
              <Popconfirm
                :title="`是否确认移除“${dataSourceState.dataSourceList[index].title}”？`"
                ok-text="确认"
                cancel-text="取消"
                @confirm="removeDataSource(index)"
              >
                <Button size="small" type="text" danger>
                  <template #icon><DeleteOutlined /></template>
                </Button>
              </Popconfirm>
            </div>
          </div>
          <span class="data-source-item-remark">
            {{ item.remark }}
          </span>
          <span class="" v-show="!item.remark"></span>
          <div class="data-source-item-info">
            <dl class="data-source-item-info-detail">
              <dt>状态</dt>
              <dd style="padding-left: 5px"><Badge color="green" status="processing" text="正常" /></dd>
            </dl>
            <dl class="data-source-item-info-detail">
              <dt>类型</dt>
              <dd>静态数据源</dd>
            </dl>
            <dl class="data-source-item-info-detail">
              <dt>数据</dt>
              <dd>10条</dd>
            </dl>
            <dl class="data-source-item-info-detail">
              <dt>地址</dt>
              <dd>——</dd>
            </dl>
          </div>
          <div class="data-source-item-btns">
            <Tooltip placement="top">
              <template #title>
                <span>基础设置</span>
              </template>
              <div class="data-source-item-btn" @click="showBasicConfig(item)">
                <i class="iconfont icon-config"></i>
              </div>
            </Tooltip>
            <Tooltip placement="top">
              <template #title>
                <span>数据配置</span>
              </template>
              <div class="data-source-item-btn" @click="showDataConfig(item)">
                <i class="iconfont icon-chucun"></i>
              </div>
            </Tooltip>
          </div>
        </li>
      </ul>
      <div class="data-source-config-create">
        <Dropdown :trigger="['click']">
          <Button type="primary">
            <template #icon
              ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
            /></template>
            添加数据源
          </Button>
          <template #overlay>
            <Menu>
              <MenuItem
                v-for="item in dataSourceTypes.filter((i) => i.enabled)"
                :key="item.type"
                @click="addNewDataSource(item)"
              >
                {{ item.title }}
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </template>

    <!-- 弹出基本配置框 -->
    <Modal
      :wrap-class-name="`preview-modal`"
      width="700px"
      :centered="true"
      :visible="state.showBasicConfigDialog"
      :destroyOnClose="true"
      @ok="editDataSourceInfo"
      @cancel="state.showBasicConfigDialog = false"
    >
      <template #title>
        <i class="iconfont icon-config" style="color: #4d8ce4; margin-right: 5px"></i>
        {{ `${showDataSource?.title} 基本配置` }}
      </template>
      <div style="margin-top: 20px"></div>
      <Form
        ref="formRef"
        :layout="'horizontal'"
        :model="state.editDataSource"
        :rules="state.rules"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
      >
        <FormItem label="类型" name="type">
          <RadioGroup :value="state.editDataSource.type" button-style="solid">
            <RadioButton
              v-for="item in dataSourceTypes.filter((i) => i.enabled)"
              :key="item.type"
              :value="item.type"
              >{{ item.title }}</RadioButton
            >
          </RadioGroup>
          <label style="
            font-size: 12px;
            color: rgb(245, 34, 45);
            display: inline-block;
            padding-left: 10px;
            vertical-align: bottom;
          ">数据类型暂无法更改</label>
        </FormItem>
        <FormItem label="标题" name="title">
          <Input v-model:value="state.editDataSource.title" placeholder="标题" />
        </FormItem>
        <FormItem label="备注" name="remark">
          <Textarea v-model:value="state.editDataSource.remark" placeholder="备注" />
        </FormItem>
      </Form>
    </Modal>

    <!-- 弹出数据配置框 -->
    <Modal
      width="1000px"
      :centered="true"
      :visible="state.showDataConfigDialog"
      :destroyOnClose="true"
      @cancel="state.showDataConfigDialog = false"
    >
      <template #title>
        <i class="iconfont icon-chucun" style="color: #4d8ce4; margin-right: 5px"></i>
        {{ `${showDataSource?.title} 数据配置` }}
      </template>

      <template #footer>
        <Button type="primary" @click="saveVariableData()">保存</Button>
      </template>

      <div style="text-align: right; margin-bottom: 15px;">
        <Button type="default" @click="importJSON()">导入JSON</Button>&nbsp;
        <Button type="default" @click="addChildNode(undefined)">增加子项</Button>&nbsp;
      </div>

      <Table
        bordered
        size="small"
        tableLayout="fixed"
        :scroll="{ y: 400 }"
        :defaultExpandAllRows="true"
        :dataSource="state.dataSource"
        :columns="state.columns"
        :rowSelection="(state.rowSelection as any)"
        :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : '')"
        :pagination="false"
        :locale="{
          filterConfirm: '确定',
          filterReset: '重置',
          emptyText: '暂无数据',
        }"
      >
        <template #bodyCell="{ column, record }">
          <!-- 变量名 -->
          <template v-if="column.dataIndex === 'name'">
            <span v-if="getParentNode(record.parentId)?.type === 'list'">
              [{{ getParentIndex(record.parentId, record.key) }}]
            </span>
            <span v-else-if="getParentNode(record.parentId)?.type === 'object'">
              <Input size="small" v-model:value="record.name" placeholder="请输入值" />
            </span>
            <span v-else>
              <Input size="small" v-model:value="record.name" placeholder="请输入值" />
            </span>
          </template>
          <!-- 类型选择框 -->
          <template v-if="column.dataIndex === 'type'">
            <!-- {{ getVarTypeStr(text) }} -->
            <Select
              ref="select"
              size="small"
              :value="record.type"
              style="width: 100%;"
              @select="changeDataType($event, record)"
            >
              <SelectOption value="object">对象</SelectOption>
              <SelectOption value="list">列表</SelectOption>
              <SelectOption value="string">字符串</SelectOption>
              <SelectOption value="number">数字</SelectOption>
              <SelectOption value="boolean">真/假</SelectOption>
            </Select>
          </template>
          <!-- 值 -->
          <template v-else-if="column.dataIndex === 'value'">
            <!-- {{ text }} -->
            <div v-if="record.type === 'object' || record.type === 'list'" style="height: 30px;"></div>
            <div v-else-if="record.type === 'boolean'">
              <Switch checked-children="开" un-checked-children="关" v-model:checked="record.value" />
            </div>
            <div v-else-if="record.type === 'number'">
              <InputNumber size="small" style="width: 100%;" v-model:value="record.value" :step="1" />
            </div>
            <div v-else>
              <Input size="small" v-model:value="record.value" placeholder="请输入值" />
            </div>
          </template>
          <!-- 备注 -->
          <template v-else-if="column.dataIndex === 'title'">
            <!-- {{ text }} -->
            <Input size="small" v-model:value="record.title" />
          </template>
          <!-- 操作 -->
          <template v-else-if="column.dataIndex === 'handle'">
            <Button size="small" type="primary" style="margin-right: 10px">
              <template #icon><EditOutlined /></template>
            </Button>
            <Button size="small" danger style="margin-right: 10px" @click="removeChildNode(record)"
              ><template #icon><DeleteOutlined /></template
            ></Button>
            <Button size="small" v-if="record.type == 'object' || record.type == 'list'" @click="addChildNode(record)">
              <template #icon><PlusOutlined /></template>
            </Button>
          </template>
        </template>
      </Table>
    </Modal>

    <!-- 弹出变量编辑框 -->
    <Modal
      width="700px"
      :centered="true"
      :visible="state.showDataEditDialog"
      :destroyOnClose="true"
      title="数据编辑"
      @ok="editDataSourceInfo"
      @cancel="state.showDataEditDialog = false"
    >
      <div style="margin-top: 20px"></div>
      <Form
        ref="formRef"
        :layout="'horizontal'"
        :model="state.editDataSource"
        :rules="state.rules"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
      >
        <FormItem label="类型" name="type">
          <RadioGroup :value="state.editDataSource.type" button-style="solid">
            <RadioButton
              v-for="item in dataSourceTypes.filter((i) => i.enabled)"
              :key="item.type"
              :value="item.type"
            >{{ item.title }}</RadioButton>
          </RadioGroup>
          <label style="
            font-size: 12px;
            color: rgb(245, 34, 45);
            display: inline-block;
            padding-left: 10px;
            vertical-align: bottom;
          ">数据类型暂无法更改</label>
        </FormItem>
        <FormItem label="标题" name="title">
          <Input v-model:value="state.editDataSource.title" placeholder="标题" />
        </FormItem>
        <FormItem label="备注" name="remark">
          <Textarea v-model:value="state.editDataSource.remark" placeholder="备注" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, createVNode, reactive, ref } from 'vue';
import { state as dataSourceState } from '../index';
import { dataSourceTypes } from '../data/data-source-types';
import { createModelId, recursive } from '@/tools/common';
import type { DataSource, DataSourceTypeItem } from '../@types';
import { Empty, Dropdown, message, Modal, Button, Menu, MenuItem, Table, FormItem, Tooltip, Form, Popconfirm, Input, Textarea, RadioGroup, RadioButton, SelectOption, Select, InputNumber, Switch, Badge } from 'ant-design-vue';
import { VariableType } from '@/modules/variable-module/@types';
import { service as variableService } from '@/modules/variable-module';
import { cloneLoop } from '@/lib/clone';
import { DeleteOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { RuleObject } from 'ant-design-vue/lib/form';

const formRef = ref<typeof Form>();

const state = reactive({
  /** 是否显示基本配置界面 */
  showBasicConfigDialog: false,
  /** 是否显示数据配置界面 */
  showDataConfigDialog: false,
  /** 是否显示变量编辑界面 */
  showDataEditDialog: false,
  /** 展示数据源 */
  showDataSourceId: '',
  /** 临时编辑数据源信息 */
  editDataSource: {} as { title: string; type: string; remark?: string },
  /** 表格列 */
  columns: [
    { title: '变量名', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type', width: '12%' },
    { title: '值', dataIndex: 'value', width: '20%' },
    { title: '备注', dataIndex: 'title' },
    { title: '操作', dataIndex: 'handle', width: '120px' },
  ] as any[],
  /** 数据源编辑校验规则 */
  rules: {
    title: [{ required: true, message: '请输入数据源标题', trigger: 'blur' }],
  } as { [k: string]: RuleObject[] },
  /** 表格数据 */
  dataSource: [] as any[],
  /** 已勾选数据 */
  rowSelection: [] as any[],
});

const showDataSource = computed<{ title: string; type: string; remark?: string }>(() => {
  if (state.showDataSourceId) {
    let _index = dataSourceState.dataSourceList.findIndex((i) => i.id == state.showDataSourceId);
    if (_index >= 0) {
      return dataSourceState.dataSourceList[_index];
    }
  }
  return { title: '', type: '', remark: '' };
});

/** 添加新数据源 */
const addNewDataSource = (instance: DataSourceTypeItem) => {
  dataSourceState.dataSourceList.push({
    id: createModelId(10),
    type: instance.type,
    title: `${instance.title} ${dataSourceState.dataSourceList.length + 1}`,
    icon: instance.icon,
    data: [],
    lastTime: Date.now(),
    enabled: true,
  });
};
/** 移除数据源 */
const removeDataSource = (index: number) => {
  dataSourceState.dataSourceList.splice(index, 1);
};
/** 展示基本配置弹窗 */
const showBasicConfig = (instance: DataSource) => {
  state.showDataSourceId = instance.id;
  state.editDataSource.type = instance.type;
  state.editDataSource.title = instance.title;
  state.editDataSource.remark = instance.remark;
  state.showBasicConfigDialog = true;
};
/** 展示数据配置弹窗 */
const showDataConfig = (instance: DataSource) => {
  state.showDataSourceId = instance.id;
  const _instance = cloneLoop(instance.data);
  const _cb = (obj, parentId) => {
    if (parentId) obj.parentId = parentId;
    if (obj.children?.length) {
      for (let i = 0; i < obj.children.length; i++) {
        _cb(obj.children[i], obj.key);
      }
    }
  };
  _instance.forEach(i => _cb(i, ''));

  state.dataSource = _instance;
  state.showDataConfigDialog = true;
};
/** 展示数据编辑弹窗 */
const showDataEdit = (instance?: Record<string, any>) => {
  if (instance) {
  }
  state.showDataEditDialog = true;
};
/** 修改数据类型 */
const changeDataType = (type: string, record) => {
  if (record.type === type) return;
  if (record?.children?.length && ['list', 'object'].includes(record.type) && !['list', 'object'].includes(type)) {
    Modal.confirm({
      title: '是否要切换数据类型？',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '切换数据类型将会清空当前变量的子项，是否继续操作？'),
      onOk() {
        record.type = type;
        record.children = [];
      },
      onCancel() {},
    });
  } else {
    record.type = type;
  }
};
/** 编辑数据配置 */
const editDataSourceInfo = () => {
  formRef.value!
    .validate()
    .then(() => {
      let _index = dataSourceState.dataSourceList.findIndex((i) => i.id == state.showDataSourceId);
      if (_index >= 0) {
        dataSourceState.dataSourceList[_index].title = state.editDataSource.title;
        dataSourceState.dataSourceList[_index].remark = state.editDataSource.remark;
        state.showBasicConfigDialog = false;
      } else {
        message.error('未找到当前数据源');
      }
    })
    .catch(({ errorFields }) => {
      message.error(
        errorFields
          .map((i) => i.errors.flat())
          .flat()
          .join('；\n'),
      );
    });
};
const saveVariableData = () => {
  message.success('变量数据保存完成');
  const _index = dataSourceState.dataSourceList.findIndex(i => i.id === state.showDataSourceId);
  dataSourceState.dataSourceList[_index].data = state.dataSource;
  state.showDataConfigDialog = false;

  variableService.updateVariable();
};
/** 获取变量类型描述 */
const getVarTypeStr = (type: VariableType) => {
  return {
    object: '对象',
    list: '列表',
    string: '字符串',
    number: '数字',
    boolean: '真/假',
  }[type];
};
/** 获取父级变量 */
const getParentNode = (parentId: string) => {
  if (parentId === undefined) return undefined;
  const _re = recursive(state.dataSource, {
    filter(variable, chain) {
      return variable.key === parentId;
    },
  })
  return _re.length ? _re[0] : undefined;
};
/** 获取子级对应父级的索引（获取数组索引） */
const getParentIndex = (parentId: string, id: string) => {
  const _parentList = recursive(state.dataSource, {
    filter(variable, chain) {
      return variable.key === parentId;
    },
  });
  if (_parentList.length) {
    const _parent = _parentList[0];
    return (_parent.children || []).findIndex((i, index) => i.key === id);
  }
  return undefined;
};
/** 移除变量子项 */
const removeChildNode = (item: Record<string, any>) => {
  if (!item.parentId) {
    const _index = state.dataSource.findIndex(i => i.key === item.key);
    state.dataSource.splice(_index, 1);
  } else {
    let _isComplete = false;
    const _cb = (arr: Record<string, any>[]) => {
      if (_isComplete) return;
      for (let i = 0; i < arr.length; i++) {
        const _el = arr[i];
        if (_el.key === item.key) {
          arr.splice(i, 1);
          _isComplete = true;
          return;
        }
        if (_el.children?.length) {
          _cb(_el.children);
        }
      }
    }
    _cb(state.dataSource);
  }
};
/** 添加变量子项 */
const addChildNode = (item: Record<string, any> | undefined) => {
  if (!item) {
    state.dataSource.push({
      key: createModelId(),
      name: `newVar${state.dataSource.length + 1}`,
      type: 'string',
      title: `新变量${state.dataSource.length + 1}`,
      children: [],
    });
  } else {
    if (!item.children) item.children = [];
    if (item.type === 'list') {
      item.children.push({
        key: createModelId(),
        parentId: item.key,
        type: 'string',
        title: `新变量${state.dataSource.length + 1}`,
      });
    } else if (item.type === 'object') {
      item.children.push({
        key: createModelId(),
        parentId: item.key,
        name: `newVar${state.dataSource.length + 1}`,
        type: 'string',
        title: `新变量${state.dataSource.length + 1}`,
      });
    }
    console.log('item', item);
  }
};
/** 导入JSON文件 */
const importJSON = () => {};
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.data-source-config {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > .data-source-config-list {
    overflow-y: auto;
  }

  > .data-source-config-create {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
  }
}

:deep(.ant-table-cell-with-append) {

  .ant-input {
    width: 120px;
  }
}

.data-source-item {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  padding: 5px 0px 0px 0px;
  margin: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  > .data-source-item-header {
    position: relative;
    padding: 0px 10px;

    > .iconfont {
      float: left;
      display: block;
      color: @primary-color;
      margin-left: 5px;
      margin-right: 15px;
      font-size: 32px;
    }

    > .data-source-item-title {
      display: inline-block;
      font-size: 14px;
      margin-top: 10px;
      line-height: 20px;
      font-weight: bold;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.blank-remark {
        line-height: 34px;
        margin-bottom: 4px;
        margin-top: 8px;
      }
    }

    > .data-source-item-tools {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }

  > .data-source-item-remark {
    display: block;
    font-size: 11px;
    padding-bottom: 3px;
    margin: 3px 10px 10px 10px;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
  }

  > .data-source-item-info {
    padding: 0px 10px;
    margin-top: 5px;

    > .data-source-item-info-detail {
      display: inline-block;
      width: 50%;
      margin-bottom: 5px;

      &.detail-full {
        width: 100%;
      }

      > dt {
        font-size: 11px;
        color: #888;
      }

      > dd {
        display: block;
        font-size: 13px;
        color: #2f2e3f;
        font-weight: bold;
        margin-top: 2px;
        margin-bottom: 0px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  > .data-source-item-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
    height: 40px;

    > .data-source-item-btn {
      position: relative;
      width: 100%;
      display: flex;
      flex-grow: 1;
      justify-content: center;
      align-items: center;

      &:hover {
        > .iconfont {
          color: @primary-color;
        }
      }

      &:before {
        content: '';
        position: absolute;
        display: none;
        top: 10px;
        left: 0px;
        bottom: 10px;
        width: 1px;
        background-color: #f0f0f0;
      }

      > .iconfont {
        color: #898989;
        font-size: 16px;
        transition: 0.15s;
      }

      + .data-source-item-btn {
        margin-left: 10px;

        &:before {
          display: block;
        }
      }
    }
  }
}
</style>
