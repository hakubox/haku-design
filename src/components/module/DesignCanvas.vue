<template>
  <div
    class="form-canvas"
    :class="{
      preview: props.isPreview,
      pc: editorState.appConfig.deviceType == 'pc',
      mobile: editorState.appConfig.deviceType == 'mobile',
    }"
    ref="formCanvas"
  >
    <!-- 全屏区域 -->
    <div class="form-canvas-full-screen-panel" v-if="props.isPreview">
      <FormDesignComponent
        v-for="(component, index) in editorState.currentPage.children.filter(
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
          editorState.appConfig.showPageProgress &&
          editorState.currentPage.pageType === 'normal-page' &&
          props.isPreview &&
          editorState.appConfig.turnPageMode !== 'no-page' &&
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
          v-for="(component, index) in editorState.currentPage.children.filter(
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
        :class="{ readonly: props.isReadonly, printmode: props.isPrint }"
        :style="{ minHeight: props.isPreview ? 'initial' : editorState.appConfig.deviceType == 'pc' ? '700px' : '687px' }"
      >
        <FormDesignComponent
          v-for="(component, index) in editorState.currentPage.children.filter(
            (i) => !props.isPreview || (props.isPreview && !i.attrs.isTop && i.attrs.visible !== false),
          )"
          v-show="!props.isPreview || editorService.showComponentInFormPage(component.id)"
          :component-id="component.id"
          :isPreview="props.isPreview"
          :class="{
            'form-component-layout': ['complex', 'layout'].includes(component.type),
            active:
              !props.isPreview &&
              editorState.currentSelectedComponent &&
              editorState.currentSelectedComponent.id == component.id,
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
        <!-- <template v-if="isPreview">
          <component
            :is="component.component"
            v-for="(component, index) in editorState.children"
            :component-id="component.id"
            :key="'hidden_' + index"
          />
        </template> -->
      </div>

      <div
        v-if="
          props.isPreview &&
          showButton &&
          editorState.appConfig?.showPageButton !== false &&
          editorState.currentPage.pageType === 'normal-page'
        "
        class="fixed-bottom"
      >
        <div class="fixed-bottom-content" v-if="editorState.appConfig.turnPageMode">
          <Button
            v-if="editorState.currentFormPageIndex > 0"
            block
            type="default"
            size="large"
            @click="editorService.prevPage()"
            >上一页</Button
          >
          <Button
            v-if="editorState.currentFormPageIndex < editorState.maxFormPageCount - 1"
            block
            type="primary"
            size="large"
            @click="editorService.nextPage()"
            >下一页</Button
          >
          <Button
            v-if="editorState.currentFormPageIndex == editorState.maxFormPageCount - 1"
            block
            type="primary"
            size="large"
            @click="submitForm()"
            >{{ editorState.appConfig.footer.submitButtonText }}</Button
          >
        </div>
        <div class="fixed-bottom-content" v-else>
          <Button
            block
            v-if="editorState.appConfig.footer.resetButton"
            type="default"
            size="large"
            @click="resetForm()"
            >{{ editorState.appConfig.footer.resetButtonText }}</Button
          >
          <Button v-if="props.isPreview" block type="primary" size="large" @click="submitForm()">{{
            editorState.appConfig.footer.submitButtonText
          }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, PropType, onMounted, nextTick, ref, provide } from 'vue';
import { Button, Progress } from 'ant-design-vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as eventState, service as eventService } from '@/modules/event-module';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { DragConfig } from '@/modules/draggable-module/@types';
import { EventTriggerType } from '@/modules/event-module/enum';
import FormDesignComponent from './FormDesignComponent.vue';
import { toast } from '@/common/message';

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
  }
});

const emit = defineEmits<{
  (event: 'refresh'): void;
}>();

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
    formFillService.submitForm().then((isComplete) => {
      if (isComplete) {
        eventService.emit(EventTriggerType.submitForm);
        toast('问卷填写完成', 'success');
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
  if (editorState.appConfig.isInit && editorState.appConfig.id) {
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
