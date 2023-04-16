import { icons } from '@/data/icon-editor';
import { PropertyEditor, SetPartial } from '@/@types';
import { ComponentPropertyEditor } from '@/@types/enum';
import { watch, computed } from 'vue';

export type InitPropertyEditor = SetPartial<PropertyEditor, 'slot' | 'propAttrs' | 'events'>;

/** 属性编辑器 */
export const propertyEditors: Array<InitPropertyEditor> = [
  {
    name: 'any',
    description: '任意',
    component: 'text-editor',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.any,
    format: (val) => new Function(`return ${val}`)(),
  },
  {
    name: 'data',
    description: '数据',
    component: 'data-editor',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.data,
    format: (val) => new Function(`return ${val}`)(),
  },
  {
    name: 'label',
    description: '标签',
    component: 'text-label',
    attrs: {},
    editor: ComponentPropertyEditor.label,
  },
  {
    name: 'code',
    description: '代码',
    component: 'code-editor',
    canFullScreen: true,
    attrs: {
      isExpression: true,
      language: 'javascript',
      options: {
        lineNumbers: 'off',
        scrollBeyondLastLine: false,
      },
      style: { width: '100%', height: '300px' },
    },
    editor: ComponentPropertyEditor.code,
  },
  {
    name: 'file',
    description: '文件',
    component: 'file-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: false,
      size: 'small',
    },
    editor: ComponentPropertyEditor.file,
  },
  {
    name: 'duration',
    description: '时间',
    component: 'duration-editor',
    attrs: {
      style: { width: '100%' },
      allowClear: false,
      size: 'small',
    },
    editor: ComponentPropertyEditor.duration,
  },
  {
    name: 'width',
    description: '长度',
    component: 'length-editor',
    attrs: {},
    editor: ComponentPropertyEditor.length,
    format: (val) => val + 'px',
  },
  {
    name: 'color',
    description: '颜色',
    component: 'color-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      addonAfter: '颜色',
      size: 'small',
      showAlpha: false,
      colorType: 'hex',
      canChangeColorType: false,
      canClear: false,
    },
    editor: ComponentPropertyEditor.color,
  },
  {
    name: 'single-line',
    description: '单行文本',
    component: 'text-editor',
    attrs: {
      style: { width: '100%' },
      allowClear: false,
      size: 'small',
    },
    editor: ComponentPropertyEditor.singerLine,
  },
  {
    name: 'multi-line',
    description: '多行文本',
    component: 'textarea-editor',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
      autoSize: { minRows: 2, maxRows: 6 },
    },
    editor: ComponentPropertyEditor.multiLine,
  },
  {
    name: 'boolean',
    description: '真假',
    component: 'switch-editor',
    model: 'checked',
    attrs: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    editor: ComponentPropertyEditor.boolean,
  },
  {
    name: 'int',
    description: '整数',
    component: 'number-editor',
    attrs: {
      precision: 0,
      min: 0,
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.int,
  },
  {
    name: 'float',
    description: '小数',
    component: 'number-editor',
    attrs: {
      step: 0.1,
      min: 0,
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.float,
  },
  {
    name: 'dropdown-list',
    description: '下拉列表',
    component: 'select-picker',
    attrs: {
      allowClear: false,
      buttonStyle: 'solid',
      style: { width: '100%' },
      size: 'small',
    },
    editor: ComponentPropertyEditor.dropdownList,
  },
  {
    name: 'radio-group',
    description: '单选组',
    component: 'radio-group-picker',
    attrs: {
      buttonStyle: 'solid',
      size: 'small',
    },
    editor: ComponentPropertyEditor.radioGroup,
  },
  {
    name: 'icon',
    description: '图标',
    component: 'a-select',
    attrs: {
      showSearch: true,
      style: {
        width: '100%',
        fontFamily: 'vant-icon',
        color: 'rgba(0, 0, 0, 0.65)',
        fontSize: '20px',
        lineHeight: '12px',
        // fontWeight: '700',
        verticalAlign: 'middle',
      },
      dropdownClassName: 'icon-editor-select',
      placeholder: '',
      allowClear: true,
      size: 'small',
    },
    slot: {
      default: icons.map((i) => ({
        component: 'a-select-option',
        html: i.label,
        slot: {
          default: icons,
        },
        attrs: {
          value: i.value,
        },
      })),
    },
    editor: ComponentPropertyEditor.icon,
  },
  {
    name: 'json',
    description: 'JSON',
    component: 'object-editor',
    canFullScreen: true,
    attrs: {
      isExpression: true,
      language: 'javascript',
      options: {
        lineNumbers: 'off',
        scrollBeyondLastLine: false,
      },
      style: { width: '100%', height: '300px' },
    },
    editor: ComponentPropertyEditor.json,
  },
  {
    name: 'text-list',
    description: '文本列表',
    component: 'text-list-editor',
    canFullScreen: false,
    attrs: {},
    editor: ComponentPropertyEditor.textList,
  },
  {
    name: 'model-list',
    description: '对象列表',
    component: 'model-list-editor',
    canFullScreen: true,
    attrs: {},
    editor: ComponentPropertyEditor.modelList,
  },
  {
    name: 'expression',
    description: '表达式',
    component: 'code-editor',
    attrs: {
      isExpression: true,
      language: 'javascript',
      options: {
        lineNumbers: 'off',
        scrollBeyondLastLine: false,
      },
      style: { width: '100%', height: '80px' },
    },
    editor: ComponentPropertyEditor.expression,
  },
  {
    name: 'formula',
    description: '公式',
    component: 'formula-editor',
    attrs: {
      isExpression: true,
      options: {
        lineNumbers: 'off',
        scrollBeyondLastLine: false,
      },
      style: { width: '100%' },
    },
    editor: ComponentPropertyEditor.formula,
  },
  {
    name: 'variable',
    description: '变量',
    component: 'variable-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.singerLine,
  },
  {
    name: 'function',
    description: '函数',
    component: 'function-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.function,
  },
  {
    name: 'rules',
    description: '校验规则',
    component: 'rules-editor',
    attrs: {},
    editor: ComponentPropertyEditor.rules,
  },
  {
    name: 'box',
    description: '盒模型编辑器',
    component: 'box-editor',
    attrs: {},
    editor: ComponentPropertyEditor.box,
  },
  {
    name: 'richtext',
    description: '富文本编辑器',
    component: 'rich-text-editor',
    canFullScreen: true,
    attrs: {},
    editor: ComponentPropertyEditor.richtext,
  },
  {
    name: 'component',
    description: '组件',
    component: 'component-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: true,
      size: 'small',
    },
    editor: ComponentPropertyEditor.component,
  },
  {
    name: 'condition',
    description: '条件表达式',
    component: 'condition-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: false,
      size: 'small',
    },
    editor: ComponentPropertyEditor.condition,
  },
  {
    name: 'variable',
    description: '变量',
    component: 'variable-picker',
    attrs: {
      style: { width: '100%' },
      allowClear: false,
      size: 'small',
    },
    editor: ComponentPropertyEditor.variable,
  },
  {
    name: 'dimension',
    description: '维度配置',
    component: 'dimension-editor',
    attrs: {
      style: { width: '100%' },
      allowClear: false,
      size: 'small',
    },
    editor: ComponentPropertyEditor.dimension,
  },
  {
    name: 'numbers',
    description: '位置',
    component: 'numbers-editor',
    canFullScreen: false,
    attrs: {},
    editor: ComponentPropertyEditor.numbers,
  },
];

/** 获取所有编辑器 */
export let getEditors = computed<Record<string, PropertyEditor>>(() => {
  return initPropertyEditors();
});

export function initPropertyEditors(): Record<string, PropertyEditor> {
  const _propertyEditors = propertyEditors.map((i) => ({
    [i.name]: {
      slot: {},
      propAttrs: {},
      events: {},
      ...i,
    },
  }));
  return Object.assign({}, ..._propertyEditors);
}
