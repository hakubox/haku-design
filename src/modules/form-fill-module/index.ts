import { state as editorState, service as editorService } from '@/modules/editor-module';
import { service as eventService } from '@/modules/event-module';
import { service as scoringService } from '@/modules/scoring-module';
import { service as validateService } from '@/modules/validate-module';
import { state as authState } from '@/common/auth-module';
import { OriginDataTransformComponentAnswerType, PageType } from '@/@types/enum';
import type { Component, ComponentAnswerType, ComponentGroup, AppPage, DataEditorValue } from '@/@types';
import type { ErrorInfo, FormInfoItem, TempStorage, TimerInfo, TimingInfo } from './index.d';
import { answerCommit } from '@/api/form-fill';
import { Dialog, Toast } from 'vant';
import { isBlank } from '@/tools/common';
import { clearOldMediaInfo } from '@/lib/media';
import { EventTriggerType } from '../event-module/enum';
import { computed, nextTick, reactive } from 'vue';

export * from './index.d';

/** 缓存列表KEY */
const StorageListKey = '__hakuform__storage__';

/** 答题模块状态 */
export const state = reactive({
  /** 组件Refs */
  componentRefs: {} as Record<string, any>,
  /** 是否启用远程请求（false则需要手动处理提交数据等功能） */
  useRequest: false,
  /** 总分数 */
  totalScore: 0,
  /** 表单信息 */
  formInfo: {} as Record<string, FormInfoItem>,
  /** 维度得分 */
  dimensionScore: [] as { dimensionName: string; score: number }[],
  /** 记时信息 */
  timerInfo: {
    isStart: false,
    startTime: new Date().getTime(),
    completeTime: undefined,
    duration: 0,
    isPause: false,
    pauseTime: 0,
    isComplete: false,
    timeList: [],
    answerTimeList: [],
  } as TimerInfo,
  /** 设备信息 */
  remoteInfo: {
    /** 设备信息 */
    deviceInfo: '',
    /** 语言 */
    language: navigator.language,
    /** 平台 */
    platform: navigator.platform,
    /** 用户字符串 */
    userAgent: navigator.userAgent,
  },
  /** 错误信息表 */
  errorInfo: {} as Record<string, ErrorInfo>,
  /** 缓存存储计时器（默认10秒） */
  tempStorageSaveTimer: undefined as undefined | number,
  /** 表单填充列表 */
  formFillList: computed((): FormInfoItem[] => {
    return Object.values(state.formInfo);
  }),
  /** 当前经过的时间 */
  nowUseTime: computed((): number => {
    if (!state.timerInfo?.timeList?.length) return 0;
    return state.timerInfo.timeList.map((i) => i.duration).reduce((a, b) => a + b);
  }),
});

/** 答题模块逻辑 */
export const service = {
  /** 重置表单项 */
  $reset() {
    state.formInfo = {};
  },
  setRef(componentId: string, ref: any) {
    state.componentRefs[componentId] = ref;
  },
  init() {
    clearOldMediaInfo();

    document.addEventListener('visibilitychange', () => {
      const _nowTime = new Date().getTime();

      // 用户离开了当前页面
      if (document.visibilityState === 'hidden') {
        state.timerInfo.pauseTime = _nowTime;
        eventService.emit(EventTriggerType.appHide, 'global');
        if (editorState.getTimerConfig.isOpen) {
          eventService.emit(EventTriggerType.timePause, 'global');
          if (editorState.getTimerConfig.isAutoTiming) service.pauseTime();
        }
        if (editorState.appConfig.questionnaireConfig.useAutoCache) service.save();
      }

      // 用户打开或回到页面
      if (document.visibilityState === 'visible') {
        // 判断离开的时间是否大于10秒
        // if (_nowTime - service.timerInfo.pauseTime < 10000) {
        //   service.timerInfo.pauseTime = 0;
        // }
        eventService.emit(EventTriggerType.appShow, 'global');
        if (editorState.getTimerConfig.isOpen) {
          eventService.emit(EventTriggerType.timeStart, 'global');
          if (editorState.getTimerConfig.isAutoTiming) service.resumeTime();
        }
        if (editorState.appConfig.questionnaireConfig.useAutoCache) service.save();
      }
    });

    // document.addEventListener("resume", () => {
    // });
  },
  /** 根据组件Id获取错误 */
  getErrorByComponent(componentId: string) {
    return state.errorInfo[componentId]?.errorText || [];
  },
  /** 清理过期信息（筛除小于一天的缓存） */
  clearExpired() {
    let storageList = JSON.parse(localStorage.getItem(StorageListKey) || '[]') as TempStorage[];
    // 筛除小于一天的缓存
    storageList = storageList.filter((i) => {
      return i.createTime > new Date().getTime() - 86400000;
    });
    localStorage.setItem(StorageListKey, JSON.stringify(storageList));
  },
  /** 自动保存当前信息到缓存 */
  autoSave(delay: number) {
    if (editorState.appConfig.questionnaireConfig.useAutoCache) {
      state.tempStorageSaveTimer = window.setTimeout(() => {
        clearTimeout(state.tempStorageSaveTimer);
        this.save();
        this.autoSave(delay);
      }, delay*1000);
    } else {
      throw new Error('未开启自动记录提交信息功能');
    }
  },
  /** 保存状态 */
  save() {
    try {
      if (editorState.appConfig.questionnaireConfig.hasScore) scoringService.countScore();
      const _tempStorage = {
        /** 用户Id */
        userId: authState.userInfo.id,
        /** 问卷Id */
        qid: editorState.appConfig.id,
        extraCode: editorState.appConfig.questionnaireConfig.extraCode,
        appVersion: editorState.appConfig.appVersion,
        /** 缓存记录创建时间 */
        createTime: new Date().getTime(),
        /** 缓存记录修改时间 */
        updateTime: new Date().getTime(),
        /** 用户字符串 */
        userAgent: navigator.userAgent,
        /** 数据 */
        data: {
          /** 表单信息 */
          formInfo: state.formInfo,
          /** 记时信息 */
          timerInfo: (editorState.appConfig.questionnaireConfig.timerConfig?.isOpen ? state.timerInfo : undefined) as TimingInfo | undefined,
        },
      } as TempStorage;

      const storageList = JSON.parse(localStorage.getItem(StorageListKey) || '[]') as TempStorage[];

      const _index = storageList.findIndex(
        (i) =>
          i.userId === _tempStorage.userId &&
          i.qid === _tempStorage.qid &&
          i.extraCode === _tempStorage.extraCode && 
          new Date().getTime() - i.updateTime < editorState.appConfig.questionnaireConfig.autoCacheDuration,
      );

      if (_index < 0) {
        storageList.push(_tempStorage);
      } else {
        storageList.splice(_index, 1, {
          ...storageList[_index],
          ..._tempStorage,
          createTime: storageList[_index].createTime,
        });
      }

      localStorage.setItem(StorageListKey, JSON.stringify(storageList));
    } catch (error) {
      console.error('自动加载错误', error);
    }
  },
  /** 获取当前评价 */
  getCurrentRating() {
    if (editorState.appConfig.questionnaireConfig.dimensionConfig?.isOpen && editorState.appConfig.questionnaireConfig.dimensionConfig?.dimensionList?.length) {
      throw new Error('暂无法获得维度评价');
      return undefined;
    } else {
      const _score = scoringService.countScore();
      const ratingList = editorState?.appConfig.questionnaireConfig.ratingList;
      return ratingList?.find(i => {
        if (i.startScore > _score) return false;
        else if (i.endScore && i.endScore < _score) return false;
        return true;
      }) || { title: '暂无评价', description: '暂无评价' };
    }
  },
  /** 刚进入页面时自动加载新数据 */
  autoLoad() {
    const storageList = JSON.parse(localStorage.getItem(StorageListKey) || '[]') as TempStorage[];
    const _index = storageList.findIndex(i => i.userId === authState.userInfo.id && i.qid === editorState.appConfig.id && i.extraCode === editorState.appConfig.questionnaireConfig.extraCode);
    if (_index >= 0) {
      state.formInfo = editorService.mergeFormData(editorState.pages[0].children, storageList[_index].data.formInfo);
      state.timerInfo = storageList[_index].data.timerInfo;
    }
    this.clearExpired();
  },
  /** 校验表单 */
  async validateForm(formPageIndex?: number): Promise<{ isComplete: boolean; errorComponents: any[] }> {
    state.errorInfo = {};
    const _errorComponents: any[] = [];
    const _components: (Component | ComponentGroup)[] = [];
    if (formPageIndex !== undefined && formPageIndex >= 0) {
      _components.push(
        ...editorService.getAllFormItem(undefined, i => !i.attrs.isTop && i.attrs.visible !== false && editorService.showComponentInFormPage(i.id)),
      );
    } else {
      _components.push(...editorService.getAllFormItem());
    }
    for await (const component of _components) {
      if (component.isFormItem) {
        if (component.attrs.visible) {
          const _val = state?.formInfo?.[component.id]?.value;
          // 校验必填项
          if (component.attrs.required) {
            if (!_val || isBlank(_val) || (Array.isArray(_val) && (!_val.length || !(_val.filter(x=>x).length)))) {
              _errorComponents.push({ component: component, message: '问卷填写未完成' });
              state.errorInfo[component.id] = {
                isError: true,
                componentId: component.id,
                errorText: ['当前题目不能为空'],
              };
            }
          }
          // 校验包含（数据校验）属性的项
          if (component.attrs.validate) {
            try {
              await validateService.transformValidate(_val, component.attrs.validate).then(d => {
                console.log('成功');
              }).catch(({ errors }) => {
                const _err = errors[0];
                const _errMessage = _err.message.replace('{{value}}', '');
                _errorComponents.push({ component: component, message: _errMessage });
                state.errorInfo[component.id] = {
                  isError: true,
                  componentId: component.id,
                  errorText: [_errMessage],
                };
              });
              
            } catch (err) {
              console.error('校验失败', err);
              debugger;
            }
          }
        }
      }
    }
    if (_errorComponents.length === 0) {
      return {
        isComplete: true,
        errorComponents: [],
      };
    } else {
      /** 出错时滚动条滚动到到第一个错误组件 【注：在设计端需要加上.form-canvas.preview前缀】 */
      setTimeout(() => {
        const _el = document.querySelector(
          `.form-canvas.preview [component-id="${_errorComponents[0].component.id}"]`,
        );
        if (_el) _el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 100);
      return {
        isComplete: false,
        errorComponents: _errorComponents,
      };
    }
  },
  /** 开始表单填写 */
  startFormFill() {
    if (editorState.getTimerConfig.isOpen && editorState.getTimerConfig.isAutoTiming) service.startTime();
  },
  /** 获取选项的score */
  getOptionScore(componentId: string, value: string): number | undefined {
    const _component = editorService.findComponent(componentId);
    if (_component) {
      const _option = _component.attrs.options.find((i) => i.value === value);
      if (_option) {
        return _option.score ?? undefined;
      }
    }
    return undefined;
  },
  /** 获取选项的label */
  getOptionLabel(componentId: string, value: string): string | undefined {
    const _component = editorService.findComponent(componentId);
    if (_component) {
      const _option = _component.attrs.options.find((i) => i.value === value);
      if (_option) {
        return _option.label;
      }
    }
    return '——';
  },
  /** 处理音视频 */
  handleMedia() {
    const _page = editorState.pages.find((page) => page.pageType === PageType.normalPage) as AppPage;
    _page.children.forEach((component) => {
      if (component.name === 'q-anx-video') {
        const _component = state.componentRefs[component.id];
        if (_component) {
          _component?.pause();
        } else {
          throw new Error('未查询到对应组件实例');
        }
      }
    });
  },
  /** 
   * 提交表单信息（完成填写）
   * @param {boolean} [validate=true] 是否需要校验
   **/
  async submitForm(validate = true) {
    eventService.emit(EventTriggerType.beforeSubmitForm, 'global');
    await nextTick();
    if (editorState.getTimerConfig.isOpen && editorState.getTimerConfig.isAutoTiming) service.completeTime();
    scoringService.countScore();
    service.handleMedia();

    const _formInfo = Object.assign({},
      ...Object.entries(state.formInfo).filter(([key, value]) => value?.value).map(([key, value]) => {
        let _val: any;
        let _score: any;
        switch (value.type) {
          case 'option':
            _score = service.getOptionScore(key, value?.value);
            _val = { label: service.getOptionLabel(key, value?.value), value: value?.value };
            break;
          case 'option-list':
            _score = value?.value.map(i => service.getOptionScore(key, i)).reduce((a, b) => a + b, 0);
            _val = value?.value.map(i => ({ label: service.getOptionLabel(key, i), value: i }));
            break;
          case 'number':
          case 'text':
            _val = { value: value?.value };
            break;
          case 'text-list':
          case 'number-list':
            _val = value?.value.map(i => ({ value: i }));
            break;
          case 'extrainfo-list':
            _val = value?.value.map(i => i);
            break;
          default:
            _val = { value: value?.value };
            break;
        }
        return {
          [key]: {
            ...value,
            score: _score,
            value: Array.isArray(_val) ? _val : [_val],
          },
        };
      }),
    );

    const _data = {
      totalScore: state.totalScore,
      questionList: editorService.getAllFormItem(),
      answerList: Object.values(_formInfo),
      formInfo: _formInfo,
      dimensionScore: editorState.appConfig.questionnaireConfig.dimensionConfig?.isOpen
        ? editorState.appConfig.questionnaireConfig.dimensionConfig?.dimensionList.map((i) => ({
            ...i,
            score: state.dimensionScore.find((i) => i.dimensionName === i.dimensionName)?.score || 0,
          }))
        : [],
      timerInfo: state.timerInfo,
      ratingList: editorState.appConfig.questionnaireConfig.ratingList,
      remoteInfo: state.remoteInfo,
    };

    if (editorState.getTimerConfig.isOpen) {
      const _isEnforceMinDuration = editorState.getTimerConfig.isEnforceMinDuration || false;
      const _minDuration = editorState.getTimerConfig.minDuration || 0;
      if (_minDuration > 0) {
        state.timerInfo.duration = state.nowUseTime;
        if (state.timerInfo.duration < _minDuration) {
          const _confrim = await Dialog.confirm({
            title: '提前结束',
            message: editorState.getTimerConfig.minDurationTooltip,
          });
          if (_confrim) {
            const _re = {
              isComplete: !_isEnforceMinDuration,
              isAdvanceComplete: true,
              data: _data,
            };
            eventService.emit(EventTriggerType.submitForm, 'global', _re);
            return _re;
          }
        }
      }
    }

    if (validate) {
      const _checkResult = await service.validateForm();
      if (!_checkResult.isComplete) {
        Toast.fail('填写未完成');
        return {
          isComplete: false,
          data: _data
        };
      }
    } 

    const hide = Toast.loading({
      message: '提交中...',
      forbidClick: true,
    });

    if (state.useRequest) await answerCommit(editorState.appConfig.id, _data);

    hide.clear();
    const _re = {
      isComplete: true,
      isAdvanceComplete: true,
      data: _data,
    };
    eventService.emit(EventTriggerType.submitForm, 'global', _re);
    return _re;
  },
  /** 获取表单信息 */
  getFormInfo(key: string): FormInfoItem {
    return state.formInfo[key];
  },
  /** 设置表单信息 */
  setFormInfo(key: string, value: any, type?: ComponentAnswerType) {
    let _type: any = type;
    let _value = value;
    if (_value?.dataOrigin === 'data-editor') {
      _type = OriginDataTransformComponentAnswerType[_value.type];
      _value = _value.value;
    } else if (_type === undefined) {
      _type = 'text';
    }
    state.formInfo[key] = { id: key, type: _type, value: _value };
  },
  /** 移除某项表单信息 */
  removeFormInfo(removeKey: string) {
    delete state.formInfo[removeKey];
  },
  /** 题目答案显示处理 */
  setQuestionAnswer(id: string, answerValue: any [], type: ComponentAnswerType) {
    let value;
    if (['text-list', 'option-list', 'number-list', 'file-list', 'array-list'].includes(type)) {
      value = answerValue.reduce((acc, cur) => {
        return [...acc, cur.value]
      }, [])
    } else if (['extrainfo-list'].includes(type)) {
      value = answerValue.reduce((acc, cur) => {
        return [...acc, cur]
      }, [])
    } else if (['option'].includes(type)) {
      value = answerValue[0];
    } else if (answerValue.length > 0) {
      value = answerValue[0].value;
    }
    this.setFormInfo(id, value, type);
    nextTick(() => {
      eventService.emit(EventTriggerType.valueChange, id, value);
      if (type === 'datetime') {
        nextTick(() => {this.setFormInfo(id, value, type);})
      }
    });
  },
  /** 开始记时 */
  startTime() {
    const _now = new Date().getTime();
    if (!state.timerInfo.timeList.length) {
      state.timerInfo.isStart = true;
      state.timerInfo.startTime = new Date(_now).getTime();
      state.timerInfo.timeList.push({
        startTime: _now,
        duration: 0,
      });
    } else {
      if (state.timerInfo.isPause) {
        const _lastIndex = state.timerInfo.timeList.length - 1;
        if (state.timerInfo.timeList[_lastIndex].duration === 0) {
          state.timerInfo.timeList.splice(_lastIndex, 1);
        }
        state.timerInfo.timeList.push({
          startTime: _now,
          duration: 0,
        });
      }
      state.timerInfo.isPause = false;
    }
  },
  /** 重置记时（将清空所有记时信息） */
  resetTime() {
    state.timerInfo = {
      isStart: false,
      isPause: false,
      isComplete: false,
      startTime: new Date().getTime(),
      pauseTime: 0,
      completeTime: undefined,
      duration: 0,
      timeList: [],
      answerTimeList: [],
    } as TimerInfo;
  },
  /** 暂停记时 */
  pauseTime() {
    // 记时未暂停时暂停才能新增时间段
    if (!state.timerInfo.isPause) {
      const _now = new Date().getTime();
      const lastInfo = state.timerInfo.timeList.slice(-1)[0];
      lastInfo.duration = _now - lastInfo.startTime;
      state.timerInfo.duration = state.nowUseTime;
    }
    state.timerInfo.isPause = true;
  },
  /** 恢复记时 */
  resumeTime() {
    if (state.timerInfo.isPause) {
      const _now = new Date().getTime();
      state.timerInfo.timeList.push({
        startTime: _now,
        duration: 0,
      });
    }
    state.timerInfo.isPause = false;
  },
  /** 完成记时 */
  completeTime() {
    service.pauseTime();
    state.timerInfo.duration = state.nowUseTime;
    state.timerInfo.isComplete = true;
    state.timerInfo.completeTime = new Date().getTime();
  },
  /** 开始某个新回答 */
  startOneFill(componentId: string) {
    state.timerInfo.answerTimeList.push({
      componentId,
      startTime: state.nowUseTime,
      duration: 0,
    });
  },
  /** 结束某一回答 */
  endOneFill(componentId: string) {
    const _index = state.timerInfo.answerTimeList.findIndex((i) => i.componentId === componentId);
    if (_index >= 0) {
      state.timerInfo.answerTimeList[_index].duration =
        state.nowUseTime - state.timerInfo.answerTimeList[_index].startTime;
    }
  },
  /** 清空表单 */
  clearForm() {
    state.formInfo = {};
  },
  getOriginDataLabel(data: DataEditorValue) {
    console.log('data', data);
    if (data?.value === undefined) return '——';
    switch (data.type) {
      case 'data-string':
      case 'data-number':
        return data.value;
      case 'data-date':
        throw new Error('[日期未分析]');
      case 'data-component':
        return editorService.findComponent(data.value)?.attrs.name || '——';
      case 'data-variable':
        return `${data.value}`; // ${variableStore.getVar(data.value) ?? '——'}
      case 'data-component-option': {
        const _splitValue = (data.value || '').split('|');
        if (_splitValue.length === 2) {
          const _component = editorService.findComponent(_splitValue[0]);
          const _options: { label: string, value: any }[] = _component?.attrs?.options ?? [];
          const _value = _options.find(i => i.value === _splitValue[1])?.label;
          return `${_component?.attrs.name} / ${_value}`;
        }
        return '——';
      }
      default:
        return '——';
    }
  },
  /** 获取数据选择器原始类型数据值 */
  getOriginDataValue(data: DataEditorValue) {
    if (data.value === undefined) return undefined;
    switch (data.type) {
      case 'data-string':
      case 'data-number':
        return data.value;
      case 'data-date':
        throw new Error('[日期未分析]');
      case 'data-component':
        return editorService.findComponent(data.value)?.attrs.name || '——';
      case 'data-variable':
        return `${data.value}`; // ${variableStore.getVar(data.value) ?? '——'}
      case 'data-component-option': {
        const _splitValue = (data.value || '').split('|');
        if (_splitValue.length === 2) {
          const _component = editorService.findComponent(_splitValue[0]);
          const _options: { label: string, value: any }[] = _component?.attrs?.options ?? [];
          const _value = _options.find(i => i.value === _splitValue[1])?.value;
          return _value;
        }
        return '——';
      }
      default:
        return '——';
    }
  }
};

export default {
  state,
  service
}