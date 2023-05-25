import { VarType } from '@/@types/enum';

interface Props {
  /** 命令属性类型 */
  type: VarType;
  /** 命令属性是否必填 */
  required: boolean;
  /** 命令属性默认值 */
  default?: any;
}

/** 真实TS类型转换 */
type RealVarType = {
  string: string;
  number: number;
  boolean: boolean;
  object: Record<string, any>;
  array: any[];
};

type GetArrayVarType<T> = T;

type GetVarType<T extends keyof RealVarType> = RealVarType[T];

type GetVarRequired<T, K> = T extends true ? K : K | undefined;

/** 命令类型 */
export interface CommandType<T> {
  /** 命令名称 */
  name: string;
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
  /** 属性 */
  propertys: T;
  /** 后退 */
  undo: (
    command: Command<{
      [K in keyof T]: T[K] extends Props ? GetVarRequired<T[K]['required'], (
        T[K]['type'] extends VarTypeStr ? GetVarType<T[K]['type']> : GetArrayVarType<T[K]['type']>
      )> : never;
    }>,
  ) => void;
  /** 执行/前进 */
  exec: (
    command: Command<{
      [K in keyof T]: T[K] extends Props ? GetVarRequired<T[K]['required'], (
        T[K]['type'] extends VarTypeStr ? GetVarType<T[K]['type']> : GetArrayVarType<T[K]['type']>
      )> : never;
    }>,
  ) => void;
}

/** 命令实例 */
export interface Command<T = any> {
  /** Id */
  id: string;
  /** 命令类型 */
  type: string;
  /** 关联对象Id（组件Id/global） */
  objectId: string | 'global';
  /** 关联对象类型（组件Id/global） */
  objectType: 'global' | 'component';
  /** 属性 */
  attrs: T;
  /** 旧值 */
  oldVal: any;
  /** 新值 */
  newVal: any;
  /** 执行时间（时间戳） */
  executeTime: number;
}