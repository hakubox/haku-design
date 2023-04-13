<template>
  <div class="canvas-quick-tools" v-if="editorState.appConfig.appType === AppType.canvas">
    <CanvasQuickToolItem
      v-for="item in state.toolList"
      :config="item"
    />
  </div>
</template>

<script lang="ts" setup>
import { Component, ComponentGroup } from '@/@types';
import { reactive, computed } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { AppType } from '@/@types/enum';
import CanvasQuickToolItem from './CanvasQuickToolItem.vue';
import type { CanvasQuickTool } from '@/@types/canvas-quick-tool';
import message from '@/common/message';
import { mergeComponent, splitComponent } from '@/common/component-handle';

const props = defineProps({
  
});

const state = reactive({
  toolList: [
    {
      type: 'tool',
      title: '层级',
      icon: 'icon-zhiding',
      children: [{
        type: 'tool',
        title: '置顶',
        icon: 'icon-zhiding',
        get disabled() { return !editorState.currentSelectedComponents.length },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          if (parent.index === 0) {
            message.toast('已经处于顶层', 'warning');
            return;
          }
          const _children = parent.component.children!;
          const _re = [
            _children[parent.index],
            ..._children.slice(0, parent.index),
            ..._children.slice(parent.index + 1),
          ];
          parent.component.children = _re;
        }
      }, {
        type: 'tool',
        title: '上移',
        icon: 'icon-shangyi',
        get disabled() { return !editorState.currentSelectedComponents.length },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          if (parent.index === 0) {
            message.toast('已经处于顶层', 'warning');
            return;
          }
          const _children = parent.component.children!;
          const _re = [
            ..._children.slice(0, parent.index - 1),
            _children[parent.index],
            _children[parent.index - 1],
            ..._children.slice(parent.index + 1),
          ];
          parent.component.children = _re;
        }
      }, {
        type: 'tool',
        title: '下移',
        icon: 'icon-xiayi',
        get disabled() { return !editorState.currentSelectedComponents.length },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          if (parent.index === 0) {
            message.toast('已经处于底层', 'warning');
            return;
          }
          const _children = parent.component.children!;
          const _re = [
            ..._children.slice(0, parent.index),
            _children[parent.index + 1],
            _children[parent.index],
            ..._children.slice(parent.index + 2),
          ];
          parent.component.children = _re;
        }
      }, {
        type: 'tool',
        title: '置底',
        icon: 'icon-zhidi',
        get disabled() { return !editorState.currentSelectedComponents.length },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          if (parent.index === 0) {
            message.toast('已经处于底层', 'warning');
            return;
          }
          const _children = parent.component.children!;
          const _re = [
            ..._children.slice(0, parent.index),
            ..._children.slice(parent.index + 1),
            _children[parent.index],
          ];
          parent.component.children = _re;
        }
      }
    ]}, {
      type: 'split',
    }, {
      type: 'tool',
      title: '对齐',
      icon: 'icon-zuoceduiqi',
      children: [{
        type: 'tool',
        title: '左侧对齐',
        icon: 'icon-zuoceduiqi',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents;
          let _minX = Number.MAX_VALUE;
          _components.forEach(i => {
            if (_minX > i.attrs.x)  _minX = i.attrs.x;
          });
          _components.forEach(i => {
            if (i.attrs.x !== _minX) i.attrs.x = _minX;
          });
        }
      }, {
        type: 'tool',
        title: '居中对齐',
        icon: 'icon-chuizhijuzhongduiqi',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents;
          let _minX = Number.MAX_VALUE;
          let _maxX = Number.MIN_VALUE;
          _components.forEach(i => {
            if (_minX > i.attrs.x) _minX = i.attrs.x;
            if (_maxX < i.attrs.x + i.attrs.width) _maxX = i.attrs.x + i.attrs.width;
          });
          let _centerX = _minX + (_maxX - _minX) / 2;
          _components.forEach(i => {
            if (i.attrs.x !== _centerX - i.attrs.width / 2) {
              i.attrs.x = _centerX - i.attrs.width / 2;
            }
          });
        }
      }, {
        type: 'tool',
        title: '右侧对齐',
        icon: 'icon-youceduiqi',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents;
          let _maxX = Number.MIN_VALUE;
          _components.forEach(i => {
            if (_maxX < i.attrs.x + i.attrs.width) _maxX = i.attrs.x + i.attrs.width;
          });
          _components.forEach(i => {
            if (i.attrs.x !== _maxX) i.attrs.x = _maxX - i.attrs.width;
          });
        }
      }, {
        type: 'tool',
        title: '顶部对齐',
        icon: 'icon-dingbuduiqi',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents;
          let _minY = Number.MAX_VALUE;
          _components.forEach(i => {
            if (_minY > i.attrs.y)  _minY = i.attrs.y;
          });
          _components.forEach(i => {
            if (i.attrs.y !== _minY) i.attrs.y = _minY;
          });
        }
      }, {
        type: 'tool',
        title: '居中对齐',
        icon: 'icon-shuipingjuzhongduiqi',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents;
          let _minY = Number.MAX_VALUE;
          let _maxY = Number.MIN_VALUE;
          _components.forEach(i => {
            if (_minY > i.attrs.y) _minY = i.attrs.y;
            if (_maxY < i.attrs.y + i.attrs.height) _maxY = i.attrs.y + i.attrs.height;
          });
          let _centerY = _minY + (_maxY - _minY) / 2;
          _components.forEach(i => {
            if (i.attrs.y !== _centerY - i.attrs.height / 2) {
              i.attrs.y = _centerY - i.attrs.height / 2;
            }
          });
        }
      }, {
        type: 'tool',
        title: '底部对齐',
        icon: 'icon-dibuduiqi',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents;
          let _maxY = Number.MIN_VALUE;
          _components.forEach(i => {
            if (_maxY < i.attrs.y + i.attrs.height) _maxY = i.attrs.y + i.attrs.height;
          });
          _components.forEach(i => {
            if (i.attrs.y !== _maxY) i.attrs.y = _maxY - i.attrs.height;
          });
        }
      }, {
        type: 'tool',
        title: '水平等间距',
        icon: 'icon-shuipingdengjianju',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents.sort((a, b) => a.attrs.x - b.attrs.x);
          let _minX = Number.MAX_VALUE;
          let _maxX = Number.MIN_VALUE;
          _components.forEach(i => {
            if (_minX > i.attrs.x) _minX = i.attrs.x;
            if (_maxX < i.attrs.x) _maxX = i.attrs.x;
          });
          let _average = (_maxX - _minX) / (_components.length - 1);
          _components.forEach((i, index) => {
            if (i.attrs.x !== _minX + index * _average) i.attrs.x = _minX + index * _average;
          });
        }
      }, {
        type: 'tool',
        title: '垂直等间距',
        icon: 'icon-chuizhidengjianju',
        get disabled() { return editorState.currentSelectedComponents.length < 2 },
        fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
          const _components = editorState.currentSelectedComponents.sort((a, b) => a.attrs.y - b.attrs.y);
          let _minY = Number.MAX_VALUE;
          let _maxY = Number.MIN_VALUE;
          _components.forEach(i => {
            if (_minY > i.attrs.y) _minY = i.attrs.y;
            if (_maxY < i.attrs.y) _maxY = i.attrs.y;
          });
          let _average = (_maxY - _minY) / (_components.length - 1);
          _components.forEach((i, index) => {
            if (i.attrs.y !== _minY + index * _average) i.attrs.y = _minY + index * _average;
          });
        }
      }]
    }, {
      type: 'split',
    }, {
      type: 'tool',
      title: '组合',
      icon: 'icon-link-device',
      get disabled() { return editorState.currentSelectedComponents.length < 2 },
      fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
        mergeComponent(editorState.currentSelectedComponents);
      }
    }, {
      type: 'tool',
      title: '拆分',
      icon: 'icon-link-device',
      get disabled() { return editorState.currentSelectedComponents.length !== 1 || !editorState.currentSelectedComponents[0].isGroup },
      fn: (component: Component, parent: { component: Component, originComponent: Component, index: number, level: number }) => {
        splitComponent(editorState.currentSelectedComponents[0] as ComponentGroup);
      }
    }
  ] as CanvasQuickTool[]
});
</script>

<style lang="less">
  .canvas-quick-tools {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 30px;

    > .canvas-quick-split {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 24px;
      width: 1px;
      border-right: 1px solid #EEE;

      + .canvas-quick-tool {
        margin-left: 10px;
      }
      + .canvas-quick-split {
        margin-left: 10px;
      }
    }

    > .canvas-quick-tool {
      cursor: pointer;
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 30px;
      background-color: white;
      transition: background-color 0.15s;
      border-radius: 4px;

      > .canvas-quick-tool-title {
        content: attr(tip);
        position: absolute;
        top: calc(100% + 12px);
        left: 50%;
        padding: 2px 12px;
        white-space: nowrap;
        color: white;
        font-size: 12px;
        background-color: rgba(0,0,0,0.6);
        border-radius: 4px;
        transform: translate(-50%, 6px);
        z-index: 999;
        opacity: 0.0;
        visibility: hidden;
        transition: visibility 0.15s, opacity 0.15s, transform 0.15s;

        &:before {
          content: '';
          position: absolute;
          top: calc(100% - 27px);
          left: 50%;
          width: 0px;
          height: 0px;
          transform: translate(-50%, 0px) rotate(45deg);
          border-top-left-radius: 3px;
          border-top: 5px solid rgba(0,0,0,0.6);
          border-right: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 5px solid rgba(0,0,0,0.6);
        }
      }

      &:hover {
        background-color: #F5F5F5;

        > .canvas-quick-tool-title {
          visibility: visible;
          opacity: 1;
          transform: translate(-50%, 0px);
        }
        
        > .iconfont {
          color: #5874d8;
        }

        > .canvas-quick-tool-group {
          visibility: visible;
          opacity: 1;
          transform: translateY(0px);
        }
      }

      &.disabled {
        cursor: not-allowed;
        color: #DDD;
        
        > .iconfont {
          color: #DDD !important;
        }
      }

      &.haschild {
        width: 50px;
        padding: 0px 8px;
        
        &:after {
          content: '\e641';
          font-family: 'iconfont' !important;
          position: relative;
          font-size: 12px;
          padding: 2px 2px 2px 6px;
          color: #BBB;
        }
      }

      + .canvas-quick-tool {
        margin-left: 10px;
      }
      + .canvas-quick-split {
        margin-left: 10px;
      }

      > .iconfont {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        height: 30px;
        width: 30px;
        color: #8f95ab;
        font-size: 18px;
        transition: 0.12s;
      }


      // 第二层
      > .canvas-quick-tool-group {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        left: -10px;
        top: calc(100% + 12px);
        border-radius: 4px;
        box-shadow: 2px 2px 8px 2px rgba(0,0,0,0.07);
        transform: translateY(6px);
        z-index: 999;
        opacity: 0.0;
        visibility: hidden;
        transition: visibility 0.15s, opacity 0.15s, transform 0.15s;

        &:before {
          content: '';
          position: absolute;
          display: block;
          top: -12px;
          left: 0px;
          width: 100%;
          height: 12px;
        }

        &:after {
          content: '';
          position: absolute;
          top: -5px;
          left: 25px;
          width: 0px;
          height: 0px;
          transform: translate(-50%, 0px) rotate(45deg);
          box-shadow: 2px 2px 6px 2px rgba(0,0,0,0.1);
          border-top-left-radius: 3px;
          border-top: 6px solid white;
          border-right: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid white;
          z-index: 1;
        }

        > .canvas-quick-tool-group-content {
          position: relative;
          border-radius: 4px;
          background-color: white;
          z-index: 2;

          &:before {
            content: '';
            display: block;
            width: 100%;
            height: 6px;
          }

          &:after {
            content: '';
            display: block;
            width: 100%;
            height: 6px;
          }

          > .canvas-quick-tool {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 6px 16px 6px 6px;
            height: 32px;

            > .canvas-quick-tool-title {
              white-space: nowrap;
              font-size: 12px;
              border-radius: 4px;
            }

            &:hover {

              > .canvas-quick-tool-title {
              }
              
              > .iconfont {
                color: #5874d8;
                background-color: #F5F5F5;
              }
            }

            &.disabled {
              cursor: not-allowed;
              color: #DDD;
              
              > .iconfont {
                color: #DDD !important;
                background-color: white !important;
              }
            }

            + .canvas-quick-tool {
              padding-top: 8px;

              &:before {
                content: '';
                position: absolute;
                top: 0px;
                left: 10%;
                height: 0px;
                width: calc(100% - 20%);
                border-top: 1px solid #F5F5F5;
              }
            }

            > .iconfont {
              display: inline-flex;
              justify-content: center;
              align-items: center;
              border-radius: 4px;
              height: 30px;
              width: 30px;
              background-color: white;
              color: #8f95ab;
              font-size: 18px;
              transition: 0.12s;
            }
          }
        }
      }
    }
  }
</style>