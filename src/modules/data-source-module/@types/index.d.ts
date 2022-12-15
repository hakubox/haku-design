import { DataSourceType, DataTypeEnum } from '../enum';

/** 数值类型 */
export type DataType<T> = string | number | boolean | Record<string, T> | T[];

/** 数据源数据项 */
export interface DataSourceDataItem {
  title: string;
  value: any;
  selectable?: boolean;
  children: DataSourceDataItem[];
}

/** 数据源 */
export interface DataSource {
  /** Id */
  id: string;
  /** 标题 */
  title: string;
  /** 图标 */
  icon: string;
  /** 数据源类型 */
  type: DataSourceType;
  /** 是否启用 */
  enabled: boolean;
  /** 数据 */
  data: any | DataSourceDataItem[];
  /** 最后获取数据日期 */
  lastTime: number;
  /** 说明 */
  remark?: string;
}

export interface DataSourceTypeItem {
  /** 标题 */
  title: string;
  /** 图标 */
  icon: string;
  /** 数据源类型 */
  type: DataSourceType;
  /** 是否启用 */
  enabled: boolean;
}

/** 绑定数据 */
export interface SourceData<T = string> {
  /** 类型 */
  type: DataTypeEnum;
  /** 值 */
  value: DataType<T>;
  /** 子项 */
  children: SourceData;
  /** 说明 */
  description: string;
}

/** API接口 */
export interface Api {
  /** 接口Id */
  id: string;
  /** 名称/别名 */
  name: string;
  /** 接口类型 */
  type: 'get' | 'post';
  /** 接口地址 */
  address: string;
  /** 描述 */
  remark: string;
  /** 参数 */
  params?: Record<string, any>;
}
