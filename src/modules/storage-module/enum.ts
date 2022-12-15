/** 对象存储服务类型 */
export enum StorageServiceType {
  /** 腾讯COS服务 */
  cos = 'cos',
  /** 阿里OSS服务 */
  oss = 'oss',
  /** 七牛云服务 */
  qiniu = 'qiniu',
}

/** 对象存储服务状态 */
export enum StorageServiceStatus {
  /** 未知 */
  unknown = 'unknown',
  /** 正常 */
  normal = 'normal',
  /** 错误 */
  fail = 'fail',
}

/** 文件类型 */
export enum StorageFileType {
  /** 图片类型 */
  image = 'image',
  /** Word文档类型 */
  word = 'word',
  /** 音频类型 */
  audio = 'audio',
  /** 其他类型 */
  other = 'other',
}

/** 排序类型 */
export enum SortType {
  letter = 1, // 按字母排序
  size, // 按大小排序
  date, // 按日期排序
}
