import type { ToolComponentItem } from '@/@types/tool-component-item';
import { type InitComponent, formComponents } from '@/data/form-components';
import { menuComponentItems } from '@/data/menu-component-items';
import { registerPlugin } from "./register-plugin";
import { PluginConfig } from './@types';
import { PluginLoadType, PluginType } from './enum';

/** 注册组件 */
export function registerComponent(plugin: PluginConfig, component: InitComponent, menu?: ToolComponentItem) {
  registerPlugin({
    ...plugin,
    name: component.name,
    title: component.title,
    icon: plugin?.icon ?? menu?.icon,
    pluginType: PluginType.component,
  });
  formComponents.push(component);
  if (menu) {
    registerPlugin({
      ...plugin,
      parent: `${menu.name}`,
      name: `${menu.name}`,
      title: `${menu.title}`,
      icon: menu.icon,
      pluginType: PluginType.menuComponentItem,
    });
    menuComponentItems.push(menu);
  }
}

/** 注册工具项 */
export function registerMenu(plugin: PluginConfig, menu: ToolComponentItem) {
  registerPlugin({
    ...plugin,
    name: menu.name,
    title: menu.title,
    icon: menu.icon,
    pluginType: PluginType.menuComponentItem,
  });
  menuComponentItems.push(menu);
}