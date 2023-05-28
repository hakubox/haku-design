import { ComponentProperty } from "@/@types";
import { ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";

/** 获取文本样式属性 */
export function getTextStyle(name: string[], title: string = '文本'): ComponentProperty {
  return {
    name: name, title: title, group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.json,
    children: [
      { name: [...name, 'color'], title: '文本颜色', editor: ComponentPropertyEditor.color },
      { name: [...name, 'fontSize'], title: '文字大小', editor: ComponentPropertyEditor.color },
    ]
  };
}

/**
 * 基础图表属性
 */
export const basicChartPropertys: ComponentProperty[] = [
  {
    name: 'visible', title: '是否显示', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    remark: '是否在界面上显示。'
  }, {
    name: ['title', 'isShow'], title: '标题', default: false,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine,
    children: [
      {
        name: ['title', 'text'], title: '标题', default: '图表标题',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'link'], title: '跳转链接',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'left'], title: '左侧距离', default: 'auto',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'right'], title: '右侧距离', default: 'auto',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'top'], title: '顶部距离', default: 'auto',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'bottom'], title: '底部距离', default: 'auto',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'textAlign'], title: '水平对齐', default: 'auto',
        editor: ComponentPropertyEditor.dropdownList,
        attrs: {
          options: [
            { label: '自动', value: 'auto' },
            { label: '左对齐', value: 'left' },
            { label: '居中对齐', value: 'center' },
            { label: '右对齐', value: 'right' },
          ]
        }
      }, {
        name: ['title', 'textStyle'], title: '标题字体', editor: ComponentPropertyEditor.none,
        children: [
          {
            name: ['title', 'textStyle', 'color'], title: '字体颜色', default: '#666666', visible: true,
            editor: ComponentPropertyEditor.color,
          }, {
            name: ['title', 'textStyle', 'fontSize'], title: '字体大小', default: '12px', visible: true,
            editor: ComponentPropertyEditor.width,
          }
        ]
      }
    ]
  }, {
    name: 'background', title: '背景', layout: PropertyLayout.block,
    default: [{ type: 'color', blendType: 'normal', show: true, opacity: 1, color: { r: 255, g: 255, b: 255, a: 1 } }],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.background,
  }, {
    name: 'chartPadding', title: '图表边距', default: [[40,20,30,50]],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box, attrs: { single: true },
  }, {
    name: ['legend', 'show'], title: '图例', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    children: [
      { name: ['legend', 'itemGap'], title: '图例间隔', editor: ComponentPropertyEditor.width, },
      { name: ['legend', 'itemWidth'], title: '图例宽度', editor: ComponentPropertyEditor.width, },
      { name: ['legend', 'left'], title: '左侧距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, },
      { name: ['legend', 'right'], title: '右侧距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, },
      { name: ['legend', 'top'], title: '顶部距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, },
      { name: ['legend', 'bottom'], title: '底部距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, }, 
    ]
  }, {
    names: ['margin', 'padding'], title: '边距', default: [[0,0,0,0], [0,0,0,0]],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box,
  }, {
    name: ['xAxis', 'show'], title: 'x轴', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    children: [
      { name: ['xAxis', 'name'], title: 'x轴名称', editor: ComponentPropertyEditor.singerLine, },
      { name: ['xAxis', 'position'], title: 'x轴位置', editor: ComponentPropertyEditor.dropdownList, attrs: {
        options: [
          { label: '上方', value: 'top' },
          { label: '下方', value: 'bottom' },
        ]
      } },
      { name: ['xAxis', 'type'], title: '坐标轴类型', editor: ComponentPropertyEditor.dropdownList, default: 'category', attrs: {
        options: [
          { label: '数值轴 - 适用连续数据', value: 'value' },
          { label: '类目轴 - 适用离散数据', value: 'category' },
          { label: '时间轴 - 适用于连续时序数据', value: 'time' },
          { label: '对数轴 - 适用于对数数据', value: 'log' },
        ]
      } }
    ]
  }, {
    name: ['yAxis', 'show'], title: 'y轴', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    children: [
      { name: ['yAxis', 'name'], title: 'y轴名称', editor: ComponentPropertyEditor.singerLine, },
      { name: ['yAxis', 'position'], title: 'x轴位置', editor: ComponentPropertyEditor.dropdownList, attrs: {
        options: [
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ]
      } },
      { name: ['yAxis', 'type'], title: '坐标轴类型', editor: ComponentPropertyEditor.dropdownList, default: 'value', attrs: {
        options: [
          { label: '数值轴 - 适用连续数据', value: 'value' },
          { label: '类目轴 - 适用离散数据', value: 'category' },
          { label: '时间轴 - 适用于连续时序数据', value: 'time' },
          { label: '对数轴 - 适用于对数数据', value: 'log' },
        ]
      } }
    ]
  }, {
    name: 'name', title: '组件名称', default: '',
    group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
  }, {
    name: 'remark', title: '备注', default: '',
    group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
  }
] as ComponentProperty[];

/** 合并基础属性 */
export function mergeBasicProps(propertys: ComponentProperty[]): ComponentProperty[] {

  return [
    ...basicChartPropertys,
    ...propertys
  ];
}