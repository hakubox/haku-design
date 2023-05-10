import { Component, ComponentGroup, FormDimensionItem } from '@/@types';
import { reactive } from 'vue';
import { toast } from '@/common/message';

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

  }
};

export default {
  /** 评分模块状态 */
  state,
  /** 评分模块逻辑 */
  service,
}