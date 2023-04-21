import { SimpleAnime, SimpleAnimeConfig } from '../@types';
import { gsap, Back, Power0, Power2 } from 'gsap';
import { ComponentPropertyEditor } from '@/@types/enum';

/** 简单动画列表 */
export const simpleAnimeList: SimpleAnime[] = [
  
  // 淡入
  { animeName: 'fadeIn', animeTitle: '渐显', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'none',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
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
            { opacity: 0 }, 
            { duration: attrs.duration / 1000, opacity: 1 }
          );
        case 'top':
          return gsap.fromTo(el, 
            { opacity: 0, y: `${attrs.distance}%` }, 
            { duration: attrs.duration / 1000, opacity: 1, y: '0%' }
          );
        case 'left':
          return gsap.fromTo(el, 
            { opacity: 0, x: `${attrs.distance}%` }, 
            { duration: attrs.duration / 1000, opacity: 1, x: '0%' }
          );
        case 'bottom':
          return gsap.fromTo(el, 
            { opacity: 0, y: `${-attrs.distance}%` }, 
            { duration: attrs.duration / 1000, opacity: 1, y: '0%' }
          );
        case 'right':
          return gsap.fromTo(el, 
            { opacity: 0, x: `${-attrs.distance}%` }, 
            { duration: attrs.duration / 1000, opacity: 1, x: '0%' }
          );
      }
    }
  },

  { animeName: 'blurIn', animeTitle: '模糊淡入', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'none',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
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
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)' } }
          );
        case 'top':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateY(${attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateY(0%)` } }
          );
        case 'left':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateX(${attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateX(0%)` } }
          );
        case 'bottom':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateY(${-attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateY(0%)` } }
          );
        case 'right':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateX(${-attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateX(0%)` } }
          );
      }
    }
  },

  { animeName: 'doorClose', animeTitle: '关门', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    console.log('attrs.direction', attrs.direction);
    switch (attrs.direction) {
      case 'top':
        return gsap.fromTo(el, 
          { opacity: 0, css: { perspective: 400, transformOrigin: 'bottom', rotationX: -90 } }, 
          { duration: attrs.duration / 1000, opacity: 1, css: { perspective: 400, transformOrigin: 'bottom', rotationX: 0 } }
        );
      case 'left':
        return gsap.fromTo(el, 
          { opacity: 0, css: { perspective: 400, transformOrigin: 'right', rotationY: -90 } }, 
          { duration: attrs.duration / 1000, opacity: 1, css: { perspective: 400, transformOrigin: 'right', rotationY: 0 } }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { opacity: 0, css: { perspective: 400, transformOrigin: 'top', rotationX: 90 } }, 
          { duration: attrs.duration / 1000, opacity: 1, css: { perspective: 400, transformOrigin: 'top', rotationX: 0 } }
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 0, css: { perspective: 400, transformOrigin: 'left', rotationY: 90 } }, 
          { duration: attrs.duration / 1000, opacity: 1, css: { perspective: 400, transformOrigin: 'left', rotationY: 0 } }
        );
    }
  } },
  
  { animeName: 'zoomIn', animeTitle: '镜头拉远', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'none',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
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
          { opacity: 0, scale: attrs.scale }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1 }
        );
      case 'top':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, y: `${attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, y: '0%' }
        );
      case 'left':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, x: `${attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, x: '0%' }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, y: `${-attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, y: '0%' }
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, x: `${-attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, x: '0%' }
        );
    }
  } },

  { animeName: 'rollFrom', animeTitle: '翻转进入', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
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
          { opacity: 0, perspective: 600, x: `${attrs.distance}%`, rotateY: `${attrs.rotate}deg` }, 
          { duration: attrs.duration / 1000, opacity: 1, x: '0%', rotateY: '0deg' }
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 0, perspective: 600, x: `${-attrs.distance}%`, rotateY: `${attrs.rotate}deg` }, 
          { duration: attrs.duration / 1000, opacity: 1, x: '0%', rotateY: '0deg' }
        );
      case 'top':
        return gsap.fromTo(el, 
          { opacity: 0, perspective: 600, y: `${attrs.distance}%`, rotateX: `${attrs.rotate}deg` }, 
          { duration: attrs.duration / 1000, opacity: 1, y: '0%', rotateX: '0deg' }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { opacity: 0, perspective: 600, y: `${-attrs.distance}%`, rotateX: `${attrs.rotate}deg` }, 
          { duration: attrs.duration / 1000, opacity: 1, y: '0%', rotateX: '0deg' }
        );
    }
  } },

  { animeName: 'pushReleaseFrom', animeTitle: '加速进入', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
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
      name: 'scale', title: '放大倍数', group: 'anime', default: 3,
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
    console.log('attrs.direction', attrs.direction);
    switch (attrs.direction) {
      case 'none':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, ease: Back.easeOut.config(attrs.speed) }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, ease: Back.easeOut.config(attrs.speed) }
        );
      case 'left':
        return gsap.fromTo(el, 
          { alpha: 0, x: `${attrs.distance}%`, ease: Back.easeOut.config(attrs.speed) },
          { duration: attrs.duration / 1000, alpha: 1, x: "0%", ease: Back.easeOut.config(attrs.speed) }
        );
      case 'right':
        return gsap.fromTo(el, 
          { alpha: 0, x: `${-attrs.distance}%`, ease: Back.easeOut.config(attrs.speed) },
          { duration: attrs.duration / 1000, alpha: 1, x: "0%", ease: Back.easeOut.config(attrs.speed) }
        );
      case 'top':
        return gsap.fromTo(el, 
          { alpha: 0, y: `${attrs.distance}%`, ease: Back.easeOut.config(attrs.speed) },
          { duration: attrs.duration / 1000, alpha: 1, y: "0%", ease: Back.easeOut.config(attrs.speed) }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { alpha: 0, y: `${-attrs.distance}%`, ease: Back.easeOut.config(attrs.speed) },
          { duration: attrs.duration / 1000, alpha: 1, y: "0%", ease: Back.easeOut.config(attrs.speed) }
        );
    }
  } },

  { animeName: 'wipe', animeTitle: '擦入', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '无', value: 'none' },
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    console.log('attrs.direction', attrs.direction);
    switch (attrs.direction) {
      case 'none':
        return gsap.fromTo(el, 
          { clipPath: 'circle(0%)' },
          { duration: attrs.duration / 1000, clipPath: 'circle(100%)' }
        );
      case 'top':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)' },
          { duration: attrs.duration / 1000, clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
      case 'right':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 0%,0% 0%,0% 100%,0% 100%)' },
          { duration: attrs.duration / 1000, clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)' },
          { duration: attrs.duration / 1000, clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
      case 'left':
        return gsap.fromTo(el, 
          { clipPath: 'polygon(100% 0%,100% 0%,100% 100%,100% 100%)' },
          { duration: attrs.duration / 1000, clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
    }
  } },

  { animeName: 'pitchingIn', animeTitle: '切入', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          // { label: '无', value: 'none' },
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '下', value: 'bottom' },
          { label: '右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    console.log('attrs.direction', attrs.direction);
    switch (attrs.direction) {
      // case 'none':
      //   return gsap.fromTo(el, 
      //     { clipPath: 'circle(0%)' },
      //     { duration: attrs.duration / 1000, clipPath: 'circle(100%)' }
      //   );
      case 'top':
        return gsap.fromTo(el, 
          { y: '100%', clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)' },
          { duration: attrs.duration / 1000, y: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
      case 'right':
        return gsap.fromTo(el, 
          { x: '-100%', clipPath: 'polygon(100% 0%,100% 0%,100% 100%,100% 100%)' },
          { duration: attrs.duration / 1000, x: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { y: '-100%', clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)' },
          { duration: attrs.duration / 1000, y: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
      case 'left':
        return gsap.fromTo(el, 
          { x: '100%', clipPath: 'polygon(0% 0%,0% 0%,0% 100%,0% 100%)' },
          { duration: attrs.duration / 1000, x: '0%', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
        );
    }
  } },
  
  // 淡出
  
  
  // 强调
];