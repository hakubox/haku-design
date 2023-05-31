import type { ToolComponentItem } from '@/@types/tool-component-item';
import { type InitComponent, formComponents } from '@/data/form-components';
import { menuComponentItems } from '@/data/menu-component-items';
import { registerPlugin } from "./register-plugin";
import type { PluginInfo } from './index.d';
import { PluginLoadType, PluginType } from './enum';
import bus, { GlobalBusType } from '@/tools/bus';

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
  bus.$emit(GlobalBusType.addShopComponent);
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