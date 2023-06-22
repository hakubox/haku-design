
/** 组件坐标尺寸信息 */
export interface ComponentRect {
  /** x坐标（左上角） */
  x: number;
  /** y坐标（左上角） */
  y: number;
  /** 右下角x坐标 */
  x2: number;
  /** 右下角y坐标 */
  y2: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 旋转角度（°） */
  rotate: number;
}