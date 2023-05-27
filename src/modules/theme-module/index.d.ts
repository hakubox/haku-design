
// 1、背景图（背景图填充方式、位置、大小、是否冻结）
// 2、标题（字体、大小、颜色、字粗、字体样式）
// 3、测评时长（字体、大小、颜色、字粗、阴影）
// 4、头部描述文字（字体、大小、颜色）
// 5、组件块。（间距、背景色、阴影）
// 6、主题色。
// 7、按钮。（默认背景色、字体大小）
// 8、标签文本。（默认字体颜色、默认行高）

declare module '@haku-design/command' {

  /** 全局命令  */
  interface GlobalCommand {
    /** 切换主题 */
    'change-theme': {
      value: 'default' | 'dark' | 'translucent',
      attrs: {
        /** 主题标题 */
        themeTitle: string,
        /** 鼠标事件（坐标） */
        loc?: { x: number, y: number },
      }
    }
  }
}

/** 主题配置 */
export interface ThemeConfig {
  /** 主题Id */
  id?: string;
  /** 主题代码 */
  code: string;
  /** 主题标题 */
  title: string;
  /** 主题描述 */
  description?: string;
  /** 备注 */
  remark?: string;

  /** 额外CSS定义 */
  css: string;
  
  /** 主题色 */
  primaryColor: string;
  
  // 标题相关

  /** 标题字色 */
  titleFontColor?: string;
  /** 标题字体大小 */
  titleFontSize?: 'initial' | 'inherit' | string;
  /** 标题位置 */
  titleAlign?: 'left' | 'center' | 'right';
  /** 标题字体样式 */
  titleFontStyle?: 'initial' | 'italic' | 'oblique' | 'inherit';
  /** 标题字体粗细 */
  titleFontWeight?: 'initial' | 'bold' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

  // 背景相关

  /** 背景类型 （无 / 纯色 / 渐变色 / 背景图） */
  backgroundType?: 'none' | 'color' | 'gradient' | 'image';
  /** 背景色 */
  appBackgroundColor?: string;
  /** 背景图（关联文件） */
  backgroundImage?: string;
  /** 背景透明度 */
  backgroundOpacity?: number;
  /** 背景位置 */
  backgroundPosition?: ['left' | 'center' | 'right', 'top' | 'center' | 'bottom'];
  /** 背景大小 */
  backgroundSize?: [number?, number?];
  /** 背景重复 */
  backgroundRepeat?: [boolean, boolean];

  // 描述文字

  /** 描述字体大小 */
  descriptionFontSize?: 'initial' | 'inherit' | number;
  /** 描述字体颜色 */
  descriptionFontColor?: string;

  // 组件/内容相关

  /** 内容文本颜色 */
  contentFontColor?: string;
  /** 内容字体大小 */
  contentFontSize?: 'initial' | 'inherit' | number;
  /** 组件间隙 */
  componentPadding?: number;

}