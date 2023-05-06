import { AppConfig } from '@/@types';
import { AppEvent } from '@/modules/event-module/@types';
import { AppPage } from '@/@types/app-page';
import { StorageFileInfo } from "@/modules/storage-module/@types";
import type { ThemeConfig } from './@types';
import { AppType } from './enum';

/** 用于导出的应用主体 */
export interface ExportAppBody {
  /** 应用Id */
  id: _appConfig.id;
  /** 预览图 */
  previewUrl?: string;
  /** 应用类型 */
  appType: AppType,
  /** 应用标题 */
  title: _appConfig.appTitle;
  /** 应用描述 */
  description: _appConfig.description;
  /** 头部标签列表 */
  headerTags: string[];
  /** 头部描述 */
  headerContent: _appConfig.headerContent;
  /** 备注 */
  remark: _appConfig.remark;

  /** 应用配置项 */
  appConfig: AppConfig;
  /** 页面列表 */
  pages: AppPage[];
  /** 事件列表 */
  events: AppEvent[];
  /** 相关文件 */
  files: any[];
  /** 主题 */
  theme: {
    id: themeState.themeConfig.id,
    code: themeState.currentThemeCode,
    config: themeState.themeConfig,
    title: themeState.themeConfig.title,
  },
}