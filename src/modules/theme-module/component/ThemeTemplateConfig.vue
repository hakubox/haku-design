<template>
  <div class="theme-config">
    <a-empty v-if="!themeState.themeList.length" description="暂无主题" :style="{ marginTop: '20vh' }"></a-empty>
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
    <a-modal
      :wrap-class-name="`preview-modal`"
      width="700px"
      :centered="true"
      :visible="showBasicConfigDialog"
      :destroyOnClose="true"
      @ok="editStorageInfo"
      @cancel="closeEditStorageInfoDialog"
    >
      <template #title>
        <i class="iconfont icon-config" style="color: #4d8ce4; margin-right: 5px"></i>
        {{ themeState.currentTheme?.title }}
      </template>
      <div style="margin-top: 20px"></div>
      <a-form
        ref="formRef"
        :layout="'horizontal'"
        :model="editStorage"
        :rules="rules"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
      >
        <template v-if="editStorage.type == 'cos'">
          <a-form-item label="标题" name="title">
            <a-input v-model:value="editStorage.title" placeholder="标题" />
          </a-form-item>
          <a-form-item label="SecretId" name="secretId">
            <a-input v-model:value="editStorage.secretId" placeholder="请输入 API 密钥 SecretID" />
          </a-form-item>
          <a-form-item label="SecretKey" name="secretKey">
            <a-input v-model:value="editStorage.secretKey" placeholder="请输入 API 密钥 SecretKey" />
          </a-form-item>
          <a-form-item label="存储桶" name="bucket">
            <a-input v-model:value="editStorage.bucket" placeholder="请输入存储桶，例如 test-1250000000" />
          </a-form-item>
          <a-form-item label="区域" name="region">
            <a-input v-model:value="editStorage.region" placeholder="请输入存储桶区域，例如 ap-beijing" />
          </a-form-item>
        </template>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="editStorage.remark" placeholder="备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, createVNode, defineComponent, reactive, ref, toRefs } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as themeState, service as themeService } from '../index';
import { createModelId } from '@/tools/common';
import type { ThemeConfig } from '../@types';
import { toast } from '@/common/message';
// import { StorageServiceType } from "../enum";

export default defineComponent({
  components: {},
  methods: {
    /** 切换主题 */
    changeTheme(item: ThemeConfig) {
      themeService.changeTheme(item.code);
    },
    /** 关闭编辑弹出框 */
    closeEditStorageInfoDialog() {
      this.showBasicConfigDialog = false;
      this.editStorage = {};
    },
    /** 展示数据配置弹窗 */
    showDataConfig(instance: ThemeConfig) {
      this.showThemeCode = instance.code || '';
      this.showDataConfigDialog = true;
    },
    /** 展示数据编辑弹窗 */
    showDataEdit(instance?: Record<string, any>) {
      if (instance) {
      }
      this.showDataEditDialog = true;
    },
    /** 编辑数据配置 */
    editStorageInfo() {
      this.formRef.validate().then(() => {
        if (!this.showThemeCode) {
          return;
        }
        let _index = this.themeState.themeList.findIndex((i) => i.code === this.showThemeCode);
        if (_index >= 0) {
          this.themeState.themeList[_index].title = this.editStorage.title;
          this.themeState.themeList[_index].remark = this.editStorage.remark;
          this.showBasicConfigDialog = false;
        } else {
          toast('未找到当前数据源', 'error');
        }
        localStorage.setItem(
          'theme-service',
          JSON.stringify(
            this.themeState.themeList.map((i) => ({
              ...i,
              sdk: undefined,
            })),
          ),
        );
        this.showBasicConfigDialog = false;
      }).catch((err) => {
        toast(err.errorFields.map((i) => i.errors.flat()).flat().join('；\n'), 'error');
      });
    },
    /** 获取变量类型描述 */
    getVarTypeStr(type: string) {
      return {
        object: '对象',
        list: '列表',
        string: '字符串',
        number: '数字',
        boolean: '真/假',
      }[type];
    },
    /** 导入JSON文件 */
    importJSON() {},
  },
  setup(props) {
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
      },
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

    return {
      ...toRefs(state),
      formRef,
      editorState,
      themeState,
      themeService,
      /** 当前显示/编辑的数据源 */
      // showStorage,
      /** 当前数据源类型列表 */
      // showStorageTypes
    };
  },
});
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
