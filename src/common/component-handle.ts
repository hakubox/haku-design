import { reactive, UnwrapRef, toRefs, onMounted, onUnmounted, StyleValue } from 'vue';
import { Component, ComponentGroup, ComponentRect } from '@/@types';
import { state as editorState, service as editorService } from '../modules/editor-module';
import { arrChange, createModelId } from '@/tools/common';
import { service as historyService } from './history-module';

/** 模块操作类型 */
export type HandleType = 'componentMovePrev' | 'componentMoveNext' | 'componentCopy' | 'componentRemove';

/** 获取组件宽度 */
export function getWidth(component: Component | ComponentGroup) {
  return component.attrs.width || component.attrs._width || component.attrs.minWidth || 0;
}

/** 获取组件高度 */
export function getHeight(component: Component | ComponentGroup) {
  return component.attrs.height || component.attrs._width || component.attrs.minHeight || 0;
}

/** 获取组件分组的坐标尺寸样式 */
export function getComponentsRectStyle(components: (ComponentGroup | Component)[], style: Record<string, any> = {}): StyleValue {
  const rect = getComponentsRect(components);
  return {
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `rotate(${rect.rotate || 0}deg)`,
    ...style
  }
}

/** 获取组件分组的坐标尺寸信息 */
export function getComponentsRect(components: (ComponentGroup | Component)[]): ComponentRect {
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;

  for (let i = 0; i < components.length; i++) {
    const item = components[i];
    if (item.attrs.x < minX) minX = item.attrs.x;
    if (item.attrs.y < minY) minY = item.attrs.y;
    const _width = getWidth(item);
    const _height = getHeight(item);
    if (item.attrs.x + _width > maxX) maxX = item.attrs.x + _width;
    if (item.attrs.y + _height > maxY) maxY = item.attrs.y + _height;
  }
  return {
    x: minX,
    y: minY,
    x2: maxX,
    y2: maxY,
    width: maxX - minX,
    height: maxY - minY,
    rotate: 0
  };
}

/** 拆分组件 */
export function splitComponent(component: ComponentGroup) {
  const parentComponent = editorService.findParentComponent(component.id);
  if (parentComponent?.component) {
    const _index = parentComponent.index;
    parentComponent.component.children?.splice(_index, 1);
    parentComponent.component.children?.push(...component.children);
    component.children.forEach(item => {
      item.attrs.x += component.attrs.x;
      item.attrs.y += component.attrs.y;
    });
  }
}

/** 合并组件 */
export function mergeComponent(components: (Component | ComponentGroup)[]) {
  const parentComponent = editorService.findParentComponent(components[0].id);
  let parentComponents = [] as {
    component: Component;
    originComponent: Component;
    index: number;
    level: number;
  }[];
  let reComponents = [] as (Component | ComponentGroup)[];
  for (let i = 0; i < components.length; i++) {
    const item = components[i];
    const _parent = editorService.findParentComponent(item.id);
    if (_parent) parentComponents.push(_parent);
  }
  parentComponents = parentComponents.sort((a, b) => a.index - b.index);
  for (let i = parentComponents.length - 1; i >= 0; i--) {
    const item = parentComponents[i];
    const _re = item.component.children?.splice(item.index)[0];
    if (_re) {
      _re.slotIndex = 0;
      reComponents.push(_re);
    }
  }
  let componentGroup = {
    id: createModelId(10),
    name: 'ComponentGroup',
    isGroup: true,
    label: '群组',
    isHidden: false,
    isFormItem: false,
    attrs: {
      ...getComponentsRect(reComponents),
      lock: false,
      visible: true,
    },
    children: reComponents.slice(),
  } as ComponentGroup;
  componentGroup.children.forEach(component => {
    component.attrs.x -= componentGroup.attrs.x;
    component.attrs.y -= componentGroup.attrs.y;
  });
  if (parentComponent) {
    parentComponent.component.children?.push(componentGroup);
    return componentGroup;
  } else {
    editorState.currentPage.children.push(componentGroup);
  }
}

/** 控件操作模块 */
export function useComponentHandle() {
  const state: UnwrapRef<any> = reactive({});

  /** 控件操作 */
  function componentHandle(eventName: HandleType, params: any, component: Component | ComponentGroup) {
    let _children = [] as (Component | ComponentGroup)[] | undefined,
      _component = undefined as Component | ComponentGroup | undefined,
      _parentComponentId = undefined as string | undefined,
      _parent = undefined as Component | ComponentGroup | undefined,
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
    component: Component | ComponentGroup,
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
    component: Component | ComponentGroup,
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
