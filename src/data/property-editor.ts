import { icons } from '@/data/icon-editor';
import { PropertyEditor, SetPartial } from '@/@types';
import { ComponentPropertyEditor } from '@/@types/enum';
import { watch, computed } from 'vue';
import { state as backgroundEditorState, service as backgroundEditorService } from '@/modules/background-editor-module';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import bus, { GlobalBusType } from '@/tools/bus';

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
    component: 'width-editor',
    attrs: {},
    editor: ComponentPropertyEditor.width,
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
      colorType: 'rgb',
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
    name: 'tags',
    description: '标签列表',
    component: 'tags-editor',
    canFullScreen: false,
    attrs: {},
    editor: ComponentPropertyEditor.tags,
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
  {
    name: 'slider',
    description: '滑动输入框',
    component: 'slider-editor',
    canFullScreen: false,
    attrs: {},
    editor: ComponentPropertyEditor.slider,
  },
  {
    name: 'background',
    description: '背景',
    component: 'background-editor',
    attrs: {},
    editor: ComponentPropertyEditor.background,
    tools: [
      {
        icon: 'iconfont icon-add',
        tooltip: '新增',
        click(e, components, property) {
          // 显示弹出框
          let _top = e.pageY - 100;
          if (_top < 50) _top = 50;
          else if (_top > window.innerHeight - 600) _top = window.innerHeight - 600;
          backgroundEditorState.dialogCss = {
            top: `${_top}px`,
            right: `520px`,
          };
          let _bgs = [] as Record<string, any>;
          if (!components?.length) {
            _bgs = editorState.appConfig.background;
          } else if (components && !components[0].isGroup) {
            // TODO: property.name不能强转为string类型
            _bgs = components[0].attrs[property.name as string];
          }
          _bgs.push({
            type: 'color', blendType: 'normal', show: true, opacity: 1, color: { r: 216, g: 216, b: 216, a: 1 }
          });
          backgroundEditorState.isShow = true;
          backgroundEditorState.currentBackground = _bgs[_bgs.length - 1];
          bus.$emit(GlobalBusType.backgroundEditorChange);
        }
      }
    ],
  },
];

/** 获取所有编辑器 */
export const getEditors = computed<Record<string, PropertyEditor>>(() => {
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
