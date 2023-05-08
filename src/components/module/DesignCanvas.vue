<template>
  <div
    class="form-canvas"
    :class="{
      preview: props.isPreview,
      pc: editorState.appConfig.designConfig.deviceType == 'pc',
      mobile: editorState.appConfig.designConfig.deviceType == 'mobile',
    }"
    ref="formCanvas"
  >
    <!-- 全屏区域 -->
    <div class="form-canvas-full-screen-panel" v-if="props.isPreview">
      <FormDesignComponent
        v-for="(component, index) in currentPage.children.filter(
          (i) => i.attrs.isFullScreen && i.attrs.visible !== false,
        )"
        v-show="!isPreview"
        :component-id="component.id"
        :isPreview="props.isPreview"
        :dragConfig="dragConfig"
        :children="component.children"
        :component="component"
        :key="index"
        :index="index"
        :isFullScreen="props.isPreview ? true : false"
      >
        {{ component }}
      </FormDesignComponent>
    </div>

    <div class="form-canvas-body">
      <div
        style="padding-top: 7px"
        v-if="
          editorState.appConfig.questionnaireConfig.showPageProgress &&
          currentPage.pageType === 'normal-page' &&
          props.isPreview &&
          editorState.appConfig.questionnaireConfig.turnPageMode !== 'no-page' &&
          editorState.maxFormPageCount > 1
        "
      >
        <Progress
          :pivot-text="editorState.currentFormPageIndex + 1 + '/' + editorState.maxFormPageCount"
          color="linear-gradient(to right, #be99ff, #7232dd)"
          :percentage="(editorState.currentFormPageIndex / (editorState.maxFormPageCount - 1)) * 100"
        />
      </div>

      <!-- 置顶区域 -->
      <div class="form-canvas-is-top-panel" v-if="props.isPreview">
        <FormDesignComponent
          v-for="(component, index) in currentPage.children.filter(
            (i) => i.attrs.isTop && i.attrs.visible !== false,
          )"
          :component-id="component.id"
          :isPreview="props.isPreview"
          :dragConfig="dragConfig"
          :children="component.children"
          :component="component"
          :key="index"
          :index="index"
          :isFullScreen="false"
        >
          {{ component }}
        </FormDesignComponent>
      </div>
      <div
        ref="form-canvas-mainpanel"
        class="form-canvas-mainpanel"
        :class="{
          'type-flex': editorState.appConfig.appType === AppType.questionnaire,
          'type-canvas': editorState.appConfig.appType === AppType.canvas,
          readonly: props.isReadonly,
          printmode: props.isPrint
        }"
        :style="{ height: '100%', minHeight: props.isPreview ? 'initial' : editorState.appConfig.canvasConfig.deviceType == 'pc' ? '700px' : '687px' }"
      >
        <CanvasNodeActionEditor :global="true" :disabledRotate="true"
          v-if="editorState.appConfig.appType === AppType.canvas && !isPreview"
          :components="editorState.currentSelectedComponents"
          :show="editorState.currentSelectedComponents.length > 1"
        />

        <FormDesignComponent
          v-for="(component, index) in currentPage.children.filter(
            (i) => !props.isPreview || (props.isPreview && !i.attrs.isTop && i.attrs.visible !== false),
          )"
          v-show="!props.isPreview || editorService.showComponentInFormPage(component.id, props.pageIndex)"
          :component-id="component.id"
          :isPreview="props.isPreview"
          :class="{
            'form-component-layout': ['complex', 'layout'].includes(!component.isGroup ? component.type : '-'),
            active:
              !props.isPreview &&
              editorState.currentSelectedComponents.find(i => i.id === component.id),
              'is-drag': dragConfig && dragConfig.targetFormComponentId == component.id,
          }"
          :dragConfig="dragConfig"
          :children="component.children"
          :component="component"
          :key="index"
          :index="index"
          :isFullScreen="false"
        >
          {{ component }}
        </FormDesignComponent>
      </div>

      <div
        v-if="
          props.isPreview &&
          showButton &&
          editorState.appConfig.appType === AppType.questionnaire &&
          editorState.appConfig.questionnaireConfig.showPageButton !== false &&
          currentPage.pageType === 'normal-page'
        "
        class="fixed-bottom"
      >
        <div class="fixed-bottom-content" v-if="editorState.appConfig.questionnaireConfig.turnPageMode">
          <Button
            v-if="editorState.currentFormPageIndex > 0"
            block
            type="default"
            size="large"
            @click="editorService.prevPage()"
          >上一页</Button>
          <Button
            v-if="editorState.currentFormPageIndex < editorState.maxFormPageCount - 1"
            block
            type="primary"
            size="large"
            @click="editorService.nextPage()"
          >下一页</Button>
          <Button
            v-if="editorState.currentFormPageIndex == editorState.maxFormPageCount - 1"
            block
            type="primary"
            size="large"
            @click="submitForm()"
          >{{ editorState.appConfig.questionnaireConfig.footer.submitButtonText }}</Button>
        </div>
        <div class="fixed-bottom-content" v-else>
          <Button
            block
            v-if="editorState.appConfig.questionnaireConfig.footer.resetButton"
            type="default"
            size="large"
            @click="resetForm()"
          >{{ editorState.appConfig.questionnaireConfig.footer.resetButtonText }}</Button>
          <Button v-if="props.isPreview" block type="primary" size="large" @click="submitForm()">{{
            editorState.appConfig.questionnaireConfig.footer.submitButtonText
          }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppType } from '@haku-design/core';
import { reactive, PropType, onMounted, nextTick, ref, provide, computed } from 'vue';
import { Button, Progress } from 'ant-design-vue';
import { state as editorState, service as editorService } from '@haku-design/editor';
import { service as eventService } from '@haku-design/event';
import { service as formFillService } from '@haku-design/form-fill';
import { DragConfig } from '@/modules/draggable-module/@types';
import { EventTriggerType } from '@haku-design/event';
import FormDesignComponent from './FormDesignComponent.vue';
import CanvasNodeActionEditor from '@/components/common/CanvasNodeActionEditor.vue';
import { message } from '@haku-design/common';

const props = defineProps({
  /** 拖拽状态 */
  dragConfig: {
    type: Object as PropType<DragConfig>,
  },
  /** 显示调试器 */
  showEditor: {
    type: Boolean,
    default: true,
  },
  /** 显示按钮 */
  showButton: {
    type: Boolean,
    default: true,
  },
  /** 是否为预览状态 */
  isPreview: {
    type: Boolean,
    default: false,
  },
  /** 是否为只读状态 */
  isReadonly: {
    type: Boolean,
    default: false,
  },
  /** 是否为打印状态 */
  isPrint: {
    type: Boolean,
    default: false,
  },
  /** 默认页面索引 */
  pageIndex: {
    type: Number,
  }
});

const emit = defineEmits<{
  (event: 'refresh'): void;
}>();

/** 获取当前页面索引 */
const currentPageIndex = computed(() => {
  return props.pageIndex ?? editorState.currentPageIndex;
});

/** 获取当前页面 */
const currentPage = computed(() => {
  return editorState.pages[currentPageIndex.value];
});

const state = reactive({});

/** 根DOM节点 */
const formCanvas = ref<HTMLElement>();

/** 将是否打印状态传递下去 */
provide('isPrint', props.isPrint);

/** 表单刷新 */
const refresh = () => {
  editorState.rootPanelEl = formCanvas.value!.querySelector('.form-canvas-mainpanel');
  emit('refresh');
};

/** 提交表单（模拟） */
const submitForm = () => {
  if (props.isPreview) {
    formFillService.submitForm().then(({ isComplete }) => {
      if (isComplete) {
        eventService.emit(EventTriggerType.submitForm);
        message.toast('问卷填写完成', 'success');
        editorService.nextAppPage();
      }
    });
  }
};

/** 重置表单 */
const resetForm = () => {
  if (props.isPreview) {
    formFillService.clearForm();
    eventService.emit(EventTriggerType.resetForm);
  }
};

onMounted(() => {
  editorState.componentCursorEl.classList.add('form-canvas-cursor');
  editorState.rootPanelEl = formCanvas.value!.querySelector('.form-canvas-mainpanel');
  nextTick(() => refresh());

  if (editorState.getTimerConfig.isOpen) {
    if (editorState.getTimerConfig.isAutoTiming) formFillService.startTime();
  }
  if (editorState.appConfig.designConfig.isInit && editorState.appConfig.id) {
    editorService.setOperationRecord();
  }
});

defineExpose({
  formFillService
});
</script>

<style lang="less">
@import '/src/assets/less/variable.less';
</style>
