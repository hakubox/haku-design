import { SimpleAnime, SimpleAnimeConfig } from '../../@types';
import { gsap, Linear, Back, Power0, Power1, Power2, Power3 } from 'gsap';
import { ComponentPropertyEditor } from '@/@types/enum';

/** 简单强调动画列表 */
export const animes: SimpleAnime[] = [

  { animeName: 'heartbeat', animeTitle: '心跳', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'speed', title: '速度', group: 'anime', default: 'fast',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '慢速', value: 'slow' },
          { label: '快速', value: 'fast' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      switch (attrs.speed) {
        case 'slow':
          return tl.to(el, { duration: 0.175, scale: 1.2, ease: Linear.easeNone })
            .to(el, { duration: 0.15, scale: 1.2, ease: Linear.easeNone })
            .to(el, { duration: 0.175, scale: 1, ease: Linear.easeNone })
            .to(el, { duration: 0.225, scale: 1, ease: Linear.easeNone })
            .to(el, { duration: 0.175, scale: 1.2, ease: Linear.easeNone })
            .to(el, { duration: 0.15, scale: 1.2, ease: Linear.easeNone })
            .to(el, { duration: 0.175, scale: 1, ease: Linear.easeNone })
            .to(el, { duration: 0.225, scale: 1, ease: Linear.easeNone });
        case 'fast':
          return tl.to(el, { duration: 0.14, scale: 1.3, ease: Linear.easeNone })
            .to(el, { duration: 0.14, scale: 1, ease: Linear.easeNone })
            .to(el, { duration: 0.14, scale: 1.3, ease: Linear.easeNone })
            .to(el, { duration: 0.28, scale: 1, ease: Linear.easeNone })
            .to(el, { duration: 0.3, scale: 1, ease: Linear.easeNone })
      }
    }
  },

  { animeName: 'bounce', animeTitle: '弹跳', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'top',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '向上', value: 'top' },
          { label: '向下', value: 'bottom' },
          { label: 'X轴', value: 'x' },
          { label: 'Y轴', value: 'y' },
          { label: '放大', value: 'zoomIn' },
          { label: '缩小', value: 'zoomOut' },
        ]
      }
    }, {
      name: 'distance', title: '弹跳距离', group: 'anime', default: 80,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'px',
        min: 40,
      },
      visible: (attrs) => ['top', 'bottom'].includes(attrs.direction),
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      switch (attrs.direction) {
        case 'top':
          return tl.to(el, { duration: 0.25, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.16, css: { transform: `translate3d(0px,-${attrs.distance}px,0px) scale3d(1,1.4,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.03, css: { transform: `translate3d(0px,-${attrs.distance}px,0px) scale3d(1,1.4,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.11, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.15, css: { transform: `translate3d(0px,-${attrs.distance / 4}px,0px)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.15, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.05, css: { transform: `translate3d(0px,-${attrs.distance / 20}px,0px)` } })
            .to(el, { duration: 0.10, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut });
        case 'bottom':
          return tl.to(el, { duration: 0.25, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.16, css: { transform: `translate3d(0px,${attrs.distance}px,0px) scale3d(1,1.2,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.03, css: { transform: `translate3d(0px,${attrs.distance}px,0px) scale3d(1,1.2,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.11, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.15, css: { transform: `translate3d(0px,${attrs.distance / 4}px,0px)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.15, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.05, css: { transform: `translate3d(0px,${attrs.distance / 20}px,0px)` } })
            .to(el, { duration: 0.10, css: { transform: `translate3d(0px,0px,0px)` }, ease: Power2.easeOut });
        case 'x':
          return tl.to(el, { duration: 0.25, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.16, css: { transform: `scale3d(1.8,1,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.03, css: { transform: `scale3d(1.8,1,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.11, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.15, css: { transform: `scale3d(1.5,1,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.15, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.05, css: { transform: `scale3d(1.1,1,1)` } })
            .to(el, { duration: 0.10, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut });
        case 'y':
          return tl.to(el, { duration: 0.25, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.16, css: { transform: `scale3d(1,2,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.03, css: { transform: `scale3d(1,2,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.11, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.15, css: { transform: `scale3d(1,1.5,1)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.15, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.05, css: { transform: `scale3d(1,1.1,1)` } })
            .to(el, { duration: 0.10, css: { transform: `scale3d(1,1,1)` }, ease: Power2.easeOut });
        case 'zoomIn':
          return tl.to(el, { duration: 0.25, css: { transform: `scale(1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.16, css: { transform: `scale(1.5)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.03, css: { transform: `scale(1.5)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.11, css: { transform: `scale(1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.15, css: { transform: `scale(1.3)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.15, css: { transform: `scale(1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.05, css: { transform: `scale(1.1)` } })
            .to(el, { duration: 0.10, css: { transform: `scale(1)` }, ease: Power2.easeOut });
        case 'zoomOut':
          return tl.to(el, { duration: 0.25, css: { transform: `scale(1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.16, css: { transform: `scale(0.3)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.03, css: { transform: `scale(0.3)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.11, css: { transform: `scale(1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.15, css: { transform: `scale(0.5)` }, ease: Power2.easeIn })
            .to(el, { duration: 0.15, css: { transform: `scale(1)` }, ease: Power2.easeOut })
            .to(el, { duration: 0.05, css: { transform: `scale(0.9)` } })
            .to(el, { duration: 0.10, css: { transform: `scale(1)` }, ease: Power2.easeOut });
      }
    }
  },

  { animeName: 'dance', animeTitle: '抖动', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方位', group: 'anime', default: 'top',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '上方', value: 'top' },
          { label: '中部', value: 'middle' },
          { label: '下方', value: 'bottom' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      switch (attrs.direction) {
        case 'top':
          return tl.to(el, { duration: 0, skewX: '0deg', transformOrigin: 'top' })
            .to(el, { duration: 0.16, skewX: '-14deg' })
            .to(el, { duration: 0.33, skewX: '12deg' })  
            .to(el, { duration: 0.49, skewX: '-8deg' })
            .to(el, { duration: 0.66, skewX: '6deg' })
            .to(el, { duration: 0.83, skewX: '-4deg' })
            .to(el, { duration: 1, skewX: '0deg' });
        case 'middle':
          return tl.to(el, { duration: 0, skewX: '0deg', transformOrigin: 'center' })
            .to(el, { duration: 0.16, skewX: '-14deg' })
            .to(el, { duration: 0.33, skewX: '12deg' })  
            .to(el, { duration: 0.49, skewX: '-8deg' })
            .to(el, { duration: 0.66, skewX: '6deg' })
            .to(el, { duration: 0.83, skewX: '-4deg' })
            .to(el, { duration: 1, skewX: '0deg' });
        case 'bottom':
          return tl.to(el, { duration: 0, skewX: '0deg', transformOrigin: 'bottom' })
            .to(el, { duration: 0.16, skewX: '-14deg' })
            .to(el, { duration: 0.33, skewX: '12deg' })  
            .to(el, { duration: 0.49, skewX: '-8deg' })
            .to(el, { duration: 0.66, skewX: '6deg' })
            .to(el, { duration: 0.83, skewX: '-4deg' })
            .to(el, { duration: 1, skewX: '0deg' });
      }
    }
  },

  { animeName: 'rotate', animeTitle: '旋转', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'type', title: '类型', group: 'anime', default: 'z',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: 'Z轴', value: 'z' },
          { label: 'X轴', value: 'x' },
          { label: 'Y轴', value: 'y' },
        ]
      }
    }, {
      name: 'rotate', title: '旋转角度', group: 'anime', default: 360,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '°',
        min: -3600,
        max: 3600
      },
    }, {
      name: 'location', title: '固定位置', group: 'anime', default: 'center',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '中间', value: 'center' },
          { label: '上方', value: 'top' },
          { label: '下方', value: 'bottom' },
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      switch (attrs.type) {
        case 'z':
          return gsap.fromTo(el, 
            { rotateZ: '0deg', transformOrigin: attrs.location }, 
            { rotateZ: `${attrs.rotate}deg` }
          );
        case 'x':
          return gsap.fromTo(el, 
            { rotateX: '0deg', transformOrigin: attrs.location }, 
            { rotateX: `${attrs.rotate}deg` }
          );
        case 'y':
          return gsap.fromTo(el, 
            { rotateY: '0deg', transformOrigin: attrs.location }, 
            { rotateY: `${attrs.rotate}deg` }
          );
      }
    }
  },

  { animeName: 'shake', animeTitle: '震动', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'type', title: '类型', group: 'anime', default: 'pulse',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '脉冲', value: 'pulse' },
          { label: '横向', value: 'horizontal' },
          { label: '纵向', value: 'vertical' },
          { label: '生气', value: 'mad' },
          { label: '震动', value: 'vibration' },
        ]
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 5,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'px',
      },
      visible: (attrs) => !['vibration', 'pulse'].includes(attrs.direction),
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      switch (attrs.type) {
        case 'pulse':
          return tl.to(el, { duration: 0.1, scale: 1 })
            .to(el, { duration: 0.02, scale: 1.2 })  
            .to(el, { duration: 0.04, scale: 1 })
            .to(el, { duration: 0.02, scale: 1.1 })
            .to(el, { duration: 0.02, scale: 1 })
            .to(el, { duration: 0.8, scale: 1 });
        case 'horizontal':
          return tl.to(el, { duration: 0, x: `0px` })
            .to(el, { duration: 0.3, x: `${attrs.distance}px` })
            .to(el, { duration: 0.3, x: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, x: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, x: `${attrs.distance}px` })
            .to(el, { duration: 0.3, x: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, x: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, x: `${attrs.distance}px` })
            .to(el, { duration: 0.3, x: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, x: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, x: `${attrs.distance}px` })
            .to(el, { duration: 0.3, x: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, x: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, x: `${attrs.distance}px` })
            .to(el, { duration: 0.3, x: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, x: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, x: `${attrs.distance}px` })
            .to(el, { duration: 0.3, x: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, x: `-${attrs.distance}px` })
            .to(el, { duration: 0.02, x: `0px` });
        case 'vertical':
          return tl.to(el, { duration: 0, y: `0px` })
            .to(el, { duration: 0.3, y: `${attrs.distance}px` })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, y: `${attrs.distance}px` })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, y: `${attrs.distance}px` })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, y: `${attrs.distance}px` })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, y: `${attrs.distance}px` })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px` })
            .to(el, { duration: 0.12, y: `${attrs.distance}px` })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px` })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px` })
            .to(el, { duration: 0.02, y: `0px` });
        case 'mad':
          return tl.to(el, { duration: 0, y: `0px`, scale: 1 })
            .to(el, { duration: 0.3, y: `${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px`, scale: 0.8 })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.12, y: `${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px`, scale: 0.8 })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.12, y: `${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px`, scale: 0.8 })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.12, y: `${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px`, scale: 0.8 })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.12, y: `${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px`, scale: 0.8 })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.12, y: `${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.3, y: `${attrs.distance * 0.6}px`, scale: 0.8 })
            .to(el, { duration: 0.3, y: `-${attrs.distance}px`, scale: 1.1 })
            .to(el, { duration: 0.02, y: `0px`, scale: 1 });
        case 'vibration':
          return tl.to(el, { duration: 0, skewY: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 })
            .to(el, { duration: 0.05, skewY: '1deg', skewX: '-1deg', scale: 1.06 })
            .to(el, { duration: 0.05, skewY: '0deg', skewX: '0deg', scale: 1 });
      }
    }
  },

  { animeName: 'pepe', animeTitle: '摇晃', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'rotate', title: '摇晃角度', group: 'anime', default: 4,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '°',
        min: 0
      },
    }, {
      name: 'location', title: '固定位置', group: 'anime', default: 'center',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '中间', value: 'center' },
          { label: '上方', value: 'top' },
          { label: '下方', value: 'bottom' },
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      return tl.to(el, { duration: 0, transformOrigin: attrs.location, rotate: `0deg` })
        .to(el, { duration: 0.16, rotate: `-${attrs.rotate}deg` })
        .to(el, { duration: 0.17, rotate: `${attrs.rotate}deg` })
        .to(el, { duration: 0.17, rotate: `-${attrs.rotate}deg` })
        .to(el, { duration: 0.16, rotate: `${attrs.rotate}deg` })
        .to(el, { duration: 0.17, rotate: `-${attrs.rotate}deg` })
        .to(el, { duration: 0.17, rotate: `0deg` });
    }
  },

  { animeName: 'huhu', animeTitle: '悬浮', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 2 }, propertys: [
    {
      name: 'distance', title: '距离', group: 'anime', default: 20,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'px',
      },
      visible: (attrs) => !['vibration', 'pulse'].includes(attrs.direction),
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      return tl.to(el, { duration: 0, y: `0px`, ease: Power1.easeInOut })
        .to(el, { duration: 0.50, y: `${attrs.distance}px`, ease: Power1.easeInOut })
        .to(el, { duration: 0.50, y: `0px`, ease: Power1.easeInOut });
    }
  },

  { animeName: '3D', animeTitle: '3D效果', animeType: 'emphasize', fillmode: 'forwards', onText: false, attrs: { duration: 2 }, propertys: [
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      return tl.to(el, { duration: 0, boxShadow: `none` })
        .to(el, { duration: 0.50, boxShadow: `0 1px 0 #ccc, 
        0 2px 0 #c9c9c9, 
        0 3px 0 #bbb, 
        0 4px 0 #b9b9b9, 
        0 5px 0 #aaa, 
        0 6px 1px rgba(0, 0, 0, .1), 
        0 0 5px rgba(0, 0, 0, .1), 
        0 1px 3px rgba(0, 0, 0, .3), 
        0 3px 5px rgba(0, 0, 0, .2), 
        0 5px 10px rgba(0, 0, 0, .25), 
        0 10px 10px rgba(0, 0, 0, .2), 
        0 20px 20px rgba(0, 0, 0, .15)` });
    }
  },
  
  { animeName: 'lightning', animeTitle: '闪烁', animeType: 'emphasize', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      return tl.to(el, { duration: 0, opacity: 1 })
        .to(el, { duration: 0.25, opacity: 0 })
        .to(el, { duration: 0.25, opacity: 1 })
        .to(el, { duration: 0.25, opacity: 0 })
        .to(el, { duration: 0.25, opacity: 1 });
    }
  },
];