import { deletes, get, post } from '@/lib/api';

/** 表单信息 */
export interface FormInfoDto {
  /** id */
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
  /** ??? */
  formJson: string;
  /** ??? */
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

/** 查询问卷详细 */
export function getFormList(id: string): Promise<any> {
  return get(`/api/FdForm/GetFormList`, { id });
}

/** 新增问卷详细 ExportAppBody */
export function editForm(formInfo: FormInfoDto): Promise<any> {
  return get(`/api/FdForm/EditForm`, formInfo);
}