import { formComponents, initComponents } from './src/data/form-components';
import { createModelId, cloneForce } from '@haku-design/common';
import { Component } from './src/@types';

export * from './src/data/icon-editor';
export * from './src/data/app-config';
export * from './src/data/form-commands';
export * from './src/data/form-components';
export * from './src/data/form-devices';
export * from './src/data/icon-editor';
export * from './src/data/menu-component-items';
export * from './src/data/property-editor';
export * from './src/data/app-config';

// export * from './src/@types/enum';
export * from './src/@types/index.d';


/** 填充控件属性 */
export function fillPropertys(components: Component[]): Component[] {
  /** 原始组件列表 */
  const _originalComponentList: Component[] = cloneForce(components);
  /** 对应组件库组件列表 */
  const _componentList: Component[] = formComponents as Component[];

  const _cb = (list: Component[]) => {
    if (list?.length) {
      for (let i = 0; i < list.length; i++) {
        const _component = _componentList.find((component) => component.name == list[i].name);
        if (_component) {
          list[i].id = list[i].id || createModelId(10);
          // list[i].component.defaultAttrs = cloneForce(_component.component.defaultAttrs);
          list[i].title = _component.title;
          list[i].propertys = cloneForce(_component.propertys);
        }
      }
      const _list = initComponents(list) as Component[];
      for (let index = 0; index < list.length; index++) {
        list[index] = {
          ..._list[index],
          // propertyEditors: list[index].propertyEditors
        };
      }
    }
  };

  _cb(_originalComponentList);

  return _originalComponentList;
}