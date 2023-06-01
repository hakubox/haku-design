import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartRadar from '../component/ChartRadar.vue';
import { App } from "vue";

/** 雷达图组件 */
export function componentRadarChart(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'ChartRadar',
    title: '雷达图',
    version: '0.0.1',
    author: 'haku',
    description: '通用e-chart雷达图',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component(_pluginInfo.name, ChartRadar);
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
      chartType: 'radar',
    },
    propertys: mergeBasicProps('radar', [
      {
        name: 'color', title: '颜色', default: 'rgba(84, 112, 198, 1)',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.color
      }, {
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
    }]
  }
]`,

        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-app2',
    category: ComponentCategory.attachment,
  });
}