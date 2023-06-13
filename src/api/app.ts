import { ExportAppBody } from '@haku-design/core';
import { deletes, get, post } from '@/lib/api';

/** 表单信息 */
export interface AppInfoDto {
  /** 应用id */
  id: string;
  /** 应用类型 */
  appType: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 头部标签列表（逗号隔开） */
  headerTags: string;
  /** 头部内容 */
  headerContent: string;
  /** 备注 */
  remark?: string;
  /** 主题 */
  theme?: string;
  /** 是否已发布 */
  isPublished?: boolean;
  /** 设备类型（用于搜索信息，真实值还是从json里取） */
  deviceType?: string;

  /** 是否包含分数 */
  hasScore?: boolean;
  /** 是否自动分级 */
  isAutoToGrade?: boolean;
  /** 主要内容 */
  formJson: string;
  /** 底部配置项 */
  footer: {
    tenantId: string,
    id: string,
    createdTime: string,
    createdBy: string,
    updatedTime: string,
    updatedBy: string,
    deletedTime: string,
    deletedBy: string,
    isDeleted: boolean,
    isShow: boolean,
    submitButtonText: string,
    resetButton: boolean,
    resetButtonText: string
  }
}

/** 查询问卷列表 */
export function getAppList(): Promise<AppInfoDto[]> {
  return new Promise((resolve, reject) => {
    get(`${process.env.serverApi}/FdForm/GetFormList`).then(data => {
      resolve(data);
    }).catch(err => {
      reject(err);
    });
  });
}

/** 获取应用信息详情 */
export function getAppInfo(id: string): Promise<any> {
  return get(`${process.env.serverApi}/FdForm/GetForm`, { id });
}

/** 新增问卷详细 ExportAppBody */
export function editForm(formInfo: AppInfoDto): Promise<any> {
  return get(`${process.env.serverApi}/FdForm/EditForm`, formInfo);
}