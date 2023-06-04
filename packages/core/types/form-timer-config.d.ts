/** 表单记时配置（适用于问卷及课程） */
export interface FormTimerConfig {
  /** 是否开启记时 */
  isOpen: boolean;
  /** 是否自动记时 */
  isAutoTiming?: boolean;
  /** 超时时长 */
  timeOutDuration?: number;
  /** 显示提示 */
  showTooltip?: boolean;
  /** 超时提醒文本 */
  timeOutRemind?: string;
  /** 超时自动提交 */
  timeOutAutoSubmit?: boolean;
  /** 超时提醒提前时长（例如1分钟） */
  remindAdvanceDuration?: number;
  /** 是否开启单题记时 */
  isOpenSingleQuestion?: boolean;
  /** 单题超时时长 */
  singleQuestionTimeOutDuration?: number;
  /** 单题超时自动跳过 */
  singleQuestionTimeOutAutoSkip?: boolean;
  /** 最小经过时长 */
  minDuration?: number;
  /** 是否强制最小时长 */
  isEnforceMinDuration?: boolean;
  /** 最小时长提示 */
  minDurationTooltip?: string;
}
