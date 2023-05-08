import { EventTriggerType, EventTriggerGroup, EventActionGroup } from '../enum';
import type { ComponentPropertyEditor } from '@haku-design/core';

/** 事件 */
export interface AppEvent {
  /** 事件Id */
  id: string;
  /** 标题 */
  title: string;
  /** 触发类型 */
  triggers: AppEventTriggerInstance[];
  /** 触发后行为 */
  actions: AppEventActionInstance[];
  /** 反向行为（else） */
  elseActions: AppEventActionInstance[];
}

/** 事件日志 */
export interface AppEventLog {
  /** 日志Id */
  id: string;
  /** 触发类型 */
  triggerType: EventTriggerType;
  /** 触发源 */
  triggerTarget: string | 'global';
  /** 触发实例Ids */
  triggerIds: string[];
  /** 标题 */
  title: string;
  /** 创建日期（时间戳） */
  createTime: number;
  /** 是否为全局事件 */
  isGlobal: boolean;
  /** 是否为反向事件触发 */
  isElseAction: boolean;
  /** 事件 */
  event: AppEvent;
  /** 额外数据 */
  extraData?: Record<string, any>;
}

/** 触发状态 */
export interface TriggerState {
  /** 触发Id */
  triggerId: string;
  /** 目标Id或“global” */
  target: string | 'global';
  /** 状态值（是否完成目标） */
  state: boolean;
}

/** 事件触发实例 */
export interface AppEventTriggerInstance extends AppEventTrigger {
  /** Id */
  id: string;
  /** 目标Id或“global” */
  target: string | 'global';
  /** 是否确认 */
  isCheck?: boolean;
  /** 逻辑门 */
  logicGate: 'and' | 'or';
}

/** 事件行为实例 */
export interface AppEventActionInstance extends AppEventAction {
  /** Id */
  id: string;
  /** 目标Id或“global” */
  target: string | 'global';
}

/** 事件触发 */
export interface AppEventTrigger {
  /** 触发属性 */
  attrs: Record<string, any>;
  /** 是否为公共事件触发 */
  isGlobal: boolean;
  /** 触发标题 */
  title: string;
  /** 触发名称/类型 */
  name: string;
  /** 事件触发类型 */
  type: EventTriggerType | string;
  /** 事件分组 */
  group: EventTriggerGroup;
  /** 包含状态 */
  hasState: boolean;
  /** 触发配置 */
  config: Record<string, AppEventTriggerConfig>;
  /** 显示描述 */
  format: string;
  /** 判断条件 */
  condition?: (
    attrs: Record<string, any>,
    config: AppEventTrigger,
    target: string,
    data?: any,
    extraData?: any,
  ) => boolean;
}

/** 事件行为 */
export interface AppEventAction {
  /** 行为属性 */
  attrs: Record<string, any>;
  /** 是否为公共事件行为 */
  isGlobal: boolean;
  /** 行为标题 */
  title: string;
  /** 行为名称 */
  name: string;
  /** 事件分组 */
  group: EventActionGroup;
  /** 行为配置 */
  config: Record<string, AppEventActionConfig>;
  /** 显示描述 */
  format: string;
  /** 动作 */
  action: (attrs: Record<string, any>, config: AppEventAction, extraData?: any) => void;
}

/** 触发属性 */
export interface AppEventTriggerConfig {
  /** 属性标题 */
  title: string;
  /** 属性名称 */
  // name: string;
  /** 是否必填 */
  required: boolean;
  /** 默认值 */
  default?: any;
  /** 编辑器 */
  editor: ComponentPropertyEditor;
  /** 宽度 */
  width?: string;
  /** 附加属性 */
  attrs?: Record<string, any>;
}

/** 配置属性 */
export interface AppEventActionConfig {
  /** 属性标题 */
  title?: string;
  /** 属性名称 */
  // name: string;
  /** 是否必填 */
  required: boolean;
  /** 默认值 */
  default?: any;
  /** 编辑器 */
  editor: ComponentPropertyEditor;
  /** 宽度 */
  width?: string;
  /** 附加属性 */
  attrs?: Record<string, any>;
}
