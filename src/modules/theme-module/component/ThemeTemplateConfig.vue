<template>
  <div class="theme-config">
    <Empty v-if="!themeState.themeList.length" description="暂无主题" :style="{ marginTop: '20vh' }"></Empty>
    <template v-else>
      <ul class="theme-config-list">
        <li
          v-for="(item, index) in themeState.themeList"
          :key="index"
          class="theme-item"
          :class="{ active: themeState.currentThemeCode === item.code }"
          @click="changeTheme(item)"
        >
          <div class="theme-item-header">
            <span class="theme-item-title">{{ item.title }}</span>
          </div>
          <div class="theme-item-img">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="" />
          </div>
        </li>
      </ul>
      <div class="theme-config-create"></div>
    </template>

    <!-- 弹出基本配置框 -->
    <Modal
      :wrap-class-name="`preview-modal`"
      width="700px"
      :centered="true"
      :visible="state.showBasicConfigDialog"
      :destroyOnClose="true"
      @ok="editStorageInfo"
      @cancel="closeEditStorageInfoDialog"
    >
      <template #title>
        <i class="iconfont icon-config" style="color: #4d8ce4; margin-right: 5px"></i>
        {{ themeState.currentTheme?.title }}
      </template>
      <div style="margin-top: 20px"></div>
      <Form
        ref="formRef"
        :layout="'horizontal'"
        :model="state.editStorage"
        :rules="state.rules"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
      >
        <template v-if="state.editStorage.type == 'cos'">
          <FormItem label="标题" name="title">
            <Input v-model:value="state.editStorage.title" placeholder="标题" />
          </FormItem>
          <FormItem label="SecretId" name="secretId">
            <Input v-model:value="state.editStorage.secretId" placeholder="请输入 API 密钥 SecretID" />
          </FormItem>
          <FormItem label="SecretKey" name="secretKey">
            <Input v-model:value="state.editStorage.secretKey" placeholder="请输入 API 密钥 SecretKey" />
          </FormItem>
          <FormItem label="存储桶" name="bucket">
            <Input v-model:value="state.editStorage.bucket" placeholder="请输入存储桶，例如 test-1250000000" />
          </FormItem>
          <FormItem label="区域" name="region">
            <Input v-model:value="state.editStorage.region" placeholder="请输入存储桶区域，例如 ap-beijing" />
          </FormItem>
        </template>
        <FormItem label="备注" name="remark">
          <Textarea v-model:value="state.editStorage.remark" placeholder="备注" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { state as themeState, service as themeService } from '../index';
import type { ThemeConfig } from '../@types';
import { toast } from '@/common/message';
import { Empty, Form, FormItem, Input, Modal, Textarea } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/lib/form';

const formRef = ref();

const state = reactive({
  /** 是否显示基本配置界面 */
  showBasicConfigDialog: false,
  /** 是否显示数据配置界面 */
  showDataConfigDialog: false,
  /** 是否显示变量编辑界面 */
  showDataEditDialog: false,
  /** 当前显示主题代码 */
  showThemeCode: '',
  /** 临时编辑数据源信息 */
  editStorage: {} as Record<string, any>,
  /** 表格列 */
  columns: [
    { title: '变量名', dataIndex: 'name', key: 'name', width: '25%' },
    { title: '类型', dataIndex: 'type', key: 'type', width: '10%', slots: { customRender: 'type' } },
    { title: '值', dataIndex: 'value', key: 'value', width: '20%', slots: { customRender: 'value' } },
    { title: '备注', dataIndex: 'remark', key: 'remark', slots: { customRender: 'remark' } },
    { title: '操作', dataIndex: 'handle', width: '120px', slots: { customRender: 'handle' } },
  ] as any[],
  /** 数据源编辑校验规则 */
  rules: {
    title: [{ required: true, message: '请输入主题标题', trigger: 'blur' }],
    secretId: [{ required: true, message: '请输入API密钥ID', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入API密钥Key', trigger: 'blur' }],
    bucket: [{ required: true, message: '请输入存储桶', trigger: 'blur' }],
    region: [{ required: true, message: '请输入存储桶区域', trigger: 'blur' }],
  } as { [k: string]: RuleObject[] },
  /** 表格数据 */
  storage: [
    {
      key: 1,
      name: 'title',
      type: 'string',
      remark: '标题',
    },
    {
      key: 1,
      name: 'config',
      type: 'object',
      remark: '配置',
      children: [{ key: 3, name: 'age', type: 'number', value: 16 }],
    },
    {
      key: 2,
      name: 'arr',
      remark: '列表',
      type: 'list',
      children: [
        { key: 3, name: '[0]', type: 'number', value: 16 },
        { key: 4, name: '[1]', type: 'number', value: 16 },
      ],
    },
  ] as any[],
  /** 已勾选数据 */
  rowSelection: [] as any[],
});

/** 当前数据源类型列表 */
// const showStorageTypes = computed<StorageService[]>(() => {
//   return Object.values(themeStore.storageTypes).filter(i => i.enabled);
// });

// const showStorage = computed<Record<string, any>>(() => {
//   if (state.showThemeId) {
//     let _index = themeStore.themeList.findIndex(i => i.id == state.showThemeId);
//     if (_index >= 0) {
//       return themeStore.themeList[_index];
//     }
//   }
//   return { title: '', remark: '' };
// });

/** 切换主题 */
const changeTheme = (item: ThemeConfig) => {
  themeService.changeTheme(item.code);
};
/** 关闭编辑弹出框 */
const closeEditStorageInfoDialog = () => {
  state.showBasicConfigDialog = false;
  state.editStorage = {};
};
/** 展示数据配置弹窗 */
const showDataConfig = (instance: ThemeConfig) => {
  state.showThemeCode = instance.code || '';
  state.showDataConfigDialog = true;
};
/** 展示数据编辑弹窗 */
const showDataEdit = (instance?: Record<string, any>) => {
  if (instance) {
  }
  state.showDataEditDialog = true;
};
/** 编辑数据配置 */
const editStorageInfo = () => {
  formRef.value.validate().then(() => {
    if (!state.showThemeCode) {
      return;
    }
    const _index = themeState.themeList.findIndex((i) => i.code === state.showThemeCode);
    if (_index >= 0) {
      themeState.themeList[_index].title = state.editStorage.title;
      themeState.themeList[_index].remark = state.editStorage.remark;
      state.showBasicConfigDialog = false;
    } else {
      toast('未找到当前数据源', 'error');
    }
    localStorage.setItem(
      'theme-service',
      JSON.stringify(
        themeState.themeList.map((i) => ({
          ...i,
          sdk: undefined,
        })),
      ),
    );
    state.showBasicConfigDialog = false;
  }).catch((err) => {
    toast(err.errorFields.map((i) => i.errors.flat()).flat().join('；\n'), 'error');
  });
};
/** 获取变量类型描述 */
const getVarTypeStr = (type: string) => {
  return {
    object: '对象',
    list: '列表',
    string: '字符串',
    number: '数字',
    boolean: '真/假',
  }[type];
};
/** 导入JSON文件 */
const importJSON = () => {};
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

.theme-config {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > .theme-config-list {
    overflow-y: auto;
  }

  > .theme-config-create {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
  }
}

.theme-item {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  padding: 5px 0px 0px 0px;
  margin: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  transition: 0.1s;

  &:hover {
    border-color: @primary-color;
  }

  &.active {
    background-color: @primary-2;
    border-color: @primary-color;
  }

  > .theme-item-header {
    position: relative;
    padding: 0px 10px;

    > .iconfont {
      float: left;
      display: block;
      color: @primary-color;
      margin-left: 5px;
      margin-right: 10px;
      font-size: 32px;
    }

    > .theme-item-title {
      display: inline-block;
      font-size: 14px;
      margin-left: 5px;
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

    > .theme-item-tools {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }

  > .theme-item-img {
    margin-top: 10px;

    > img {
      max-height: 100px;
      width: 100%;
      object-fit: cover;
    }
  }

  > .theme-item-remark {
    display: block;
    font-size: 11px;
    padding-bottom: 3px;
    margin: 3px 10px 10px 10px;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
  }

  > .theme-item-info {
    padding: 0px 10px;
    margin-top: 5px;

    > .theme-item-info-detail {
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

  > .theme-item-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
    height: 40px;

    > .theme-item-btn {
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

      + .theme-item-btn {
        margin-left: 10px;

        &:before {
          display: block;
        }
      }
    }
  }
}
</style>
