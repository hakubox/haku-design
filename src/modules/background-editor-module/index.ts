import { Component, ComponentGroup, FormDimensionItem } from '@/@types';
import { reactive } from 'vue';
import message, { toast } from '@/common/message';
import type { AppBackground, AppBackgroundType, AppColor, AppLinearGradientBackground, AppConicGradientBackground, AppRadialGradientBackground, GradientRectInfo } from './index.d';
import { distance } from '@/tools/common';

export * from './index.d';

/** 背景编辑器模块状态 */
export const state = reactive({
  /** 当前背景 */
  currentBackground: { type: 'color', blendType: 'normal', color: { r: 216, g: 216, b: 216, a: 1 } } as AppBackground,
  /** 背景类型列表 */
  backgroundTypeList: [
    { name: 'color', title: '纯色', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAACLSURBVFiF7dexDcMwDETRT6fOAhkjWUNzODN5Dy+QnlogAygDeAC6kArDcM00d4AgQc09ljR6HsBz3BlpwA+oBrzG+UdWgALM7h5ZcfcAZqDYeBARS+boZvYGmDJLryKAAAIIIIAAAggggAACCDDRF0VqrWmlh65m9I24pLWfLDdgO3zck4ob8AG+OxCjg8ww/O8tAAAAAElFTkSuQmCC' },
    { name: 'linear-gradient', title: '线性渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAD1SURBVFiF7ZQhjsMwEEX/KCbBJs41AspKcqVdkj3AhvRA4WU+RhRgFEWWpSi2Ey8y6JaPQfORNeQ9/RmZAGCapl/nXO+cA0eISFdV9Wzb9pu01o8Y4xcL+V+aphnEvu/38zyhlIJSigVsjIExBsuy9MJ7fwMAKSVCCCwCUkrM84x1XSEy1HvPAs/J3PICMcaXAVcy92qgfAPHcbwMuJK55Ru4bqC4wLWC4g3kB3cDbwKfewPFBa4VXA0Ub6D4R1R8BdnGWou6rlng27Yhxggi0iKlNIQQ+hACrLUsAjlE9CQA6LrukVK6p5RuHGAhBIQQwziOP39YyzDUDdMzzwAAAABJRU5ErkJggg==' },
    { name: 'radial-gradient', title: '径向渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAASASURBVFiFxVdbbttGFD3DeZGUjNj/ho0EySrU6Me1Ass7aLqOJM5HUfQjSbOI7kIy/EIBJ15FbHgNsmWRM8Mh++FcdjSSG7stkAEuaIPUnHPPfcwdhges3d3d38qy1EqpHmMMAHpfX501TQPGWD2dTj+cnp6O77snu89HW1tbv2utX3HOwTlHkiRIkgRfSaBpGtR1jbqu4b2H9x4APo3H4/5/IjAYDN5JKfeEEJBSQikFKSWEEEiSBEIIAEBVVajrGlVVwTkHay2cc/T/+8PDw7cPJrCzs/NZStlTSkFrjSzLoLVuwe9SoKoqVFWF2WyGoiiIzNn+/v4P9yLw4sWLHznnR0opZFmGPM+RZRmklJBSIgxDTIDkd87BOYebmxvc3NzAWgtrLbz32wcHB8chnogJcM6PyONHjx6BFCACQoh/JEBhcM6Bc440TTGZTMAYgzHmKHaax7JrrTfyPMfq6irSNF0wrXX7VEq1eRGqExJkjEFKCe896rrG48ePt8/Pz/9YIDAYDN5prX/SWmNtba0FzLJsKYmYgBBiTp1QIQAQQlCINjY3N/XFxcXJXAiklHtKKXQ6nVb2GDQE45zPhSCUf9n7uq6R5zmcc/De7wF42yowHA5PpZSb3W4XKysrc14vUyBWYVluhOBkANryXF9fzy8vL49JgedSSuR53saT5CWgEDjsBQDmesAyZUgdKSWyLIMxBlrrVwBe836/P8yy7GWe5+h0Oku9DZWgZ6hA6D0t8pr6Q2hUJc+ePeOi2+2+4ZzPyUgJFaoRq6CUAue3Oey9h7W2JRDmRJygtC/nHLPZTIumaRJqq0mStGUU/yAkEnZF4LYVExkKR+xQWJ6EpZTqCcZYWzaxhXVNXoRqKKUAANbaVomwCuLDKzbGGASAHmMMQog2e2OLCRGRPM/bmJMKcR9YZoQFoPd31nynJXA7TPSqqpqr2dDis76qqlZ24DYEVVW17+n7u/YjLABn4q5SCQEJlIAp4aqqap/GmJZISCYkFFvTNBDW2jOtdY+GihAwPt3CUvPeL5QhkaDvwz1CMoTFGKtFmqaGsjf8QQwcdjhqJiEBUqcsy6VEYoe895hOpx/4ly9f/nz69OmvSZLM1e5dp9qys5+8JyMS8d9k0+kU1locHx//LADAGPNRSvmqKAqkaTrn9bLeTp0sPAtIxZgMTUOkxmw2g3MOAD4BwXSyu7vb0BTU7XaRZdncSfiQ45hIlGWJsixRFAWKosDV1RWur69RFAVGoxGjMgQAOOfec873ZrMZlFILI1fY2+9SJlQhJEFK0HzonHtPuO1EdHFxcfLkyZPtpmk26rqGlLLdPOwHYZWESRpLH8d/MpmgLEtYa88ODg5eEu7CVDwcDpv/ayglzyeTCYqigDEG4/F4DnNhKvbebxtjjqhjdToddDqdfzWWF0Uxdz/w3m/HePe6mND9gE7Eb11MjDGtxw++mITru17NwjUcDk8BPH/I5dQY8/Hk5OT1t/a+FwFa/X5/2O123zRNkyy7nltrz9I0NaPR6Jf77vkXZm13nfYcEWgAAAAASUVORK5CYII=' },
    { name: 'conic-gradient', title: '旋转渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAUdSURBVFiFpVc9bBNJGH3fzNjrYC8h4sdIh8RPT8o9kRSglPwIJEdQpkmBQmjINZyoU+EKyqOkPClNTiK0KBDXaVA6IohEkIK9xni983PFeZbZ8SYY3UifvB7Pznvfm2/ejAm/0G7evLnabrfDcrkcaa2hlIqazSYAtAAgDEO1vb3dnJ+f/3vcOWmcQXNzc8+EEMvGGGitYT+11mg2m7nvAKC1xuTk5NvLly/P/C8Ct27deiqlXLEAnHNwzsEYg9YajDGsra2h3W5Da41Op5OFMQbGGAghmrOzs3/8MoHbt29vSSkjYww456hUKhnwUH5orbG2tjbSp7XG3t4ePn36ZIm2rl279nsRjvA7Go3G9TRN140xKJfLCIIAQoicxABA9IO7zdZt9XodSins7e1BKRW9fv3acM5vzM3N/eOOYz4BrfU6EaFUKmFychJBEICIRsJvloRbD/V6HdPT0zh27BiMMZBSrvvv5QjMz89vERGCIMCJEyfAGDsS3CfiknAL9tKlS6hWq9Ba49WrV1uFBO7du/cUQEREOXDG2JFEDgP11bh48SKq1SqUUtHGxsbTEQLGmBUiQrVazUBd4CISP1sCG7bv9OnTMMZgMBis5AgsLCxsEhFqtRrCMMwRKIrDwH1gPyYmJjAxMQFjDF6+fPksIzAYDK4wxgrB3b1/GJFxwG2cOXMGxhjUarVlABB37txp2KpnjOWkJKLc1rNNa10IrpTKwpffblOrQrfbxebm5qo4efLkSpIkmdG4e9qSsAbkgxJR9myBpZQj6++GJRHHMXZ2dkKRpilnjCEIAjDGcmtqt5oxJleEAKCUyghLKZGmKdI0HcneT8gSMMbg+PHjkbCT2HV2CwtAThVbE3bcYDCAlBJJkiBJkix7q4qfjL9kACCIKCIiVCqVHLBf5f4E5XIZABDHMeI4zjL3sy2a0yqglIqEldTN3m2+89kQQuDChQvY3t5GGIaZMnb8UY4J4IcCjLEWgEhKmWXlT+KaEWMMQggEQYAwDNHpdAAAQRBkW9aOdd91yfR6PXu8t4Q/uQ/q/845R6lUyk5JpRSSJPkvGyEghCi0bzchu1RKKYjBYNAKgiBK0xSVSqXQ813zEUKgVCpBCJH5hJQyt4Nc4yqy7ziO7a1JiXq9Hnc6HaRpWviC74pCiNx620yUUjmf4JxnPuLHt2/foLXGzs5OkwBgaWnJAMCpU6cyFfzT0LVlq4IbVn6X4GEqvH//HkSEhYUFYgCQJMlzy+xnB1HROeAfRq4Zuc9aa3z+/Blaa9RqtbfA8DB68eLFQ8ZY5mbjgPtXMv+27J8FWmvs7+/jy5cvAIBGozGTERhWcJOI0O12C+UvAvdVKAJ1+/b39+3+b1pcbh/evXu3MTMzc10p9VuapqjVakcSGUcZd+/v7u5CSgkiai0uLt7NfvMHP3r0yFhrPnv2bCGQLTL3ruB/uvHx40f0+30QEe7fv5/DHPFfzvkNIkKaptjd3UWn0yncy0W3Ir8oe70ePnz4gF6vZ7fmjRF1RvQatsePH29prSPGGKampjA1NXWo9H7WSZLg69evrkO2lpaWCv+Y8KJOAHjz5s1fV69eDYloJkkStNttJEmSGY5SCqVSCUSEfr8PpRS63S4ODg5wcHBg1xtCiOaDBw/uHoYz1p/T1dXVze/fv1/xb8du8fkF2+v1nj958uThz+Yei4Bty8vLjfPnz6/0+30+rIFouASt4SnXOnfuXLy4uPjnuHP+C33P74mp5QIpAAAAAElFTkSuQmCC' },
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
  /** 当前背景类型索引 */
  currentBackgroundTypeIndex: 0,
  /** 当前背景类型文本 */
  currentBackgroundTypeText: '纯色',
  /** 当前渐变项索引 */
  currentGradientItemIndex: -1,

  /** 当前渐变列表项坐标列表 */
  gradientListItemLocs: [

  ] as { x: number, y: number, rotate: number }[],

  /** 对照测试组件 */
  component: {
    x: 100,
    y: 100,
    width: 200,
    height: 200
  }
});


/** 背景编辑器模块逻辑 */
export const service = {
  
  /** 修改背景类型 */
  setBackgroundType(name: AppBackgroundType) {
    const _typeIndex = state.backgroundTypeList.findIndex(i => i.name === name);
    if (_typeIndex >= 0) {
      state.currentBackgroundTypeIndex = _typeIndex;
      state.currentBackgroundTypeText = state.backgroundTypeList[_typeIndex].title;
      
      switch (state.backgroundTypeList[_typeIndex].name) {
        case 'color':
          state.currentBackground = {
            type: 'color',
            show: state.currentBackground.show,
            opacity: state.currentBackground.opacity,
            blendType: 'normal',
            color: { r: 216, g: 216, b: 216, a: 1 }
          };
          state.currentGradientItemIndex = -1;
          break;
        case 'linear-gradient': {
          const _background = state.currentBackground as AppLinearGradientBackground;
          state.currentBackground = {
            type: 'linear-gradient',
            x1: state.component.width / 2,
            y1: 0,
            x2: state.component.width / 2,
            y2: state.component.height,
            show: _background.show,
            opacity: _background.opacity,
            blendType: 'normal',
            repeating: false,
            gradientList: [
              { progress: 0, color: { r: 216, g: 216, b: 216, a: 1 } },
              { progress: 1, color: { r: 255, g: 255, b: 255, a: 1 } },
            ]
          };
          state.currentGradientItemIndex = 0;
          break;
        }
        case 'radial-gradient': {
          const _background = state.currentBackground as AppRadialGradientBackground;
          state.currentBackground = {
            type: 'radial-gradient',
            x1: state.component.width / 2,
            y1: state.component.height / 2,
            x2: state.component.width / 2,
            y2: state.component.height,
            show: _background.show,
            opacity: _background.opacity,
            radius: state.component.width / 2,
            ovalityRatio: state.component.height / state.component.width,
            blendType: 'normal',
            repeating: false,
            gradientList: [
              { progress: 0, color: { r: 216, g: 216, b: 216, a: 1 } },
              { progress: 1, color: { r: 255, g: 255, b: 255, a: 1 } },
            ]
          };
          state.currentGradientItemIndex = 0;
          break;
        }
        case 'conic-gradient': {
          const _background = state.currentBackground as AppConicGradientBackground;
          state.currentBackground = {
            type: 'conic-gradient',
            x1: state.component.width / 2,
            y1: state.component.height / 2,
            x2: state.component.width / 2,
            y2: state.component.height,
            show: _background.show,
            opacity: _background.opacity,
            radius: state.component.width / 2,
            ovalityRatio: state.component.height / state.component.width,
            blendType: 'normal',
            gradientList: [
              { progress: 0, color: { r: 216, g: 216, b: 216, a: 1 } },
              { progress: 1, color: { r: 255, g: 255, b: 255, a: 1 } },
            ]
          };
          state.currentGradientItemIndex = 0;
          break;
        }
        default:
          state.currentGradientItemIndex = -1;
          break;
      }
    } else {
      message.toast('背景类型不存在', 'error');
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
  /** 获取背景样式 */
  getBackgroundStyle(
    gradientBg: AppBackground, 
    width: number, 
    height: number, 
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
  ) {
    let _style = {} as Record<string, any>;
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
          backgroundImage: `radial-gradient(${_distance * gradientBg.ovalityRatio}px ${_distance}px at ${gradientBg.x1 + state.component.width * 0.5}px ${gradientBg.y1 + state.component.height * 0.5}px, ${
            service.getGradientCSSColors(gradientBg)
          })`,
          left: `${-state.component.width * 0.5}px`,
          top: `${-state.component.height * 0.5}px`,
          width: `${state.component.width * 2}px`,
          height: `${state.component.height * 2}px`,
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
          width: `${state.component.width}px`,
          height: `${state.component.height}px`,
        };
        break;
      }
      default:
        break;
    }
    return _style;
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
