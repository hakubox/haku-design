import { propertyEditors, type InitPropertyEditor } from '@haku-design/core';
import { registerPlugin } from './register-plugin';
import { PluginLoadType, PluginType } from './enum';
import { PluginInfo } from './@types';

/** 引入编辑器 */
export function registerEditor(plugin: PluginInfo, editor: InitPropertyEditor) {
  registerPlugin({
    ...plugin,
    name: editor.name,
    title: plugin.title ?? editor.description,
    pluginType: PluginType.menuComponentItem,
  });
  propertyEditors.push(editor);
}
