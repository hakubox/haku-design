import { propertyEditors, type InitPropertyEditor } from '@/data/property-editor';
import { registerPlugin } from './register-plugin';
import { PluginLoadType, PluginType } from './enum';
import type { PluginInfo } from './index.d';

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
