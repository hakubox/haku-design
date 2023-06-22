import type { Howl } from 'howler';

/** 时间轴 */
export interface TimeAxis {
  /** 时间轴Id */
  id: string;
  /** 时间轴总时长（毫秒） */
  duration: number;
  /** 是否播放中 */
  isPlay: boolean;
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
  /** 轨道Id */
  id: string;
  /** 轨道类型（动画不属于任一轨道） */
  type: TimelineTrackType;
  /** 是否锁定 */
  lock: boolean;
  /** 是否静音（仅针对音频轨道） */
  muted?: boolean;
  /** 时间轴Id */
  timeAxisId: string;
}

/** 时间轴片段 */
export interface TimelineFragment {
  /** 片段Id */
  id: string;
  /** 所属轨道Id */
  trackId: string;
  /** 所属时间轴Id */
  timeAxisId: string;
  /** 片段名称 */
  title: string;
  /** 片段类型（普通类型/附着类型） */
  type: 'normal' | 'attach';
  /** 轨道类型 */
  trackType: TimelineTrackType;
  /** 开始时间（ms） */
  startTime: number;
  /** 结束时间（ms） */
  endTime: number;
  /** 附着片段（例如给一个组件附着一段简单动画） */
  attachFragment?: TimelineFragment;
  /** 是否锁定 */
  lock: boolean;
  /** 是否禁用 */
  disabled: boolean;
  /** 背景Url */
  bgUrl?: string;
  /** url地址 / DOM节点 / 其他... */
  target: string | HTMLElement | ArrayBuffer;
}

/** 时间轴片段 - 音频 */
export interface AudioTimelineFragment extends TimelineFragment {
  /** 轨道类型 - 音频 */
  trackType: 'audio';
  /** DOM节点 / 其他... */
  buffer: ArrayBuffer;
  /** howl实例 */
  howl: Howl;
}

/** 时间轴片段 - 组件 */
export interface ComponentTimelineFragment extends TimelineFragment {
  /** 轨道类型 - 组件 */
  trackType: 'component';
  /** DOM节点 / 其他... */
  element: HTMLElement;
}

/** 关键帧 */
export interface KeyFrame {
  /** 关键帧Id（自动生成） */
  id: string;
  /** 所属片段Id */
  fragmentId: string;
  /** 关键帧时间（ms，相对时间） */
  time: number;
  /** 是否启用 */
  isEnabled: boolean;
  /** 关键帧属性 */
  attrs: Record<string, any>;
}