import global from '@/common/global';
import ImageEditor from './ImageEditor.vue';
import { PluginType, type PluginConfig, registerEditor } from '@/modules/plugin-module';

/** 注册图片编辑器（插件测试） */
export function registerImageEditor() {
  const _pluginInfo: PluginConfig = {
    name: 'logo-component',
    title: '测试用图片编辑器',
    description: '测试用图片编辑器插件',
    version: '0.0.1',
    pluginType: PluginType.component,
    async register() {
      global.state.app.component('ImageEditor', ImageEditor);
    },
  };

  registerEditor(_pluginInfo, {
    name: 'image',
    description: '图片',
    component: 'image-editor',
    attrs: {},
    editor: 'image',
  });
}