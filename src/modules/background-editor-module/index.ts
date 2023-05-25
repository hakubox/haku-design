import { StyleValue, reactive } from 'vue';
import { toast } from '@/common/message';
import { state as editorState } from '@/modules/editor-module';
import type {
  AppBackground,
  AppBackgroundType,
  AppColor,
  AppLinearGradientBackground,
  AppConicGradientBackground,
  AppRadialGradientBackground,
  GradientRectInfo,
  AppImageBackground
} from './index.d';
import { distance } from '@/tools/common';
import { AppType } from '@/@types/enum';

export * from './index.d';

/** 默认方格图片 */
export const defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFAAQMAAAD3XjfpAAAABlBMVEX///8AAABVwtN+AAAAUUlEQVRo3u3ZIQ4AMAwCwP7/05vaVE0daQ5JTuCp81MvbQeCIAiCIAiCIJgGI0aAIAiCIAiCIAjOYfAyEARBEARBEARB/wwIgiAIgiAIgivhBfk86GnT8zOGAAAAAElFTkSuQmCC';

/** 背景编辑器模块状态 */
export const state = reactive({
  /** 是否显示 */
  isShow: false,
  /** 弹出框样式 */
  dialogCss: {} as Record<string, any>,
  /** 显示背景操作面板 */
  showBackgroundPanel: false,
  /** 当前背景 */
  currentBackground: { type: 'color', blendType: 'normal', show: true, opacity: 1, color: { r: 216, g: 216, b: 216, a: 1 } } as AppBackground,
  /** 背景类型列表 */
  backgroundTypeList: [
    { name: 'color', title: '纯色', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAACLSURBVFiF7dexDcMwDETRT6fOAhkjWUNzODN5Dy+QnlogAygDeAC6kArDcM00d4AgQc09ljR6HsBz3BlpwA+oBrzG+UdWgALM7h5ZcfcAZqDYeBARS+boZvYGmDJLryKAAAIIIIAAAggggAACCDDRF0VqrWmlh65m9I24pLWfLDdgO3zck4ob8AG+OxCjg8ww/O8tAAAAAElFTkSuQmCC' },
    { name: 'linear-gradient', title: '线性渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAD1SURBVFiF7ZQhjsMwEEX/KCbBJs41AspKcqVdkj3AhvRA4WU+RhRgFEWWpSi2Ey8y6JaPQfORNeQ9/RmZAGCapl/nXO+cA0eISFdV9Wzb9pu01o8Y4xcL+V+aphnEvu/38zyhlIJSigVsjIExBsuy9MJ7fwMAKSVCCCwCUkrM84x1XSEy1HvPAs/J3PICMcaXAVcy92qgfAPHcbwMuJK55Ru4bqC4wLWC4g3kB3cDbwKfewPFBa4VXA0Ub6D4R1R8BdnGWou6rlng27Yhxggi0iKlNIQQ+hACrLUsAjlE9CQA6LrukVK6p5RuHGAhBIQQwziOP39YyzDUDdMzzwAAAABJRU5ErkJggg==' },
    { name: 'radial-gradient', title: '径向渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAArlBMVEUAAABJSUlHR0dKSkpKSkpDQ0NCQkJwcHB/f3+IiIhRUVHBwcG3t7egoKCUlJRaWlpUVFROTk5KSkqnp6eZmZl5eXlpaWnOzs6rq6udnZ2SkpKOjo6KioqFhYV2dnZzc3Nra2tiYmLY2NjHx8dlZWVVVVXt7e3j4+Pf39/V1dXKysq8vLyysrKwsLCtra2jo6OBgYF8fHx7e3tfX19LS0v39/fn5+e4uLhnZ2dcXFwz48DTAAAAB3RSTlMAxIXEwolHz+ZFVgAAAaZJREFUOMuNU+d6gzAQAwJ4sGwTIOydPZrRNnn/F+v5a78mbZNQ/ZU4dGdJuYFmqCMhRqpuKvdgCE4p63tGKRf6H1o7ceYd6y4Mu/roMX7SfvIq0F2FUAlAqDpfGFdvaFNQr65QEewxYB8UqKp7Kq5WgA9RccA5IVlGSI4PBQo9Kr7nSz7AeZYmLiBJsxwHUqF++eM98C8kdcexA4jHbkpepIJ/Oj2xWvLJON75E4C/i8eJVNTsJHmdX6oCA+/427UNWG99BxS4qDxuSIfsjA55CvzGXlmAlb0BRZofUMcErMg9GJC5sb95t9plFC1b633jx24GI6QLnR5RAAN2W9tqo0XTLKLWsrc7GBGgIzVgxxrtSRL761UbNfPZbN5E7WrtxwnZoxo2HbGuxMR1Jra1XMzfptO3+WJp2RPHJbjs2EgRfViCBSmImtn09XU6ayIpABNl2ItBweAvhk0az9fUFe35oUx56u7Rqc9MyLBy79FjXbj+n+eWLu4HpufaUOSGQ3uNff879sCbP4tzOV+L03lQnMHq/YZ+W15DuQdT/6y/cfv1B5R5SXlWcOKgAAAAAElFTkSuQmCC' },
    { name: 'conic-gradient', title: '旋转渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABZVBMVEUAAABiYmKurq6KiopeXl7Ly8uoqKiEhIRCQkJhYWGjo6OCgoI/Pz/GxsZzc3NRUVHAwMCbm5uWlpZ5eXlxcXFUVFRPT0+2trbY2NjT09OGhoa6urqenp6VlZV6enpNTU2cnJxMTEysrKyNjY1sbGy+vr6bm5t1dXViYmK+vr6urq7KysqkpKRzc3Orq6t6enqKiop9fX1paWlYWFj09PTe3t7V1dXR0dHDw8OVlZVmZmZdXV1VVVVTU1NOTk7v7+/s7Oy4uLixsbGoqKibm5uQkJCDg4N3d3dubm5sbGz7+/vp6enl5eXj4+PFxcWhoaGdnZ2ZmZmGhoZfX1/+/v7Hx8fAwMC1tbWfn5+Xl5eSkpJwcHBQUFDb29vZ2dnMzMyzs7OOjo6AgIB2dnb29vbX19eMjIyHh4eBgYFaWlr4+Pjx8fHg4ODOzs67u7u6urpMTExJSUnCwsKmpqZFRUU+Pj5CQkIkWfQrAAAAKHRSTlMAycjIkcnJycnGk5OTiYlOycnJycnJycjGxsaMjIyMjIaGU1NTSkpKfICU6QAAAlJJREFUOMttkXl74VAYRy/d19n3fc+uQtsgKBKCNhJKEIqq6TYtin7+ee8NqjM9/57z/J7n3hfN8GV9eXnELiy8/ooeYn04vL0djVi2qOvSm//0p35/2O9FepHD6N72rnRT2rjvX/b6Pdknh2uRw0zmxO8/KtGPZ/SjSKTmC52PgwsILjs0ff1jGtQi4UJhNriMRveK3e7EvwjLFFUIQeEEfj/4vawee+X4+XA4GISCTEAAA9jv70vWOxLIckh0ikng+IOO1cR+xUelRVLABAQXMED8wR+6uQqBz6el0zghEzUIJn57Jx6HJ54XbE0bF+dyLXNyCR5r4JrZQCuhIG/bNiS48NUy/ih4rOv1usSsIldI4zF4RqRC4Uw0CxrsEdBg3MhVsNsY0oiUfJI9ILYD7LCCG1GUx5Ma0+ZtKls/6uxMEQQcELyY46RKs42r3SmJBHJRKaKOj8+S+S3VYGipyLKNxhWwqw8WkSvowfIsmcyfbqmVnGDRJb3IQgNI3CKaD/LEgv6tBpScEI/RJUkv4oaNcW60KWqOxr5icAnGitH0jaTjRsh9Q0gUvUS31GrALEMQt7o0jOCknMPXTvMTX1FI0Izh4kaS4oYbAWktOfamkeMSAtO0YtdQlBjDQJhNLUV8wFRIgCdIYSrvEeG57VGreEApjwMLFznzCRrD8x7iDScgRbdcqaAJv/h2+5QEHARkglECgZ/ojmcpzxYZ4AY4SJjV6lN0j49wrnzLVLhBmVMCrZb6Af3LW68Xn8T5tDX0EN/nlpaS+bm5tc/ojr9q4NepUU1B6gAAAABJRU5ErkJggg==' },
    { name: 'image', title: '图片', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAADLSURBVFiF7ZfBDcIwDEX/rxioVRfoAp0BevE63H2hzNAO0AUi2MgcIAipaXuBlIO/5FP8858sRYoJAKpaAjibWYMMIjkBuIpIT1U9mdklR3ACpDoAOALAOI4YhmHWZGZbl6yep/whBIQQAOBcxLGnwn+luq4jXFNkS12QA/wPgJkli+RqLfm2/DOAveQADuAAb4Bvv/Mt/wxgLzmAAziA/wccYH+A16IYV6UsatsWwHNJpaqWZnbLlv4hkl0hIneSXZxEpuCJZCUi/QOhULdMV8B8TgAAAABJRU5ErkJggg==' },
  ] as {
    name: AppBackgroundType,
    title: string,
    url: string
  }[],
  /** 混合模式列表 */
  blendModeList: [
    { value: 'normal', label: '正常' },
    { value: 'multiply', label: '正片叠底' },
    { value: 'screen', label: '滤色' },
    { value: 'overlay', label: '叠加' },
    { value: 'darken', label: '变暗' },
    { value: 'lighten', label: '变亮' },
    { value: 'color-dodge', label: '颜色减淡' },
    { value: 'color-burn', label: '颜色加深' },
    { value: 'hard-light', label: '强光' },
    { value: 'soft-light', label: '柔光' },
    { value: 'difference', label: '差值' },
    { value: 'exclusion', label: '排除' },
    { value: 'hue', label: '色相' },
    { value: 'saturation', label: '饱和度' },
    { value: 'color', label: '颜色' },
    { value: 'luminosity', label: '明度' },
    { value: 'initial', label: '初始' },
    { value: 'inherit', label: '继承' }
  ],
  /** 当前背景类型文本 */
  currentBackgroundTypeText: '纯色',
  /** 当前渐变项索引 */
  currentGradientItemIndex: -1,

  /** 当前渐变列表项坐标列表 */
  gradientListItemLocs: [

  ] as { x: number, y: number, rotate: number }[],
  /** 填充模式 */
  fillModeList: [
    { value: 'auto', label: '不处理' },
    { value: 'cover', label: '充满' },
    { value: 'contain', label: '适应' },
    { value: 'stretch', label: '拉伸' },
    { value: 'repeat', label: '平铺' },
    { value: 'repeat-x', label: '横向平铺' },
    { value: 'repeat-y', label: '纵向平铺' },
  ],
  /** 特殊效果列表 */
  specialEffectList: [
    { title: '亮度', code: 'brightness', default: 0, min: -100, max: 200, unit: '%', formatter: value => value + 100 },
    { title: '对比度', code: 'contrast', default: 0, min: -100, max: 200, unit: '%', formatter: value => value + 100 },
    { title: '模糊', code: 'blur', default: 0, min: 0, max: 100, unit: 'px' },
    { title: '灰度', code: 'grayscale', default: 0, min: 0, max: 100, unit: '%' },
    { title: '色调', code: 'hueRotate', default: 0, min: 0, max: 360, unit: 'deg' },
    { title: '反相', code: 'invert', default: 0, min: 0, max: 100, unit: '%' },
    { title: '饱和度', code: 'saturate', default: 0, min: -100, max: 200, unit: '%', formatter: value => value + 100 },
    { title: '复古', code: 'sepia', default: 0, min: 0, max: 100, unit: '%' },
  ],
});


/** 背景编辑器模块逻辑 */
export const service = {
  mergeBackground(style: Record<string, any>) {
    Object.entries(style).forEach(([key, value]) => {
      state.currentBackground[key] = value;
    });
  },
  /** 修改背景类型 */
  setBackgroundType(name: AppBackgroundType, attrs: { width: number, height: number }) {
    if (!attrs) return;
    const _typeIndex = state.backgroundTypeList.findIndex(i => i.name === name);
    if (_typeIndex >= 0) {
      state.currentBackgroundTypeText = state.backgroundTypeList[_typeIndex].title;
      
      switch (state.backgroundTypeList[_typeIndex].name) {
        case 'color':
          service.mergeBackground({
            type: 'color',
            show: state.currentBackground.show,
            opacity: state.currentBackground.opacity,
            blendType: 'normal',
            color: { r: 216, g: 216, b: 216, a: 1 },
            innerStyle: {},
            parentStyle: {},
          });
          state.currentGradientItemIndex = -1;
          break;
        case 'linear-gradient': {
          const _background = state.currentBackground as AppLinearGradientBackground;
          service.mergeBackground({
            type: 'linear-gradient',
            x1: attrs.width / 2,
            y1: 0,
            x2: attrs.width / 2,
            y2: attrs.height,
            show: _background.show,
            opacity: _background.opacity,
            blendType: 'normal',
            repeating: false,
            gradientList: [
              { progress: 0, color: { r: 216, g: 216, b: 216, a: 1 } },
              { progress: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
            ],
            innerStyle: {},
            parentStyle: {},
          });
          state.currentGradientItemIndex = 0;
          break;
        }
        case 'radial-gradient': {
          const _background = state.currentBackground as AppRadialGradientBackground;
          service.mergeBackground({
            type: 'radial-gradient',
            x1: attrs.width / 2,
            y1: attrs.height / 2,
            x2: attrs.width / 2,
            y2: attrs.height,
            show: _background.show,
            opacity: _background.opacity,
            radius: attrs.width / 2,
            ovalityRatio: attrs.height / attrs.width,
            blendType: 'normal',
            repeating: false,
            gradientList: [
              { progress: 0, color: { r: 216, g: 216, b: 216, a: 1 } },
              { progress: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
            ],
            innerStyle: {},
            parentStyle: {},
          });
          state.currentGradientItemIndex = 0;
          break;
        }
        case 'conic-gradient': {
          const _background = state.currentBackground as AppConicGradientBackground;
          service.mergeBackground({
            type: 'conic-gradient',
            x1: attrs.width / 2,
            y1: attrs.height / 2,
            x2: attrs.width / 2,
            y2: attrs.height,
            show: _background.show,
            opacity: _background.opacity,
            radius: attrs.width / 2,
            ovalityRatio: attrs.height / attrs.width,
            blendType: 'normal',
            gradientList: [
              { progress: 0, color: { r: 216, g: 216, b: 216, a: 1 } },
              { progress: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
            ],
            innerStyle: {},
            parentStyle: {},
          });
          state.currentGradientItemIndex = 0;
          break;
        }
        case 'image': {
          const _background = state.currentBackground as AppImageBackground;
          service.mergeBackground({
            blendType: 'normal',
            show: _background.show,
            opacity: _background.opacity,
            type: 'image',
            imageUrl: '',
            fillMode: 'contain',
            rotate: 0,
            xFlipOver: false,
            yFlipOver: false,
            x: 0,
            y: 0,
            brightness: 0,
            contrast: 0,
            blur: 0,
            grayscale: 0,
            hueRotate: 0,
            invert: 0,
            saturate: 0,
            sepia: 0,
            innerStyle: {},
            parentStyle: {},
          });
          state.currentGradientItemIndex = 0;
          break;
        }
        default:
          state.currentGradientItemIndex = -1;
          break;
      }
    } else {
      toast('背景类型不存在', 'error');
      throw new Error('背景类型不存在');
    }
  },
  /** 判断是否为背景 */
  isBackground(item: AppColor | AppBackground): item is AppBackground {
    return (item as AppBackground).type !== undefined;
  },
  /** 获取颜色字符串 rgba() */
  getColorStr(color: AppColor | AppBackground, index?: number): string | undefined {
    if (this.isBackground(color)) {
      switch (color.type) {
        case 'color':
          return this.getColorStr(color.color);
        case 'linear-gradient':
        case 'radial-gradient':
        case 'conic-gradient':
          if (index === undefined || index < 0) return undefined;
          return this.getColorStr(color.gradientList[index || 0].color);
        default:
          return undefined;
      }
    } else {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
  },
  /** 获取角度 */
  getAngle() {

  },
  /** 获取旋转度数 */
  getRotate(gradientBg: AppLinearGradientBackground | AppRadialGradientBackground | AppConicGradientBackground) {
    return 180 / Math.PI * Math.atan2(
      gradientBg.y2 - gradientBg.y1,
      gradientBg.x2 - gradientBg.x1
    );
  },
  /** 获取背景中使用的排序后的颜色字符串 */
  getGradientCSSColors(
    gradientBg: AppLinearGradientBackground | AppRadialGradientBackground | AppConicGradientBackground,
    start = 0,
    end = 1
  ) {
    let _str = '';
    const _gradientStr = gradientBg.gradientList
      .map<[number, string]>(i => {
        const _progress = start + ((end - start) * i.progress);
        return [_progress, `rgba(${i.color.r}, ${i.color.g}, ${i.color.b}, ${i.color.a}) ${_progress * 100}%` ];
      })
      .sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < _gradientStr.length; i++) {
      if (i > 0) _str += ', ';
      _str += _gradientStr[i][1];
    }
    return _str;
  },
  /** 获取组件属性 */
  getComponentAttrs() {
    let _attrs = {} as { width: number; height: number; };
    if (editorState.currentSelectedComponents?.length) {
      _attrs = editorState.currentSelectedComponents[0]?.attrs as unknown as { width: number; height: number; };
    } else if (editorState.appConfig.appType === AppType.questionnaire && editorState.canvasEl) {
      const _rect = (editorState.canvasEl as HTMLElement).getBoundingClientRect();
      _attrs = _rect;
    } else if (editorState.appConfig.appType === AppType.canvas) {
      _attrs = editorState.appConfig.canvasConfig;
    } else {
    }
    return _attrs;
  },
  /** 获取背景样式 */
  getBackgroundStyle(
    gradientBg: AppBackground, 
    width: number, 
    height: number,
    attrs: { width: number, height: number }, 
    gradientBgRect?: {
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
  ): { innerStyle: StyleValue, parentStyle: StyleValue } | undefined {
    if (!attrs) return;
    let _parentStyle = {} as StyleValue;
    let _style = {} as StyleValue;
    switch (gradientBg.type) {
      case 'color':
        _style = {
          backgroundColor: `rgba(${ gradientBg.color.r }, ${ gradientBg.color.g }, ${ gradientBg.color.b }, ${ gradientBg.color.a })`,
          left: `0px`, top: `0px`, width: `100%`, height: `100%`,
        };
        break;
      case 'linear-gradient': {
        const rect = gradientBgRect ?? service.getLinearGradientRectInfo(gradientBg, width, height);
        _style = {
          backgroundImage: `linear-gradient(${rect.rotate + 90}deg, ${service.getGradientCSSColors(gradientBg, (1 - rect.ratio) / 2, rect.ratio + (1 - rect.ratio) / 2)})`,
          left: `${rect.centerX - rect.radius}px`,
          top: `${rect.centerY - rect.radius}px`,
          width: `${rect.radius * 2}px`,
          height: `${rect.radius * 2}px`,
        };
        break;
      }
      case 'radial-gradient': {
        /** 两点距离 */
        const _distance = distance({ x: gradientBg.x1, y: gradientBg.y1 }, { x: gradientBg.x2, y: gradientBg.y2 });
        /** 角度 */
        const _rotate = service.getRotate(gradientBg);
        _style = {
          backgroundImage: `radial-gradient(${_distance * gradientBg.ovalityRatio}px ${_distance}px at ${gradientBg.x1 + attrs.width * 0.5}px ${gradientBg.y1 + attrs.height * 0.5}px, ${
            service.getGradientCSSColors(gradientBg)
          })`,
          left: `${-attrs.width * 0.5}px`,
          top: `${-attrs.height * 0.5}px`,
          width: `${attrs.width * 2}px`,
          height: `${attrs.height * 2}px`,
          transform: `rotate(${_rotate + 90}deg)`
        };
        break;
      }
      case 'conic-gradient': {
        // const rect = gradientBgRect ?? service.getConicGradientRectInfo(gradientBg, width, height);
        const _rotate = 180 / Math.PI * Math.atan2(
          gradientBg.y2 - gradientBg.y1,
          gradientBg.x2 - gradientBg.x1
        );
        _style = {
          backgroundImage: `conic-gradient(from ${_rotate + 90}deg at ${gradientBg.x1}px ${gradientBg.y1}px, ${
            service.getGradientCSSColors(gradientBg)
          })`,
          left: `0px`,
          top: `0px`,
          width: `${attrs.width}px`,
          height: `${attrs.height}px`,
        };
        break;
      }
      case 'image': {
        _parentStyle = {
          ...service.getFillMode(gradientBg),
          filter: service.getImageFilter(gradientBg),
        };
        _style = {
          left: `0px`, top: `0px`, width: `100%`, height: `100%`,
          backgroundImage: gradientBg.imageUrl,
        };
        break;
      }
      default:
        break;
    }
    return {
      innerStyle: _style,
      parentStyle: _parentStyle
    };
  },
  /** 切换填充模式 */
  getFillMode(gradientBg: AppImageBackground) {
    let _size = 'auto';
    let _repeat = 'no-repeat';
    switch (gradientBg.fillMode) {
      case 'contain':
        _size = 'contain';
        break;
      case 'auto':
        _size = 'auto';
        break;
      case 'cover':
        _size = 'cover';
        break;
      case 'stretch':
        _size = '100% 100%';
        break;
      default:
        _size = 'auto';
        break;
      case 'repeat':
        _repeat = 'repeat';
        break;
      case 'repeat-x':
        _repeat = 'repeat-x';
        break;
      case 'repeat-y':
        _repeat = 'repeat-y';
        break;
    }

    return {
      '--image-repeat': _repeat,
      '--image-position': '50% 50%',
      '--image-size': _size,
    };
  },
  /** 修改图像特效 */
  getImageFilter(gradientBg: AppImageBackground) {
    const _imageFilter = [] as string[];
    state.specialEffectList.filter(i => {
      return gradientBg[i.code] !== i.default;
    }).forEach(i => {
      const _styleName = i.code.replace(/([A-Z])/g, (a) => `-${a.toLowerCase()}`);
      const _value = i.formatter ? i.formatter(gradientBg[i.code]) : gradientBg[i.code];
      _imageFilter.push(`${_styleName}(${_value}${i.unit || ''})`);
    });
    
    return _imageFilter.join(' ');
  },
  /** 获取线性渐变中点及其他信息 */
  getLinearGradientRectInfo(gradientBg: AppLinearGradientBackground, width: number, height: number): GradientRectInfo {
    const _x1 = Math.min(gradientBg.x2, gradientBg.x1);
    const _y1 = Math.min(gradientBg.y2, gradientBg.y1);
    const _x2 = Math.max(gradientBg.x1, gradientBg.x2);
    const _y2 = Math.max(gradientBg.y1, gradientBg.y2);
    const _centerPoint = { x: _x2 - (_x2 - _x1) / 2, y: _y2 - (_y2 - _y1) / 2 };

    /** 最小半径 */
    let minRadius = 0;
    if (minRadius < Math.abs(_centerPoint.x - width)) minRadius = Math.abs(_centerPoint.x - width);
    if (minRadius < Math.abs(_centerPoint.x - 0)) minRadius = Math.abs(_centerPoint.x - 0);
    if (minRadius < Math.abs(_centerPoint.y - height)) minRadius = Math.abs(_centerPoint.y - height);
    if (minRadius < Math.abs(_centerPoint.y - 0)) minRadius = Math.abs(_centerPoint.y - 0);

    if (minRadius < (_x2 - _x1) / 2) minRadius = (_x2 - _x1) / 2;
    if (minRadius < (_y2 - _y1) / 2) minRadius = (_y2 - _y1) / 2;

    /** 渐变线角度 */
    const _rotate = service.getRotate(gradientBg);
    
    let _pointA = { x: 0, y: 0 };
    let _pointB = { x: 0, y: 0 };
    // 获取延长线的坐标点
    if (_y2 - _y1 < _x2 - _x1) {
      // 小三角与大三角的比值
      const _ratio = (_centerPoint.x - _x1) / _centerPoint.x;
      // 获取与左侧相交的A点Y坐标
      const _aPointY = _centerPoint.y - _ratio * (_centerPoint.y - _y1);
      _pointA = { x: 0, y: _aPointY };
      _pointB = { x: minRadius * 2, y: (_centerPoint.y - _aPointY) * 2 + _aPointY };
    } else {
      // 小三角与大三角的比值
      const _ratio = (_centerPoint.y - _y1) / _centerPoint.y;
      // 获取与左侧相交的A点Y坐标
      const _aPointX = _centerPoint.x - _ratio * (_centerPoint.x - _x1);
      _pointA = { x: _aPointX, y: 0 };
      _pointB = { x: (_centerPoint.x - _aPointX) * 2 + _aPointX, y: minRadius * 2 };
    }

    // 最后一步，获取线段在整条延长线上的占比
    const _globalRatio = (_x2 - _x1 > _y2 - _y1 ? _x2 - _x1 : _y2 - _y1) / (minRadius * 2);

    return {
      minX: _x1,
      minY: _y1,
      maxX: _x2,
      maxY: _y2,
      centerX: _centerPoint.x,
      centerY: _centerPoint.y,
      radius: minRadius,
      rotate: _rotate,
      pointA: _pointA,
      pointB: _pointB,
      ratio: _globalRatio,
    };
  },
  /** 获取径向渐变中点及其他信息 */
  getRadialGradientRectInfo(gradientBg: AppRadialGradientBackground, width: number, height: number): GradientRectInfo {
    const _x1 = Math.min(gradientBg.x2, gradientBg.x1);
    const _y1 = Math.min(gradientBg.y2, gradientBg.y1);
    const _x2 = Math.max(gradientBg.x1, gradientBg.x2);
    const _y2 = Math.max(gradientBg.y1, gradientBg.y2);
    const _centerPoint = { x: _x2 - (_x2 - _x1) / 2, y: _y2 - (_y2 - _y1) / 2 };

    /** 最小半径 */
    let minRadius = 0;
    if (minRadius < Math.abs(_centerPoint.x - width)) minRadius = Math.abs(_centerPoint.x - width);
    if (minRadius < Math.abs(_centerPoint.x - 0)) minRadius = Math.abs(_centerPoint.x - 0);
    if (minRadius < Math.abs(_centerPoint.y - height)) minRadius = Math.abs(_centerPoint.y - height);
    if (minRadius < Math.abs(_centerPoint.y - 0)) minRadius = Math.abs(_centerPoint.y - 0);

    if (minRadius < (_x2 - _x1) / 2) minRadius = (_x2 - _x1) / 2;
    if (minRadius < (_y2 - _y1) / 2) minRadius = (_y2 - _y1) / 2;

    /** 渐变线角度 */
    const _rotate = service.getRotate(gradientBg);
    
    let _pointA = { x: 0, y: 0 };
    let _pointB = { x: 0, y: 0 };
    // 获取延长线的坐标点
    if (_y2 - _y1 < _x2 - _x1) {
      // 小三角与大三角的比值
      const _ratio = (_centerPoint.x - _x1) / _centerPoint.x;
      // 获取与左侧相交的A点Y坐标
      const _aPointY = _centerPoint.y - _ratio * (_centerPoint.y - _y1);
      _pointA = { x: 0, y: _aPointY };
      _pointB = { x: minRadius * 2, y: (_centerPoint.y - _aPointY) * 2 + _aPointY };
    } else {
      // 小三角与大三角的比值
      const _ratio = (_centerPoint.y - _y1) / _centerPoint.y;
      // 获取与左侧相交的A点Y坐标
      const _aPointX = _centerPoint.x - _ratio * (_centerPoint.x - _x1);
      _pointA = { x: _aPointX, y: 0 };
      _pointB = { x: (_centerPoint.x - _aPointX) * 2 + _aPointX, y: minRadius * 2 };
    }

    // 最后一步，获取线段在整条延长线上的占比
    const _globalRatio = (_x2 - _x1 > _y2 - _y1 ? _x2 - _x1 : _y2 - _y1) / (minRadius * 2) * 3;

    return {
      minX: _x1,
      minY: _y1,
      maxX: _x2,
      maxY: _y2,
      centerX: _centerPoint.x,
      centerY: _centerPoint.y,
      radius: minRadius,
      rotate: _rotate,
      pointA: _pointA,
      pointB: _pointB,
      ratio: _globalRatio,
    };
  },
  /** 获取旋转渐变中点及其他信息 */
  getConicGradientRectInfo(gradientBg: AppConicGradientBackground, width: number, height: number): GradientRectInfo {
    const _x1 = Math.min(gradientBg.x2, gradientBg.x1);
    const _y1 = Math.min(gradientBg.y2, gradientBg.y1);
    const _x2 = Math.max(gradientBg.x1, gradientBg.x2);
    const _y2 = Math.max(gradientBg.y1, gradientBg.y2);
    const _centerPoint = { x: _x2 - (_x2 - _x1) / 2, y: _y2 - (_y2 - _y1) / 2 };

    /** 最小半径 */
    let minRadius = 0;
    if (minRadius < Math.abs(_centerPoint.x - width)) minRadius = Math.abs(_centerPoint.x - width);
    if (minRadius < Math.abs(_centerPoint.x - 0)) minRadius = Math.abs(_centerPoint.x - 0);
    if (minRadius < Math.abs(_centerPoint.y - height)) minRadius = Math.abs(_centerPoint.y - height);
    if (minRadius < Math.abs(_centerPoint.y - 0)) minRadius = Math.abs(_centerPoint.y - 0);

    if (minRadius < (_x2 - _x1) / 2) minRadius = (_x2 - _x1) / 2;
    if (minRadius < (_y2 - _y1) / 2) minRadius = (_y2 - _y1) / 2;

    /** 渐变线角度 */
    const _rotate = 180 / Math.PI * Math.atan2(
      gradientBg.y2 - gradientBg.y1,
      gradientBg.x2 - gradientBg.x1
    );
    
    let _pointA = { x: 0, y: 0 };
    let _pointB = { x: 0, y: 0 };
    // 获取延长线的坐标点
    if (_y2 - _y1 < _x2 - _x1) {
      // 小三角与大三角的比值
      const _ratio = (_centerPoint.x - _x1) / _centerPoint.x;
      // 获取与左侧相交的A点Y坐标
      const _aPointY = _centerPoint.y - _ratio * (_centerPoint.y - _y1);
      _pointA = { x: 0, y: _aPointY };
      _pointB = { x: minRadius * 2, y: (_centerPoint.y - _aPointY) * 2 + _aPointY };
    } else {
      // 小三角与大三角的比值
      const _ratio = (_centerPoint.y - _y1) / _centerPoint.y;
      // 获取与左侧相交的A点Y坐标
      const _aPointX = _centerPoint.x - _ratio * (_centerPoint.x - _x1);
      _pointA = { x: _aPointX, y: 0 };
      _pointB = { x: (_centerPoint.x - _aPointX) * 2 + _aPointX, y: minRadius * 2 };
    }

    // 最后一步，获取线段在整条延长线上的占比
    const _globalRatio = (_x2 - _x1 > _y2 - _y1 ? _x2 - _x1 : _y2 - _y1) / (minRadius * 2) * 3;

    return {
      minX: _x1,
      minY: _y1,
      maxX: _x2,
      maxY: _y2,
      centerX: _centerPoint.x,
      centerY: _centerPoint.y,
      radius: minRadius,
      rotate: _rotate,
      pointA: _pointA,
      pointB: _pointB,
      ratio: _globalRatio,
    };
  },
  /** 在一条线段上根据百分比值获取坐标 （progress取值范围: 0~1） */
  getPointLocByLine(x1: number, y1: number, x2: number, y2: number, progress: number) {
    return {
      x: x1 + (x2 - x1) * progress,
      y: y1 + (y2 - y1) * progress
    };
  },
  /** 显示背景选择器 */
  showBackgroundDialog() {

  },
  /** 关闭背景选择器 */
  closeBackgroundDialog() {

  },
  /** 选择图片 */
  selectImage() {

  },
  /** 绘制线性渐变背景 */
  drawLinearGradient(gradient: AppLinearGradientBackground) {
    const _style = { } as Record<string, any>;
    const _panelRect = {
      width: 0,
      height: 0,
    };
    // 输出背景框位置/尺寸及渐变

    // 输出结果

  },
  /** 获取线段中点 */
  getLineCenter(x1: number, y1: number, x2: number, y2: number) {
    const _x1 = Math.min(x2, x1);
    const _y1 = Math.min(y2, y1);
    const _x2 = Math.max(x1, x2);
    const _y2 = Math.max(y1, y2);
    return { x: _x2 - (_x2 - _x1) / 2, y: _y2 - (_y2 - _y1) / 2 };
  },
  /** 渐变旋转90度 */
  rotate90Gradient(gradientBg: AppLinearGradientBackground | AppRadialGradientBackground | AppConicGradientBackground) {
    let _x1 = gradientBg.x1;
    let _y1 = gradientBg.y1;
    let _x2 = gradientBg.x2;
    let _y2 = gradientBg.y2;

    if (gradientBg.type === 'linear-gradient') {
      const center = service.getLineCenter(_x1, _y1, _x2, _y2);
  
      const _r_x1 = _x1 - center.x;
      const _r_y1 = _y1 - center.y;
      const _r_x2 = _x2 - center.x;
      const _r_y2 = _y2 - center.y;
  
      _x1 = _r_y1 + center.x;
      _y1 = -_r_x1 + center.y;
      _x2 = _r_y2 + center.x;
      _y2 = -_r_x2 + center.y;

      gradientBg.x1 = _x2;
      gradientBg.y1 = _y2;
      gradientBg.x2 = _x1;
      gradientBg.y2 = _y1;
    } else if (gradientBg.type === 'radial-gradient' || gradientBg.type === 'conic-gradient') {
      const _r_x2 = _x2 - _x1;
      const _r_y2 = _y2 - _y1;
  
      _x2 = -_r_y2 + _x1;
      _y2 = _r_x2 + _y1;

      gradientBg.x2 = _x2;
      gradientBg.y2 = _y2;
    }

    return gradientBg;
  },
  /** 获取圆环侧边点 */
  getSlidePoint(x1: number, y1: number, x2: number, y2: number, ratio = 1) {
    const _r_x = x2 - x1;
    const _r_y = y2 - y1;
    return { x: -_r_y + x1, y: _r_x + y1 };
  }
};

export default {
  /** 评分模块状态 */
  state,
  /** 评分模块逻辑 */
  service,
}
