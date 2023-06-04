import { Component } from './component';

/** 问卷 */
export interface Questionnaire {
  /** 问卷ID */
  id: String;
  /** 问卷标题 */
  title: String;
  /** 问卷状态 */
  state: String;
  /** 可拖拽组件列表 */
  components: Component[];
  /** 备注 */
  notes: String;
  /** 创建时间 */
  createTime: Date;
}
