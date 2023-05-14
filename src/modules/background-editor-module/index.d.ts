
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

/** 应用背景（单层） */
export interface AppBasicBackground {
  type: AppBackgroundType;
  /** 图层混合类型 */
  mixedType: 'normal';
  /** 是否显示 */
  show: boolean;
  /** 透明度：0~1 */
  opacity: number;
}

/** 渐变相关尺寸信息 */
export interface GradientRectInfo {
  /** X1 */
  x1: number;
  /** Y1 */
  y1: number;
  /** X2 */
  x2: number;
  /** Y2 */
  y2: number;
  /** 中点X坐标 */
  x: number;
  /** 中点Y坐标 */
  y: number;
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
  AppRadialConicBackground |
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
export interface AppRadialConicBackground extends AppBasicBackground {
  /** 类型：圆锥渐变 */
  type: 'conic-gradient';
  /** 椭圆长边和基础圆半径的比值 */
  ovalityRatio: number;
  /** 渐变列表 */
  gradientList: GradientItem[];
  /** 坐标点 - 横坐标 */
  x: number;
  /** 坐标点 - 纵坐标 */
  y: number;
}

/** 图片型背景 */
export interface AppImageBackground extends AppBasicBackground {
  /** 类型：圆锥渐变 */
  type: 'image';
  /** 图片路径 */
  imageUrl: string;
  /** 填充方式 none:默认尺寸；fill:充满；cover:拉伸；contain:适应；repeat:平铺  */
  fillType: 'none' | 'fill' | 'contain' | 'cover' | 'repeat';
  /** 平铺方式 no-repeat:不平铺；x-repeat:横向平铺；y-repeat:纵向平铺；repeat:完全平铺 */
  repeatType: 'no-repeat' | 'x-repeat' | 'y-repeat' | 'repeat';
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

  /** 亮度 */
  brightness: number;
  /** 对比度：0~1 */
  contrast: number;
  /** 模糊：0~100% */
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