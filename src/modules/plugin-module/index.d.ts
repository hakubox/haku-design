import { PluginLoadType, PluginStatus, PluginType } from '../enum';
import { VarType } from './enum';

/** 插件依赖项 */
export interface PluginDependency {
  /** 插件名称 */
  pluginName: string;
  /** 版本号 */
  version: string;
}

/** 插件基本配置信息 */
export interface PluginInfo {
  /** 关联父级插件 */
  parent?: string;
  /** 插件名称 */
  name: string;
  /** 插件标题 */
  title: string;
  /** 插件描述 */
  description?: string;
  /** 插件版本（版本使用x.x.x-命名） */
  version: string;
  /** 作者 */
  author?: string;
  /** 项目主页地址 */
  homepage?: string;
  /** 插件图标URL */
  icon?: string;
  /** 插件类型 */
  pluginType: PluginType;
  /** 是否已过期/弃用 */
  deprecated?: boolean;
  /** 依赖项 */
  dependencies?: { pluginName: string, version: string }[];
  /** 内核（设计器）版本 */
  coreVersion?: string;
  /** 注册 */
  register?: (() => void) | (() => Promise<void>);
  /** 取消注册 */
  unRegister?: (() => void) | (() => Promise<void>);
  /** 应用加载事件 */
  onloadApp?: (() => void) | (() => Promise<void>);
}

/** 插件实例 */
export interface PluginInstance extends PluginInfo {
  /** 插件Id */
  id: string;
  /** 注册时间（时间戳） */
  registerDate: number;
  /** 插件状态 */
  status: PluginStatus;
  /** 是否启用 */
  isEnable: boolean;
  /** 加载类型 */
  loadType: PluginLoadType;
  /** 用户配置 */
  userConfig: Record<string, any>;
}