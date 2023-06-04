import { PluginInfo, PluginType, registerComponent } from "@/modules/plugin-module";
import { ComponentCategory, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@haku-design/core";
import { mergeBasicProps } from './basic-chart-propertys';
import ChartMap from '../component/ChartMap.vue';
import { App } from "vue";
import { getPropType } from "@/common/app-handle";

/** 地图组件 */
export function componentMapChart(app: App) {
  const _pluginInfo: PluginInfo = {
    name: 'ChartMap',
    title: '地图',
    version: '0.0.1',
    author: 'haku',
    description: '通用e-chart地图',
    pluginType: PluginType.component,
    async onloadApp() {
      app.component(_pluginInfo.name, ChartMap);
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
      chartType: 'map',
    },
    propertys: mergeBasicProps('map', [
      getPropType({
        name: 'dataSource', title: '数据', default: `[
  {
    "name": "香港18区人口密度",
    "type": "map",
    "map": "HK",
    "label": {
      "show": true
    },
    "data": [
      {
        "name": "中西区",
        "value": 20057.34
      },
      {
        "name": "湾仔",
        "value": 15477.48
      },
      {
        "name": "东区",
        "value": 31686.1
      },
      {
        "name": "南区",
        "value": 6992.6
      },
      {
        "name": "油尖旺",
        "value": 44045.49
      },
      {
        "name": "深水埗",
        "value": 40689.64
      },
      {
        "name": "九龙城",
        "value": 37659.78
      },
      {
        "name": "黄大仙",
        "value": 45180.97
      },
      {
        "name": "观塘",
        "value": 55204.26
      },
      {
        "name": "葵青",
        "value": 21900.9
      },
      {
        "name": "荃湾",
        "value": 4918.26
      },
      {
        "name": "屯门",
        "value": 5881.84
      },
      {
        "name": "元朗",
        "value": 4178.01
      },
      {
        "name": "北区",
        "value": 2227.92
      },
      {
        "name": "大埔",
        "value": 2180.98
      },
      {
        "name": "沙田",
        "value": 9172.94
      },
      {
        "name": "西贡",
        "value": 3368
      },
      {
        "name": "离岛",
        "value": 806.98
      }
    ],
    "nameMap": {
      "Central and Western": "中西区",
      "Eastern": "东区",
      "Islands": "离岛",
      "Kowloon City": "九龙城",
      "Kwai Tsing": "葵青",
      "Kwun Tong": "观塘",
      "North": "北区",
      "Sai Kung": "西贡",
      "Sha Tin": "沙田",
      "Sham Shui Po": "深水埗",
      "Southern": "南区",
      "Tai Po": "大埔",
      "Tsuen Wan": "荃湾",
      "Tuen Mun": "屯门",
      "Wan Chai": "湾仔",
      "Wong Tai Sin": "黄大仙",
      "Yau Tsim Mong": "油尖旺",
      "Yuen Long": "元朗"
    }
  }
]`,

        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }),
      getPropType({
        name: 'geo', title: '地图结构数据', default: `https://www.hakuq.com/json/HK.json`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine, layout: PropertyLayout.block
      })
    ])
  }, {
    title: _pluginInfo.title,
    name: _pluginInfo.name,
    icon: 'iconfont icon-app2',
    category: ComponentCategory.attachment,
  });
}