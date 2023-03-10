import { reactive, UnwrapRef, toRefs, onMounted, onUnmounted } from 'vue';
import { Component } from '@/@types';
import { state as editorState, service as editorService } from '../modules/editor-module';
import { arrChange } from '@/tools/common';
import { service as historyService } from './history-module';

/** 模块操作类型 */
export type HandleType = 'componentMovePrev' | 'componentMoveNext' | 'componentCopy' | 'componentRemove';

/** 获取组件宽度 */
export function getWidth(component: Component) {
  return component.attrs.width || component.attrs._width || component.attrs.minWidth || 0;
}

/** 获取组件高度 */
export function getHeight(component: Component) {
  return component.attrs.height || component.attrs._width || component.attrs.minHeight || 0;
}

/** 合并组件 */
export function mergeComponent(component: Component) {
  
}

/** 控件操作模块 */
export function useComponentHandle() {
  const state: UnwrapRef<any> = reactive({});

  /** 控件操作 */
  function componentHandle(eventName: HandleType, params: any, component: Component) {
    let _children = [] as Component[] | undefined,
      _component = undefined as Component | undefined,
      _parentComponentId = undefined as string | undefined,
      _parent = undefined as Component | undefined,
      _index: number = -1;
    const findParent = (root, id) => {
      const _index = root.children?.findIndex(child => child.id === component.id);
      let parent;
      if (_index >= 0) {
        parent = root;
      } else {
        root.children?.forEach((item, childIndex) => {
          parent = findParent(item, id);
        });
      }
      return parent;
    };
    _parent = findParent(editorState.currentPage, component.id) as unknown as Component;
    _parentComponentId = _parent?.id;
    _component = component;
    _children = _parent?.children;
    _index = _parent?.children?.findIndex(child => child.id === component.id) ?? -1;
    if (_component) {
      switch (eventName) {
        case 'componentMovePrev':
          if (!_parent) throw new Error('children属性不存在');
          return componentMovePrev(params, _parent, _index);
        case 'componentMoveNext':
          if (!_parent) throw new Error('children属性不存在');
          return componentMoveNext(params, _parent, _index);
        case 'componentCopy':
          return componentCopy(params, _component, _component.id, _parentComponentId, _index);
        case 'componentRemove':
          return componentRemove(params, _component, _component.id, _parentComponentId, _index);
        default:
          break;
      }
    }
  }

  /** 控件前移 */
  function componentMovePrev(e, parent: Component, index: number) {
    if (parent.children?.length && index > 0) {
      parent.children = arrChange(parent.children, index, index - 1);
    }
  }

  /** 控件后移 */
  function componentMoveNext(e, parent: Component, index: number) {
    if (parent.children?.length && index >= 0 && index < parent.children.length - 1) {
      parent.children = arrChange(parent.children, index, index + 1);
    }
  }

  /** 控件复制 */
  function componentCopy(
    e,
    component: Component,
    componentId: string,
    parentComponentId: string | undefined,
    index: number,
  ) {
    historyService.exec('copy-component', {
      objectId: component.id,
      value: component,
      attrs: {
        index: index + 1,
        parentComponentId,
        parentComponentSlotIndex: component.slotIndex,
      },
    });
    refresh();
  }

  /** 控件删除 */
  function componentRemove(
    e,
    component: Component,
    componentId: string,
    parentComponentId: string | undefined,
    index: number,
  ) {
    historyService.exec('remove-component', {
      objectId: componentId,
      value: component,
      attrs: { index: index + 1, componentId, parentComponentId },
    });
    refresh();
  }

  /** 刷新 */
  function refresh(fn?: Function) {
    setTimeout(() => {
      editorService.refresh();
      fn && fn();
    }, 50);
  }

  onMounted(() => {});

  onUnmounted(() => {});

  return {
    ...toRefs(state),
    componentHandle,
  };
}
