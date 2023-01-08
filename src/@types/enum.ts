import { string } from 'vue-types';

export enum DataBind {}

/** 表单下的页面类型 */
export enum PageType {
  /** 常规页面 */
  normalPage = 'normal-page',
  /** 起始页 */
  startPage = 'start-page',
  /** 起始页 */
  endPage = 'end-page',
}

/** 变量类型 */
export enum VarType {
  /** 字符串 */
  string = 'string',
  /** 数值 */
  number = 'number',
  /** 布尔型 */
  boolean = 'boolean',
  /** 对象 */
  object = 'object',
  /** 数组 */
  array = 'array',
}

/** 布局类型 */
export enum LayoutType {
  /** 无布局（直接放置） */
  none = 'none',
  /** 流式布局 */
  flex = 'flex',
  /** 中心布局 */
  center = 'center',
  /** 绝对布局 */
  absolute = 'absolute',
  /** 表格布局 */
  table = 'table',
}

/** 组件分类 */
export enum ComponentCategory {
  /** 题型组件 */
  normal = 'normal',
  /** 附加内容 */
  attachment = 'attachment',
  /** 复合组件 */
  complex = 'complex',
  /** 布局组件 */
  layout = 'layout',
  /** 定制组件 */
  special = 'special',
}

/** 设备类型 */
export enum DeviceType {
  /** 移动端 */
  mobile = 'mobile',
  /** 平板端 */
  tablet = 'tablet',
  /** PC端 */
  pc = 'pc',
}

/** 属性编辑器 */
export enum ComponentPropertyEditor {
  /** 任意值 */
  any = 'any',
  /** 标签（不允许编辑） */
  label = 'label',
  /** 数据 */
  data = 'data',
  /** 文本列表 */
  textList = 'text-list',
  /** 代码 */
  code = 'code',
  /** 文件 */
  file = 'file',
  /** 时长 */
  duration = 'duration',
  /** 单行文本 */
  singerLine = 'single-line',
  /** 多行文本 */
  multiLine = 'multi-line',
  /** 布尔类型 */
  boolean = 'boolean',
  /** 整数 */
  int = 'int',
  /** 浮点数 */
  float = 'float',
  /** 长度 */
  width = 'width',
  /** 颜色 */
  color = 'color',
  /** Json类型 */
  json = 'json',
  /** 图标类型(vant) */
  icon = 'icon',
  /** 下拉列表 */
  dropdownList = 'dropdown-list',
  /** 单选组 */
  radioGroup = 'radio-group',
  /** 函数类型 */
  function = 'function',
  /** 对象列表类型 */
  modelList = 'model-list',
  /** 表达式 */
  expression = 'expression',
  /** 盒模型编辑器 */
  box = 'box',
  /** 校验规则 */
  rules = 'rules',
  /** 富文本 */
  richtext = 'richtext',

  /** 题目 */
  component = 'component',
  /** 条件表达式 */
  condition = 'condition',

  /** 变量 */
  variable = 'variable',
  /** 维度配置 */
  dimension = 'dimension',
  /** 公式 */
  formula = 'formula',
}

/** 控件属性组 */
export enum ComponentPropertyGroup {
  /** 表单分组 */
  form = '表单属性',
  /** 子属性分组 */
  parent = '子属性',
  /** 外观分组 */
  style = '外观',
  /** 行为分组 */
  action = '行为',
  /** 其他分组 */
  else = '其他',
  /** 数据源分组 */
  data = '数据',
}

/** 表单类型 */
export enum ComponentRuleType {
  /** 文本填写框 */
  text = 'text',
  /** 数字填写框 */
  number = 'number',
  /** 选择框 */
  select = 'select',
  /** 日期框 */
  date = 'date',
  /** 文件上传框 */
  upload = 'upload',
}

/** 属性布局方式 */
export enum PropertyLayout {
  /** 行内布局（默认） */
  inline = 'inline',
  /** 整块布局 */
  block = 'block',
}

/** Flex主轴对齐方式 */
export enum MainAxisAlignment {
  /** 开始对齐 */
  start = 'flex-start',
  /** 结束对齐 */
  end = 'flex-end',
  /** 中间对齐 */
  center = 'center',
  /** 两端对齐 */
  spaceBetween = 'spaceBetween',
  /** 平铺对齐 */
  spaceAround = 'spaceAround',
}

/** Flex次轴对齐方式 */
export enum CrossAxisAlignment {
  /** 开始对齐 */
  start = 'flex-start',
  /** 结束对齐 */
  end = 'flex-end',
  /** 中间对齐 */
  center = 'center',
  /** 填充满 */
  stretch = 'stretch',
  /** 基线对齐 */
  baseline = 'baseline',
}

/** 应用类型 */
export enum AppType {
  /** 问卷 */
  questionnaire = 'questionnaire',
  /** 画布 */
  canvas = 'canvas',
  /** 课件 */
  courseware = 'courseware',
  /** 复合组件 */
  complexComponent = 'complex-component',
}

/** 数据编辑器的值转换为答案类型 */
export enum OriginDataTransformComponentAnswerType {
  /** 字符串类型 */
  'data-string' = 'text',
  /** 数字类型 */
  'data-number' = 'number',
  /** 布尔类型 */
  'data-boolean' = 'boolean',
  /** 日期类型 */
  'data-date' = 'datetime',
  /** 【未完成】组件类型 */
  'data-component' = 'text',
  /** 变量类型 */
  'data-variable' = 'variable',
  /** 组件子选项类型 */
  'data-component-option' = 'text'
}