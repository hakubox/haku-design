import global from '@/common/global';
import { registerPlugin } from '@/modules/plugin-module/register-plugin';
import ImageEditor from './ImageEditor.vue';
import { registerEditor } from '@/modules/plugin-module/register-editor';

/** 注册图片编辑器（插件测试） */
export function registerImageEditor() {
  registerPlugin({
    name: 'logo-component',
    title: 'LOGO组件',
    type: 'component',
    async register() {
      global.state.app.component('ImageEditor', ImageEditor);
      registerEditor({
        name: 'image',
        description: '图片',
        component: 'image-editor',
        attrs: {},
        editor: 'image',
      });
    },
  });
}