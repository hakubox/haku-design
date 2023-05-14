<template>
  <HakuDialog
    body-class="background-dialog"
    :visible="true"
    :drag="true"
    :title="backgroundEditorState.currentBackgroundTypeText"
  >
    <!-- 背景类型选择 -->
    <div class="background-dialog-type-panel">
      <ul
        class="background-type-tabs"
        :style="{
          '--background-type-count': backgroundEditorState.backgroundTypeList.length,
          '--background-type-index': backgroundEditorState.currentBackgroundTypeIndex
        }"
      >
        <li
          class="background-type-tab"
          :class="{ active: backgroundEditorState.currentBackground.type === item.name }"
          :title="item.title"
          v-for="item in backgroundEditorState.backgroundTypeList"
          @click="changeBackgroundType(item.name)"
          :style="{
            backgroundImage: `url(${item.url})`
          }"
        ></li>
      </ul>
    </div>
    <!-- 选择器内容区域 -->
    <div class="background-dialog-content">
      <!-- 线性渐变 -->
      <!-- 径向渐变 -->
      <div class="gradient-config" v-if="backgroundEditorState.currentBackground.type !== 'image' && backgroundEditorState.currentBackground.type !== 'color'">
        <GradientSlider
          v-model:cursor-list="backgroundEditorState.currentBackground.gradientList"
          v-model:current-cursor-index="backgroundEditorState.currentGradientItemIndex"
          @change="change"
        />
      </div>
      <!-- 纯色 -->
      <TypeColorPicker
        v-if="backgroundEditorState.currentBackground.type !== 'image'"
        v-model:value="currentColor"
        @change="change"
      />
    </div>
  </HakuDialog>
</template>

<script lang="ts" setup>
import message from '@/common/message';
import HakuDialog from '@/components/common/HakuDialog.vue';
import { reactive, type PropType } from 'vue';
import TypeColorPicker from './type-color/TypeColorPicker.vue';
import type { AppBackground, AppBackgroundType, AppColor, AppLinearGradientBackground, AppRadialGradientBackground, GradientItem } from '../index.d';
import GradientSlider from './common/GradientSlider.vue';
import { state as backgroundEditorState, service as backgroundEditorService } from '../';
import { computed } from 'vue';

const defaultImage = 'data:image/png;base64,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';

const props = defineProps({
  
});

const emit = defineEmits<{
  (event: 'change', value: AppBackground): void;
}>();

const state = reactive({
  /** 值 */
  // value: { type: 'color', color: { r: 255, g: 255, b: 255, a: 0 } } as AppBackground,
});

const changeBackgroundType = (name: AppBackgroundType) => {
  backgroundEditorService.setBackgroundType(name);
  change();
};

const change = () => {
  emit('change', backgroundEditorState.currentBackground);
}

const currentColor = computed<AppColor>({
  get() {
    if (backgroundEditorState.currentBackground.type === 'color') {
      return backgroundEditorState.currentBackground.color;
    } else if (backgroundEditorState.currentBackground.type === 'image') {
      return { r: 0, g: 0, b: 0, a: 0 };
    } else {
      return backgroundEditorState.currentBackground.gradientList[backgroundEditorState.currentGradientItemIndex].color;
    }
  },
  set(color: AppColor) {
    if (backgroundEditorState.currentBackground.type === 'color') {
      backgroundEditorState.currentBackground.color = color;
    } else if (backgroundEditorState.currentBackground.type === 'image') {
    } else {
      backgroundEditorState.currentBackground.gradientList[backgroundEditorState.currentGradientItemIndex].color = color;
    }
  }
});
</script>

<style lang="less" scoped>

:deep(.background-dialog) {
  width: 240px;
  
}

.background-dialog-content {
  > .gradient-config {
    margin: 18px 0px;
  }
}

.background-dialog-type-panel {
  margin-bottom: 12px;
  
  > .background-type-tabs {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0px;
    background-color: #F5F5F5;
    border-radius: 6px;

    &:before {
      content: '';
      position: absolute;
      display: block;
      left: calc(var(--background-type-index, 0) * 100% / var(--background-type-count, 1) + 1%);
      top: 8%;
      width: calc(100% / var(--background-type-count, 1) - 2%);
      height: 84%;
      background-color: white;
      border: 1px solid #CCC;
      box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.1);
      border-radius: 4px;
      transition: 0.15s left;
    }

    > .background-type-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      text-align: center;
      z-index: 1;
      transition: 0.15s color;
      background-position: center center;
      background-size: 16px 16px;
      background-repeat: no-repeat;

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      &.active {
        cursor: default;
        color: white;
        // background-color: rgba(51, 122, 183, 0.2);
      }
    }
  }
}
</style>