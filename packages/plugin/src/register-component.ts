import { menuComponentItems, formComponents, type ToolComponentItem, type InitComponent } from '@haku-design/core';
import { registerPlugin } from "./register-plugin";
import { PluginInfo } from './@types';
import { PluginLoadType, PluginType } from './enum';

/** 注册组件 */
export function registerComponent(plugin: PluginInfo, component: InitComponent, menu?: ToolComponentItem) {
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
      dependencies: [
        ...(plugin.dependencies ?? []),
        { pluginName: plugin.name ?? component.name, version: plugin.version }
      ],
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
export function registerMenu(plugin: PluginInfo, menu: ToolComponentItem) {
  registerPlugin({
    ...plugin,
    name: menu.name,
    title: menu.title,
    icon: menu.icon,
    pluginType: PluginType.menuComponentItem,
  });
  menuComponentItems.push(menu);
}