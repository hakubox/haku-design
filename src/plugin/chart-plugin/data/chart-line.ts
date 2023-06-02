import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartLine from '../component/ChartLine.vue';
import { App } from "vue";

/** 折线图组件 */
export function componentLineChart(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'ChartLine',
    title: '折线图',
    version: '0.0.1',
    author: 'haku',
    description: '通用e-chart折线图',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component(_pluginInfo.name, ChartLine);
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
      chartType: 'line',
    },
    propertys: mergeBasicProps('line', [
      {
        name: 'dataSource', title: '数据', default: `[
  {
    "name": "测试数据",
    "data": [
      ["Sports", 275],
      ["Strategy", 115],
      ["Action", 120],
      ["Shooter", 350],
      ["Other", 150]
    ],
    "colorBy": "series"
  }
]`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-chart-line',
    category: ComponentCategory.attachment
  });
}