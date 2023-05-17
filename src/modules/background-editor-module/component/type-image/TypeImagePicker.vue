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
          ref="colorTypeSelect"
          v-model:visible="state.showFillModeSelect"
          :options="state.fillModeList"
          v-model:value="currentBackground.fillMode"
        ></SimpleSelect>
      </div>
      <div class="image-picker-tool" tooltip="旋转90°" @click="rotate90">
        <i class="iconfont icon-refresh"></i>
      </div>
      <div class="image-picker-tool" tooltip="横向翻转" @click="flipHorizontal">
        <i class="iconfont icon-refresh"></i>
      </div>
      <div class="image-picker-tool" tooltip="竖向翻转" @click="flipVertical">
        <i class="iconfont icon-refresh"></i>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="image-picker-preview">
      <!-- 预览内容 -->
      <div class="image-picker-preview-content" :style="{
        backgroundImage: `url(${currentBackground.imageUrl})`,
        backgroundRepeat: getRepeat
      }">
        
      </div>
    </div>

    <!-- 尺寸调整区域 -->

    <hr style="border: none; border-top: 1px solid #F2F2F2; margin-bottom: 9px" />

    <!-- 特殊效果调整区域 -->
    <div class="image-special-effect-list">
      <div class="image-special-effect-item" v-for="item in state.specialEffectList">
        <span class="image-special-effect-label">{{ item.title }}</span>
        <Slider v-model:value="backgroundEditorState.currentBackground[item.code]" :min="item.min" :max="item.max" />
        <InputNumber :controls="false" size="small" type="number" v-model:value.number="backgroundEditorState.currentBackground[item.code]" />
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { reactive, PropType, onMounted, onUnmounted } from 'vue';
import SimpleSelect from '../common/SimpleSelect.vue';
import { state as backgroundEditorState, service as backgroundEditorService, defaultImage } from '../../';
import { InputNumber, Slider } from 'ant-design-vue';
import type { AppImageBackground } from '../../index.d';
import { computed } from 'vue';

const props = defineProps({
  /** 当前背景图 */
  value: {
    type: Object as PropType<AppImageBackground>,
    required: true
  },
});

const state = reactive({

  /** 是否显示填充模式下拉框 */
  showFillModeSelect: false,
  /** 填充模式 */
  fillModeList: [
    { value: 'none', label: '不处理' },
    { value: 'cover', label: '充满' },
    { value: 'contain', label: '适应' },
    { value: 'stretch', label: '拉伸' },
    { value: 'repeat', label: '平铺' },
    { value: 'repeat-x', label: '横向平铺' },
    { value: 'repeat-y', label: '纵向平铺' },
  ],

  /** 特殊效果列表 */
  specialEffectList: [
    { title: '亮度', code: 'brightness', min: -100, max: 100 },
    { title: '对比度', code: 'contrast', min: -100, max: 100, formatter: value => value / 100 },
    { title: '模糊', code: 'blur', min: -100, max: 100, unit: 'px' },
    { title: '灰度', code: 'grayscale', min: -100, max: 100, formatter: value => value / 100 },
    { title: '色调', code: 'hueRotate', min: -360, max: 360 },
    { title: '反相', code: 'invert', min: -100, max: 100, formatter: value => value / 100 },
    { title: '饱和度', code: 'saturate', min: -100, max: 100, formatter: value => value / 100 },
    { title: '深褐色', code: 'sepia', min: -100, max: 100, formatter: value => value / 100 },
  ]
});

const emit = defineEmits<{
  (event: 'change', value: AppImageBackground): void;
  (event: 'update:value', value: AppImageBackground): void;
  (event: 'update:colorType', value: "hex" | "rgb" | "hsl" | "hsv"): void;
}>();

const currentBackground = computed(() => {
  return backgroundEditorState.currentBackground as AppImageBackground;
});

const getRepeat = computed(() => {
  switch (currentBackground.value.fillMode) {
    case 'repeat': return 'repeat';
    case 'repeat-x': return 'repeat-x';
    case 'repeat-y': return 'repeat-y';
    default: return '';
  }
});

/** 获取填充模式标题 */
const fillTypeTitle = computed(() => {
  return state.fillModeList.find(i => i.value === currentBackground.value.fillMode)?.label ?? '-';
});

/** 图片旋转90° */
const rotate90 = () => {

};

/** 横向翻转 */
const flipHorizontal = () => {

};

/** 纵向翻转 */
const flipVertical = () => {

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
    height: 180px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQBAMAAAB8P++eAAAAGFBMVEXv7+/////+/v7////v7+/////v7+/w8PCSTbPxAAAABXRSTlPy8vLl5ZnZbUAAAAB/SURBVEjHY3BggAFFQSgQYsAUE2ZIg4H0UDgowyLGwEacwsBRhaMK6aowDaEwDQ6QFLKXQwGyiZhiQQyq+KQRYgUMovgsRIglICksw+atUYWjCumpkOiES3RWIDpzEciug6xIGVU4qnC0nhlVOKqQPIWhxClMYzDE1zlBiLEAAFzGa7yLS3ZOAAAAAElFTkSuQmCC);
    background-size: 40px 40px;
    background-repeat: repeat;

    > .image-picker-preview-content {
      position: absolute;
      display: block;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      border-radius: 4px;
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
        font-size: 13px;
        color: #666;
      }

      > .ant-slider {
        flex-grow: 1;
        flex-shrink: 1;
        width: 100%;
        margin-right: 15px;
      }

      > .ant-input-number {
        flex-grow: 0;
        flex-shrink: 0;
        width: 45px;
      }
    }
  }
}
</style>
