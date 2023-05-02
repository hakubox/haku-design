<template>
  <div class="upload-progress-container">
    <div class="upload-progress-item" v-for="item in progressState" :key="item.filename">
      <svg class="item-icon" aria-hidden="true">
        <use :xlink:href="`#${getFileIconByFileType(getFileType(item.filename))}`"></use>
      </svg>
      <div class="item-info">
        <span>{{ item.filename }}</span>
        <Progress :percent="Math.round(item.progress.percent * 100)" />
        <span>{{ item.progress.speed ? parseByte(item.progress.speed ?? 0) + '/s' : '上传准备中' }}</span>
      </div>
      <div class="item-actions">
        <CaretRightOutlined v-if="item.isPaused" @click="onResume(item)" />
        <PauseOutlined v-else @click="onPause(item)" />
        <CloseOutlined @click="onCancel(item)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 全局文件下载进度
 */
import { Modal, Progress } from 'ant-design-vue';
import { getFileType, getFileIconByFileType } from '@/modules/storage-module/tools/fileTypeHandler';
import { parseByte } from '../tools/transFileSize';
import { ProgressState } from '../hooks/useFile';
import { CaretRightOutlined, PauseOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';

const props = defineProps<{ globalUploadProgressState: ProgressState }>();
const emit = defineEmits<{ (e: 'update:globalUploadProgressState', value: ProgressState): void }>();

const progressState = computed({
  get: () => props.globalUploadProgressState,
  set: (value) => emit('update:globalUploadProgressState', value),
});

const onPause = (state: ProgressState[0]) => {
  state.isPaused = true;
  state.pause();
};

const onResume = (state: ProgressState[0]) => {
  state.isPaused = false;
  state.resume();
};

const onCancel = (state: ProgressState[0]) => {
  Modal.confirm({
    title: '取消上传',
    content: '是否取消文件：' + state.filename + ' 的上传?',
    onOk: state.cancel,
  });
};
</script>
<style lang="less" scoped>
.upload-progress-container {
  .upload-progress-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #efefef71;
    }
    .item-icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      line-height: 12px;
      overflow: hidden;
      > :first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .item-actions {
      margin-left: 10px;
      > :first-child {
        padding-right: 5px;
      }
    }
  }
}
</style>
