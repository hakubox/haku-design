import type { RouteParams, RouteRecordName } from 'vue-router';

/** 设置 */
export interface Config {
  /** 操作模式（normal普通模式 / advanced高级模式 / engineering工程模式 */
  proMode: 'easy' | 'normal' | 'advanced' | 'engineering';
  /** 是否显示欢迎界面 */
  showWelcome: boolean;
  /** 自动保存 */
  autoSave: boolean;
  /** 自动保存间隔时长（分钟） */
  autoSaveDuration: number;
  /** 上次存储时间 */
  prevSaveTime: number;
  /** 是否显示额外配置 */
  showAttaProps: boolean;
}

/** 服务器环境 */
export type ServerEnvironment = 'development' | 'test' | 'production';

/** 服务器配置 */
export interface ServerConfig {
  /** 主题 */
  subject: string;
  /** 环境 */
  environment: ServerEnvironment;
  /** API接口地址 */
  apiSrc: string;
  /** postMessage域名白名单 */
  whiteList: string[];
}

/** 页面配置 */
export interface TabPageItem {
  /** 页面标题 */
  title?: string;
  /** 页面名称(code) */
  name?: RouteRecordName | null | undefined;
  /** 图标 */
  icon?: string;
  /** 页面路径 */
  path: string;
  /** 完整路径 */
  fullPath: string;
  /** 权限 */
  permission?: string;
  /** 参数 */
  params?: RouteParams;
  /** 是否固定 */
  fixed: boolean;
  /** Meta */
  meta: Record<string, any>;
}
