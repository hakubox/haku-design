import { AppConfig, AppPage } from './';
import { AppEvent } from '@haku-design/event';
import type { ThemeConfig } from '@haku-design/theme';
import { AppType } from './enum';

/** 用于导出的应用主体 */
export interface ExportAppBody {
  /** 应用Id */
  id: string;
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
  /** 头部描述 */
  headerContent: string;
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
  /** 主题 */
  theme: {
    id: string,
    code: string,
    config: string,
    title: string,
  },
}