<template>
  <!-- 图片预览 -->
  <template v-if="activeMenuFile?.type === FileType.image">
    <Image
      :style="{ display: 'none' }"
      :src="activeMenuFile?.previewSrc"
      :preview="{ visible: showPreview, onVisibleChange: setPreviewVisible }"
    />
  </template>
  <!-- video预览 -->
  <template v-else-if="activeMenuFile?.type === FileType.video || activeMenuFile?.type === FileType.audio">
    <Modal
      v-model:visible="showPreview"
      :body-style="{ padding: '0px 0px 0px 0px', width: '0', height: '0' }"
      :footer="null"
      :closable="false"
      :destroyOnClose="true"
      @cancel="setPreviewVisible(false)"
      wrapClassName="modal-preview"
    >
      <template v-if="activeMenuFile?.type === FileType.video">
        <video class="content-info" controls :src="activeMenuFile?.previewSrc"></video>
      </template>
      <template v-else><audio controls :src="activeMenuFile?.previewSrc" class="content-info"></audio> </template>
    </Modal>
  </template>
  <!-- pdf预览 -->
  <template v-else-if="activeMenuFile?.type === FileType.pdf">
    <Modal
      :visible="showPreview"
      :footer="null"
      :title="activeMenuFile?.key"
      wrapClassName="full-modal"
      width="100%"
      @cancel="setPreviewVisible(false)"
    >
      <iframe
        title="PDF"
        className="scrolling"
        scrolling="no"
        frameBorder="0"
        :src="activeMenuFile?.previewSrc"
        width="100%"
        height="100%"
      ></iframe>
    </Modal>
  </template>
</template>

<script lang="ts" setup>
import type { StorageFileInfo } from '@/modules/storage-module/index.d';
import { FileType } from '@/modules/storage-module/tools/fileTypeHandler';
import { Image, Modal } from 'ant-design-vue';
import { computed } from 'vue';

interface IProps {
  activeMenuFile: StorageFileInfo | undefined;
  visible: boolean;
}

interface IEmit {
  (e: 'update:visible', visible: boolean): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const showPreview = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const setPreviewVisible = (preview: boolean) => { showPreview.value = preview }

</script>
<style lang="less" scoped>
</style>