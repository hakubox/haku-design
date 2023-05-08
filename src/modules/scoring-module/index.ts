import { state as editorState, service as editorService } from '@haku-design/editor';
import { state as formFillState, service as formFillService } from '@haku-design/form-fill';
import { type Component, type ComponentGroup, type FormDimensionItem } from '@haku-design/core';
import { ComponentCategory } from '@haku-design/core/src/@types/enum';
import { reactive } from 'vue';
import { message } from '@haku-design/common';

/** 评分模块状态 */
export const state = reactive({
  /** 开启评分模式 */
  isScoring: false,
  /** 总分数 */
  totalScore: 0,
  /** 维度得分 */
  dimensionScore: [] as { dimensionName: string, score: number | undefined }[],
  /** 评分 */
  scores: {} as Record<string, { componentId: string, score: number | undefined }>,
});

/** 评分模块逻辑 */
export const service = {
  init() {
  },
  /** 重置评分 */
  resetScore() {
    state.scores = {};
  },
  /** 提交评分 */
  submitScore() {
    return new Promise<Record<string, { componentId: string, score: number | undefined }>>((resolve, reject) => {
      const _components: (Component | ComponentGroup)[] = editorService.getAllFormItem();
      const _checkResult = service.checkScore(_components);
      if (_checkResult === true) {
        resolve(state.scores);
      } else {
        message.toast(_checkResult.message, 'error');
        reject(_checkResult);
      }
    })
  },
  /** 校验评分 */
  checkScore(components: (Component | ComponentGroup)[]) {
    const _failComponents = components.filter(i => {
      if (state.scores[i.id]?.score === undefined) {
        const _component = editorService.findComponent(i.id);
        if (_component?.attrs.required && formFillState.formInfo[i.id]?.value) {
          return true;
        }
      }
      return false;
    });
    if (_failComponents.length > 0) {
      return {
        message: '必填项未作评分',
        components: _failComponents
      }
    } else return true;
  },
  /** 设置组件评分 */
  setComponentScore(componentId: string, score: number | undefined) {
    if (!state.scores?.[componentId]) {
      state.scores[componentId] = { componentId, score: undefined };
    }
    state.scores[componentId].score = score;
  },
  /** 获取组件评分 */
  getComponentScore(componentId: string) {
    return state.scores[componentId]?.score;
  },
  /** 获取当前评价 */
  getCurrentRating() {
    if (
      editorState.appConfig.questionnaireConfig.dimensionConfig?.isOpen &&
      editorState.appConfig.questionnaireConfig.dimensionConfig?.dimensionList?.length
    ) {
      throw new Error('暂无法获得维度评价');
    } else {
      const _score = service.countScore();
      const ratingList = editorState.appConfig.questionnaireConfig.ratingList;
      return (
        ratingList?.find((i) => {
          if (i.startScore > _score) return false;
          else if (i.endScore && i.endScore < _score) return false;
          return true;
        }) || { title: '暂无评价', description: '暂无评价' }
      );
    }
  },
  /** 获取选项的score */
  getOptionScore(componentId: string, value: string) {
    const _component = editorService.findComponent(componentId);
    if (_component) {
      const _option = _component.attrs.options.find((i) => i.value === value);
      if (_option) {
        return _option.score ?? undefined;
      }
    }
    return undefined;
  },
  /** 计算得分 */
  countScore() {
    if (editorState.appConfig.questionnaireConfig.hasScore) {
      const _components: (Component | ComponentGroup)[] = editorService.getAllFormItem();
      /** 总分数 */
      let _totalScore = 0;
      /** 维度配置 */
      const _dimensions: FormDimensionItem[] = editorState.appConfig.questionnaireConfig.dimensionConfig?.isOpen ? editorState.appConfig.questionnaireConfig.dimensionConfig?.dimensionList : [];

      _components.filter((item) => !item.isGroup && [ComponentCategory.normal, ComponentCategory.complex].includes(item.type)).forEach((item) => {
        // 普通题
        // if (item.attrs.score) {
        //   _totalScore += service.formInfo[item.id].value;
        // }
        // 单/多选题
        const _optionIndex = item.attrs?.options?.findIndex?.(
          (option) => option.value === formFillState.formInfo?.[item.id]?.value,
        );
        // 查询对应维度
        const _dimension = _dimensions.find((i) => i.dimensionQuestions.includes(item.id));
        if (_optionIndex >= 0) {
          const _option = item.attrs.options[_optionIndex];
          if (formFillState.formInfo[item.id].value?.includes?.(_option.value)) {
            _totalScore += _option.score;
          }
          if (_dimension) {
            if (!state.dimensionScore[_dimension.dimensionId]) state.dimensionScore[_dimension.dimensionId] = 0;
            state.dimensionScore[_dimension.dimensionId] += _option.score;
          }
        }
      });

      state.totalScore = _totalScore;
      return _totalScore;
    } else {
      return 0;
    }
  },
};

export default {
  /** 评分模块状态 */
  state,
  /** 评分模块逻辑 */
  service,
}