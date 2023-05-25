<template>
  <HakuDialog
    class="background-dialog"
    v-model:visible="backgroundEditorState.isShow"
    :drag="true"
    :title="backgroundEditorState.currentBackgroundTypeText"
    :body-style="{ width: '240px' }"
    :style="[backgroundEditorState.dialogCss, { width: '240px', left: 'initial' }]"
    @close="backgroundEditorState.isShow = false;"
  >
    <template #header-tools>
      
      <div
        class="haku-dialog-header-tool"
        title="混合模式"
        tabindex="-1"
        @click="state.showBlendModeSelect = !state.showBlendModeSelect"
        @blur="state.showBlendModeSelect = false"
      >
        <i class="iconfont icon-config3"></i>
        <SimpleSelect
          ref="colorTypeSelect"
          v-model:visible="state.showBlendModeSelect"
          :options="backgroundEditorState.blendModeList"
          v-model:value="backgroundEditorState.currentBackground.blendType"
        ></SimpleSelect>
      </div>
    </template>
    <!-- 背景类型选择 -->
    <div class="background-dialog-type-panel">
      <ul
        class="background-type-tabs"
        :style="{
          '--background-type-count': backgroundEditorState.backgroundTypeList.length,
          '--background-type-index': currentBackgroundTypeIndex
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
      <!-- 渐变 -->
      <div class="gradient-config" v-if="backgroundEditorState.currentBackground.type !== 'image' && backgroundEditorState.currentBackground.type !== 'color'">
        <GradientSlider
          v-model:gradient-background="backgroundEditorState.currentBackground"
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
      <TypeImagePicker
        v-else
        v-model:value="backgroundEditorState.currentBackground"
        @change="change"
      />
    </div>
  </HakuDialog>
</template>

<script lang="ts" setup>
import HakuDialog from '@/components/common/HakuDialog.vue';
import { reactive } from 'vue';
import TypeColorPicker from './type-color/TypeColorPicker.vue';
import TypeImagePicker from './type-image/TypeImagePicker.vue';
import SimpleSelect from './common/SimpleSelect.vue';
import type { AppBackground, AppBackgroundType, AppColor } from '../index.d';
import GradientSlider from './common/GradientSlider.vue';
import { state as backgroundEditorState, service as backgroundEditorService } from '../';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { computed } from 'vue';
import bus from '@/tools/bus';
import { AppType } from '@/@types/enum';

const emit = defineEmits<{
  (event: 'change', value: AppBackground): void;
}>();

const state = reactive({
  /** 混合模式下拉框是否显示 */
  showBlendModeSelect: false,
});

const currentBackgroundTypeIndex = computed(() => {
  return backgroundEditorState.backgroundTypeList.findIndex(i => i.name === backgroundEditorState.currentBackground.type);
})

const changeBackgroundType = (name: AppBackgroundType) => {
  backgroundEditorService.setBackgroundType(name, backgroundEditorService.getComponentAttrs());
  change();
};

const change = () => {
  if (backgroundEditorState.currentBackground.type === 'color') {
    backgroundEditorState.currentBackground.opacity = backgroundEditorState.currentBackground.color.a;
  }
  bus.$emit('background_editor_change');
  emit('change', backgroundEditorState.currentBackground);
}

const currentColor = computed<AppColor>({
  get() {
    if (backgroundEditorState.currentBackground.type === 'color') {
      return backgroundEditorState.currentBackground.color;
    } else if (backgroundEditorState.currentBackground.type === 'image') {
      return { r: 0, g: 0, b: 0, a: 0 };
    } else {
      if (backgroundEditorState.currentGradientItemIndex >= 0 && backgroundEditorState.currentGradientItemIndex < backgroundEditorState.currentBackground.gradientList.length - 1) {
        return backgroundEditorState.currentBackground.gradientList[backgroundEditorState.currentGradientItemIndex].color;
      } else {
        return { r: 0, g: 0, b: 0, a: 0 };
      }
    }
  },
  set(color: AppColor) {
    if (backgroundEditorState.currentBackground.type === 'color') {
      backgroundEditorState.currentBackground.color = color;
    } else if (backgroundEditorState.currentBackground.type === 'image') {
    } else {
      if (backgroundEditorState.currentGradientItemIndex >= 0) {
        backgroundEditorState.currentBackground.gradientList[backgroundEditorState.currentGradientItemIndex].color = color;
      }
    }
  }
});
</script>

<style lang="less" scoped>

.background-dialog-content {
  > .gradient-config {
    margin: 8px 0px;
  }
}

.background-dialog-type-panel {
  margin-bottom: 10px;
  
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
      }
    }
  }
}
</style>