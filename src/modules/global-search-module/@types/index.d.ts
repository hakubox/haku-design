

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
  /** 标题 */
  title: string;
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