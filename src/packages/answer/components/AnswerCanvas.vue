<template>
  <div class="app-canvas" :class="[editorState.currentPage.pageType, { 'answer-success': state.answerSuccess }]">
    <slot name="header"></slot>
    <!-- 问卷标题 -->
    <div class="questionnaire-title form-header" v-if="props.showTitle">
      <span class="form-title">{{editorState.appConfig.appTitle}}</span>
      <div class="form-header-tags" v-if="editorState.appConfig.headerTags">
        <span v-for="(tag, index) in editorState.appConfig.headerTags" :key="tag">{{tag}}</span>
      </div>
      <p v-if="appConfig.headerContent" class="form-header-content">{{ appConfig.headerContent }}</p>
      <!-- 问卷内容 -->
      <!-- <p v-for="(item, index) in controls" :key="index">{{item.name}}</p> -->
    </div>
    <div class="form-content">
      <slot name="empty" v-if="isEmptyForm">
        <Empty image="search" :description="props.empty || state.errorMsg" />
      </slot>
      
      <!-- 全屏区域 -->
      <div class="form-canvas-full-screen-panel">
        <FormComponent
          v-for="(component, index) in editorState.currentPage.children.filter(
            (i) => i.attrs.isFullScreen && i.attrs.visible !== false,
          )"
          v-show="editorService.showComponentInFormPage(component.id)"
          :component-id="component.id"
          :children="component.children"
          :component="component"
          :key="index"
          :index="index"
          :isFullScreen="true"
        >
          {{ component }}
        </FormComponent>
      </div>

      <div class="form-canvas-body">

        <!-- 进度条 -->
        <div
          style="padding: 12px 8px;"
          v-if="
            editorState.appConfig.showPageProgress && 
            editorState.currentPage.pageType === 'normal-page' &&
            editorState.appConfig.turnPageMode !== 'no-page' &&
            editorState.maxFormPageCount > 1 &&
            props.showProgress
          "
        >
          <Progress
            :pivot-text="editorState.currentFormPageIndex + 1 + '/' + editorState.maxFormPageCount"
            color="linear-gradient(to right, #be99ff, #7232dd)"
            :percentage="(editorState.currentFormPageIndex / (editorState.maxFormPageCount - 1)) * 100"
          />
        </div>

        <!-- 置顶区域 -->
        <div class="form-canvas-is-top-panel">
          <FormComponent
            v-for="(component, index) in editorState.currentPage.children.filter(i => i.attrs.isTop && i.attrs.visible !== false)"
            :component-id="component.id"
            :children="component.children"
            :component="component"
            :key="index"
            :index="index"
            :isFullScreen="false"
          >
            {{component}}
          </FormComponent>
        </div>

        <div class="form-canvas-mainpanel">
          <FormComponent
            v-for="(component, index) in editorState.currentPage.children.filter(i => !i.attrs.isTop && i.attrs.visible !== false)"
            v-show="editorService.showComponentInFormPage(component.id)"
            :component-id="component.id"
            :class="{
              'form-component-layout': ['complex', 'layout'].includes(component.type),
            }"
            :children="component.children"
            :component="component"
            :key="index"
            :index="index"
            :isFullScreen="false"
          >
            {{ component }}
          </FormComponent>
          <!-- <template v-if="isPreview">
            <component
              :is="component.component"
              v-for="(component, index) in editorStore.children"
              :component-id="component.id"
              :key="'hidden_' + index"
            />
          </template> -->
        </div>

        <!-- 提交问卷按钮 -->
        <div v-if="editorState.currentPage.pageType === 'normal-page' && editorState.appConfig?.showPageButton !== false && !isEmptyForm" class="fixed-bottom">
          <div class="fixed-bottom-content" v-if="editorState.maxFormPageCount > 1">
            <Button v-if="editorState.currentFormPageIndex > 0" round block type="default" size="large" @click="editorService.prevPage()">上一页</Button>
            <Button v-if="editorState.currentFormPageIndex < editorState.maxFormPageCount - 1" round block type="primary" size="large" @click="editorService.nextPage()">下一页</Button>
            <Button v-if="editorState.currentFormPageIndex == editorState.maxFormPageCount - 1" round block type="primary" size="large" @click="submitForm(true)">{{ editorState.appConfig?.footer?.submitButtonText || '提交' }}</Button>
          </div>
          <div class="fixed-bottom-content" v-else>
            <Button
              block
              v-if="editorState.appConfig?.footer?.resetButton"
              type="default"
              size="large"
              @click="resetForm()"
              >{{ editorState.appConfig?.footer?.resetButtonText }}</Button
            >
            <Button block type="primary" size="large" @click="submitForm(true)">{{
              editorState.appConfig?.footer?.submitButtonText
            }}</Button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="form-footer" v-if="!isEmptyForm">
      <Button :disabled="state.answerSuccess" type="default" round style="width: 40%" @click="reset">重置</Button>
      <Button type="primary" round block @click="submit">提交问卷</Button>
    </div> -->
    <slot name="footer"></slot>

    <Dialog
      v-model:show="state.showQRCode"
      title="分享二维码"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
    >
      <QRCode :width="290" :height="290" :margin="0" :value="'——'" />
    </Dialog>

    <Dialog v-model:show="state.successDialogShow" :show-confirm-button="false">
      <div class="sweet-alert showSweetAlert visible">
        <div class="sa-icon sa-success animate" style="display: block">
          <span class="sa-line sa-tip animateSuccessTip"></span>
          <span class="sa-line sa-long animateSuccessLong"></span>
          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
      </div>
      <p style="margin: 0px 0px 30px 0px">感谢您的参与！</p>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, defineEmits, PropType, onMounted, onUnmounted, watch, defineExpose, computed } from 'vue';
import { Button, Dialog, Empty, Progress, Toast } from 'vant';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as scoringState, service as scoringService } from '@/modules/scoring-module';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { state as authState } from '@/common/auth-module';
import { service as eventService } from '@/modules/event-module';
import { getQuestionary, getQuestionaryAnswer } from '@/api/common/questionnaire';
import { EventTriggerType } from '@/modules/event-module/enum';
import type { AppPage, AppConfig } from '@/@types';
import type { AppEvent } from '@/modules/event-module/@types';
import FormComponent from './FormComponent.vue';
import QRCode from '@/components/common/QRCode.vue';
import '../assets/sweetalert.css';

const emits = defineEmits<{
  /** 答卷提交事件，返回false则阻止 */
  (event: 'onComplete', data: Record<string, any>): boolean | void;
  /** 答卷重置事件 */
  (event: 'onReset'): void;
  /** 主动放弃回答，返回false则阻止 */
  (event: 'onCancel'): boolean | void;
  /** 跳到下一题， 返回false则阻止 */
  (event: 'onAnsNext', componentId: string): boolean | void;
  /** 跳到上一题， 返回false则阻止 */
  (event: 'onAnsPrev', componentId: string): boolean | void;
  /** 跳到下一个页面， 返回false则阻止 */
  (event: 'onPageNext', pageIndex: number): boolean | void;
  /** 跳到上一个页面， 返回false则阻止 */
  (event: 'onPagePrev', pageIndex: number): boolean | void;
  /** 中断 / 暂停答题 */
  (event: 'onPause'): void;
  /** 继续答题 */
  (event: 'onResume'): void;
  /** 中止答题 */
  (event: 'onStop'): void;
  /** 保存答案到缓存 */
  (event: 'onSave'): void;
  /** 组件及问卷准备完毕 */
  (event: 'onReady'): boolean;
  /** 数据加载错误 */
  (event: 'onLoadError', errorType: string): boolean;
  /** 通用事件 */
  (event: 'onEvent', eventName: string, targetId: string, attrs?: Record<string, any>): void;
}>();

/** 传入属性 */
const props = defineProps({
  /** 问卷Id */
  targetId: {
    type: String,
    required: true,
  },
  /** 用户Id */
  userId: {
    type: String,
    required: false,
  },
  /** 时候开启debug模式 */
  isDebug: {
    type: Boolean,
    default: false,
  },
  /** 为空时的提示文本 */
  empty: {
    type: String,
    default: ''
  },
  /** 全屏/顶级组件挂载的节点 */
  topLevelTeleport: {
    type: Object as PropType<string | HTMLElement>,
    default: () => document.body,
  },
  /** 自动保存（秒），为0则不自动保存 */
  autoSave: {
    type: Number,
    default: 0,
  },
  /** 平台（mobile | pc | auto） */
  platform: {
    type: String as PropType<'mobile' | 'pc' | 'auto'>,
    default: 'auto',
  },
  /** 是否显示内容 */
  visibleContent: {
    type: Boolean,
    default: true,
  },
  /** 禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 是否显示标题 */
  showTitle: {
    type: Boolean,
    default: true,
  },
  /** 是否显示进度条 */
  showProgress: {
    type: Boolean,
    default: true,
  },
  /** 是否全屏显示组件 */
  fullScreen: {
    type: Boolean,
    default: true,
  },
  /** 主题 */
  theme: {
    type: String,
    default: '',
  },
  /** 是否提交数据（false则需要手动处理提交数据等功能） */
  useRequest: {
    type: Boolean,
    default: false
  },
  /** 是否显示答案 */
  showAnswer: {
    type: Boolean,
    default: false
  },
  /** 答案id */
  answerId: {
    type: String,
    default: ''
  },
  /** 是否评分 */
  isScoring: {
    type: Boolean,
    default: false
  },
});

const state = reactive({
  /** 当前用户userId */
  userInfo: authState.userInfo ?? {},
  /** 服务器获取问卷详情 */
  content: {} as AppPage[],
  /** 服务器获取答题详情 */
  answerInfo: {} as Record<string, any>,
  /** 用户填写信息 */
  formFillInfo: {} as Record<string, any>,
  /** 是否显示二维码 */
  showQRCode: false,
  /** 回答完毕弹出提示框 */
  successDialogShow: false,
  /** 回答完毕 */
  answerSuccess: false,
  /** 是否初始化 */
  isInit: false,
  /** 查询问卷错误信息 */
  errorMsg: '未查询到数据',
  /** 应用配置 */
  appConfig: {} as AppConfig,
  /** 事件列表 */
  events: [] as AppEvent[],
  /** 页面配置 */
  pages: [] as AppPage[],
  /** 文件列表 */
  files: [] as string[],
  /** 是否开启自动保存 */
  isAutoSave: false,
});

/** 是否为空表单 */
const isEmptyForm = computed(() => {
  return state.isInit && (editorState.pages.length === 0 || editorState.currentPage.children.length === 0);
});

onMounted(() => {
  log('——问卷初始化——');

  init();

  if (props.autoSave && props.autoSave > 0) {
    autoSave();
  }
});

onUnmounted(() => { 
  // editorService.$reset();
  // formFillService.$reset();
  // eventService.$reset();
})

watch(() => props.autoSave, (val, oldVal) => {
  if (val && !oldVal) {
    autoSave();
  }
  // else if () {

  // }
});

/** 触发常规事件 */
eventService.setupOnEventHook((eventName: string, targetId: string, attrs: any) => {
  switch (eventName) {
    case 'onComplete':
      return emits('onComplete', attrs || {});
    case 'onCancel':
      return emits('onCancel');
    case 'onPageNext':
      return emits('onPageNext', attrs);
    case 'onPagePrev':
      return emits('onPagePrev', attrs);
    default:
      return emits('onEvent', eventName, targetId, attrs);
  }
});

const autoSave = () => {
  setTimeout(() => {
    autoSave();
  }, props.autoSave);
};

/** 打印日志 */
const log = (...txt: any[]) => {
  if (props.isDebug) {
    console.info(...txt);
  }
};

/** 重置表单 */
const resetForm = () => {
  Dialog.confirm({
    title: '提示',
    message: '是否确认重置表单？',
    closeOnClickOverlay: true,
  }).then((d) => {
    eventService.emit(EventTriggerType.resetForm);
    formFillService.startFormFill();
    emits('onReset');
    Toast({ message: '表单已重置' });
  }).catch((err) => {});
};

/** 
 * 提交表单
 * @param validate 是否需要校验
 */
const submitForm = (validate?: boolean) => {
  return new Promise((resolve, reject) => {
    if (scoringState.isScoring) {
      scoringService.submitScore().then(scores => {
        resolve({ scores });
        emits('onComplete', { scores });
      })
    } else {
      formFillService.submitForm(!!validate).then(({ isComplete, data }) => {
        resolve({ isComplete, data });
        emits('onComplete', { isComplete, data });
        if (isComplete) {
          // Toast.success('问卷填写完成');
          editorService.nextAppPage();
        } 
      }).catch(reject);
    }
  });
};

/** 初始化 */
const init = async () => {
  state.isInit = false;
  state.appConfig.id = props.targetId;
  
  if (props.platform !== 'auto') {
    authState.isMobile = props.platform === 'mobile';
  }

  formFillState.useRequest = props.useRequest;
  scoringState.isScoring = props.isScoring;

  const hide = Toast.loading('加载中...');

  try {
    const res = await getQuestionaryInfo();
    const questionary = res.questionary;
    log(questionary, `当前应用Id${questionary}`);
    state.answerInfo = res['questionaryAnswer'] || {};
    editorState.appConfig.id = questionary.id + '';
    editorState.appConfig.appVersion = questionary.appVersion;
    if (props.theme) {
      questionary.content.theme.code = props.theme;
    }
    await editorService.loadAppBody(questionary.content.appConfig.id, questionary.content);
    if (props.showAnswer || props.isScoring) {
      const questionAnswerList = res['questionAnswerList'] || [];
      questionAnswerList.map(x => {
        formFillService.setQuestionAnswer(x.questionId, x.answerJson, x.type);
        props.isScoring && scoringService.setComponentScore(x.questionId, x.score);
      });
    }
    state.isInit = true;
    formFillService.init();
    formFillService.startFormFill();
  } catch (e) {
    hide.clear();
  }
};

/** 获取问卷信息 */
const getQuestionaryInfo = async () => {
  if (props.showAnswer || props.isScoring) {
    return getQuestionaryAnswer(props.targetId, props.userId||'', props.answerId||'').then();
  } else {
    return getQuestionary(props.targetId).then();
  }
};

watch(() => props.targetId, (val, oldVal) => {
  if (!val) {
    state.isInit = false;
  } else if (val !== oldVal) {
    init();
  }
});

/** 重新渲染 */
const reRender = () => {
  init();
}

/** 合并答案信息并提交 */
const mergeAnswer = () => {
  return new Promise((resolve, reject) => {
    getQuestionary(props.targetId).then(res => {
      const questionary = res.questionary;
      const components = questionary.content.pages[0].children;
      const formInfo = editorService.mergeFormData(components, formFillState.formInfo);
      return formInfo;
    }).then(res =>{
      formFillState.formInfo = res;
      reRender();
    })
  })
}

/** 获取填表相关信息 */
const formInfo = computed(() => formFillState.formInfo);
/** 获取时间相关信息 */
const timerInfo = computed(() => formFillState.timerInfo);
/** 获取时间相关信息 */
const appConfig = computed(() => editorState.appConfig);
/** 获取表单填写的Url地址 */
const getUrl = () => '';
/** 获取当前问卷得分 */
const getScore = () => 100;
/** 获取问卷相关信息 */
const getAppConfig = () => editorState.appConfig;
/** 获取服务器答题详情 */
const getAnswerInfo = () => state.answerInfo;
/** 获取用户填写的相关信息 */
const getFormInfo = () => formFillState.formInfo;
/** 获取时间相关信息 */
const getTimerInfo = () => formFillState.timerInfo;
/** 获取题目列表 */
const getQuestionList = () => editorService.getAllFormItem();
/** 答卷完成并提交，isIgnore为true则忽略其他因素强制提交 */
const complete = (isIgnore: boolean) => {};
/** 取消答题，isIgnore为false则弹出提示框确认，否则直接取消；isSubmit为true则取消并提交填写内容，否则不提交。 */
const cancel = (isIgnore: boolean, isSubmit: boolean) => {}; 

defineExpose({
  getUrl,
  getScore,
  getAppConfig,
  getAnswerInfo,
  getFormInfo,
  getTimerInfo,
  getQuestionList,
  submitForm,
  reRender,
  mergeAnswer,
  complete,
  cancel,
});

// const ready = (callback) => {
//   // 如果jsbridge已经注入则直接调用
//   if ((window as any).AlipayJSBridge) {
//     callback && callback();
//   } else {
//     // 如果没有注入则监听注入的事件
//     document.addEventListener('AlipayJSBridgeReady', callback, false);
//   }
// };

// 获取授权 （1为微信）
//   if (d.data.ivtMethod == '1') {

//     // 获取用户详情
//     if (this.userId) {
//       // 获取当前用户是否提交过问卷
//       get('/fnd/ivt/checkAlreadyAnswer', {
//         qid: this.qid,
//         userId: this.userId
//       }).then(d => {
//         if (d.code == '0' && d.data) {
//           this.answerSuccess = true;
//           Dialog.alert({
//             title: '提示',
//             message: '当前用户已填写过该问卷。',
//           });
//         }
//       });
//     } else {
//       if (!query.userId) {
//         Dialog.alert({
//           title: '警告',
//           message: '当前页面未获取到用户信息。',
//         });
//         this.answerSuccess = true;
//         return;
//       }
//       this.userId = query.userId;
//       localStorage.setItem('userId', this.userId);

//       // 获取当前用户是否提交过问卷
//       get('/fnd/ivt/checkAlreadyAnswer', {
//         qid: this.qid,
//         userId: this.userId
//       }).then(d => {
//         if (d.code == '0' && d.data) {
//           this.answerSuccess = true;
//           Dialog.alert({
//             title: '提示',
//             message: '当前用户已填写过该问卷。',
//           });
//         }
//       });
//     }
//   }
</script>

<style lang="less">
@import '../assets/less/question.less';

.app-canvas {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  &.answer-success {
    > .form-content {
      // &:before {
      //   content: '';
      //   position: absolute;
      //   display: block;
      //   top: 0px;
      //   left: 0px;
      //   width: 100%;
      //   height: 100%;
      //   z-index: 99999;
      // }
    }
  }

  > .form-header {
    flex-grow: 0;
    padding: var(--app-title-padding);
    padding-bottom: 0;
    > .form-title {
      margin: 0px;
      box-sizing: content-box;
      color: var(--app-title-font-color);
      font-size: var(--app-title-fontsize);
      text-align: var(--app-title-textalign);
      font-weight: bold;
      flex-grow: 0;
    }

    > .form-header-tags {
      display: flex;
      margin-top: 18px;

      > span {
        padding: 2px 10px;
        margin-right: 8px;
        background: #fff;
        box-shadow: 0px 4px 12px 0px #F0F1FA;
        border-radius: 12px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #929CE3;
      }
    }

    > .form-header-content {
      text-align: left;
      padding: 0px 15px;
      color: #999999;
      font-size: 14px;
    }
  }
  > .form-content {
    position: relative;
    flex-grow: 1;
    overflow-y: auto;

    > .form-canvas-body {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;

      > .form-canvas-is-top-panel {
        display: flex;
        flex-direction: column;
      }

      > .form-canvas-mainpanel {
        display: block;
        flex-shrink: 1;
        flex-grow: 1;
        padding: 15px 0px;
        // font-size: 0px;
      }

      > .fixed-bottom {
        display: block;
        flex-shrink: 0;
        flex-grow: 0;
        padding: 15px;
      }
    }
  }
  > .form-footer {
    display: flex;
    flex-grow: 0;
    padding: 15px;

    > button {
      + button {
        margin-left: 15px;
      }
    }
  }
}

.question-item {
  box-sizing: border-box;
  padding: 5px 15px 15px 15px;
  background-color: white;
  border-radius: 7px;
  box-shadow: 0px 5px 5px 0px rgba(175, 213, 255, 0.3);

  > .label {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;

    > .label-index {
      display: inline-block;
      padding-right: 2px;
    }

    > p {
      margin: 0px;
      display: inline;
    }
  }

  &.question-label {
    > .label {
      &:before {
        content: none;
      }
    }
  }

  + .question-item {
    margin-top: 15px !important;
  }
}
</style>
