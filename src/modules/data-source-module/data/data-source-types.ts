import { DataSourceType } from '../enum';
import type { DataSourceTypeItem } from '../@types';

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
    type: DataSourceType.database,
    icon: 'iconfont icon-lianjieliu',
    title: '关系型数据库（待开发）',
    enabled: false,
  },
  {
    type: DataSourceType.mongodb,
    icon: 'iconfont ',
    title: 'MongoDB（待开发）',
    enabled: false,
  },
];
