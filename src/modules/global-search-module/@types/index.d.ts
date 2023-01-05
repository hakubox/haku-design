

/** 搜索项分组 */
export type GlobalSearchGroup = 'guide' | 'function' | 'config' | 'components' | 'event' | 'theme' | 'variable' | 'plugin';

/** 搜索项分组实例 */
export interface GlobalSearchGroupInstance {
  /** 分组名 */
  name: GlobalSearchGroup;
  /** 标题 */
  title: string;
  /** 图标 */
  icon: string;
}

/** 全局搜索项 */
export interface GlobalSearchItem {
  /** 搜索项Id */
  id?: string;
  /** 分组 */
  group: GlobalSearchGroup;
  /** 相关标签（参考antd/tag组件） */
  tags?: { label: string | (() => string), color: string | (() => string) }[];
  /** 标题 */
  title: string;
  /** 操作项（按钮列表） */
  actions?: GlobalSearchItemAction[];
  /** 面包屑 */
  crumbs: GlobalSearchItemCrumb[];
  /** 跳转（暂定） */
  goto: string | Function;
  /** 别名/近似文本 */
  alias?: string[];
  /** 描述（暂定） */
  description?: string;
  /** 相关内容 */
  related?: GlobalSearchItemCrumb[];
}

/** 全局搜索项面包屑 */
export interface GlobalSearchItemCrumb {
  /** 标签 */
  label: string;
  /** 图标 */
  icon?: string;
  /** 提示 */
  tooltip?: string;
  /** 跳转（暂定） */
  goto?: Function;
}

/** 全局搜索项面包屑 */
export interface GlobalSearchItemAction {
  /** 按钮类型（外观，参考antd/button组件） */
  type: 'link' | 'primary' | 'default' | ((val: any) => 'link' | 'primary' | 'default');
  /** 标签 */
  label: string | ((val: any) => string);
  /** 是否为警告按钮 */
  danger?: boolean | ((val: any) => boolean);
  /** 图标 */
  icon?: string;
  /** 操作确认提示文本 */
  confirm?: string | ((val: any) => string);
  /** 操作函数 */
  action: Function;
}