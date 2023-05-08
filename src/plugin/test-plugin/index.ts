import { state as editorState } from '@haku-design/editor';
import { VNode, h, render } from 'vue';
import { PluginType, registerPlugin } from '@/modules/plugin-module';
import TestPlugin from './TestPlugin.vue';

/** 注册测试组件（插件测试） */
export function registerTestPlugin() {
  registerPlugin({
    name: 'test-plugin',
    title: '测试插件',
    version: '0.0.1',
    author: 'haku',
    description: '测试用插件，用于在界面中展示一些内容',
    pluginType: PluginType.basicPlugin,
    async onloadApp() {
      const _container: HTMLDivElement = document.createElement('div');
      const _component: VNode = h(TestPlugin, {});
      render(_component, _container);
      editorState.canvasPanelEl.appendChild(_container);
    },
  });
}