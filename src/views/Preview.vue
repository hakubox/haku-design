<template>
  <Loading v-if="state.isLoading" size="36px" vertical style="margin-top: 50vh; transform: translateY(-50%);">加载中...</Loading>
  <Empty v-else-if="!state.isLoading && state.errorMsg" image="error" :description="state.errorMsg" style="margin-top: 50vh; transform: translateY(-50%);" />
  <div v-else class="app-canvas" :class="editorState.currentPage.pageType" style="height: 100vh;">
    <!-- 背景 -->
    <template v-if="editorState.appConfig.background?.length">
      <div
        class="app-canvas-bg-panel"
        :style="[item.parentStyle, {
          opacity: item.opacity,
          mixBlendMode: item.blendType
        }]"
        v-for="item in editorState.appConfig.background.filter(i => i.show)"
      >
        <div
          class="app-canvas-bg-panel-layer"
          :style="item.innerStyle"
        ></div>
      </div>
    </template>
    <!-- 问卷标题 -->
    <div class="form-header" v-show="editorState.currentPage.pageType === 'normal-page' && editorState.appConfig.appType === AppType.questionnaire">
      <span class="form-title">{{editorState.appConfig.appTitle}}</span>
    </div>
    <DesignCanvas
      ref="componentCanvas"
      :isPreview="true"
      :isReadonly="false"
      :showEditor="false"
      :showButton="false"
      :style="{ 'flex-grow': 1, height: '100px' }"
      @refresh="editorService.refresh"
    />
  </div>
</template>

<script lang="ts" setup>
import { type AppType } from '@haku-design/core';
import { onMounted, reactive, ref } from 'vue';
import { getQuestionary } from '@/api/questionnaire';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import DesignCanvas from "../components/module/DesignCanvas.vue";
import { useRoute } from 'vue-router';
import { showDialog, Empty, Loading, Toast } from 'vant';

editorState.componentCanvas = ref(DesignCanvas);

const route = useRoute();

const state = reactive({
  /** 加载中 */
  isLoading: true,
  /** 错误信息 */
  errorMsg: '',
});

onMounted(() => {
  window.onresize = () => {
    editorService.onPageSize();
  };

  state.isLoading = true;
  // if (route.query?.token) {
  //   localStorage.setItem('Authorization', route.query.token as string);
  // }
  if (route.query?.qid) {
    // 获取测试问卷
    getQuestionary(route.query.qid as string).then(({ questionary, tagList }) => {
      console.log(questionary, `当前应用Id${questionary.id}`);
      if (questionary.content) {
        editorService.loadAppBody(questionary.id + '', questionary.content, true);
      }
    }).catch(err => {
      showDialog({
        title: '查询问卷失败',
        message: err.message
      });
      state.errorMsg = err.message || '查询问卷失败';
    }).finally(() => {
      state.isLoading = false;
    });
  } else {
    Toast.fail('未查询到对应问卷Id');
    state.errorMsg = '未查询到对应问卷Id';
    state.isLoading = false;
  }
});
</script>

<style lang="less" scoped>
  :deep(.form-canvas-mainpanel) {
    overflow-x: visible !important;
    overflow-y: visible !important;
  }

  :deep(.component-item) {

    > .component-item-label {

      ~ * {
        position: relative;
        pointer-events: none;
        user-select: none;

        &:before {
          content: '';
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
</style>