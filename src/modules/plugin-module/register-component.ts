import type { Component, SetPartial } from '@/@types';
import type { ToolComponentItem } from '@/@types/tool-component-item';
import { formComponents } from '@/data/form-components';
import { menuComponentItems } from '@/data/menu-component-items';
import { state as pluginState, type PluginInstance, type PluginConfig } from "./";
import { registerPlugin } from "./register-plugin";

type InitComponent = SetPartial<Component, 'id' | 'attrs' | 'component'>;

/** 注册组件 */
export function registerComponent(component: InitComponent, menu?: ToolComponentItem) {
  registerPlugin({
    name: component.name,
    title: component.title,
    icon: '',
    type: 'component'
  });
  formComponents.push(component);
  if (menu) {
    registerPlugin({
      name: menu.name,
      title: menu.title,
      icon: menu.icon,
      type: 'menu-component-item'
    });
    menuComponentItems.push(menu);
  }
}

/** 注册工具项 */
export function registerMenu(plugin: PluginConfig, menu: ToolComponentItem) {
  registerPlugin(plugin);
  menuComponentItems.push(menu);
}