import { ComponentAnswerType } from '@haku-design/core/@types/component';

/** 表单填写信息的有效时间段 */
export interface TimerInfoItem {
  /** 开始时间 */
  startTime: number;
  /** 使用的时长 */
  duration: number;
}

/** 表单填写信息的每题时间段 */
export interface AnswerTimerInfoItem {
  /** 关联Id */
  componentId: string;
  /** 开始时间 */
  startTime: number;
  /** 使用的时长 */
  duration: number;
}

/** 表单填写信息的记时信息 */
export interface TimerInfo {
  /** 是否已开始记时 */
  isStart: boolean;
  /** 是否已暂停 */
  isPause: boolean;
  /** 是否已结束 */
  isComplete: boolean;
  /** 开始时间 */
  startTime: number;
  /** 暂停时间 */
  pauseTime: number;
  /** 完成时间 */
  completeTime?: number;
  /** 完成时长 */
  duration: number;
  /** 记时信息（有效时间段，正常只有一段） */
  timeList: TimerInfoItem[];
  /** 答案时间列表 */
  answerTimeList: AnswerTimerInfoItem[];
}

/** 表单填写信息项 */
export interface FormInfoItem {
  /** 题目Id */
  id: string;
  /** 值类型 */
  type: ComponentAnswerType;
  /** 值 [{ label: '完全不会', value: '1' }] */
  value?: any;
  /** 分数 */
  score?: number;
}

/** 缓存实例 */
export interface TempStorage {
  /** 用户Id */
  userId: string;
  /** 问卷Id */
  qid: string;
  /** 缓存记录创建时间 */
  createTime: number;
  /** 缓存记录修改时间 */
  updateTime: number;
  /** 用户字符串 */
  userAgent: string;
  /** 数据 */
  data: {
    /** 表单信息 */
    formInfo: Record<string, FormInfoItem>;
    /** 计时器 */
    timerInfo: TimingInfo;
  };
  /** 用于匹配的额外Code */
  extraCode?: string;
}

/** 计时信息 */
export interface TimingInfo {
  /** 是否开始 */
  isStart: boolean;
  /** 开始时间 */
  startTime: number;
  /** 完成时间 */
  completeTime?: number;
  /** 经过时长 */
  duration: number;
  /** 是否暂停 */
  isPause: boolean;
  /** 暂停时间 */
  pauseTime: number;
  /** 是否完成 */
  isComplete: boolean;
  /** 时间列表 */
  timeList: { startTime: number; duration: number }[];
  /** 答题时间列表 */
  answerTimeList: { startTime: number; duration: number; componentId: string }[];
}

/** 错误信息 */
export interface ErrorInfo {
  /** 是否错误（正常情况为true） */
  isError: boolean;
  /** 组件Id */
  componentId: string;
  /** 错误信息 */
  errorText: string[];
  /** 规则列表（暂时不用） */
  rules?: any[];
}
