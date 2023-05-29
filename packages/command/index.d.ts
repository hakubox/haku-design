import { Component, ComponentProperty } from "../../src/@types"

/** 基础命令类型 */
export interface BasicCommand {
  /** 属性 */
  attrs: Record<string, any>
}

/** 全局命令 */
export interface GlobalCommand {
  /** 开始编辑 */
  'init': {
    value: undefined,
    attrs: undefined,
  }
  /** 移动组件 */
  'move-component': {
    value: string,
    attrs: {
      /** 来源索引 */
      fromIndex?: number,
      /** 目标索引 */
      toIndex: number,
      /** 来源父组件Id */
      fromParentComponentId?: string,
      /** 目标父组件Id */
      toParentComponentId?: string,
      /** 目标父节点插槽索引 */
      toParentComponentSlotIndex?: number,
      /** X坐标 */
      x?: number,
      /** Y坐标 */
      y?: number,
    }
  }
  /** 添加组件 */
  'add-component': {
    value: Component,
    attrs: {
      /** 位置索引 */
      index: number,
      /** 编辑器 */
      editor?: string,
      /** 父组件Id */
      parentComponentId?: string,
      /** 父组件组索引 */
      parentComponentSlotIndex?: number,
      /** X坐标 */
      x?: number,
      /** Y坐标 */
      y?: number,
    }
  }
  /** 复制组件 */
  'copy-component': {
    value: Component, //  | ComponentGroup
    attrs: {
      /** 位置索引 */
      index: number,
      /** 父组件Id */
      parentComponentId?: string,
      /** 父组件组索引 */
      parentComponentSlotIndex?: number
    }
  }
  /** 删除组件 */
  'remove-component': {
    value: Component, //  | ComponentGroup
    attrs: {
      /** 组件Id */
      componentId: string,
      /** 父组件Id */
      parentComponentId?: string,
      /** 组件索引 */
      index: number,
    }
  }
  /** 设置属性值 */
  'set-property': {
    value: any,
    attrs: {
      /** 属性 */
      property: ComponentProperty,
      /** 编辑器 */
      editor?: string,
    }
  }
  /** 设置值类型 */
  'set-property-type': {
    value: any,
    attrs: {
      /** 组件Id */
      componentId: string,
      /** 属性名称 */
      propertyName: string,
    }
  }
  /** 设置应用配置 */
  'set-global-config': {
    value: any,
    attrs: {
      /** 实体类 */
      model: object,
      /** 属性名称 */
      propertyName: string | string[],
      /** 属性标题 */
      propertyTitle: string,
    }
  }
  /** 调整窗口大小 */
  'change-page-size': {
    value: undefined;
    attrs: undefined;
  }
  /** 保存 */
  'save': {
    value: undefined;
    attrs: undefined;
  }
}

/** 命令类型 */
export interface CommandType<CommandType extends keyof GlobalCommand> {
  /** 图标 */
  icon?: string;
  /** 格式化行为文本 */
  format: string;
  /** 描述 */
  description: string;
  /** 是否可更新 */
  updatable: boolean;
  /** 影响范围 */
  objectType: 'global' | 'component';
  /** 后退 */
  undo: (
    command: Command<CommandType>,
  ) => void;
  /** 执行/前进 */
  exec: (
    command: Command<CommandType>,
  ) => void;
}

/** 命令实例 */
export interface Command<T extends keyof GlobalCommand> {
  /** Id */
  id: string;
  /** 命令类型 */
  type: T;
  /** 关联对象类型（组件Id/global） */
  objectType: 'global' | 'component';
  /** 关联对象Id（组件Id/global） */
  objectId: string | 'global';
  /** 属性 */
  attrs: GlobalCommand[T]['attrs'];
  /** 旧值 */
  oldVal: GlobalCommand[T]['value'];
  /** 新值 */
  newVal: GlobalCommand[T]['value'];
  /** 执行时间（时间戳） */
  executeTime: number;
}

/** 命令实例 */
export interface CommandHistory<T extends keyof GlobalCommand> {
  /** Id */
  id: string;
  /** 命令类型 */
  type: T;
  /** 关联对象类型（组件Id/global） */
  objectType: 'global' | 'component';
  /** 关联对象Id（组件Id/global） */
  objectId: string | 'global';
  /** 属性 */
  attrs: GlobalCommand[T]['attrs'];
  /** 旧值 */
  oldVal: GlobalCommand[T]['value'];
  /** 新值 */
  newVal: GlobalCommand[T]['value'];
  /** 执行时间（时间戳） */
  executeTime: number;
}