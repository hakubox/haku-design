import { AppConfig } from '@/@types';
import { AppEvent } from '@/modules/event-module/@types';
import { AppPage } from '@/@types/app-page';
import { StorageFileInfo } from "@/modules/storage-module/@types";
import type { ThemeConfig } from './@types';

/** 用于导出的应用主体 */
export interface ExportAppBody {
  /** 应用配置 */
  appConfig: AppConfig;
  /** 事件列表 */
  events: AppEvent[];
  /** 页面配置 */
  pages: AppPage[];
  /** 文件列表 */
  files: string[];
  /** 主题配置 */
  theme: {
    /** 主题Id */
    id?: string;
    /** 主题标题 */
    title: string;
    /** 主题Code */
    code: string;
    /** 主题配置 */
    config: ThemeConfig;
  };
  /** 预览图地址（默认空字符串） */
  previewUrl: string;
}