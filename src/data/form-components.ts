import { Component, ComponentProperty, LayoutConfig, SetPartial } from "@/@types";
import { LayoutType, PropertyLayout, ComponentPropertyEditor, ComponentPropertyGroup, ComponentCategory, MainAxisAlignment, CrossAxisAlignment } from '@/@types/enum';
import { createModelId } from "@/tools/common";
import { watch, computed } from 'vue';
import bus from '@/tools/bus';

export type InitComponent = SetPartial<Component, 'id' | 'attrs' | 'component'>;

export let formComponents: InitComponent[] = [

  /** 
   * 单行问答题
   */
  {
    name: 'q-single-line',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'text',
    title: '单行问答题',
    quickTools: [
      // {
      //   icon: (component) => component.attrs.visible ? 'iconfont icon-icon_yulan' : 'iconfont icon-miwen',
      //   tooltip: (component) => component.attrs.visible ? '显示' : '隐藏',
      //   callback: (component) => component.attrs.visible = !component.attrs.visible,
      // }
    ],
    attrs: {
      width: 300,
      height: 100,
      disabledHeight: true,
    },
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。', attrs: {
          confirm: (value) => `是否${value ? '隐藏' : '显示'}当前组件？`,
        }
      }, {
        name: 'label', title: '标题', default: '单行问答题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        },
        attach: [ ComponentPropertyEditor.variable, ComponentPropertyEditor.formula ],
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine,
        attach: [ ComponentPropertyEditor.variable ],
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'maxlength', title: '最大输入字数', default: 1000,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'validate', title: '数据校验', default: [],
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.rules, attrs: { validateType: 'text' }
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, 
      // {
      //   name: 'data', title: '数据', default: '',
      //   group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.data
      // }
    ]
  },

  /** 
   * 数值填写题
   */
   {
    name: 'q-number',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'number',
    title: '数值填写题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。', attrs: {
          confirm: (value) => `是否${value ? '隐藏' : '显示'}当前组件？`,
        }
      }, {
        name: 'label', title: '标题', default: '数值填写题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        },
        attach: [ ComponentPropertyEditor.variable, ComponentPropertyEditor.formula ],
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine,
        attach: [ ComponentPropertyEditor.variable ],
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'inputWidth', title: '输入框长度', default: '60px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length,
      }, {
        name: 'min', title: '最小值',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'max', title: '最大值',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'decimalLength', title: '小数位数', default: 0,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'step', title: '步长', default: 1, remark: '每次点击时改变的数值',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabledInput', title: '是否禁用输入框', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'disabled', title: '是否禁用', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 单行问答组
   */
  {
    name: 'q-single-line-group',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'text-list',
    title: '单行问答组',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '单行问答组', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'maxlength', title: '最大输入字数', default: 1000,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'options', title: '列表项', default: [ 
          { value: '1', label: '题目 1' },
          { value: '2', label: '题目 2' },
          { value: '3', label: '题目 3' }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'value', width: '20%', title: '值', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] }
      }
    ]
  },

  /**
   * 多行问答题
   */
  {
    name: 'q-multiple-line',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'text',
    title: '多行问答题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '多行问答题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'editorHeight', title: '编辑框高度', default: '100px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length,
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'maxlength', title: '最大输入字数', default: 1000,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  }, 

  /**
   * 单项选择题
   */
  {
    name: 'q-single-choice',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'option',
    title: '单项选择题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '单项选择题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'layout', title: '宽屏排列方式', default: 'layout-wrap', remark: 'PC端或宽屏的情况下应用，在移动端上则始终为每项一行',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
          { label: '自动换行', value: 'layout-wrap' },
          { label: '每项一行', value: 'layout-span-1' },
          { label: '2项换行', value: 'layout-span-2' },
          { label: '3项换行', value: 'layout-span-3' },
          { label: '4项换行', value: 'layout-span-4' }
        ] } 
      }, {
        name: 'hasImg', title: '是否包含图片', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'hasElse', title: '是否包含其他', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'options', title: '列表项', default: [ 
          { value: '1', label: '单选项 1', score: 0 },
          { value: '2', label: '单选项 2', score: 0 },
          { value: '3', label: '单选项 3', score: 0 },
          { value: '4', label: '单选项 4', score: 0 }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'value', width: '15%', title: '值', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          {
            name: 'image', width: '20%', title: '图片', editor: ComponentPropertyEditor.file, attrs: { }, 
            visible: (component) => component.attrs.hasImg,
          },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] },
        attach: [ ComponentPropertyEditor.variable ],
      }
    ]
  }, 

  /**
   * 多项选择题
   */
   {
    name: 'q-multiple-choice',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'option-list',
    title: '多项选择题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '多项选择题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'layout', title: '排列方式', default: 'layout-wrap',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
            { label: '自动换行', value: 'layout-wrap' },
            { label: '每项一行', value: 'layout-span-1' },
            { label: '2项换行', value: 'layout-span-2' },
            { label: '3项换行', value: 'layout-span-3' },
            { label: '4项换行', value: 'layout-span-4' }
        ] } 
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'hasElse', title: '是否包含其他', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'min', title: '最小选择数量', default: 0, remark: '最少选择的项数，低于当前数量则不通过校验',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'max', title: '最大选择数量', default: 0, remark: '最多选择的项数',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'options', title: '列表项', default: [
          { value: '1', label: '多选项 1', score: 0 },
          { value: '2', label: '多选项 2', score: 0 },
          { value: '3', label: '多选项 3', score: 0 },
          { value: '4', label: '多选项 4', score: 0 }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'value', width: '20%', title: '值', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] }
      }
    ]
  }, 
  
  /**
   * 下拉选择题
   */
   {
    name: 'q-dropdown',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'option',
    title: '下拉选择题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '下拉选择题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '请选择',
        group: ComponentPropertyGroup.style, default: '请选择', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'options', title: '列表项', default: [ 
          { value: '1', label: '选项 1', score: 0 },
          { value: '2', label: '选项 2', score: 0 },
          { value: '3', label: '选项 3', score: 0 }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'value', width: '20%', title: '值', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] }
      }
    ]
  }, 

  /**
   * 日期选择
   */
   {
    name: 'q-datetime-picker',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'datetime',
    title: '日期选择',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '日期选择', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '请选择',
        group: ComponentPropertyGroup.style, default: '请选择', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  }, 

  /**
   * 日期范围选择
   */
   {
    name: 'q-datetime-picker',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'datetime-range',
    title: '日期范围选择',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '日期选择', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '请选择',
        group: ComponentPropertyGroup.style, default: '请选择', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'isRange', title: '是否选择范围', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  }, 

  /** 
   * 评分题
   */
   {
    name: 'q-score',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'number',
    title: '评分题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '评分题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'color', title: '评分颜色', default: '#FFD21E',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.color
      }, {
        name: 'size', title: '图标大小', default: '20px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'count', title: '最大星数', default: 5,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'allowHalf', title: '允许半星', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'maxlength', title: '最大输入字数', default: 1000,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 多项评分题
   */
   {
    name: 'q-score-group',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'number-list',
    title: '多项评分题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '多项评分题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'color', title: '评分颜色', default: '#FFD21E',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.color
      }, {
        name: 'size', title: '图标大小', default: '20px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'count', title: '最大星数', default: 5,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'allowHalf', title: '允许半星', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'maxlength', title: '最大输入字数', default: 1000,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'options', title: '列表项', default: [ 
          { value: '1', label: '评分 1' },
          { value: '2', label: '评分 2' },
          { value: '3', label: '评分 3' }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'value', width: '20%', title: '值', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] }
      }
    ]
  },


  /** 
   * 手写题
   */
   {
    name: 'q-drawing-board',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'file',
    title: '手写题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '手写题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'pencolor', title: '颜色', default: 'genre',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'height', title: '高度', default: 200,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 文件上传题
   */
  {
    name: 'q-file-upload',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'file-list',
    title: '文件上传题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '文件上传题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'placeholder', title: '占位提示文字',
        group: ComponentPropertyGroup.style, default: '请输入', editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'size', title: '预览图片大小', default: '100px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'type', title: '功能', default: 'camcorder',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
          { label: '拍照', value: 'camera' },
          { label: '录像', value: 'camcorder' },
          { label: '录音', value: 'microphone' },
          { label: '上传文件', value: 'file' },
        ] }
      }, {
        name: 'count', title: '最大文件数量', default: 1,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int
      }, {
        name: 'capture', title: '拍照模式', default: 'user',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.dropdownList,
        showCondition: (prop, propMap, component, value, refs) => component['attrs']['type'] == 'camera',
        attrs: { options: [
          { label: '前置摄像头', value: 'user' },
          { label: '后置摄像头', value: 'environment' },
          { label: '选取照片', value: '' },
        ] }
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /**
   * 表格题
   */
   {
    name: 'q-table',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'array-list',
    title: '表格题',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '表格题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'useCard', title: '卡片形式', default: true, description: '仅会在移动端使用卡片形式展示',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'useAction', title: '是否可操作', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'disabled', title: '是否禁用', default: false, visible: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'columns', title: '表格列', default: [ 
          { name: 'col1', title: '列头1', disabled: false, score: 0 },
          { name: 'col2', title: '列头2', disabled: false, score: 0 },
          { name: 'col3', title: '列头3', disabled: false, score: 0 }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'name', columns: [
          { name: 'name', width: '20%', title: '属性名', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'title', width: '40%', title: '标题', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'readonly', width: '15%', title: '只读', editor: ComponentPropertyEditor.boolean, attrs: { } },
          // { name: 'type', width: '20%', title: '类型', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] }
      }, {
        name: 'dataSource', title: '表格数据', default: [
          { col1: '张三', col2: '80', col3: '160' },
          { col1: '李四', col2: '76', col3: '172' },
        ],
        layout: PropertyLayout.block, group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.json,
        attrs: { language: 'json' }
      }
    ]
  }, 

  /** 
   * 隐藏题
   */
   {
    name: 'q-hidden',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'text',
    title: '隐藏题',
    propertys: [
      {
        name: 'label', title: '标题', default: '隐藏题', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, 
    ]
  },

  /** 
   * 可选择卡片
   */
   {
    name: 'q-card-picker',
    isHidden: false,
    isFormItem: true,
    isTopLevel: false,
    type: ComponentCategory.normal,
    answerType: 'extrainfo-list',
    title: '可选择卡片',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'label', title: '标题', default: '可选择卡片', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'titleLabel', title: '标题标签', default: '',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine,
      }, {
        name: 'description', title: '描述', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'layout', title: '排列方式', default: 'layout-wrap',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
            { label: '自动换行', value: 'layout-wrap' },
            { label: '每项一行', value: 'layout-span-1' },
            { label: '2项换行', value: 'layout-span-2' },
            { label: '3项换行', value: 'layout-span-3' },
            { label: '4项换行', value: 'layout-span-4' }
        ] } 
      }, {
        name: 'selectMode', title: '选择方式', default: 'single-choice',
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
          { label: '单选', value: 'single-choice' },
          { label: '多选', value: 'multiple-choice' },
          { label: '不可选择', value: 'not-choice' },
        ] },
        change(prop, propMap, component, value) {
          component.attrs.maxCount = 0;
        }
      }, {
        name: 'maxCount', title: '最大选择数', default: 0,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.int,
        showCondition(prop, propMap, component, value, refs) {
          return component.attrs['selectMode'] === 'multiple-choice';
        }
      }, {
        name: 'required', title: '是否必填', default: true,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'hasElse', title: '是否包含其他', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }, {
        name: 'options', title: '列表项', default: [
          { value: '1', label: '选项 1', score: 0 },
          { value: '2', label: '选项 2', score: 0 },
          { value: '3', label: '选项 3', score: 0 },
          { value: '4', label: '选项 4', score: 0 }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'value', width: '15%', title: '值', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          // { name: 'disabled', width: '60px', title: '禁用', editor: ComponentPropertyEditor.boolean, default: false, attrs: { } },
        ] }
      }, {
        name: 'extraInfo', title: '附加数据', default: [],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'name', width: '20%', title: '名称', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'title', width: '20%', title: '标题', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'type', width: '20%', title: '类型', editor: ComponentPropertyEditor.dropdownList, attrs: {
            options: [
              { label: '标签', value: 'none' },
              { label: '文本框', value: 'text' },
              { label: '数字框', value: 'number' },
              { label: '日期框', value: 'datetime' },
            ],
          }, default: 'none' },
          { name: 'required', width: '15%', title: '必填', editor: ComponentPropertyEditor.boolean, attrs: { } },
        ] }
      }
    ]
  },

  /** 
   * 布局：流式布局
   */
   {
    name: 'q-flex',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.layout,
    childrenSlot: '.component-flex-item',
    childrenContentSlot: '.component-flex-item-content',
    title: '流式布局',
    layoutConfig: {
      layout: LayoutType.flex,
      layoutDetailConfig: {
        direction: 'column',
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
      }
    } as LayoutConfig<LayoutType.flex>,
    children: [],
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'sticky', title: '是否吸顶', default: false,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否吸附在当前区域内的顶部。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'direction', title: '组件方向', default: 'column',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
          { label: '行布局', value: 'row' },
          { label: '反向行布局', value: 'row-reverse' },
          { label: '列布局', value: 'column' },
          { label: '反向列布局', value: 'column-reverse' },
        ] },
        change(prop, propMap, component, value) {
          const _layoutConfig = component.layoutConfig as LayoutConfig<LayoutType.flex>;
          if (_layoutConfig?.layoutDetailConfig?.direction) {
            _layoutConfig.layoutDetailConfig.direction = value as "row" | "column";
          }
        }
      }, {
        name: 'wrap', title: '换行规则', default: 'nowrap',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [ 
            { label: '不换行', value: 'nowrap' }, 
            { label: '换行', value: 'wrap' }, 
            { label: '换行逆序', value: 'wrap-reverse' }
        ] }
      }, {
        name: 'mainAxisAlignment', title: '主轴配置', default: 'flex-start',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
          { label: '开始对齐', value: 'flex-start' },
          { label: '结束对齐', value: 'flex-end' },
          { label: '中间对齐', value: 'center' },
          { label: '两端对齐', value: 'spaceBetween' },
          { label: '平铺对齐', value: 'spaceAround' },
        ] },
        change(prop, propMap, component, value) {
          const _layoutConfig = component.layoutConfig as LayoutConfig<LayoutType.flex>;
          if (_layoutConfig?.layoutDetailConfig?.mainAxisAlignment) {
            _layoutConfig.layoutDetailConfig.mainAxisAlignment = value as MainAxisAlignment;
          }
        }
      }, {
        name: 'crossAxisAlignment', title: '次轴配置', default: 'flex-start',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: { options: [
          { label: '开始对齐', value: 'flex-start' },
          { label: '结束对齐', value: 'flex-end' },
          { label: '中间对齐', value: 'center' },
          { label: '填充', value: 'stretch' },
        ] },
        change(prop, propMap, component, value) {
          const _layoutConfig = component.layoutConfig as LayoutConfig<LayoutType.flex>;
          if (_layoutConfig?.layoutDetailConfig?.crossAxisAlignment) {
            _layoutConfig.layoutDetailConfig.crossAxisAlignment = value as CrossAxisAlignment;
          }
        }
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ],
    childPropertys: [
      {
        name: 'flex-shrink', title: '缩小系数', default: 1,
        group: ComponentPropertyGroup.parent, editor: ComponentPropertyEditor.int,
      }, {
        name: 'flex-grow', title: '放大系数', default: 1,
        group: ComponentPropertyGroup.parent, editor: ComponentPropertyEditor.int,
      }
    ]
  },

  /** 
   * 布局：画布
   */
   {
    name: 'q-canvas',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.layout,
    childrenSlot: '.component-canvas-item',
    title: '自由画布',
    layoutConfig: {
      layout: LayoutType.absolute,
      layoutDetailConfig: { }
    } as LayoutConfig<LayoutType.absolute>,
    children: [],
    attrs: {
      width: 300,
      height: 102,
      minHeight: 102,
    },
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'height', title: '最小组件高度', default: 100, 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 布局：中心布局
   */
   {
    name: 'q-center',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.layout,
    childrenSlot: '.component-flex-item',
    title: '中心布局',
    layoutConfig: {
      layout: LayoutType.flex,
      layoutDetailConfig: {
        direction: 'column',
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        maxChildCount: 1
      }
    } as LayoutConfig<LayoutType.flex>,
    children: [],
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'minHeight', title: '最小组件高度', default: '100px', 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 布局：折叠面板
   */
   {
    name: 'q-collapse',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.layout,
    childrenSlot: '.component-collapse-item-content',
    childrenContentSlot: '.component-collapse-item-content-panel-component',
    title: '折叠面板',
    layoutConfig: {
      layout: LayoutType.flex,
      layoutDetailConfig: {
        direction: 'column',
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        maxChildCount: 1
      }
    } as LayoutConfig<LayoutType.flex>,
    children: [],
    propertys: [
      {
        name: 'label', title: '标题', default: '折叠面板', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        attrs: {
          isTitleMode: true
        }
      }, {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0], 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'minHeight', title: '最小组件高度', default: '100px', 
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      },
      {
        name: 'options', title: '列表项', default: [ 
          { label: '面板 1', score: 0 },
          { label: '面板 2', score: 0 }
        ],
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'value', columns: [
          { name: 'label', title: '文本', editor: ComponentPropertyEditor.singerLine, attrs: { } },
        ] },
        attach: [ ComponentPropertyEditor.variable ],
      }
    ]
  },

  /** 
   * 分页器
   */
  {
    name: 'q-page-split',
    isHidden: true,
    isFormItem: false,
    isTopLevel: true,
    type: ComponentCategory.attachment,
    title: '分页器',
    attrs: {
      visible: true,
    },
    propertys: [
      {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 文本
   */
   {
    name: 'q-text',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '文本',
    attrs: {
      disabledWidth: true,
      disabledHeight: true,
      _width: 58,
      _height: 50,
      minHeight: 50,
    },
    propertys: [
      {
        name: 'width', title: '宽度', visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int
      }, {
        name: 'autowidth', title: '自动宽度', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否使用自动宽度。', change(prop, propMap, component) {
          if (component.attrs.autowidth) {
            component.attrs.width = undefined;
            component.attrs.disabledWidth = true;
          } else {
            component.attrs.disabledWidth = false;
          }
          bus.$emit('onAutoSizeChange', component);
        }
      }, {
        name: 'autoheight', title: '自动高度', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否使用自动高度。', change(prop, propMap, component) {
          if (component.attrs.autoheight) {
            component.attrs.height = undefined;
            component.attrs.disabledHeight = true;
          } else {
            component.attrs.disabledHeight = false;
          }
          bus.$emit('onAutoSizeChange', component);
        }
      }, {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'className', title: '类名', default: '', visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine,
        remark: '组件关联代码的类名称。'
      }, {
        name: 'textClassName', title: '文本类名', default: '', visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine,
        remark: '文本内容关联代码的类名称。'
      }, {
        name: 'text', title: '内容', default: '文本',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.multiLine,
        change(prop, propMap, component) {
          bus.$emit('onAutoSizeChange', component);
        }
      }, {
        name: 'description', title: '富文本内容', default: '', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
        change(prop, propMap, component) {
          bus.$emit('onAutoSizeChange', component);
        }
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 图片
   */
   {
    name: 'q-image',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '图片',
    attrs: {
      isFullScreen: false,
      width: 300,
      height: 200,
    },
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'borderRadius', title: '圆角度数', default: 0,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int,
        attrs: {
          suffix: '像素',
        }
      }, {
        name: 'blur', title: '滤镜（模糊）', default: 0,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int,
        attrs: {
          suffix: '像素',
        }
        // format: (val) => { return `blur(${val}px)`; }
      }, {
        name: 'isBackground', title: '背景视频', default: false,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否为背景视频（在背景铺满）',
        change(prop, propMap, component, value) {
          component.attrs.isFullScreen = value;
        }
      }, {
        name: 'maskColor', title: '背景视频遮罩色', default: '',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.color,
        attrs: {
          showAlpha: true,
          colorType: 'rgb',
        }
      }, {
        name: 'fillType', title: '填充方式', default: 'cover',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: {
          options: [
            { label: '完全填充', value: 'fill' }, 
            { label: '区域内等比填充', value: 'contain' }, 
            { label: '区域外等比填充', value: 'cover' }, 
            { label: '不缩放', value: 'none' }, 
            { label: '较小等比填充', value: 'scale-down' }
          ]
        }
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'src', title: 'url地址', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.file,
        remark: '音频的URL路径。', attrs: { multiple: false }
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 音频
   */
  {
    name: 'q-audio',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '音频',
    attrs: {
      isFullScreen: false,
    },
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'isBackground', title: '背景音乐', default: false,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否为背景音乐（不在界面上显示）',
        change(prop, propMap, component, value) {
          component.attrs.isFullScreen = value;
        }
      }, {
        name: 'showControls', title: '显示控制器', default: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否显示音乐控制器'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'autoplay', title: '是否自动播放', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'src', title: '音频文件',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.file,
        remark: '音频的URL路径。', attrs: { multiple: false }
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 视频
   */
  {
    name: 'q-video',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '视频',
    attrs: {
      isFullScreen: false,
    },
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'isBackground', title: '背景视频', default: false,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否为背景视频（在背景铺满）',
        change(prop, propMap, component, value) {
          component.attrs.isFullScreen = value;
        }
      }, {
        name: 'maskColor', title: '背景视频遮罩色', default: '',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.color,
        attrs: {
          showAlpha: true,
          colorType: 'rgb',
        }
      }, {
        name: 'controls', title: '显示控制器', default: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否显示视频控制器'
      }, {
        name: 'fillType', title: '填充方式', default: 'cover',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.dropdownList,
        attrs: {
          options: [
            { label: '完全填充', value: 'fill' }, 
            { label: '区域内等比填充', value: 'contain' }, 
            { label: '区域外等比填充', value: 'cover' }, 
            { label: '不缩放', value: 'none' }, 
            { label: '较小等比填充', value: 'scale-down' }
          ]
        }
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'autoplay', title: '是否自动播放', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'muted', title: '是否静音', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean,
      }, {
        name: 'loop', title: '是否循环播放', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean,
      }, {
        name: 'preload', title: '是否预加载', default: false,
        group: ComponentPropertyGroup.action, editor: ComponentPropertyEditor.boolean,
        attrs: {
          unCheckedValue: 'none', checkedValue: 'auto'
        }
      }, {
        name: 'src', title: '视频文件',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.file,
        remark: '视频的URL路径。', attrs: { multiple: false }
      }, {
        name: 'poster', title: '视频封面', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.file,
        remark: '视频的URL路径。', attrs: { multiple: false }
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 完成得分
   */
   {
    name: 'q-complete-score',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '完成得分',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'text', title: '内容', default: '得分：{{score}}分', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.richtext,
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 柱状图
   */
   {
    name: 'q-chart-bar',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '柱状图',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'legend', title: '显示图例', default: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'color', title: '颜色', default: '#5470C6',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'height', title: '高度', default: '200px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'position', title: '绑定图表', default: 'genre*sold',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'dataSource', title: '数据', default: `[
  ["Sports","275"],
  ["Strategy","115"],
  ["Action","120"],
  ["Shooter","350"],
  ["Other","150"]
]`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  /** 
   * 折线图
   */
   {
    name: 'q-chart-line',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '折线图',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'legend', title: '显示图例', default: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'color', title: '颜色', default: '#5470C6',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'height', title: '高度', default: '200px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'padding', title: '内边距', default: [0,30,50,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'position', title: '绑定图表', default: 'School Year*value',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'dataSource', title: '数据', default: `[
  ["Sports","275"],
  ["Strategy","115"],
  ["Action","120"],
  ["Shooter","350"],
  ["Other","150"]
]`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  
  /** 
   * 饼图
   */
  {
    name: 'q-chart-pie',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.attachment,
    title: '饼图',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'legend', title: '显示图例', default: false,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'color', title: '颜色', default: 'name',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'height', title: '高度', default: '200px',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.length
      }, {
        name: 'padding', title: '内边距', default: [40,0,10,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'position', title: '绑定图表', default: 'const*y',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'dataSource', title: '数据', default: `[{
  "name": "其他消费",
  "value": "6371664"
}, {
  "name": "生活用品",
  "value": "7216301"
}, {
  "name": "通讯物流",
  "value": "1500621"
}, {
  "name": "交通出行",
  "value": "586622"
}, {
  "name": "饮食",
  "value": "900000"
}]`,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.code, layout: PropertyLayout.block
      }, {
        name: 'name', title: '组件名称', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  {
    name: 'q-anx-stepper',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.special,
    title: '步骤组件',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'options', title: '步骤列表', default: [], layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'label', columns: [
          { name: 'label', title: '步骤', editor: ComponentPropertyEditor.singerLine, attrs: { } },
        ] }
      }, {
        name: 'currentStep', title: '当前步骤', default: 0,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int,
        attach: [ ComponentPropertyEditor.variable ],
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  {
    name: 'q-anx-practise-score',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.special,
    title: '仪表盘',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.box
      }, {
        name: 'showImage', title: '显示图片', default: false, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在仪表盘下方显示对应阶段图片。'
      }, {
        name: 'steps', title: '阶段列表', layout: PropertyLayout.block,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.modelList, default: [
          { label: '正常', color: '#41D79C', image: undefined },
          { label: '轻度焦虑', color: '#FEE225', image: undefined },
          { label: '中度焦虑', color: '#FFA136', image: undefined },
          { label: '重度焦虑', color: '#FF6165', image: undefined },
        ],
        attrs: { rowKey: 'id', columns: [
          { name: 'id', visible: false, editor: ComponentPropertyEditor.singerLine, get default() { return createModelId(); } },
          { name: 'label', title: '名称', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'image', title: '图片', editor: ComponentPropertyEditor.file, attrs: { } },
          { name: 'color', title: '颜色', editor: ComponentPropertyEditor.color, attrs: { } },
        ] }
      }, {
        name: 'unit', title: '数值单位', default: '分',
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.singerLine
      }, {
        name: 'lineWidth', title: '圆环宽度', default: 6,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int, attrs: {
          suffix: '像素'
        }
      }, {
        name: 'thumbSize', title: '指示器大小', default: 15,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int, attrs: {
          suffix: '像素'
        }
      }, {
        name: 'spaceDeg', title: '每段间隔', default: 8,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.int, attrs: {
          suffix: '像素'
        }
      }, {
        name: 'needAnima', title: '使用动画', default: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean
      }, {
        name: 'score', title: '当前数值', default: 0,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int,
        attach: [ ComponentPropertyEditor.variable ],
      }, {
        name: 'max', title: '最大值', default: 100,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int
      }, {
        name: 'min', title: '最小值', default: 0,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  {
    name: 'q-anx-compelete-button',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.special,
    title: '翻页按钮',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'prevDisabled', title: '禁用上一页', default: false,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.boolean,
      }, {
        name: 'nextDisabled', title: '禁用下一页', default: false,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.boolean,
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  {
    name: 'q-anx-video',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.special,
    title: '视频播放器',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'playPosition', title: '当前视频索引', default: 0,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int
      }, {
        name: 'dataList', title: '视频列表', get default() { 
          return [ { id: createModelId() } ];
        },
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'id', columns: [
          { name: 'id', visible: false, editor: ComponentPropertyEditor.singerLine, get default() { return createModelId(); } },
          { name: 'src', title: '文件', editor: ComponentPropertyEditor.file, attrs: { } },
          { name: 'poster', title: '封面', editor: ComponentPropertyEditor.file, attrs: { } },
          // { name: 'prevTime', title: '上次播放位置', editor: ComponentPropertyEditor.int, attrs: { } },
        ] }
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },

  {
    name: 'q-anx-audio',
    isHidden: false,
    isFormItem: false,
    isTopLevel: false,
    type: ComponentCategory.special,
    title: '音频播放器',
    propertys: [
      {
        name: 'visible', title: '是否显示', default: true, visible: true,
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.boolean,
        remark: '是否在界面上显示。'
      }, {
        name: 'margin', title: '外边距', default: [0,0,0,0],
        group: ComponentPropertyGroup.style, editor: ComponentPropertyEditor.box
      }, {
        name: 'playPosition', title: '当前音频', default: 0,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int
      }, {
        name: 'dataList', title: '音频列表', get default() { 
          return [ { id: createModelId() } ];
        },
        layout: PropertyLayout.block,
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.modelList,
        attrs: { rowKey: 'id', columns: [
          { name: 'id', visible: false, editor: ComponentPropertyEditor.singerLine, get default() { return createModelId(); } },
          { name: 'title', width: '30%', title: '标题', editor: ComponentPropertyEditor.singerLine, attrs: { } },
          { name: 'src', title: '文件', editor: ComponentPropertyEditor.file, attrs: { } },
          { name: 'poster', width: '20%', title: '封面', editor: ComponentPropertyEditor.file, attrs: { } },
          // { name: 'duration', width: '20%', title: '时长', editor: ComponentPropertyEditor.int, attrs: { } },
          // { name: 'prevTime', title: '上次播放位置', editor: ComponentPropertyEditor.int, attrs: { } },
        ] }
      }, {
        name: 'remark', title: '备注', default: '',
        group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.multiLine
      }
    ]
  },
];

/** 获取所有组件 */
export let getComponents = computed<InitComponent[]>(() => {
  return initComponents();
});

export function initComponents(componentList?: InitComponent[]): InitComponent[] {
  if (!componentList) {
    componentList = formComponents;
  }
  return (componentList ?? []).map(i => {
    const _propertys = i.propertys
      .filter(o => o.default !== undefined && o.default !== null)
      .map(o => ({[o.name]: o.default}));
    const component = {
      ...i,
      propertyEditors: Object.assign.apply({}, 
        [{}].concat(
          i.propertys.filter(o => o.attach?.length).map(o => ({[o.name]: o.editor}))
        ) as [object, ...ComponentProperty[]]
      ),
      attrs: Object.assign({}, ..._propertys, i.attrs ?? {})
    };
    return component;
  });
}

export const setFormComponents = (items) => {
  formComponents = items;
}