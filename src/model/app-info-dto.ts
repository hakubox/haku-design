import { AppEvent } from "@/modules/event-module";
import { ThemeConfig } from "@/modules/theme-module";
import { dateFormat } from "@/tools/common";
import { AppConfig, AppPage, AppType, ExportAppBody } from "@haku-design/core";


/** 表单信息 */
export interface AppInfoDto {
  /** 应用id */
  id: string;
  /** 应用类型 */
  appType: string;
  /** 预览图地址 */
  previewUrl?: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 头部标签列表（逗号隔开） */
  headerTags: string;
  /** 头部内容 */
  headerContent: string;
  /** 备注 */
  remark?: string;
  /** 主题名称（主要用于搜索信息） */
  theme?: string;
  /** 版本号 */
  version?: number;
  /** 主题JSON */
  themeJson?: string;
  /** 事件列表 */
  eventJson?: string;
  /** 是否已发布 */
  isPublished?: boolean;
  /** 设备类型（用于搜索信息，真实值还是从json里取） */
  deviceType?: string;
  /** 主要内容 */
  formJson: string;
  /** 创建时间 */
  createdTime: string;
  /** 更新时间 */
  updatedTime: string;
}

/** 转换AppInfoDto为ExportAppBody */
export function appInfoDto2AppBody(dto: AppInfoDto): ExportAppBody {
  const _formJson = JSON.parse(dto.formJson);

  const _theme = _formJson.themeJson ? JSON.parse(_formJson.themeJson) as {
    /** 主题Id */
    id?: string;
    /** 主题code */
    code?: string;
    /** 主题标题 */
    title?: string;
    /** 主题配置项 */
    config?: ThemeConfig;
  } : undefined;

  return {
    id: dto.id,
    isPublished: dto.isPublished ?? false,
    appType: dto.appType as AppType,
    title: dto.title,
    description: dto.description,
    headerTags: (dto.headerTags ?? '').split(','),
    headerContent: dto.headerContent,
    remark: dto.remark ?? '',
    appConfig: {
      id: dto.id,
      appType: dto.appType as AppType,
      appVersion: dto.version ?? 1,
      appTitle: dto.title,
      headerTags: (dto.headerTags ?? '').split(','),
      headerContent: dto.headerContent,
      remark: dto.remark ?? '',
      description: dto.description,
      background: _formJson.background ?? [],
      appTheme: dto.theme ?? 'default',
      layoutConfig: _formJson.layoutConfig,
      designConfig: _formJson.designConfig,
      questionnaireConfig: _formJson.questionnaireConfig,
      canvasConfig: _formJson.canvasConfig,
      createdTime: new Date(dto.createdTime).getTime(),
      updatedTime: new Date(dto.updatedTime).getTime(),
    },
    pages: _formJson.pages,
    events: dto.eventJson ? JSON.parse(dto.eventJson) as AppEvent[] : [],
    themeId: _theme?.id,
    themeConfig: _theme?.config,
    files: []
  };
}

/** 转换ExportAppBody为AppInfoDto */
export function appBody2AppInfoDto(body: ExportAppBody): AppInfoDto {
  return {
    id: body.id,
    appType: body.appType,
    title: body.title,
    description: body.description,
    headerTags: body.headerTags.join(','),
    headerContent: body.headerContent,
    remark: body.remark,
    theme: body.themeConfig?.title,
    version: body.appConfig.appVersion,
    themeJson: JSON.stringify(body.themeConfig),
    eventJson: JSON.stringify(body.events),
    isPublished: body.isPublished,
    deviceType: body.appConfig.designConfig.deviceType,
    formJson: JSON.stringify({
      pages: body.pages,
      background: body.appConfig.background,
      layoutConfig: body.appConfig.layoutConfig,
      designConfig: body.appConfig.designConfig,
      questionnaireConfig: body.appConfig.questionnaireConfig,
      canvasConfig: body.appConfig.canvasConfig,
    }),
    createdTime: dateFormat(body.appConfig.createdTime, 'yyyy-MM-dd HH:mm:ss'),
    updatedTime: dateFormat(body.appConfig.updatedTime, 'yyyy-MM-dd HH:mm:ss'),
  }
}