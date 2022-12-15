import { VarType } from './enum';

/** 插件信息 */
interface PluginInfo {
  /** 插件名称 */
  name: string;
  /** 插件版本 */
  version: string;
  /** 插件标题 */
  title: string;
  /** 作者 */
  author: string;
  /** 插件图标地址 */
  iconSrc?: string;
  /** 插件描述 */
  description: string;
  /** Gitee地址 */
  giteeSrc: string;
  /** GitHub地址 */
  githubSrc: string;
  /** NPM库名 */
  npmModuleName?: string;
  /** 插件配置 */
  config: PluginConfig;
}

/** 插件 */
interface Plugin extends PluginInfo {
  /** 插件Id */
  id: string;
  /** 视图页 */
  viewPageUrl: string;
  /** 是否启用 */
  isEnable: string;
  /** 用户配置 */
  userConfig: Record<string, any>;
}

/** 插件配置 */
interface PluginConfig {
  /** 名称 */
  name: string;
  /** 类型 */
  type: VarType;
  /** 默认值 */
  default: string;
  /** 是否必填 */
  required: boolean;
}
