import { FormFooterConfig } from './form-footer-config';
import { FormDimensionConfig } from './form-dimension-config';
import { FormTimerConfig } from './form-timer-config';
import { FormStartPageConfig } from './form-start-page-config';
import { FormEndPageConfig } from './form-end-page-config';
import { RatingConfig } from './rating-config';
import { DeviceType, AppType, LayoutType } from './enum';
import { LayoutConfig } from './form-panel';

/** 应用配置 */
export declare class AppConfig {
  /** 唯一编号 */
  id: string;
  /** 应用版本号 */
  appVersion: string;
  /** 是否初始化（是否可以开始编辑） */
  isInit: boolean;
  /** 面板标题（需删除，已由pages取代） */
  // canvasTitle: string;
  /** 标题 */
  appTitle: string;
  /** 头部标签 */
  headerTags: string[];
  /** 头部内容 */
  headerContent: string;
  /** 描述 */
  description: string;
  /** 备注 */
  remark: string;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 头部高度 */
  headerHeight: number;
  /** 设备类型 */
  deviceType: DeviceType;
  /** 底部按钮配置 */
  footer: FormFooterConfig;
  /** 当前控件索引（自增） */
  componentIndex: number;
  /** 主题 */
  formTheme: string;
  /** 是否包含分数机制 */
  hasScore: boolean;
  /** 是否自动评分 */
  isAutoToGrade: boolean;

  // 新增

  /** 应用类型 */
  appType: AppType;
  /** 分页类型 */
  turnPageMode: 'default' | 'page' | 'no-page';
  /** 显示页面进度 */
  showPageProgress: boolean;
  /** 显示页面按钮 */
  showPageButton: boolean;
  /** 页面布局形式 */
  layoutConfig: LayoutConfig;
  /** 表单计时配置 */
  timerConfig: FormTimerConfig;
  /** 维度配置 */
  dimensionConfig: FormDimensionConfig;
  /** 起始页配置 */
  startPageConfig: FormStartPageConfig;
  /** 完成页配置 */
  endPageConfig: FormEndPageConfig;
  /** 评价列表 */
  ratingList: RatingConfig[];
  /** 是否显示题目序号 */
  showNo: boolean;
  /** 自动记录提交信息 */
  useAutoCache: boolean;
  /** 缓存超时时长 */
  autoCacheDuration: number;
  /** 用于匹配的额外Code */
  extraCode?: string;
}
