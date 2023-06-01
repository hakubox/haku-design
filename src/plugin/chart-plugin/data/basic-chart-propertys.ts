import { ComponentProperty } from "@/@types";
import { AppType, ComponentPropertyEditor, ComponentPropertyGroup, PropertyLayout } from "@/@types/enum";

/** 获取工具提示属性列表 */
export function getTooltipProps({
  name, title = '提示'
}: {
  name: string[],
  title: string
}): ComponentProperty {
  const _textProps = [
    { name: [...name, 'color'], title: '文本颜色', editor: ComponentPropertyEditor.color },
  ];
  return {
    name: name, title: title, group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.json,
    children: _textProps
  };
}

/** 获取文本样式属性列表 */
export function getTextStyleProps({
  name, title = '文本'
}: {
  name: string[],
  title: string
}): ComponentProperty {
  const _textProps = [
    { name: [...name, 'color'], title: '文本颜色', editor: ComponentPropertyEditor.color },
    { name: [...name, 'fontSize'], title: '字体大小', default: 12, editor: ComponentPropertyEditor.int },
    { name: [...name, 'fontStyle'], title: '字体风格', editor: ComponentPropertyEditor.dropdownList, attrs: { options: [
      { label: 'normal', value: 'normal' }, { label: 'italic', value: 'italic' }, { label: 'oblique', value: 'oblique' }
    ] } },
    { name: [...name, 'fontWeight'], title: '字体粗细', default: 'normal', editor: ComponentPropertyEditor.int, attrs: { options: [
      { label: 'normal', value: 'normal' }, { label: 'bold', value: 'bold' }, { label: 'bolder', value: 'bolder' }, { label: 'lighter', value: 'lighter' },
    ] }  },
    { name: [...name, 'align'], title: '水平对齐', editor: ComponentPropertyEditor.dropdownList, attrs: { options: [
      { label: 'auto', value: 'auto' }, { label: 'left', value: 'left' }, { label: 'center', value: 'center' }, { label: 'right', value: 'right' },
    ] } },
    { name: [...name, 'verticalAlign'], title: '垂直对齐', editor: ComponentPropertyEditor.dropdownList, attrs: { options: [
      { label: 'auto', value: 'auto' }, { label: 'top', value: 'top' }, { label: 'middle', value: 'middle' }, { label: 'bottom', value: 'bottom' },
    ] } },
    { name: [...name, 'lineHeight'], title: '行高', editor: ComponentPropertyEditor.int },
    { name: [...name, 'padding'], title: '文字边距', editor: ComponentPropertyEditor.box, attrs: { single: true } },
    { name: [...name, 'backgroundColor'], title: '文字背景色', editor: ComponentPropertyEditor.color },
    
  ];
  return {
    name: name, title: title, group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.json,
    children: _textProps
  };
}

/**
 * 基础图表属性
 */
export const basicChartPropertys: ComponentProperty[] = [
  {
    name: '', names: ['x', 'y'], title: '位置', appType: [AppType.canvas],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.numbers,
    attrs: {
      options: [ { label: 'x', prop: 'x' }, { label: 'y', prop: 'y' } ]
    },
  }, {
    name: '', names: ['width', 'height'], title: '尺寸', appType: [AppType.canvas],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.numbers,
    attrs: {
      options: [ { label: '宽', prop: 'width' }, { label: '高', prop: 'height' } ]
    },
  }, {
    name: 'height', title: '高度', appType: [AppType.questionnaire],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int,
  }, {
    name: 'visible', title: '是否显示', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    remark: '是否在界面上显示。'
  }, {
    name: ['title', 'show'], title: '标题', default: false,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    children: [
      {
        name: ['title', 'text'], title: '标题', default: '图表标题',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'link'], title: '跳转链接',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'left'], title: '左侧距离', default: 'center',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'right'], title: '右侧距离', default: 'auto',
        editor: ComponentPropertyEditor.singerLine,
      }, {
        name: ['title', 'top'], title: '顶部距离', default: 'top',
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
    name: ['legend', 'show'], title: '图例', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    children: [
      { name: ['legend', 'itemGap'], title: '图例间隔', editor: ComponentPropertyEditor.width, },
      { name: ['legend', 'itemWidth'], title: '图例宽度', editor: ComponentPropertyEditor.width, },
      { name: ['legend', 'left'], title: '左侧距离', default: 'right', editor: ComponentPropertyEditor.singerLine, },
      { name: ['legend', 'right'], title: '右侧距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, },
      { name: ['legend', 'top'], title: '顶部距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, },
      { name: ['legend', 'bottom'], title: '底部距离', default: 'auto', editor: ComponentPropertyEditor.singerLine, }, 
    ]
  }, {
    name: ['label', 'show'], title: '标签', default: true,
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
    children: [
      { name: ['label', 'distance'], title: '距离', editor: ComponentPropertyEditor.width, },
      { name: ['label', 'rotate'], title: '旋转角度', editor: ComponentPropertyEditor.int, attrs: { min: -90, max: 90 } },
      { name: ['label', 'offset'], title: '偏移', default: [0, 0], editor: ComponentPropertyEditor.numbers, attrs: {
        options: [ { label: 'x', unit: 'px' }, { label: 'y', unit: 'px' } ]
      } },
      { name: ['label', 'formatter'], title: '格式化', editor: ComponentPropertyEditor.singerLine, },
      // getTextStyle({ name: ['label'], title: '文本' })
    ]
  }, {
    names: ['margin', 'padding'], title: '边距', default: [[0,0,0,0], [0,0,0,0]],
    group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box,
  }, {
    name: 'name', title: '组件名称', default: '',
    group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
  }, {
    name: 'remark', title: '备注', default: '',
    group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
  }
] as ComponentProperty[];

/** 合并基础属性 */
export function mergeBasicProps(chartType: string, propertys: ComponentProperty[]): ComponentProperty[] {
  const _props = propertys;

    switch (chartType) {
      case 'bar':
      case 'line':
      case 'scatter':
        _props.push(
          {
            name: ['grid'], names: ['top', 'right', 'bottom', 'left'], title: '边距', default: [40,20,30,50],
            editor: ComponentPropertyEditor.numbers, attrs: {
              options: [
                { label: '左', prop: 'left', unit: 'px' }, { label: '右', prop: 'right', unit: 'px' },
                { label: '上', prop: 'top', unit: 'px' }, { label: '下', prop: 'bottom', unit: 'px' },
              ]
            }
          }, {
            name: ['grid', 'show'], title: '网格', default: false,
            group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
            children: [
              { name: ['grid', 'zIndex'], title: 'zIndex', editor: ComponentPropertyEditor.int, },
              { name: ['grid', 'backgroundColor'], title: '背景色', editor: ComponentPropertyEditor.color },
              { name: ['grid', 'borderColor'], title: '边框色', editor: ComponentPropertyEditor.color },
              { name: ['grid', 'borderWidth'], title: '边框宽度', default: 1, editor: ComponentPropertyEditor.float },
              // { name: ['grid', 'containLabel'], title: '刻度标签', default: false, editor: ComponentPropertyEditor.boolean },
              
              // getTextStyle({ name: ['label'], title: '文本' })
            ]
          }, {
            name: ['xAxis', 'show'], title: 'x轴', default: true,
            group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.boolean,
            children: [
              // { name: ['xAxis', 'name'], title: 'x轴名称', editor: ComponentPropertyEditor.singerLine, },
              { name: ['xAxis', 'position'], title: 'x轴位置', editor: ComponentPropertyEditor.dropdownList, default: 'bottom', attrs: {
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
              } }, 
              { name: '', title: '标题', editor: ComponentPropertyEditor.none, children: [
                { name: ['xAxis', 'name'], title: '标题文本', default: '', editor: ComponentPropertyEditor.singerLine }, 
                { name: ['xAxis', 'nameLocation'], title: '标题位置', default: 'middle', editor: ComponentPropertyEditor.dropdownList, attrs: {
                  options: [
                    { label: '头部', value: 'start' },
                    { label: '居中', value: 'middle' },
                    { label: '尾部', value: 'end' },
                  ]
                } }, 
                { name: ['xAxis', 'nameGap'], title: '标题轴距', default: 15, editor: ComponentPropertyEditor.int, attrs: { suffix: '像素(px)' } },
                { name: ['xAxis', 'nameRotate'], title: '标题角度', default: 0, editor: ComponentPropertyEditor.int, attrs: { suffix: '度(°)' } },
                { name: ['xAxis', 'offset'], title: '偏移', default: 0, editor: ComponentPropertyEditor.int, attrs: { suffix: '像素(px)' } },
              ] },
              { name: ['xAxis', 'inverse'], title: '是否反向', default: false, editor: ComponentPropertyEditor.boolean },
              { name: ['xAxis', 'min'], title: '最小值', editor: ComponentPropertyEditor.float, },
              { name: ['xAxis', 'max'], title: '最大值', editor: ComponentPropertyEditor.float, },
              { name: ['xAxis', 'minInterval'], title: '最小间隔', editor: ComponentPropertyEditor.float,
                showCondition(prop, propMap, component) { return ['value', 'time'].includes(component.attrs.xAxis.type) }
              },
              { name: ['xAxis', 'maxInterval'], title: '最大间隔', editor: ComponentPropertyEditor.float,
                showCondition(prop, propMap, component) { return ['value', 'time'].includes(component.attrs.xAxis.type) }
              },
              { name: ['xAxis', 'silent'], title: '阻止交互', editor: ComponentPropertyEditor.boolean, },
            ]
          }, {
            name: ['yAxis', 'show'], title: 'y轴', default: true,
            group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
            children: [
              // { name: ['yAxis', 'name'], title: 'y轴名称', editor: ComponentPropertyEditor.singerLine, },
              { name: ['yAxis', 'position'], title: 'y轴位置', editor: ComponentPropertyEditor.dropdownList, default: 'left', attrs: {
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
              } },
              { name: '', title: '标题', editor: ComponentPropertyEditor.none, children: [
                { name: ['yAxis', 'name'], title: '标题文本', default: '', editor: ComponentPropertyEditor.singerLine }, 
                { name: ['yAxis', 'nameLocation'], title: '标题位置', default: 'middle', editor: ComponentPropertyEditor.dropdownList, attrs: {
                  options: [
                    { label: '头部', value: 'start' },
                    { label: '居中', value: 'middle' },
                    { label: '尾部', value: 'end' },
                  ]
                } }, 
                { name: ['yAxis', 'nameGap'], title: '标题轴距', default: 15, editor: ComponentPropertyEditor.int, attrs: { suffix: '像素(px)' } },
                { name: ['yAxis', 'nameRotate'], title: '标题角度', default: 0, editor: ComponentPropertyEditor.int, attrs: { suffix: '度(°)' } },
                { name: ['yAxis', 'offset'], title: '偏移', default: 0, editor: ComponentPropertyEditor.int, attrs: { suffix: '像素(px)' } },
              ] },
              { name: ['yAxis', 'inverse'], title: '是否反向', default: false, editor: ComponentPropertyEditor.boolean },
              { name: ['yAxis', 'min'], title: '最小值', editor: ComponentPropertyEditor.float, },
              { name: ['yAxis', 'max'], title: '最大值', editor: ComponentPropertyEditor.float, },
              { name: ['yAxis', 'minInterval'], title: '最小间隔', editor: ComponentPropertyEditor.float,
                showCondition(prop, propMap, component) { return ['value', 'time'].includes(component.attrs.yAxis.type) }
              },
              { name: ['yAxis', 'maxInterval'], title: '最大间隔', editor: ComponentPropertyEditor.float,
                showCondition(prop, propMap, component) { return ['value', 'time'].includes(component.attrs.yAxis.type) }
              },
              { name: ['yAxis', 'silent'], title: '阻止交互', editor: ComponentPropertyEditor.boolean, },
            ]
          }
        );
        break;
    }

  return [
    ...basicChartPropertys,
    ..._props
  ];
}