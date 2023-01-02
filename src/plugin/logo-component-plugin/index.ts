import global from '@/common/global';
import LogoComponent from './LogoComponent.vue';
import { registerComponent, registerMenu } from '@/modules/plugin-module/register-component';
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from '@/@types/enum';
import { registerPlugin } from '@/modules/plugin-module/register-plugin';

/** 注册Logo组件（插件测试） */
export function registerLogoComponent() {
  registerPlugin({
    name: 'logo-component',
    title: 'LOGO组件',
    type: 'component',
    async register() {
      global.state.app.component('LogoComponent', LogoComponent);
      registerComponent({
        name: 'logo-component',
        isHidden: false,
        isFormItem: false,
        isTopLevel: false,
        type: ComponentCategory.attachment,
        answerType: 'none',
        title: 'LOGO',
        propertys: [
          {
            name: 'visible', title: '是否显示', default: true, visible: true,
            group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
            remark: '是否在界面上显示。', attrs: {
              confirm: (value) => `是否${value ? '隐藏' : '显示'}当前组件？`,
            }
          }, {
            name: 'text', title: 'LOGO文本', default: 'BAIDU',
            group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine,
          }, {
            name: 'image', title: '在线图片', default: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
            group: ComponentPropertyGroup.style, editor: 'image',
          }
        ]
      }, {
        title: 'LOGO组件',
        name: 'logo-component',
        icon: 'iconfont icon-sun',
        category: ComponentCategory.attachment
      });
    },
  });
}