import { StyleValue } from "vue";

/** 应用颜色 */
export interface AppColor {
  /** 红色值：0~255 */
  r: number;
  /** 绿色值：0~255 */
  g: number;
  /** 蓝色值：0~255 */
  b: number;
  /** 透明度：0~1 */
  a: number;
  /** 临时Hue值 */
  tempHue?: number;
}

/** 渐变列表项 */
export interface GradientItem {
  /** 百分比定位（0~1） */
  progress: number;
  /** 颜色 */
  color: AppColor;
}

// 背景类型
export type AppBackgroundType = 'color' | 'linear-gradient' | 'radial-gradient' | 'conic-gradient' | 'image';

/**
 * 混合模式
 * - normal: 正常
 * - multiply: 正片叠底
 * - screen: 滤色
 * - overlay: 叠加
 * - darken: 变暗
 * - lighten: 变亮
 * - color-dodge: 颜色减淡
 * - color-burn: 颜色加深
 * - hard-light: 强光
 * - soft-light: 柔光
 * - difference: 差值
 * - exclusion: 排除
 * - hue: 色相
 * - saturation: 饱和度
 * - color: 颜色
 * - luminosity: 亮度
 * - initial: 初始
 * - inherit: 继承
 */
export type BlendMode = 'normal' | 'darken' | 'multiply' | 'color-burn' | 'lighten' | 'screen' | 'color-dodge' | 'overlay' | 'soft-light' |
  'hard-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'initial' | 'inherit';

/** 应用背景（单层） */
export interface AppBasicBackground {
  type: AppBackgroundType;
  /** 图层混合类型 */
  blendType: 'normal';
  /** 是否显示 */
  show: boolean;
  /** 透明度：0~1 */
  opacity: number;

  /** 父级样式 */
  parentStyle: Record<string, string>;
  /** 子级样式 */
  innerStyle: Record<string, string>;
}

/** 渐变相关尺寸信息 */
export interface GradientRectInfo {
  /** 最小X */
  minX: number;
  /** 最小Y */
  minY: number;
  /** 最大X */
  maxX: number;
  /** 最大Y */
  maxY: number;
  /** 中点X坐标 */
  centerX: number;
  /** 中点Y坐标 */
  centerY: number;
  /** 背景正方形半径 */
  radius: number;
  /** 渐变线角度 */
  rotate: number;
  /** 线段延长线与正方形相交的A坐标 */
  pointA: { x: number, y: number };
  /** 线段延长线与正方形相交的B坐标 */
  pointB: { x: number, y: number };
  /** 线段和整条延长线的比值 */
  ratio: number;
}

/** 背景 */
export type AppBackground = AppColorBackground | 
  AppLinearGradientBackground | 
  AppRadialGradientBackground | 
  AppConicGradientBackground |
  AppImageBackground;

/** 颜色型背景 */
export interface AppColorBackground extends AppBasicBackground {
  /** 类型：颜色 */
  type: 'color';
  /** 颜色 */
  color: AppColor;
}

/** 线性渐变型背景 */
export interface AppLinearGradientBackground extends AppBasicBackground {
  /** 类型：线性渐变 */
  type: 'linear-gradient';
  /** 是否循环渐变 */
  repeating: boolean;
  /** 渐变列表 */
  gradientList: GradientItem[];
  /** 第1个坐标点 - 横坐标 */
  x1: number;
  /** 第1个坐标点 - 纵坐标 */
  y1: number;
  /** 第2个坐标点 - 横坐标 */
  x2: number;
  /** 第2个坐标点 - 纵坐标 */
  y2: number;
}

/** 径向渐变型背景 */
export interface AppRadialGradientBackground extends AppBasicBackground {
  /** 类型：径向渐变 */
  type: 'radial-gradient';
  /** 是否循环渐变 */
  repeating: boolean;
  /** 基础圆半径 */
  radius: number;
  /** 椭圆长边和基础圆半径的比值 */
  ovalityRatio: number;
  /** 渐变列表 */
  gradientList: GradientItem[];
  /** 第1个坐标点 - 横坐标 */
  x1: number;
  /** 第1个坐标点 - 纵坐标 */
  y1: number;
  /** 第2个坐标点 - 横坐标 */
  x2: number;
  /** 第2个坐标点 - 纵坐标 */
  y2: number;
}

/** 圆锥渐变型背景 */
export interface AppConicGradientBackground extends AppBasicBackground {
  /** 类型：圆锥渐变 */
  type: 'conic-gradient';
  /** 基础圆半径 */
  radius: number;
  /** 椭圆长边和基础圆半径的比值 */
  ovalityRatio: number;
  /** 渐变列表 */
  gradientList: GradientItem[];
  /** 第1个坐标点 - 横坐标 */
  x1: number;
  /** 第1个坐标点 - 纵坐标 */
  y1: number;
  /** 第2个坐标点 - 横坐标 */
  x2: number;
  /** 第2个坐标点 - 纵坐标 */
  y2: number;
}

/** 图片型背景 */
export interface AppImageBackground extends AppBasicBackground {
  /** 类型：圆锥渐变 */
  type: 'image';
  /** 图片路径 */
  imageUrl: string;
  /** 填充方式 auto:自动；stretch:拉伸；cover:充满；contain:适应；repeat:平铺；repeat-x:横向平铺；repeat-y:纵向平铺  */
  fillMode: 'auto' | 'stretch' | 'contain' | 'cover' | 'repeat' | 'repeat-x' | 'repeat-y';
  /** 图片横向位置 */
  x: 'left' | 'center' | 'right' | number;
  /** 图片纵向位置 */
  y: 'top' | 'center' | 'bottom' | number;
  /** 旋转角度：0~360 */
  rotate: number;
  /** 横向翻转 */
  xFlipOver: boolean;
  /** 纵向翻转 */
  yFlipOver: boolean;

  /** 亮度：0~100 */
  brightness: number;
  /** 对比度：0~1 */
  contrast: number;
  /** 模糊：0~100 */
  blur: number;
  /** 灰度：0~1 */
  grayscale: number;
  /** 色调：0~360° */
  hueRotate: number;
  /** 反相：0~1 */
  invert: number;
  /** 饱和度：0~1 */
  saturate: number;
  /** 深褐色：0~1 */
  sepia: number;
}