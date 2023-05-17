<template>
  <Modal class="file-attribute-modal-container" title="文件属性" v-model:visible="visible" @ok="onOk">
    <Descriptions bordered :column="1" size="small">
      <DescriptionsItem
        v-for="{ label, value } in fileAttributeList"
        :key="label"
        :label="label"
        :labelStyle="{ width: '100px' }"
      >
        {{ value }}
      </DescriptionsItem>
    </Descriptions>
  </Modal>
</template>

<script lang="ts" setup>
/** 查看文件属性弹窗 */
import { computed, type PropType } from 'vue';
import { Descriptions, DescriptionsItem, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
import { FileType } from '../../../../../tools/fileTypeHandler';
import { parseByte } from '../../../tools/transFileSize';
import type { StorageFileInfo } from '../../../../../index.d';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  fileItem: {
    type: Object as PropType<StorageFileInfo>,
    default: () => ({}),
  },
});

const emits = defineEmits<{ (e: 'update:visible', value: boolean): void }>();

const visible = computed({
  get: () => props.visible,
  set: (value) => {
    emits('update:visible', value);
  },
});

// 文件夹相关属性
const dirAttributeMap: { [key in keyof StorageFileInfo]?: string } = {
  name: '文件名称',
  updateTime: '修改日期',
  remark: '描述',
};

// 文件相关属性
const fileAttributeMap: { [key in keyof StorageFileInfo]?: string } = {
  src: '链接地址',
  name: '文件名称',
  suffix: '文件类型',
  fileSize: '文件大小',
  updateTime: '修改日期',
  remark: '文件描述',
  tags: '文件标签',
  timeLength: '视频时长',
};

// 格式化视频时长
const parseTimeLength = (ms: number) => {
  const second = Math.floor(ms / 1000);
  const minute = Math.floor(second / 60);
  const hour = Math.floor(minute / 60);

  if (hour) {
    return `${hour}小时 ${minute % 60}分 ${second % 60}秒`;
  } else if (minute) {
    return `${minute}分 ${second % 60}秒`;
  } else {
    return `${second}秒`;
  }
};

// 文件属性label - value列表
const fileAttributeList = computed(() => {
  const keys = Object.keys(props.fileItem.type === FileType.dir ? dirAttributeMap : fileAttributeMap);

  return keys
    .map((k) => {
      if (props.fileItem[k] !== undefined) {
        if (k === 'fileSize') {
          return {
            label: fileAttributeMap[k],
            value: parseByte(props.fileItem[k]),
          };
        }
        if (k === 'updateTime') {
          return {
            label: fileAttributeMap[k],
            value: dayjs(props.fileItem[k]).format('YYYY-MM-DD HH:mm:ss'),
          };
        }
        if (k === 'timeLength' && props.fileItem[k] !== 0) {
          return {
            label: fileAttributeMap[k],
            value: parseTimeLength(props.fileItem[k] as number),
          };
        }
        return {
          label: fileAttributeMap[k],
          value: props.fileItem[k],
        };
      }
    })
    .filter((item) => item?.value) as { label: string; value: string }[];
});

const onOk = () => emits('update:visible', false);
</script>
<style lang="less" scoped></style>
