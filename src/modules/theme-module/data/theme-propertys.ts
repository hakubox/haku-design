import { ComponentPropertyEditor, PropertyLayout } from "@haku-design/core";
import { getPropType } from "@/common/app-handle";

/** 主题属性列表 */
export const themePropertys = [
  getPropType({
    name: 'title', title: '主题名称',
    group: 'primary', editor: ComponentPropertyEditor.singerLine
  }),
  getPropType({
    name: 'description', title: '主题描述',
    group: 'primary', editor: ComponentPropertyEditor.multiLine,
  }),
  getPropType({
    name: 'primaryColor', title: '主题色',
    group: 'primary', editor: ComponentPropertyEditor.color, attrs: {
      cssVariable: 'primary-color',
      showAlpha: false,
    }
  }),
  getPropType({
    name: 'css', title: '样式代码[less]', 
    canFullScreen: true,
    default: `// 问卷样式
  .form-canvas {

    // 问卷标题
    .form-title {

    }

    // 问卷内容
    .form-content {

    }
}`, 
    group: 'primary', editor: ComponentPropertyEditor.code, layout: PropertyLayout.block, attrs: {
      language: 'less',
    }
  }),
  getPropType({
    name: 'titleFontColor', title: '标题字色',
    group: 'title', editor: ComponentPropertyEditor.color, attrs: {
      cssVariable: 'app-title-font-color',
    },
  }),
  getPropType({
    name: 'titleFontSize', title: '标题字体大小', default: '22px',
    group: 'title', editor: ComponentPropertyEditor.width, attrs: {
      cssVariable: 'app-title-fontsize',
    },
  }),
  getPropType({
    name: 'titleAlign', title: '标题位置', default: 'center',
    group: 'title', editor: ComponentPropertyEditor.dropdownList, attrs: {
      cssVariable: 'app-title-textalign',
      options: [
        { label: '居左', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '居右', value: 'right' },
      ]
    }
  }),
  getPropType({
    name: 'titlePadding', title: '标题边距', default: '15px',
    group: 'title', editor: ComponentPropertyEditor.width, attrs: {
      cssVariable: 'app-title-padding',
    },
  }),
  getPropType({
    name: 'titleFontStyle', title: '标题字体倾斜',
    group: 'title', editor: ComponentPropertyEditor.boolean
  }),
  getPropType({
    name: 'titleFontWeight', title: '标题字体加粗',
    group: 'title', editor: ComponentPropertyEditor.boolean
  }),
  getPropType({
    name: 'descriptionFontSize', title: '描述字体大小', default: '13px',
    group: 'description', editor: ComponentPropertyEditor.width
  }),
  getPropType({
    name: 'descriptionFontColor', title: '描述字体颜色',
    group: 'description', editor: ComponentPropertyEditor.color
  }),
  getPropType({
    name: 'backgroundType', title: '背景类型', default: 'none',
    group: 'background', editor: ComponentPropertyEditor.dropdownList, attrs: {
      options: [
        { label: '无背景', value: 'none' },
        { label: '纯色背景', value: 'color' },
        { label: '渐变色背景', value: 'gradient' },
        { label: '背景图', value: 'image' },
      ]
    }
  }),
  getPropType({
    name: 'appBackgroundColor', title: '背景色',
    group: 'primary', editor: ComponentPropertyEditor.color, attrs: {
      cssVariable: 'app-background-color',
      showAlpha: true,
      colorType: 'rgb'
    }
  }),
  getPropType({
    name: 'backgroundImage', title: '背景图',
    group: 'background', editor: ComponentPropertyEditor.file,
    showCondition: ({ model }) => model.backgroundType === 'image',
  }),
  getPropType({
    name: 'backgroundPosition', title: '背景图位置', default: 'center',
    group: 'background', editor: ComponentPropertyEditor.dropdownList, attrs: {
      options: [
        { label: '左上角', value: 'top-left' },
        { label: '上方', value: 'top' },
        { label: '右上角', value: 'top-right' },
        { label: '左侧', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右侧', value: 'right' },
        { label: '左下角', value: 'bottom-left' },
        { label: '下方', value: 'bottom' },
        { label: '右下角', value: 'bottom-right' },
      ]
    },
    showCondition: ({ model }) => model.backgroundType === 'image',
  }),
  getPropType({
    name: 'backgroundWidth', title: '背景图宽度',
    group: 'background', editor: ComponentPropertyEditor.int,
    showCondition: ({ model }) => model.backgroundType === 'image',
  }),
  getPropType({
    name: 'backgroundHeight', title: '背景图高度',
    group: 'background', editor: ComponentPropertyEditor.int,
    showCondition: ({ model }) => model.backgroundType === 'image',
  }),
  getPropType({
    name: 'backgroundOpacity', title: '背景透明度', default: 100,
    group: 'background', editor: ComponentPropertyEditor.int, attrs: {
      min: 0, max: 100
    }
  }),
  getPropType({
    name: 'backgroundRepeatX', title: '背景X轴重复',
    group: 'background', editor: ComponentPropertyEditor.int,
    showCondition: ({ model }) => ['image', 'gradient'].includes(model.backgroundType),
  }),
  getPropType({
    name: 'backgroundRepeatY', title: '背景Y轴重复',
    group: 'background', editor: ComponentPropertyEditor.int,
    showCondition: ({ model }) => ['image', 'gradient'].includes(model.backgroundType),
  }),
  getPropType({
    name: 'contentFontColor', title: '内容文本颜色',
    group: 'content', editor: ComponentPropertyEditor.color, attrs: {
      cssVariable: 'content-font-color',
      showAlpha: false,
    }
  }),
  getPropType({
    name: 'contentFontSize', title: '内容字体大小',
    group: 'content', editor: ComponentPropertyEditor.width,
  }),
  getPropType({
    name: 'componentPadding', title: '组件间隙',
    group: 'content', editor: ComponentPropertyEditor.width,
  }), 
];