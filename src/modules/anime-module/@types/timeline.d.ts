
/** 时间轴 */
export interface Timeline {
  /** 时间轴Id */
  id: string;
  /** 时间轴总时长（毫秒） */
  duration: number;
  /** 时间轴轨道 */
  tracks: TimelineTrack[];
}

/** 轨道类型（动画不属于任一轨道）
 * @alias **text** 文本
 * @alias **gif** 动图
 * @alias **component** 组件
 * @alias **audio** 音频
 * @alias **effects** 特效
 */
export type TimelineTrackType = 'text' | 'gif' | 'component' | 'audio' | 'effects';

/** 时间轴轨道 */
export interface TimelineTrack {
  /** 轨道类型（动画不属于任一轨道） */
  type: TimelineTrackType;
  /** 是否锁定 */
  lock: boolean;
  /** 是否静音（仅针对音频轨道） */
  muted?: boolean;
  /** 片段列表 */
  fragments: TimelineFragment[];
}

/** 时间轴片段 */
export interface TimelineFragment {
  /** 片段名称 */
  title: string;
  /** 片段类型（普通类型/附着类型） */
  type: 'normal' | 'attach';
  /** 开始时间（ms） */
  startTime: number;
  /** 结束时间（ms） */
  endTime: number;
  /** 关键帧列表 */
  keyFrames: KeyFrame[];
  /** 附着片段（例如给一个组件附着一段简单动画） */
  attachFragment: TimelineFragment;
  /** 是否锁定 */
  lock: boolean;
  /** 是否禁用 */
  disabled: boolean;
}

/** 关键帧 */
export interface KeyFrame {
  /** 关键帧Id（自动生成） */
  id: string;
  /** 关键帧时间（ms） */
  time: number;
  /** 关键帧属性 */
  attrs: Record<string, any>;
}