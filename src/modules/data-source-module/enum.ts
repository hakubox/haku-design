/** 数据源类型 */
export enum DataSourceType {
  /** 静态数据绑定（包含导入数据） */
  static = 'static',
  /** 使用API绑定 */
  api = 'api',
  /** 数据库直连（配合后端接口完成，需要传入地址/账号密码/端口信息以连接） */
  database = 'database',
  /** mongodb直连（配合后端接口完成，需要传入地址/账号密码/端口信息以连接） */
  mongodb = 'mongodb',
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
