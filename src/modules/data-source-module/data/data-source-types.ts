import { DataSourceType } from '../enum';
import type { DataSourceTypeItem } from '../index.d';

/** 事件行为 */
export const dataSourceTypes: DataSourceTypeItem[] = [
  {
    type: DataSourceType.static,
    icon: 'iconfont icon-shebeiguanli',
    title: '静态数据源',
    enabled: true,
  },
  {
    type: DataSourceType.api,
    icon: 'iconfont icon-liujisuan',
    title: 'API接口',
    enabled: true,
  },
  {
    type: DataSourceType.source,
    icon: 'iconfont icon-lianjieliu',
    title: '数据源',
    enabled: false,
  },
];
