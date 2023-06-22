import { type AppEvent } from '@/modules/event-module';
import { AppPage, AppConfig } from '@haku-design/core';
import type { ThemeConfig } from '@/modules/theme-module';
import { AppType } from '../enum';

/** 用于导出的应用主体 */
export interface ExportAppBody {
  /** 应用Id */
  id: string;
  /** 是否已发布 */
  isPublished: boolean;
  /** 预览图 */
  previewUrl?: string;
  /** 应用类型 */
  appType: AppType,
  /** 应用标题 */
  title: string;
  /** 应用描述 */
  description: string;
  /** 头部标签列表 */
  headerTags: string[];
  /** 备注 */
  remark: string;

  /** 应用配置项 */
  appConfig: AppConfig;
  /** 页面列表 */
  pages: AppPage[];
  /** 事件列表 */
  events: AppEvent[];
  /** 相关文件 */
  files: any[];
  /** 主题Id */
  themeId?: string;
  /** 主题 */
  themeConfig?: {
    /** 主题Id */
    id?: string;
    /** 主题code */
    code?: string;
    /** 主题配置项 */
    config?: ThemeConfig;
    /** 主题标题 */
    title?: string;
  },
}