import { get, post, put, deletes, ApiReturn, PageList } from '@/lib/api';

/** 提交回答问卷 */
export function answerCommit(questionaryId: string, answer: Record<string, any>): Promise<any> {
  return post(`/questionary/questionaryAnswer/commit`, { questionaryId, answer });
}
