<template>
  <div class="data-source-config">
    <a-empty v-if="!storageState.storageServices.length" description="暂无数据源" :style="{ marginTop: '20vh' }">
      <a-dropdown :trigger="['click']">
        <a-button type="primary" style="margin-top: 10px">
          <template #icon
            ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
          /></template>
          添加存储服务
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="item in showStorageTypes" :key="item.type" @click="createNewStorageService(item.type)">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-empty>
    <template v-else>
      <ul class="data-source-config-list">
        <li class="data-source-item" v-for="(item, index) in storageState.storageServices" :key="index">
          <div class="data-source-item-header">
            <i :class="storageState.storageTypes[item.type].icon"></i>
            <span class="data-source-item-title" :class="{ 'blank-remark': !item.remark }">
              {{ item.title }}
            </span>
            <div class="data-source-item-tools">
              <a-popconfirm
                :title="`是否确认移除“${storageState.storageServices[index].title}”？`"
                ok-text="确认"
                cancel-text="取消"
                @confirm="removeStorage(index)"
              >
                <a-button size="small" type="text" danger>
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-popconfirm>
            </div>
          </div>
          <span class="data-source-item-remark">
            {{ item.remark }}
          </span>
          <span class="" v-show="!item.remark"></span>
          <div class="data-source-item-info">
            <dl class="data-source-item-info-detail">
              <dt>状态</dt>
              <dd style="padding-left: 5px">
                <a-badge
                  :color="
                    {
                      unknown: '#D9D9D9',
                      fail: 'red',
                      normal: 'green',
                    }[item.status]
                  "
                  :status="
                    {
                      unknown: 'default',
                      fail: 'error',
                      normal: 'processing',
                    }[item.status]
                  "
                  :text="
                    {
                      unknown: '未知',
                      fail: '错误',
                      normal: '正常',
                    }[item.status]
                  "
                />
              </dd>
            </dl>
            <dl class="data-source-item-info-detail">
              <dt>类型</dt>
              <dd>{{ getServiceName(item.type) }}</dd>
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
            <a-tooltip placement="top">
              <template #title>
                <span>基础设置</span>
              </template>
              <div class="data-source-item-btn" @click="showBasicConfig(item)">
                <i class="iconfont icon-config"></i>
              </div>
            </a-tooltip>
            <a-tooltip placement="top">
              <template #title>
                <span>数据配置</span>
              </template>
              <div class="data-source-item-btn" @click="showDataConfig(item)">
                <i class="iconfont icon-chucun"></i>
              </div>
            </a-tooltip>
          </div>
        </li>
      </ul>
      <div class="data-source-config-create">
        <a-dropdown :trigger="['click']">
          <a-button type="primary">
            <template #icon
              ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
            /></template>
            添加存储服务
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="item in showStorageTypes"
                :key="item.type"
                @click="createNewStorageService(item.type)"
              >
                {{ item.name }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
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
        {{ `${showStorage?.title || getServiceName(editStorage.type)} 基本配置` }}
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

    <!-- 弹出文件存储操作框 -->
    <a-modal
      :wrap-class-name="`preview-modal`"
      width="1000px"
      :centered="true"
      :visible="showDataConfigDialog"
      :destroyOnClose="true"
      @cancel="showDataConfigDialog = false"
    >
      <template #title>
        <i class="iconfont icon-chucun" style="color: #4d8ce4; margin-right: 5px"></i>
        {{ `${showStorage?.title} 文件管理` }}
      </template>

      <template #footer>
        <a-button type="primary" @click="importJSON()">导入JSON</a-button>&nbsp;
        <a-button type="primary" @click="showDataEdit()">增加子项</a-button>&nbsp;
        <a-button type="primary" danger>批量删除</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as storageState, service as storageService } from '../index';
import { openFileDialog } from '@/tools/common';
import { message } from 'ant-design-vue';
import { StorageService, StorageServiceInstance } from '@/modules/storage-module/@types';
import { QiniuService } from '../service/qiniu.service';
import { StorageServiceType } from '../enum';
import { COSService } from '../service/cos.service';

export default defineComponent({
  components: {},
  methods: {
    /** 关闭编辑弹出框 */
    closeEditStorageInfoDialog() {
      this.showBasicConfigDialog = false;
      this.editStorage = {};
    },
    /** 获取服务名 */
    getServiceName(type: StorageServiceType) {
      return this.storageState.storageTypes[type].name;
    },
    /** 上传文件 */
    uploadFile(instance: StorageServiceInstance) {
      openFileDialog().then((d) => {
        if (d.length) {
          QiniuService.api.upload(instance, d[0]);
        }
      });
    },
    /** 移除数据源 */
    removeStorage(index: number) {
      this.storageState.storageServices.splice(index, 1);
    },
    /** 创建新文件存储 */
    createNewStorageService(type: StorageServiceType) {
      this.showStorageId = '';
      this.editStorage.type = type;
      this.editStorage.title = `${this.storageState.storageTypes[type].name} ${
        this.storageState.storageServices.length + 1
      }`;
      this.showBasicConfigDialog = true;
    },
    /** 展示基本配置弹窗 */
    showBasicConfig(instance: StorageServiceInstance) {
      this.showStorageId = instance.id;
      this.editStorage.type = instance.type;
      this.editStorage.title = instance.title;
      this.editStorage.remark = instance.remark;
      this.showBasicConfigDialog = true;
    },
    /** 展示数据配置弹窗 */
    showDataConfig(instance: StorageServiceInstance) {
      this.showStorageId = instance.id;
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
      this.formRef
        .validate()
        .then(() => {
          if (this.showStorageId) {
            let _index = this.storageState.storageServices.findIndex((i) => i.id == this.showStorageId);
            if (_index >= 0) {
              this.storageState.storageServices[_index].title = this.editStorage.title;
              this.storageState.storageServices[_index].remark = this.editStorage.remark;
              this.showBasicConfigDialog = false;
            } else {
              message.error('未找到当前数据源');
            }
          } else {
            let _instance = this.storageService.createStorageService(this.editStorage.type);
            switch (this.editStorage.type) {
              case StorageServiceType.cos:
                _instance.config = {
                  secretId: this.editStorage.secretId,
                  secretKey: this.editStorage.secretKey,
                  bucket: this.editStorage.bucket,
                  region: this.editStorage.region,
                };
                break;
              case StorageServiceType.qiniu:
                _instance.config = {
                  secretId: this.editStorage.secretId,
                  secretKey: this.editStorage.secretKey,
                  bucket: this.editStorage.bucket,
                  region: this.editStorage.region,
                };
                break;
              default:
                break;
            }
            _instance.remark = this.editStorage.remark;
            this.showStorageId = _instance.id;
          }
          localStorage.setItem(
            'storage-service',
            JSON.stringify(
              this.storageState.storageServices.map((i) => ({
                ...i,
                sdk: undefined,
              })),
            ),
          );
          this.showBasicConfigDialog = false;
        })
        .catch((err) => {
          message.error(
            err.errorFields
              .map((i) => i.errors.flat())
              .flat()
              .join('；\n'),
          );
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
  created() {
    let _localService = localStorage.getItem('storage-service');
    if (_localService && _localService.length > 2) {
      this.storageState.storageServices = JSON.parse(_localService);
    }
    this.storageState.storageServices.forEach((i) => {
      this.storageService.initService(i);
    });
  },
  mounted() {},
  setup(props) {
    const formRef = ref();

    const state = reactive({
      /** 是否显示基本配置界面 */
      showBasicConfigDialog: false,
      /** 是否显示数据配置界面 */
      showDataConfigDialog: false,
      /** 是否显示变量编辑界面 */
      showDataEditDialog: false,
      /** 展示数据源 */
      showStorageId: '',
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
        title: [{ required: true, message: '请输入服务标题', trigger: 'blur' }],
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
    const showStorageTypes = computed<StorageService[]>(() => {
      return Object.values(storageState.storageTypes).filter((i) => i.enabled);
    });

    const showStorage = computed<Record<string, any>>(() => {
      if (state.showStorageId) {
        let _index = storageState.storageServices.findIndex((i) => i.id == state.showStorageId);
        if (_index >= 0) {
          return storageState.storageServices[_index];
        }
      }
      return { title: '', remark: '' };
    });

    return {
      ...toRefs(state),
      formRef,
      editorState,
      storageState,
      storageService,
      /** 当前显示/编辑的数据源 */
      showStorage,
      /** 当前数据源类型列表 */
      showStorageTypes,
    };
  },
});
</script>

<style lang="less">
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
