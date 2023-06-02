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
        name: '', title: '雷达图配置',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.none,
        children: [
          {
            name: ['radar', 'center'], title: '中心坐标', default: ['50%', '50%'], 
            editor: ComponentPropertyEditor.numbers, attrs: {
              options: [ { label: 'x', unit: '%' }, { label: 'y', unit: '%' } ],
              formatter: val => `${val}%`
            } 
          },{
            name: ['radar', 'indicator'], title: '维度配置', default: [
              { name: '销售额', min: 0, max: 6500 },
              { name: '手续费', min: 0, max: 16000 },
              { name: 'IT设备', min: 0, max: 30000 },
              { name: '客户支撑', min: 0, max: 38000 },
              { name: '开发', min: 0, max: 52000 },
              { name: '营销活动', min: 0, max: 25000 }
            ],
            editor: ComponentPropertyEditor.modelList, layout: PropertyLayout.block,
            attrs: { rowKey: 'name', columns: [
              { name: 'name', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
              { name: 'min', width: '60px', title: '最小值', editor: ComponentPropertyEditor.float, attrs: { controls: false } },
              { name: 'max', width: '60px', title: '最大值', editor: ComponentPropertyEditor.float, attrs: { controls: false } },
            ] }
          },
          { name: ['radar', 'radius'], title: '半径', default: '75%', editor: ComponentPropertyEditor.int, attrs: {
              formatter: val => `${val}%`,
              suffix: '%'
            }
          },
        ]
      }, {
        name: 'dataSource', title: '数据', default: `[
  {
    "name": "测试数据",
    "data": [
      {
        "value": [4200, 3000, 20000, 35000, 50000, 18000],
        "name": "预算"
      }, {
        "value": [5000, 14000, 28000, 26000, 42000, 21000],
        "name": "支出"
      }
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
    icon: 'iconfont icon-app2',
    category: ComponentCategory.attachment,
  });
}