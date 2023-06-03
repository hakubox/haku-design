/** 数据源类型 */
export enum DataSourceType {
  /** 静态数据绑定（包含导入数据） */
  static = 'static',
  /** 使用API绑定 */
  api = 'api',
  /** 数据源 */
  source = 'source',
}

/** 数据类型 */
export enum DataTypeEnum {
  /** 字符串 */
  string = 'string',
  /** 数值 */
  number = 'number',
  /** 数组 */
  array = 'array',
  /** 对象 */
  object = 'object',
}
