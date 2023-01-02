import { state as editorState } from '@/modules/editor-module';
import { VNode, h, render } from 'vue';
import TestPlugin from './TestPlugin.vue';
import { registerPlugin } from '@/modules/plugin-module/register-plugin';

/** 注册测试组件（插件测试） */
export function registerTestPlugin() {
  registerPlugin({
    name: 'test-plugin',
    title: '测试插件',
    type: 'component',
    async onloadApp() {
      const _container: HTMLDivElement = document.createElement('div');
      let _component: VNode = h(TestPlugin, {});
      render(_component, _container);
      editorState.canvasPanelEl.appendChild(_container);
    }
  });
}