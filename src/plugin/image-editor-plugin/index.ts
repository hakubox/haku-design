import ImageEditor from './ImageEditor.vue';
import { PluginType, type PluginInfo, registerEditor } from '@/modules/plugin-module';
import { App } from 'vue';

/** 注册图片编辑器（插件测试） */
export function registerImageEditor(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'image-editor',
    title: '测试用图片编辑器',
    description: '测试用图片编辑器插件',
    version: '0.0.1',
    author: 'haku',
    pluginType: PluginType.component,
    async register() {
      app.component('ImageEditor', ImageEditor);
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

export default {
  install(app: App) {
    registerImageEditor(app);
  }
}