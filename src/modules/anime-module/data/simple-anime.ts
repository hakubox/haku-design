import { SimpleAnime, SimpleAnimeConfig } from '../@types';
import { gsap, Power0, Power2 } from 'gsap';
import { ComponentPropertyEditor } from '@/@types/enum';

/** 简单动画列表 */
export const simpleAnimeList: SimpleAnime[] = [
  
  // 淡入
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
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateY(${-attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateY(0%)` } }
          );
        case 'left':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateX(${-attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateX(0%)` } }
          );
        case 'bottom':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateY(${attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateY(0%)` } }
          );
        case 'right':
          return gsap.fromTo(el, 
            { opacity: 0, css: { filter: `blur(${attrs.blur}px)`, transform: `translateX(${attrs.distance}%)` } }, 
            { duration: attrs.duration / 1000, opacity: 1, css: { filter: 'blur(0px)', transform: `translateX(0%)` } }
          );
      }
    }
  },
  { animeName: 'doorClose', animeTitle: '翻转进入', animeType: 'in', onText: false, propertys: [
    {
      name: 'direction', title: '方向', group: 'anime', default: 'left',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '左', value: 'left' },
          { label: '右', value: 'right' },
        ]
      }
    }
  ], animeFn: (el: HTMLElement, attrs: Record<string, any>) => {
    console.log('attrs.direction', attrs.direction);
    switch (attrs.direction) {
      case 'left':
        return gsap.fromTo(el, 
          { opacity: 0, css: { perspective: 400, transformOrigin: 'left', rotationY: 90 } }, 
          { duration: attrs.duration / 1000, opacity: 1, css: { perspective: 400, transformOrigin: 'left', rotationY: 0 } }
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 0, css: { perspective: 400, transformOrigin: 'right', rotationY: -90 } }, 
          { duration: attrs.duration / 1000, opacity: 1, css: { perspective: 400, transformOrigin: 'right', rotationY: 0 } }
        );
    }
  } },
  { animeName: 'zoomIn', animeTitle: '镜头拉近', animeType: 'in', onText: false, propertys: [
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
          { opacity: 0, scale: attrs.scale, y: `${-attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, y: '0%' }
        );
      case 'left':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, x: `${-attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, x: '0%' }
        );
      case 'bottom':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, y: `${attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, y: '0%' }
        );
      case 'right':
        return gsap.fromTo(el, 
          { opacity: 0, scale: attrs.scale, x: `${attrs.distance}%` }, 
          { duration: attrs.duration / 1000, scale: 1, opacity: 1, x: '0%' }
        );
    }
  } },
  
  
  // 淡出
  
  
  // 强调
];