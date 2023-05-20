<template>
  <div class="image-picker">

    <div class="image-picker-tools">
      <div
        class="image-picker-select"
        title="填充模式"
        tabindex="-1"
        @click="state.showFillModeSelect = !state.showFillModeSelect"
        @blur="state.showFillModeSelect = false"
      >
        {{ fillTypeTitle }}
        <SimpleSelect
          v-model:visible="state.showFillModeSelect"
          :options="backgroundEditorState.fillModeList"
          v-model:value="props.value.fillMode"
          @change="changeFillMode"
        ></SimpleSelect>
      </div>
      <div class="image-picker-tool" tooltip="旋转90°" @click="rotate90">
        <i class="iconfont icon-rotate-90"></i>
      </div>
      <div class="image-picker-tool" tooltip="横向翻转" @click="flipHorizontal">
        <i class="iconfont icon-flip-horizontal"></i>
      </div>
      <div class="image-picker-tool" tooltip="竖向翻转" @click="flipVertical">
        <i class="iconfont icon-flip-vertical"></i>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="image-picker-preview">
      <!-- 预览内容 -->
      <div class="image-picker-preview-content" :style="[state.imageStyle, { filter: state.imageFilter }]">
        <div class="image-picker-preview-image" ref="previewImageEl"></div>
      </div>
      <div class="image-picker-preview-upload" @click="selectImage()">
        <div class="image-picker-preview-upload-btn">选择图片...</div>
      </div>
    </div>

    <!-- 尺寸调整区域 -->

    <hr style="border: none; border-top: 1px solid #F2F2F2; margin-bottom: 9px" />

    <!-- 特殊效果调整区域 -->
    <div class="image-special-effect-list">
      <div class="image-special-effect-item" v-for="item in backgroundEditorState.specialEffectList">
        <span class="image-special-effect-label">{{ item.title }}</span>
        <Slider @change="changeImageFilter" v-model:value="backgroundEditorState.currentBackground[item.code]" :min="item.min" :max="item.max" />
        <InputNumber @change="changeImageFilter" :controls="false" size="small" type="number" v-model:value.number="backgroundEditorState.currentBackground[item.code]" />
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { reactive, PropType, onMounted, onUnmounted, ref, nextTick, type StyleValue } from 'vue';
import SimpleSelect from '../common/SimpleSelect.vue';
import { state as backgroundEditorState, service as backgroundEditorService, defaultImage } from '../../';
import { InputNumber, Slider } from 'ant-design-vue';
import type { AppImageBackground } from '../../index.d';
import { computed } from 'vue';
import { openFileDialog, throttle } from '@/tools/common';
import { toast } from '@/common/message';

const previewImageEl = ref<HTMLElement>();

const previewImage = new Image();

const props = defineProps({
  /** 当前背景图 */
  value: {
    type: Object as PropType<AppImageBackground>,
    required: true
  },
});

const emit = defineEmits<{
  (event: 'change'): void;
  (event: 'update:value', value: AppImageBackground): void;
  (event: 'update:colorType', value: "hex" | "rgb" | "hsl" | "hsv"): void;
}>();

const state = reactive({
  /** 是否显示填充模式下拉框 */
  showFillModeSelect: false,
  /** 图片样式 */
  imageStyle: {} as StyleValue,
  /** 图片特效 */
  imageFilter: '',
});

/** 选择图片 */
const selectImage = () => {
  openFileDialog({
    accept: 'image/*',
  }).then(file => {
    if (file) {
      if (file?.size > 1024 * 1024 * 2) {
        toast('选择的图片不能大于2mb');
        return;
      }
      changeFillMode();
      var reader = new FileReader();
      reader.onload = function() {
        if (typeof this.result === 'string') {
          setImageUrl(this.result);
          props.value.imageUrl = this.result;
        } else {
          toast('图片识别出错');
        }
      };
      reader.readAsDataURL(file as Blob);
    }
  });
};

/** 修改图像特效 */
const changeImageFilter = throttle(() => {
  state.imageFilter = backgroundEditorService.getImageFilter(props.value);
  nextTick(() => emit('change'));
}, 50);

/** 切换填充模式 */
const changeFillMode = () => {
  state.imageStyle = backgroundEditorService.getFillMode(props.value);
  nextTick(() => emit('change'));
};

/** 设置图片Url */
const setImageUrl = (url: string) => {
  previewImage.onload = resetImgStyle;
  previewImage.src = url;
}

const resetImgStyle = () => {
  if (!previewImageEl.value) {
    toast('未找到对应的图片DOM节点');
    console.error('未找到对应的图片DOM节点');
    return;
  }
  let _img = AlloyImage(previewImage);
  nextTick(() => {
    if (props.value.rotate) _img = _img.rotate(props.value.rotate);
    if (props.value.xFlipOver) _img = _img.transform([-1, 0, 0, 1, 0, 0]);
    if (props.value.yFlipOver) _img = _img.transform([1, 0, 0, -1, 0, 0]);

    previewImageEl.value!.style.backgroundImage = `url(${_img.save()})`;
    props.value.imageUrl = previewImageEl.value!.style.backgroundImage;
    emit('change');
  });
}

/** 获取填充模式标题 */
const fillTypeTitle = computed(() => {
  return backgroundEditorState.fillModeList.find(i => i.value === props.value.fillMode)?.label ?? '-';
});

/** 图片旋转90° */
const rotate90 = () => {
  props.value.rotate = (props.value.rotate + 90) % 360;
  resetImgStyle();
};

/** 横向翻转 */
const flipHorizontal = () => {
  props.value.xFlipOver = !props.value.xFlipOver;
  resetImgStyle();
};

/** 纵向翻转 */
const flipVertical = () => {
  if (previewImageEl.value) {
  props.value.yFlipOver = !props.value.yFlipOver;
  resetImgStyle();
  }
};

onMounted(() => {
});

onUnmounted(() => {
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

// 图片选择器

.image-picker {

  > .image-picker-tools {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    > .image-picker-select {
      position: relative;
      cursor: pointer;
      flex-shrink: 1;
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 29px;
      background-color: #F0F0F0;
      padding: 0px 10px;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 15px;

      &:after {
        content: '\e641';
        position: relative;
        font-family: "iconfont" !important;
        font-size: 12px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }

    > .image-picker-tool {
      position: relative;
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 26px;
      height: 26px;
      padding: 4px;
      border-radius: 4px;
      transition: 0.15s;

      > .iconfont {
        font-size: 18px;
      }

      &:hover {
        background-color: rgba(0,0,0,0.08);

        &:before {
          transform: translate(25%, 0px);
          opacity: 1.0;
          visibility: visible;
          z-index: 9;
        }

        &:after {
          transform: translate(-50%, 0px) rotate(45deg);
          opacity: 1.0;
          visibility: visible;
          z-index: 8;
        }
      }

      &:before {
        content: attr(tooltip);
        pointer-events: none;
        position: absolute;
        bottom: calc(100% + 6px);
        right: 0%;
        transform: translate(25%, 4px);
        display: inline-block;
        visibility: hidden;
        opacity: 0.0;
        padding: 3px 10px;
        background-color: #333333;
        color: white;
        border-radius: 4px;
        transition: 0.15s;
        font-size: 12px;
        font-weight: normal;
        white-space: nowrap;
        z-index: 0;
      }

      &:after {
        content: '';
        pointer-events: none;
        position: absolute;
        display: block;
        bottom: calc(100% + 3px);
        right: calc(50% - 7px);
        width: 8px;
        height: 8px;
        border-radius: 2px;
        transform: translate(-50%, 4px) rotate(45deg);
        visibility: hidden;
        opacity: 0.0;
        background-image: linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(51,51,51,1) 51%);
        transition: 0.18s;
        z-index: -1;
      }

      + .image-picker-tool {
        margin-left: 6px;
      }
    }
  }

  // 预览区域
  > .image-picker-preview {
    position: relative;
    display: block;
    border: 1px solid #EEE;
    border-radius: 4px;
    height: 160px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQBAMAAAB8P++eAAAAGFBMVEXv7+/////+/v7////v7+/////v7+/w8PCSTbPxAAAABXRSTlPy8vLl5ZnZbUAAAAB/SURBVEjHY3BggAFFQSgQYsAUE2ZIg4H0UDgowyLGwEacwsBRhaMK6aowDaEwDQ6QFLKXQwGyiZhiQQyq+KQRYgUMovgsRIglICksw+atUYWjCumpkOiES3RWIDpzEciug6xIGVU4qnC0nhlVOKqQPIWhxClMYzDE1zlBiLEAAFzGa7yLS3ZOAAAAAElFTkSuQmCC);
    background-size: 40px 40px;
    background-repeat: repeat;
    overflow: hidden;

    &:hover {
      > .image-picker-preview-upload {
        opacity: 1.0;
        visibility: visible;
      }
    }

    > .image-picker-preview-upload {
      cursor: default;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0.0;
      transition: 0.15s;
      background-color: rgba(210,210,210,0.3);
      visibility: visible;

      > .image-picker-preview-upload-btn {
        cursor: pointer;
        display: inline-block;
        color: white;
        background-color: @primary-color;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 13px;
      }
    }

    > .image-picker-preview-content {
      position: absolute;
      display: block;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      border-radius: 4px;

      > .image-picker-preview-image {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;

        background-repeat: var(--image-repeat);
        background-position: var(--image-position);
        background-size: var(--image-size);
        transform: var(--image-transform);
      }
    }
  }

  > .image-special-effect-list {
    display: block;

    > .image-special-effect-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      > .image-special-effect-label {
        flex-grow: 0;
        flex-shrink: 0;
        width: 50px;
        font-size: 12px;
        color: #666;
      }

      > .ant-slider {
        flex-grow: 1;
        flex-shrink: 1;
        width: 100%;
        margin: 8px 0px;
        margin-right: 15px;
      }

      > .ant-input-number {
        flex-grow: 0;
        flex-shrink: 0;
        width: 40px;
        font-size: 12px;
      }
    }
  }
}
</style>
