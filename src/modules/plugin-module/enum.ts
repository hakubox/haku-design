
/** 插件类型 */
export enum PluginType {
  /** 工具栏组件 */
  component = 'component',
  /** 事件触发 */
  eventTrigger = 'eventTrigger',
  /** 事件行为 */
  eventAction = 'eventAction',
  /** 配置 */
  config = 'config',
  /** 菜单工具栏 */
  menuComponentItem = 'menuComponentItem',
  /** 基础插件 */
  basicPlugin = 'basicPlugin',
}

/** 插件状态 */
export enum PluginStatus {
  /** 未初始化 */
  unInit = 'un-init', 
  /** 远程插件加载中 */
  initLoading = 'init-loading',
  /** 加载完毕 */
  complete = 'complete',
  /** 初始化错误 */
  error = 'error'
}

/** 组件加载类型 */
export enum PluginLoadType {
  /** 本地注册 */
  local = 'local-register',
  /** 包注册 */
  package = 'package-register',
  /** 代码注册 */
  code = 'code-register',
  /** 远程注册 */
  remote = 'remote-register',
}