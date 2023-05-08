<template>
  <!-- 产品预览 -->
  <ConfigProvider v-bind="globalState.antdConfigProvider">
    <Modal
      title="设置"
      :width="1080"
      :visible="configState.isOpen"
      :destroyOnClose="true"
      @cancel="onClose"
      @ok="onSubmit"
    >
      <Descriptions bordered :column="6" :labelStyle="{ width: '200px' }">
        <template #extra>
        </template>
        <!-- <DescriptionsItem label="服务状态" :span="6">
          <Badge status="processing" text="运行中" />
        </DescriptionsItem> -->
        <DescriptionsItem label="自动保存" :span="2">
          <Switch v-model:checked="configState.config.autoSave" checked-children="是" un-checked-children="否" />
        </DescriptionsItem>
        <DescriptionsItem label="自动保存时间" :span="4">
          <RadioGroup v-model:value="configState.config.autoSaveDuration" :disabled="!configState.config.autoSave">
            <RadioButton :value="10">10分钟</RadioButton>
            <RadioButton :value="30">30分钟</RadioButton>
            <RadioButton :value="60">1小时</RadioButton>
          </RadioGroup>
        </DescriptionsItem>
        <DescriptionsItem label="显示欢迎界面" :span="2">
          <Switch v-model:checked="configState.config.showWelcome" checked-children="是" un-checked-children="否" />
        </DescriptionsItem>
        <DescriptionsItem label="操作模式" :span="4">
          <RadioGroup v-board-key="'config-handle-mode'" v-model:value="configState.config.proMode">
            <RadioButton value="easy">简易模式</RadioButton>
            <RadioButton value="normal">普通模式</RadioButton>
            <RadioButton value="advanced" :disabled="true">高级模式</RadioButton>
            <RadioButton value="engineering" :disabled="true">工程模式</RadioButton>
          </RadioGroup>
        </DescriptionsItem>
        <DescriptionsItem label="可配置额外属性" :span="2">
          <Switch v-model:checked="configState.config.showAttaProps" checked-children="是" un-checked-children="否" />
        </DescriptionsItem>
        <DescriptionsItem label="文件相关" :span="4">
          <Button type="primary" @click="storageService.checkFileDependent" style="margin-right: 20px;">检测依赖项</Button>
          <Button type="primary" danger @click="storageService.removeAllFile">移除所有文件依赖</Button>
        </DescriptionsItem>
      </Descriptions>
    </Modal>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { state as configState } from '@haku-design/config';
import { service as storageService } from '@/modules/storage-module';
import { Badge, Button, Descriptions, DescriptionsItem, Modal, RadioButton, RadioGroup, Switch, ConfigProvider } from "ant-design-vue";
import { state as globalState } from '@haku-design/global';
import { vBoardKey } from '@/directives';

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  visible: true,
});

const emit = defineEmits<{
  (event: 'update:visible', isShow: boolean): void;
  (event: 'close'): void;
}>();

/** 记录媒体信息的缓存KEY */
const ConfigStorageKey = '__hakuform__config__';

const onClose = () => {
  configState.isOpen = false;
  setTimeout(() => emit('close'), 600);
};
const onSubmit = () => {
  state.isLoading = true;
  localStorage.setItem(ConfigStorageKey, JSON.stringify(configState.config));
  // this.formRef.validate().then(() => {
  //   post('/product/editproduct', {
  //     ...this.configState.config
  //   }).then(d => {
  //     this.$emit('update:visible', false);
  //     this.$emit('submit', d);
  //   }).finally(() => {
  //     this.isLoading = false;
  //   });
  // }).catch((error) => {
  //   this.isLoading = false;
  //   console.error('error', error);
  // });
  onClose();
};
</script>

<style lang="less" scoped>
  .ant-descriptions-header {
    margin-bottom: 0px;
  }
</style>