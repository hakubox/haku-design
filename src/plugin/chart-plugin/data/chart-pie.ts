import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartPie from '../component/ChartPie.vue';
import { App } from "vue";

/** 饼图组件 */
export function componentPieChart(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'ChartPie',
    title: '饼图',
    version: '0.0.1',
    author: 'haku',
    description: '通用e-chart饼图',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component(_pluginInfo.name, ChartPie);
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
      chartType: 'pie',
    },
    propertys: mergeBasicProps('pie', [
      {
        name: 'dataSource', title: '数据', default: `[
  {
    "name": "测试数据",
    "data": [{
      "name": "其他消费",
      "value": 6371664
    }, {
      "name": "生活用品",
      "value": 7216301
    }, {
      "name": "通讯物流",
      "value": 1500621
    }, {
      "name": "交通出行",
      "value": 586622
    }, {
      "name": "饮食",
      "value": 900000
    }],
    "colorBy": "series"
  }
]`,

        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-chart-pie',
    category: ComponentCategory.attachment,
  });
}