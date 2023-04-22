import { SimpleAnime, SimpleAnimeConfig } from '../../@types';
import { gsap, Linear, Back, Power0, Power2 } from 'gsap';
import { ComponentPropertyEditor } from '@/@types/enum';

/** 简单淡出动画列表 */
export const animes: SimpleAnime[] = [

  { animeName: 'fadeOut', animeTitle: '渐隐', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'none',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }, {
      name: 'blur', title: '模糊', group: 'anime', default: 20,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'px',
        min: 0
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 100,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '%',
      },
      visible: (attrs) => attrs.direction !== 'none',
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      switch (attrs.direction) {
        case 'none':
          return gsap.fromTo(el, 
            { opacity: 1 }, 
            { opacity: 0 }
          );
        case 'top':
          return gsap.fromTo(el, 
            { opacity: 1, y: '0%' }, 
            { opacity: 0, y: `${-attrs.distance}%` }
          );
        case 'left':
          return gsap.fromTo(el, 
            { opacity: 1, x: '0%' }, 
            { opacity: 0, x: `${-attrs.distance}%` }
          );
        case 'bottom':
          return gsap.fromTo(el, 
            { opacity: 1, y: '0%' }, 
            { opacity: 0, y: `${attrs.distance}%` }
          );
        case 'right':
          return gsap.fromTo(el, 
            { opacity: 1, x: '0%' }, 
            { opacity: 0, x: `${attrs.distance}%` }
          );
      }
    }
  },

  { animeName: 'blurOut', animeTitle: '模糊淡出', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'none',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }, {
      name: 'blur', title: '模糊', group: 'anime', default: 20,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'px',
        min: 0
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 100,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '%',
      },
      visible: (attrs) => attrs.direction !== 'none',
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      switch (attrs.direction) {
        case 'none':
          return gsap.fromTo(el, 
            { opacity: 1, css: { filter: 'blur(0px)' } },
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)` } }, 
          );
        case 'top':
          return gsap.fromTo(el, 
            { opacity: 1, css: { filter: 'blur(0px)', transform: `translateY(0%)` } },
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateY(${-attrs.distance}%)` } }, 
          );
        case 'left':
          return gsap.fromTo(el, 
            { opacity: 1, css: { filter: 'blur(0px)', transform: `translateX(0%)` } },
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateX(${-attrs.distance}%)` } }, 
          );
        case 'bottom':
          return gsap.fromTo(el, 
            { opacity: 1, css: { filter: 'blur(0px)', transform: `translateY(0%)` } },
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateY(${attrs.distance}%)` } },
          );
        case 'right':
          return gsap.fromTo(el, 
            { opacity: 1, css: { filter: 'blur(0px)', transform: `translateX(0%)` } },
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateX(${attrs.distance}%)` } }, 
          );
      }
    }
  },

  { animeName: 'doorOpen', animeTitle: '开门', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    switch (attrs.direction) {
      case 'top':
        return gsap.fromTo(el, 
          { opacity: 1, css: { perspective: 400, transformOrigin: 'top', rotationX: 0 } },
          { opacity: 0, css: { perspective: 400, transformOrigin: 'top', rotationX: 90 } }, 
        );
      case 'left':
        return gsap.fromTo(el, 
          { opacity: 1, css: { perspective: 400, transformOrigin: 'left', rotationY: 0 } },
          { opacity: 0, css: { perspective: 400, transformOrigin: 'left', rotationY: 90 } }, 
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { opacity: 1, css: { perspective: 400, transformOrigin: 'bottom', rotationX: 0 } },
          { opacity: 0, css: { perspective: 400, transformOrigin: 'bottom', rotationX: -90 } }, 
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 1, css: { perspective: 400, transformOrigin: 'right', rotationY: 0 } },
          { opacity: 0, css: { perspective: 400, transformOrigin: 'right', rotationY: -90 } }, 
        );
    }
  } },
  
  { animeName: 'zoomOut', animeTitle: '镜头拉近', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'none',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      },
    }, {
      name: 'scale', title: '放大倍数', group: 'anime', default: 6,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '倍',
        min: 0
      },
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 200,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '%',
        min: 0
      },
      visible: (attrs) => attrs.direction !== 'none',
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    switch (attrs.direction) {
      case 'none':
        return gsap.fromTo(el, 
          { scale: 1, opacity: 1 },
          { opacity: 0, scale: attrs.scale }, 
        );
      case 'top':
        return gsap.fromTo(el, 
          { scale: 1, opacity: 1, y: '0%' },
          { opacity: 0, scale: attrs.scale, y: `${-attrs.distance}%` }, 
        );
      case 'left':
        return gsap.fromTo(el, 
          { scale: 1, opacity: 1, x: '0%' },
          { opacity: 0, scale: attrs.scale, x: `${-attrs.distance}%` }, 
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { scale: 1, opacity: 1, y: '0%' },
          { opacity: 0, scale: attrs.scale, y: `${attrs.distance}%` }, 
        );
      case 'right':
        return gsap.fromTo(el, 
          { scale: 1, opacity: 1, x: '0%' },
          { opacity: 0, scale: attrs.scale, x: `${attrs.distance}%` }, 
        );
    }
  } },

  { animeName: 'rollTo', animeTitle: '翻转淡出', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 100,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '%',
        min: 0
      },
    }, {
      name: 'rotate', title: '翻转角度', group: 'anime', default: 180,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '°',
        min: 0
      },
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    console.log('attrs.direction', attrs.direction);
    switch (attrs.direction) {
      case 'left':
        return gsap.fromTo(el, 
          { opacity: 1, x: '0%', rotateY: '0deg' },
          { opacity: 0, perspective: 600, x: `${-attrs.distance}%`, rotateY: `${attrs.rotate}deg` }, 
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 1, x: '0%', rotateY: '0deg' },
          { opacity: 0, perspective: 600, x: `${attrs.distance}%`, rotateY: `${attrs.rotate}deg` }, 
        );
      case 'top':
        return gsap.fromTo(el, 
          { opacity: 1, y: '0%', rotateX: '0deg' },
          { opacity: 0, perspective: 600, y: `${-attrs.distance}%`, rotateX: `${attrs.rotate}deg` }, 
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { opacity: 1, y: '0%', rotateX: '0deg' },
          { opacity: 0, perspective: 600, y: `${attrs.distance}%`, rotateX: `${attrs.rotate}deg` }, 
        );
    }
  } },

  { animeName: 'rotateTo', animeTitle: '旋转淡出', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '类型', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 100,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '%',
        min: 0
      },
    }, {
      name: 'rotate', title: '旋转角度', group: 'anime', default: 180,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '°',
        min: 0
      },
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      switch (attrs.direction) {
        case 'left':
          return gsap.fromTo(el, 
            { opacity: 1, rotateZ: `${attrs.rotate}deg`, x: `0%` },
            { opacity: 0, rotateZ: `0deg`, x: `-${attrs.distance}%` }, 
          );
        case 'right':
          return gsap.fromTo(el, 
            { opacity: 1, rotateZ: `${attrs.rotate}deg`, x: `0%` },
            { opacity: 0, rotateZ: `0deg`, x: `${attrs.distance}%` }, 
          );
        case 'top':
          return gsap.fromTo(el, 
            { opacity: 1, rotateZ: `${attrs.rotate}deg`, y: `0%` },
            { opacity: 0, rotateZ: `0deg`, y: `-${attrs.distance}%` }, 
          );
        case 'bottom':
          return gsap.fromTo(el, 
            { opacity: 1, rotateZ: `${attrs.rotate}deg`, y: `0%` },
            { opacity: 0, rotateZ: `0deg`, y: `${attrs.distance}%` }, 
          );
      }
    }
  },
  
  { animeName: 'pushReleaseTo', animeTitle: '加速淡出', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 100,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '%',
        min: 0
      },
      visible: (attrs) => attrs.direction !== 'none',
    }, {
      name: 'scale', title: '放大倍数', group: 'anime', default: 5,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '倍',
        min: 0
      },
      visible: (attrs) => attrs.direction === 'none',
    }, {
      name: 'speed', title: '速度', group: 'anime', default: 3,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: '倍',
        min: 0
      },
      visible: (attrs) => attrs.direction !== 'none',
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    let tl = gsap.timeline();
    switch (attrs.direction) {
      case 'none':
        return tl.to(el, { duration: 0, opacity: 1, scale: 1, ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.3, opacity: 1, scale: 0.5, ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.7, opacity: 0, scale: attrs.scale, ease: Back.easeOut.config(attrs.speed) });
      case 'left':
        return tl.to(el, { duration: 0, opacity: 1, x: '0%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.3, opacity: 1, x: '20%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.7, opacity: 0, x: '-100%', ease: Back.easeOut.config(attrs.speed) });
      case 'right':
        return tl.to(el, { duration: 0, opacity: 1, x: '0%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.3, opacity: 1, x: '-20%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.7, opacity: 0, x: '100%', ease: Back.easeOut.config(attrs.speed) });
      case 'top':
        return tl.to(el, { duration: 0, opacity: 1, y: '0%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.3, opacity: 1, y: '20%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.7, opacity: 0, y: '-100%', ease: Back.easeOut.config(attrs.speed) });
      case 'bottom':
        return tl.to(el, { duration: 0, opacity: 1, y: '0%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.3, opacity: 1, y: '-20%', ease: Back.easeOut.config(attrs.speed) })
          .to(el, { duration: 0.7, opacity: 0, y: '100%', ease: Back.easeOut.config(attrs.speed) });
    }
  } },
  
  { animeName: 'wipeOut', animeTitle: '擦出', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    switch (attrs.direction) {
      case 'none':
        return gsap.fromTo(el, 
          { clipPath: 'circle(100%)' },
          { clipPath: 'circle(0%)' },
        );
      case 'top':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)' },
        );
      case 'right':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { clipPath: 'polygon(100% 0%,100% 0%,100% 100%,100% 100%)' },
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)' },
        );
      case 'left':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { clipPath: 'polygon(0% 0%,0% 0%,0% 100%,0% 100%)' },
        );
    }
  } },

  { animeName: 'pitchingOut', animeTitle: '切出', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '向上', value: 'top' },
          { label: '向左', value: 'left' },
          { label: '向下', value: 'bottom' },
          { label: '向右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    switch (attrs.direction) {
      case 'top':
        return gsap.fromTo(el, 
          { y: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { y: '-100%', clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)' },
        );
      case 'right':
        return gsap.fromTo(el, 
          { x: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { x: '100%', clipPath: 'polygon(0% 0%,0% 0%,0% 100%,0% 100%)' },
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { y: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { y: '100%', clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)' },
        );
      case 'left':
        return gsap.fromTo(el, 
          { x: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' },
          { x: '-100%', clipPath: 'polygon(100% 0%,100% 0%,100% 100%,100% 100%)' },
        );
    }
  } },

  { animeName: 'hangAndDrop', animeTitle: '掉下', animeType: 'out', fillmode: 'none', onText: false, attrs: { duration: 1 }, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '向左', value: 'left' },
          { label: '向右', value: 'right' },
        ]
      }
    }, {
      name: 'distance', title: '距离', group: 'anime', default: 300,
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'px',
      },
      visible: (attrs) => attrs.direction !== 'none',
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
      let tl = gsap.timeline();
      switch (attrs.direction) {
        case 'left':
          return tl.to(el, { duration: 0, transformOrigin: 'left', rotate: '0deg', ease: Linear.easeNone })
            .to(el, { duration: 0.5, rotate: '100deg', ease: Linear.easeNone })
            .to(el, { duration: 0.1, opacity: 1, rotate: '90deg', ease: Linear.easeNone })
            .to(el, { duration: 0.4, opacity: 0, y: `${attrs.distance}px`, rotate: '70deg', ease: Linear.easeNone });
        case 'right':
          return tl.to(el, { duration: 0, transformOrigin: 'right', rotate: '0deg', ease: Linear.easeNone })
            .to(el, { duration: 0.5, rotate: '-100deg', ease: Linear.easeNone })
            .to(el, { duration: 0.1, opacity: 1, rotate: '-90deg', ease: Linear.easeNone })
            .to(el, { duration: 0.4, opacity: 0, y: `${attrs.distance}px`, rotate: '-70deg', ease: Linear.easeNone });
      }
    }
  },
];