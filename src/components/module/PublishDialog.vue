<template>
  <div>
    <!-- 产品预览 -->
    <a-modal title="发布问卷" :width="1080" :visible="visible" :footer="false" @cancel="onClose" @ok="onSubmit">
      <div class="publish-panel">
        <div class="publish-panel-left">
          <a-image src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
        </div>
        <div class="publish-panel-right">
          <div class="design-form-panel cols-2">
            <a-form ref="formRef" autocomplete="off" layout="vertical" :model="formState">
              <div class="form-panel-content">
                <a-form-item class="form-item" label="发布地址">
                  <span
                    class="form-item-value-link"
                    style="display: inline-block; margin-right: 10px; vertical-align: middle"
                    >www.xxx.com/12345/123</span
                  >
                  <a-tooltip placement="bottom">
                    <template #title>
                      <QRCode :width="220" :height="220" :margin="0" value="www.xxx.com/12345/123" />
                    </template>
                    <QrcodeOutlined style="font-size: 18px" />
                  </a-tooltip>
                </a-form-item>
                <a-form-item class="form-item" label="当前版本号">
                  <span class="form-item-value-txt">V2</span>
                </a-form-item>
                <!-- <a-form-item class="form-item" label="是否发布到问卷库（需审核）" name="dateRange">
                  <a-switch v-model:checked="formState.isPublic" />
                </a-form-item> -->
                <a-form-item class="form-item" label="发布密码" name="ansPassword">
                  <a-input :allowClear="true" v-model:value="formState.ansPassword" />
                </a-form-item>
                <a-form-item class="form-item" label="填写问卷数上限（0为不设限）" name="maxCopies">
                  <a-input-number
                    :allowClear="true"
                    :min="0"
                    :max="1000000"
                    :precision="0"
                    v-model:value.number="formState.maxCopies"
                  >
                    <template #addonAfter>份</template>
                  </a-input-number>
                </a-form-item>
                <a-form-item class="form-item" label="答题日期范围" name="dateRange">
                  <a-range-picker
                    :allowClear="true"
                    style="width: 100%"
                    v-model:value="formState.dateRange"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
                <a-form-item class="form-item col-full" label="填写问卷是否需要身份验证">
                  <a-checkbox-group
                    v-model:value="formState.validateTypes"
                    name="checkboxgroup"
                    :options="validateTypes"
                  />
                </a-form-item>
                <a-form-item class="form-item col-full" label="需登记个人以下信息">
                  <a-checkbox-group
                    v-model:value="formState.requiredUserInfos"
                    name="checkboxgroup"
                    :options="userInfos"
                  />
                </a-form-item>
                <a-form-item class="form-item col-full" label="发布描述" name="title">
                  <a-textarea v-model:value="formState.description" />
                </a-form-item>
              </div>
            </a-form>
            <div class="form-panel-btns">
              <a-button type="link" size="large" @click="onSubmit">取消</a-button>
              <a-button block type="primary" size="large" @click="onSubmit">确认发布</a-button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, watch, computed } from 'vue';
import { state as configState, service as configService } from '@/common/config-module';
import QRCode from '@/components/common/QRCode.vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  components: {
    QRCode,
  },
  props: {
    /** 是否显示 */
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false);
    },
    /** 提交 */
    onSubmit() {
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
      //           this.$emit('update:visible', false);
      //           this.$emit('submit', d);
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
    },
  },
  created() {
    // get('/api/configs').then(({ data }) => {
    //   this.configModule = data;
    // });
  },
  mounted() {},
  setup(props) {
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
        dateRange: [] as string[],
        /** 验证方式 */
        validateTypes: ['none'],
        /** 必须用户信息 */
        requiredUserInfos: [],
      },
    });

    watch(
      () => props.visible,
      (count, prevCount) => {
        if (count) {
          // get('/frontend/getproductById', {
          // }).then(({ data }) => {
          //   configModule.proMode = data.proMode;
          //   configModule.prevSaveTime = data.prevSaveTime;
          //   configModule.autoSave = data.autoSave;
          // })
        }
      },
    );

    const rules = {};

    return {
      ...toRefs(state),
      configState,
      rules,
      formRef,
    };
  },
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
