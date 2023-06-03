import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartBar from '../component/ChartBar.vue';
import { App } from "vue";

/** 柱状图组件 */
export function componentBarChart(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'ChartBar',
    title: '柱状图',
    version: '0.0.1',
    author: 'haku',
    description: '通用e-chart柱状图',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component(_pluginInfo.name, ChartBar);
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
      chartType: 'bar',
      // xAxis: {
      //   show: true,
      //   type: 'category'
      // },
      // yAxis: {
      //   show: true,
      //   type: 'value'
      // }
    },
    propertys: mergeBasicProps('bar', [
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
    "colorBy": "data"
  }
]`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-chart-bar',
    category: ComponentCategory.attachment
  });
}