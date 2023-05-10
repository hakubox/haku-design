import { Component, ComponentGroup, FormDimensionItem } from '@/@types';
import { reactive } from 'vue';
import { toast } from '@/common/message';
import { AppLinearGradientBackground } from './index.d';

export * from './index.d';

/** 背景编辑器模块状态 */
export const state = reactive({
  
});

/** 背景编辑器模块逻辑 */
export const service = {
  /** 显示背景选择器 */
  showBackgroundDialog() {

  },
  /** 关闭背景选择器 */
  closeBackgroundDialog() {

  },
  /** 选择图片 */
  selectImage() {

  },
  /** 绘制线性渐变背景 */
  drawLinearGradient(gradient: AppLinearGradientBackground) {
    const _style = { } as Record<string, any>;
    const _panelRect = {
      width: 0,
      height: 0,
    };
    // 输出背景框位置/尺寸及渐变

    // 输出结果

  }
};

export default {
  /** 评分模块状态 */
  state,
  /** 评分模块逻辑 */
  service,
}