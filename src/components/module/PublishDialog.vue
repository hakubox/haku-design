<template>
  <div>
    <!-- 产品预览 -->
    <Modal title="发布问卷" :width="1080" :visible="visible" :footer="false" @cancel="onClose" @ok="onSubmit">
      <div class="publish-panel">
        <div class="publish-panel-left">
          <Image src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
        </div>
        <div class="publish-panel-right">
          <div class="design-form-panel cols-2">
            <Form ref="formRef" autocomplete="off" layout="vertical" :model="state.formState">
              <div class="form-panel-content">
                <FormItem class="form-item" label="发布地址">
                  <span
                    class="form-item-value-link"
                    style="display: inline-block; margin-right: 10px; vertical-align: middle"
                    >www.xxx.com/12345/123</span
                  >
                  <Tooltip placement="bottom">
                    <template #title>
                      <QRCode :width="220" :height="220" :margin="0" value="www.xxx.com/12345/123" />
                    </template>
                    <QrcodeOutlined style="font-size: 18px" />
                  </Tooltip>
                </FormItem>
                <FormItem class="form-item" label="当前版本号">
                  <span class="form-item-value-txt">V2</span>
                </FormItem>
                <!-- <FormItem class="form-item" label="是否发布到问卷库（需审核）" name="dateRange">
                  <Switch v-model:checked="formState.isPublic" />
                </FormItem> -->
                <FormItem class="form-item" label="发布密码" name="ansPassword">
                  <Input :allowClear="true" v-model:value="state.formState.ansPassword" />
                </FormItem>
                <FormItem class="form-item" label="填写问卷数上限（0为不设限）" name="maxCopies">
                  <InputNumber
                    :allowClear="true"
                    :min="0"
                    :max="1000000"
                    :precision="0"
                    v-model:value.number="state.formState.maxCopies"
                  >
                    <template #addonAfter>份</template>
                  </InputNumber>
                </FormItem>
                <FormItem class="form-item" label="答题日期范围" name="dateRange">
                  <RangePicker
                    :allowClear="true"
                    style="width: 100%"
                    v-model:value="state.formState.dateRange"
                    valueFormat="YYYY-MM-DD"
                  />
                </FormItem>
                <FormItem class="form-item col-full" label="填写问卷是否需要身份验证">
                  <CheckboxGroup
                    v-model:value="state.formState.validateTypes"
                    name="checkboxgroup"
                    :options="state.validateTypes"
                  />
                </FormItem>
                <FormItem class="form-item col-full" label="需登记个人以下信息">
                  <CheckboxGroup
                    v-model:value="state.formState.requiredUserInfos"
                    name="checkboxgroup"
                    :options="state.userInfos"
                  />
                </FormItem>
                <FormItem class="form-item col-full" label="发布描述" name="title">
                  <Textarea v-model:value="state.formState.description" />
                </FormItem>
              </div>
            </Form>
            <div class="form-panel-btns">
              <Button type="link" size="large" @click="onSubmit">取消</Button>
              <Button block type="primary" size="large" @click="onSubmit">确认发布</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { state as configState } from '@/modules/config-module';
import QRCode from '@/components/common/QRCode.vue';
import { Button, CheckboxGroup, Form, FormItem, Image, Input, InputNumber, Modal, RangePicker, Textarea, Tooltip, message } from 'ant-design-vue';
import { QrcodeOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  /** 是否显示 */
  visible: {
    type: Boolean,
    default: false,
  },
});

const formRef = ref();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 用户信息 */
  userInfos: [
    { label: '姓名', value: 'name' },
    { label: '手机号', value: 'phone' },
    { label: '身份证号', value: 'idcard' },
    { label: '出生日期', value: 'birthday' },
    { label: '性别', value: 'gender' },
    { label: '籍贯', value: 'hometown' },
    { label: '民族', value: 'nationality' },
    { label: '现住址', value: 'address' },
  ],
  /** 身份验证方式 */
  validateTypes: [
    { label: '无需验证', value: 'none' },
    { label: '手机号验证', value: 'phone' },
    { label: '微信验证', value: 'wechat' },
    { label: '系统用户登录', value: 'wechat' },
  ],
  /** 发布表单项 */
  formState: {
    /** 描述 */
    description: '',
    /** 最大份数 */
    maxCopies: 0,
    /** 答题密码 */
    ansPassword: '',
    /** 发布时间 */
    publishDate: '',
    /** 是否发布到公共库 */
    isPublic: true,
    /** 日期范围 */
    dateRange: ['', ''] as [string, string],
    /** 验证方式 */
    validateTypes: ['none'],
    /** 必须用户信息 */
    requiredUserInfos: [],
  },
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
  (event: 'submit', val: Record<string, any>): void;
}>();

const rules = {};

const onClose = () => {
  emit('update:visible', false);
};

/** 提交 */
const onSubmit = () => {
  message.warning({
    content: '暂无发布功能',
  });
  throw new Error('暂无发布功能');
  // this.isLoading = true;
  // this.formRef
  //   .validate()
  //   .then(() => {
  //     post('/product/publish', {
  //       ...this.configState.config,
  //     })
  //       .then((d) => {
  //         this.publish().then((d) => {
  //           emit('update:visible', false);
  //           emit('submit', d);
  //         });
  //       })
  //       .finally(() => {
  //         this.isLoading = false;
  //       });
  //   })
  //   .catch((error) => {
  //     this.isLoading = false;
  //     console.error('error', error);
  //   });
};

watch(() => props.visible, (count, prevCount) => {
  if (count) {
    // get('/frontend/getproductById', {
    // }).then(({ data }) => {
    //   configModule.proMode = data.proMode;
    //   configModule.prevSaveTime = data.prevSaveTime;
    //   configModule.autoSave = data.autoSave;
    // })
  }
});
</script>

<style lang="less" scoped>
/** 发布面板 */
.publish-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  // 左侧预览窗口
  > .publish-panel-left {
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    width: 300px;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #e5e5e5;

    > :deep(.ant-image) {
      position: relative;
      width: 100%;
      height: 100%;

      > img {
        position: relative;
        object-fit: cover;
        height: 100%;
      }
    }
  }
  > .publish-panel-right {
    flex-grow: 1;
    flex-shrink: 1;
    width: 100%;
    margin-left: 25px;
  }
}
</style>
