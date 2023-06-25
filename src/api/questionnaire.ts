import type { ExportAppBody } from '@haku-design/core';
import { get, post, type PageList } from '@/lib/api';

export interface QuestionaryBasicInfoDto {
  /** id */
  id: number;
  /** 版本号 */
  appVersion: number;
  /** 标题 */
  title: string;
  /** 备注 */
  remark?: string;
  /** 标签 */
  tags: string[];
  /** 创建时间 */
  createTime: string;
  /** 修改时间 */
  updateTime: string;
  /** 文本内容 */
  content: ExportAppBody;
  /** 状态 0:未发布 1:已发布 2:被停用 */
  status: number;
  /** 应用类型 */
  innerType: string;

  /** 描述 */
  description: string;
  /** 介绍 */
  introduction: string;
  /** 预览图地址（默认空字符串） */
  previewUrl: string;
  /** 标题 */
  appTitle: string;
  /** 应用类型 */
  appType: string;
}

/** 发布配置 */
export interface PublishConfig {
  /** 问卷Id */
  originId: string[];
  /** 答题者列表 */
  allowedList?: string[];
  /** 访问密码 */
  ansPassword?: string;
  /** 答题前需要登记的个人信息，逗号分隔 */
  configBeforeAns?: string;
  /** 开始访问日期 */
  effectiveBeginTime?: string;
  /** 结束访问日期 */
  effectiveEndTime?: string;
  /** 最大访问人数 */
  maxAnsNum?: number;
  /** 预定发布时间 */
  scheduledPublishTime?: string;
  /** 发布人 */
  userId?: string;
}

/** 查询问卷列表 */
export function listQuestionary({
  pageNum,
  pageSize = 10,
  searchKey = '',
}: {
  pageNum: number;
  pageSize?: number;
  searchKey?: string;
}) {
  return post(
    '/questionary/general/list',
    {
      pageNum,
      pageSize,
      searchKey,
    },
    { returnPageList: true },
  );
}

/** 查询问卷详细 */
export function getQuestionary(id: string): Promise<{ questionary: QuestionaryBasicInfoDto; tagList: number[] }> {
  return get(`/questionary/questionary/detail`, { id });
}

/** 查询问卷答案 */
export function getQuestionaryAnswer(id: string, userId: string, answerId?: string): Promise<{ questionary: QuestionaryBasicInfoDto, questionAnswerList: Record<string, any>[] }> {
  return get(`/questionary/questionaryAnswer/score-detail`, { questionaryId: id, userId, answerId });
}

/** 新增问卷 */
export function addQuestionary(data: Partial<QuestionaryBasicInfoDto>): Promise<QuestionaryBasicInfoDto> {
  return post('/questionary/general/add', data);
}

/** 保存问卷 */
export function saveQuestionary(data: Partial<ExportAppBody>, saveType: 'UPDATE' | 'UPGRADE'): Promise<QuestionaryBasicInfoDto> {
  return post('/questionary/general/save', {
    content: data,
    id: data?.appConfig?.id,
    saveType,
    title: data?.appConfig?.appTitle
  });
}

/** 查询问卷版本列表 */
export function getQuestionaryVersionList(id: string) {
  return get('/questionary/questionary/version-list', { id });
}

/** 切换问卷版本 */
export function setQuestionaryVersion(id: string, appVersion: number ) {
  return post('/questionary/questionary/set-current', { id, appVersion });
}

/** 删除问卷 */
// export function delQuestionary(id: string) {
//   return deletes(`/questionary/questionary/delete/${id}`);
// }

/** 发布问卷 */
// export function publishQuestionary(publishConfig: PublishConfig) {
//   return post('/questionary/questionary/publish', publishConfig);
// }
