import { SimpleAnime, SimpleAnimeConfig } from '../../@types';
import { gsap, Linear, Back, Power0, Power2 } from 'gsap';
import { ComponentPropertyEditor } from '@/@types/enum';

/** 简单强调动画列表 */
export const animes: SimpleAnime[] = [

  { animeName: 'heartbeat', animeTitle: '心跳', animeType: 'emphasize', onText: false, attrs: { duration: 1 }, propertys: [
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

  { animeName: 'bounce', animeTitle: '弹跳', animeType: 'emphasize', onText: false, attrs: { duration: 1 }, propertys: [
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
];