import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@haku-design/core";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartRadar from '../component/ChartRadar.vue';
import { App } from "vue";
import { getPropType } from "@/common/app-handle";

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
      getPropType({
        name: '', title: '雷达图配置',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.none,
        children: [
          getPropType({
            name: ['radar', 'center'], title: '中心坐标', default: ['50%', '50%'], 
            editor: ComponentPropertyEditor.numbers, attrs: {
              options: [ { label: 'x', unit: '%' }, { label: 'y', unit: '%' } ],
              formatter: val => `${val}%`
            } 
          }),
          getPropType({
            name: ['radar', 'indicator'], title: '维度配置', default: [
              { name: '维度A', min: 0, max: 10 },
              { name: '维度B', min: 0, max: 10 },
              { name: '维度C', min: 0, max: 10 },
              { name: '维度D', min: 0, max: 10 },
              { name: '维度E', min: 0, max: 10 },
              { name: '维度F', min: 0, max: 10 }
            ],
            editor: ComponentPropertyEditor.modelList, layout: PropertyLayout.block,
            attrs: { rowKey: 'name', columns: [
              { name: 'name', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
              { name: 'min', width: '60px', title: '最小值', editor: ComponentPropertyEditor.float, attrs: { controls: false } },
              { name: 'max', width: '60px', title: '最大值', editor: ComponentPropertyEditor.float, attrs: { controls: false } },
            ] }
          }),
          getPropType({ name: ['radar', 'radius'], title: '半径', default: 75, editor: ComponentPropertyEditor.int, attrs: {
              formatter: val => `${val}%`,
              suffix: '%'
            }
          }),
        ]
      }),
      getPropType({
        name: 'dataSource', title: '数据', default: `[
  {
    "name": "测试数据",
    "data": [
      {
        "value": [3, 6, 8, 10, 7, 5],
        "name": "数据A"
      }, {
        "value": [6, 10, 3, 5, 2, 4],
        "name": "数据B"
      }
    ],
    "colorBy": "data"
  }
]`,

        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      })
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-app2',
    category: ComponentCategory.attachment,
  });
}