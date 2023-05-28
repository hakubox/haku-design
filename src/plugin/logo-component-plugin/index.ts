import LogoComponent from './LogoComponent.vue';
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup } from '@/@types/enum';
import { PluginType, type PluginInfo, registerComponent } from '@/modules/plugin-module';
import { App } from 'vue';

/** 注册Logo组件（插件测试） */
export function registerLogoComponent(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'logo-component',
    title: 'LOGO组件',
    version: '0.0.1',
    author: 'haku',
    description: '测试用LOGO组件，暂时用于展示百度的LOGO',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component('LogoComponent', LogoComponent);
    }
  };

  registerComponent(_pluginInfo, {
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
}

export default {
  install(app: App) {
    registerLogoComponent(app);
  }
}