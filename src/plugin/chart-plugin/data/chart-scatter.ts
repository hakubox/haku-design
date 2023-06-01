import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartScatter from '../component/ChartScatter.vue';
import { App } from "vue";

/** 散点图组件 */
export function componentScatterChart(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'ChartScatter',
    title: '散点图',
    version: '0.0.1',
    author: 'haku',
    description: '通用e-chart散点图',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component(_pluginInfo.name, ChartScatter);
    }
  };
  
  registerComponent(_pluginInfo, {
    name: _pluginInfo.name,
    title: _pluginInfo.title,
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    attrs: {
      lock: false,
      visible: true,
      width: 350,
      height: 260,
      chartType: 'scatter',
    },
    propertys: mergeBasicProps('scatter', [
      {
        name: 'color', title: '颜色', default: 'rgba(84, 112, 198, 1)',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.color
      }, {
        name: 'dataSource', title: '数据', default: `[
  {
    "name": "测试数据",
    "data": [
      ["Sports", 275],
      ["Strategy", 115],
      ["Action", 120],
      ["Shooter", 350],
      ["Other", 150]
    ]
  }
]`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-app2',
    category: ComponentCategory.attachment
  });
}