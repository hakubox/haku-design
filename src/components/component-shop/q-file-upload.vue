<template>
  <ComponentBasic class="component-photograph" :class="`component-photograph-${type}`" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <Uploader
      class="q-photograph"
      :preview-size="size"
      :capture="($attrs.capture as string)"
      :accept="getAccept"
      v-model="state.fileList"
      :image-fit="'cover'"
      :max-count="count"
      :upload-icon="getUploadIcon"
    >
      <div class="component-photograph-upload">
        <div class="component-photograph-upload-video" v-if="props.type === 'camcorder'">
          录像
        </div>
        <div class="component-photograph-upload-camera" v-else-if="props.type === 'camera'">
          拍照
        </div>
        <div class="component-photograph-upload-microphone" v-else-if="props.type === 'microphone'">
          录音
        </div>
        <div class="component-photograph-upload-file" v-else-if="props.type === 'file'">
          选择文件
        </div>
      </div>
      <template #preview-cover="{ file }">
        <div class="component-photograph-preview" @click="print(file)">
          <div class="component-photograph-preview-camcorder" v-if="props.type === 'camcorder'">
            <video controls :src="getSrc(file)"></video>
          </div>
          <div class="component-photograph-preview-camera" v-else-if="props.type === 'camera'">
            <img :src="getSrc(file)" />
          </div>
          <div v-else-if="props.type === 'microphone'">
            录音
          </div>
          <div v-else-if="props.type === 'file'">
            选择文件
          </div>
          <div class="component-photograph-preview-label">{{ file.name }}</div>
        </div>
      </template>
    </Uploader>
    <ImagePreview v-model:show="state.showPreview" :images="state.images" @change="onChangePreview">
      <template #index="{ index }">第{{ index }}页</template>
      <template #cover>
        <div>AAAAA</div>
      </template>
    </ImagePreview>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { onMounted, PropType, reactive, computed } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { ImagePreview, Uploader } from 'vant';

const props =  defineProps({
  /** 内边距 */
  padding: {
    type: Array as PropType<any>,
    default: () => [0, 0, 0, 0] as [number, number, number, number],
  },
  /** 大小 */
  size: {
    type: String,
    default: '100px',
  },
  /** 最大图片数量 */
  count: {
    type: Number,
    default: 1,
  },
  /** 功能 */
  type: {
    type: String,
    default: 'camcorder'
  }
});

const state = reactive({
  /** 文件列表 */
  fileList: [] as Record<string, any>[],
  /** 显示预览 */
  showPreview: false,
  /** 图片 */
  images: [],
});

const onChangePreview = (index) => {

};

const print = (context) => {
  console.log(context);
}

/** 获取地址 */
const getSrc = (file: File) => {
  return URL.createObjectURL(file);
}

const getAccept = computed(() => {
  switch (props.type) {
    case 'camera':
      return 'image/*';
    case 'camcorder':
      return 'video/*';
    case 'microphone':
      return 'audio/*';
    case 'file':
      return '*/*';
    default:
      return '';
  }
})
const getUploadIcon = computed(() => {
  switch (props.type) {
    case 'camera':
      return 'photograph';
    case 'camcorder':
      return 'video';
    case 'microphone':
      return 'music';
    case 'file':
      return 'add-square';
    default:
      return '';
  }
});

onMounted(() => {
});
</script>

<style lang="less" scoped>
.component-photograph {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  :deep(.van-uploader) {
    display: flex;
    width: 100%;

    > .van-uploader__wrapper {
      flex-grow: 1;
      width: 100%;

      > .van-uploader__input-wrapper {
        width: 100%;
      }

      > .van-uploader__preview {
        width: 100%;

        > .van-uploader__file {
          width: 100% !important;
          height: auto !important;

          > .van-icon-description {
            display: none;
          }
          > .van-uploader__file-name {
            display: none;
          }
        }

        > .van-image {
          width: 100% !important;
          height: auto !important;

          > img {
            width: 100% !important;
            height: auto !important;
            max-width: 400px;
            visibility: hidden;
          }
        }
      }
    }
  }

  .component-photograph-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 300px;
    aspect-ratio: 4 / 3;
    max-width: 400px;
    background-color: #F5F7FB;
    border-radius: 6px;
  }

  :deep(.van-uploader__preview-delete) {
    display: none;
  }

  .component-photograph-preview {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    max-width: 400px;
    border-radius: 6px;
    background-color: #F7F8FA;

    > .component-photograph-preview-camcorder {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      width: 100%;
      height: auto;

      > video {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }

    > .component-photograph-preview-camera {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      width: 100%;
      height: auto;

      > img {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }

    > .component-photograph-preview-label {
      margin-top: 6px;
    }
  }
}
.q-photograph {
}
</style>
