import { StorageServiceType, StorageServiceStatus } from '../enum';

/** 版本历史实例 */
export interface VersionHistoryInstance {
  /** 历史版本Id */
  id: string;
  /** 历史版本号 */
  appVersion: string;
  /** 升级描述 */
  description: string;
  /** 历史版本备注 */
  remark: string;
  /** 历史版本创建人 */
  createUser: string;
  /** 版本更新时间 */
  updateTime: string;
}
