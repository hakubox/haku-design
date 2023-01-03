import { propertyEditors, type InitPropertyEditor } from '@/data/property-editor';
import { registerPlugin } from './register-plugin';
import { PluginLoadType, PluginType } from './enum';
import { PluginConfig } from './@types';

/** 引入编辑器 */
export function registerEditor(plugin: PluginConfig, editor: InitPropertyEditor) {
  registerPlugin({
    ...plugin,
    name: editor.name,
    title: editor.description,
    icon: 'iconfont icon-box2',
    pluginType: PluginType.menuComponentItem,
  });
  propertyEditors.push(editor);
}
