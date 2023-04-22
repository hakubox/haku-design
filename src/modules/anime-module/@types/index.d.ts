import { GeneralProperty } from "@/@types";

/** 简单动画-方向 */
export type SimpleAnimeDirection = 'none' | 'left' | 'right' | 'top' | 'bottom';

/** 简单动画 */
export interface SimpleAnime {
  /** 动画名称 */
  animeName: string;
  /** 动画标题 */
  animeTitle: string;
  /** 动画描述 */
  description?: string;
  /** 默认属性 */
  attrs: Record<string, any>;
  /** 动画类型(入场/出场/强调) */
  animeType: 'in' | 'out' | 'emphasize';
  /** 动画函数（如果没有则取css动画） */
  animeFn?: (el: HTMLElement, attrs: Record<string, any>) => gsap.core.Tween | gsap.core.Timeline | undefined;
  /** 可选择方向 */
  // directions: Partial<Record<SimpleAnimeDirection, any>>;
  /** 仅针对文字 */
  onText: boolean;
  /** 属性列表 */
  propertys?: GeneralProperty[];
}

/** 简单动画配置项 */
export interface SimpleAnimeConfig {
  /** 动画名称 */
  animeName: string;
  /** 时长（ms） */
  duration: number;
  /** 缓动类型 */
  easing: string;
  /** 循环次数（true为无限循环） */
  loop: number | true;
  /** 方向（默认为'none'） */
  direction: SimpleAnimeDirection;
  /** 延迟时长（ms） */
  delay?: number;
  /** 间隔时长（ms） */
  interval?: number;
  /** 属性 */
  attrs: Record<string, any>;
}