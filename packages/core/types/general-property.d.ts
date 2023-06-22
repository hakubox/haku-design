import { ComponentPropertyEditor, PropertyLayout, AppType } from '../enum';

/** 组件属性Map */
export interface ComponentPropertyMap {
  [ComponentPropertyEditor.any]: {
    attrs: undefined,
    returnValue: string
  },
  [ComponentPropertyEditor.data]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.width]: {
    attrs: {
      /** 后缀文本 */
      suffix?: string;
    },
    returnValue: string
  },
  [ComponentPropertyEditor.label]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.tags]: {
    attrs: undefined,
    returnValue: string[]
  },
  [ComponentPropertyEditor.textList]: {
    attrs: undefined,
    returnValue: string[]
  },
  [ComponentPropertyEditor.code]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.file]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.duration]: {
    attrs: {
      /** 单位 */
      unit?: string
    },
    returnValue: undefined
  },
  [ComponentPropertyEditor.singerLine]: {
    attrs: undefined,
    returnValue: string
  },
  [ComponentPropertyEditor.multiLine]: {
    attrs: undefined,
    returnValue: string
  },
  [ComponentPropertyEditor.boolean]: {
    attrs: {
      confirm?: (val: boolean) => string,
    },
    returnValue: boolean
  },
  [ComponentPropertyEditor.int]: {
    attrs: undefined,
    returnValue: number
  },
  [ComponentPropertyEditor.float]: {
    attrs: undefined,
    returnValue: number
  },
  [ComponentPropertyEditor.color]: {
    attrs: undefined,
    returnValue: string
  },
  [ComponentPropertyEditor.json]: {
    attrs: undefined,
    returnValue: any
  },
  // [ComponentPropertyEditor.icon]: {
  //   attrs: undefined,
  //   returnValue: undefined
  // },
  [ComponentPropertyEditor.dropdownList]: {
    attrs: {
      /** 选项列表 */
      options: {
        /** 标签 */
        label: string,
        /** 值 */
        value: string,
      }[]
    },
    returnValue: string
  },
  [ComponentPropertyEditor.radioGroup]: {
    attrs: {
      /** 选项列表 */
      options: {
        /** 标签 */
        label: string,
        /** 值 */
        value: string,
      }[]
    },
    returnValue: string
  },
  [ComponentPropertyEditor.function]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.modelList]: {
    attrs: {
      rowKey: string,
      columns: {
        name: string,
        width?: string,
        title: string,
        editor: ComponentPropertyEditor,
        visible?: boolean,
        default?: any,
        attrs: Record<string, any>,
        buttonEditorText?: string
      }[]
    },
    returnValue: Record<string, any>[]
  },
  [ComponentPropertyEditor.expression]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.box]: {
    attrs: {
      /** 单层边距 */
      single: boolean,
    },
    returnValue: [number, number, number, number][]
  },
  [ComponentPropertyEditor.rules]: {
    attrs: undefined,
    returnValue: Record<string, any>[]
  },
  [ComponentPropertyEditor.richtext]: {
    attrs: undefined,
    returnValue: string
  },
  [ComponentPropertyEditor.component]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.condition]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.variable]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.dimension]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.formula]: {
    attrs: undefined,
    returnValue: undefined
  },
  [ComponentPropertyEditor.numbers]: {
    attrs: {
      /** 选项列表 */
      options: {
        /** 标签名 */
        label: string,
        /** 属性名 */
        prop: string,
        /** 最小值 */
        min?: number,
        /** 最大值 */
        max?: number,
      }[]
    },
    returnValue: undefined
  },
  [ComponentPropertyEditor.slider]: {
    attrs: {
      /** 最小值 */
      min?: number,
      /** 最大值 */
      max?: number,
      /** 步长 */
      step?: number,
      /** 后缀文本 */
      suffix: string
    },
    returnValue: number
  },
  [ComponentPropertyEditor.background]: {
    attrs: undefined,
    returnValue: Record<string, any>[]
  },
  [ComponentPropertyEditor.none]: {
    attrs: undefined,
    returnValue: undefined
  }
}

/** 通用属性 */
export interface GeneralProperty<T extends ComponentPropertyEditor> {
  /** 属性名 */
  name: string | (string | number)[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 属性标题 */
  title: string;
  /** 输入框默认提示 */
  placeholder?: string;
  /** 属性类型 */
  type?: string;
  /** 备注 */
  remark?: string;
  /** 默认值 */
  default?: any;
  /** 是否必填 */
  require?: boolean;
  /** 是否显示 */
  visible?: boolean | ((attrs: Record<string, any>) => boolean);
  /** 是否子级 */
  leaf?: boolean;
  /** 是否为可变属性 */
  isSync?: boolean;
  /** 属性分组 */
  group?: string;
  /** 属性描述 */
  description?: string;
  /** 编辑器 */
  editor: T;
  /** 初始化（未实装） */
  init?(value: {
    /** 当前属性值 */
    value: ComponentPropertyMap[T]['returnValue'],
    /** 当前属性 */
    prop: GeneralProperty<T>,
    propMap: Record<string, GeneralProperty<any>>,
    /** 原绑定对象 */
    model: Record<string, any>,
  }): void;
  /** 修改属性 */
  change?(value: {
    /** 当前属性值 */
    value: ComponentPropertyMap[T]['returnValue'],
    /** 当前属性 */
    prop: GeneralProperty<T>,
    propMap: Record<string, GeneralProperty<any>>,
    /** 原绑定对象 */
    model: Record<string, any>,
  }): void;
  /** 显示条件 */
  showCondition?(value: {
    /** 当前属性值 */
    value: ComponentPropertyMap[T]['returnValue'],
    /** 当前属性 */
    prop: GeneralProperty<T>,
    propMap: Record<string, GeneralProperty<any>>,
    /** 原绑定对象 */
    model: Record<string, any>,
  }): boolean;

  /** 当前属性 */
  attrs?: ComponentPropertyMap[T]['attrs'] | {};
  /** 属性附加选项 */
  attach?: ComponentPropertyEditor[];
  /** 布局方式，默认为行内布局 */
  layout?: PropertyLayout;
  /** 值格式化函数 */
  format?: (val: ComponentPropertyMap[T]['returnValue']) => any;
  /** 是否全屏 */
  canFullScreen?: boolean;
  /** 属性当前的编辑器 */
  // currentEditor?: ComponentPropertyEditor;

  /** 属性名 */
  names?: string[] | string[][];
  /** 子属性 */
  children?: GeneralProperty<any>[];
  /** 排序索引 */
  sort?: number;
  /** 应用类型筛选 */
  appType?: AppType[];
}
