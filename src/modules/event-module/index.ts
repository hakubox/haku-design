import type { AppEvent, AppEventLog, TriggerState } from './@types';
import { getEventActions } from '@/modules/event-module/data/event-action';
import { getEventTriggers } from '@/modules/event-module/data/event-trigger';
import { EventTriggerType } from './enum';
import { createModelId } from '@/tools/common';
import { cloneLoop } from '@/lib/clone';
import { reactive } from 'vue';

/** 事件模块状态 */
export const state = reactive({
  /** 全局已添加事件 */
  allEvents: [] as AppEvent[],
  /** 触发状态管理 */
  triggerStates: [] as TriggerState[],
  /** 事件日志 */
  eventLogs: [] as AppEventLog[],
});

/** 事件模块逻辑 */
export const service = {
  eventHook(eventName: string, targetId: string, attrs?: Record<string, any>) {},
  setupOnEventHook(fn) {
    service.eventHook = fn;
  },
  /** 增加触发状态 */
  addTriggerState(id: string, status: boolean, target: string = 'global') {
    const _index = state.triggerStates.findIndex((i) => i.triggerId == id);
    if (_index) {
      state.triggerStates[_index].state = status;
    } else {
      state.triggerStates.push({
        triggerId: id,
        state: status,
        target,
      });
    }
  },
  /** 发布触发 */
  emit(type: EventTriggerType, target: string | 'global' = 'global', data?: any, extraData?: any) {
    service.execute(type, target, data, extraData);
  },
  /** 校验逻辑组是否成立 */
  checkLogicGroup(eventLogicGroup: { id: string, isCheck: boolean, groupIndex: number }[]) {
    for (let i = 0; i < eventLogicGroup.length; i++) {
      const item = eventLogicGroup[i];
      const _logicGroup = eventLogicGroup.filter(i => i.groupIndex === item.groupIndex);
      let _logicGroupSuccessCount = 0;
      for (let o = 0; o < _logicGroup.length; o++) {
        const item = _logicGroup[o];
        if (item.isCheck) _logicGroupSuccessCount++;
      }
      if (_logicGroupSuccessCount === _logicGroup.length) return true;
    }
    return false;
  },
  /** 判断并执行事件 */
  execute(type?: EventTriggerType, target?: string, data?: any, extraData?: any) {
    if (type) {
      const _triggerGroupIds: Record<string, string[]> = {};
      const _canExecuteList = state.allEvents.map((event, eventIndex) => {
        const _eventLogicGroup: { id: string, isCheck: boolean, groupIndex: number }[] = [];
        // 事件触发类型包含触发的类型时才会触发事件，否则直接跳过
        if (!event.triggers.some(i => i.type === type)) return undefined;
        let _logicGroupIndex = 0;
        event.triggers.forEach((trigger, triggerIndex) => {
          if (triggerIndex > 0) {
            if (trigger.logicGate === 'or') {
              _logicGroupIndex++;
            }
          }
          _eventLogicGroup.push({ id: trigger.id, isCheck: false, groupIndex: _logicGroupIndex });
        });
        if (service.isCompleteEvent(event)) {
          let _completeCount = 0;
          // 如果触发源target不为global（触发源是某个组件），且当前事件不包含触发源为target的触发时，则不触发当前事件行为及反向行为 (by.lidian)
          if (target !== 'global' && !event.triggers.some(i => i.target === target)) return undefined;

          for (let o = 0; o < event.triggers.length; o++) {
            const trigger = event.triggers[o];
            let _re = false;
            if (trigger.hasState) {
              const _condition = getEventTriggers.value.find((i) => i.type === trigger.type)?.condition;
              _re =
                trigger.type === type &&
                trigger.target === target &&
                (_condition?.(trigger.attrs, trigger, trigger.target, data, extraData) ?? true);
            } else {
              _re = trigger.type == type && trigger.target == target;
            }
            // 判断分组情况
            if (_re) {
              if (event.triggers.length > 1) {
                const _index = _eventLogicGroup.findIndex(i => i.id === trigger.id);
                if (_index >= 0) {
                  _eventLogicGroup[_index].isCheck = true;
                }
                _completeCount++;
                const _group = _eventLogicGroup.filter(i => i.groupIndex === _eventLogicGroup[_index].groupIndex);
                if (_group.every(i => i.isCheck)) {
                  if (!_triggerGroupIds[event.id]) {
                    _triggerGroupIds[event.id] = _group.map(i => i.id);
                  }
                  _completeCount = event.triggers.length;
                  break;
                }
              } else {
                _completeCount++;
              }
            }
          }
          if (!_triggerGroupIds[event.id]) {
            _triggerGroupIds[event.id] = _completeCount === event.triggers.length ? event.triggers.map(i => i.id) : [];
          }
          return _completeCount === event.triggers.length;
        }
        if (!_triggerGroupIds[event.id]) {
          _triggerGroupIds[event.id] = [];
        }
        return false;
      });

      _canExecuteList.forEach((canExecute, index) => {
        if (canExecute === undefined) return;
        const _event = state.allEvents[index];
        if (canExecute === true && _event?.actions?.length) {
          service.executeEvent(_event, type, target, _triggerGroupIds[_event.id], false, extraData);
        } else if (canExecute === false && _event?.elseActions?.length) {
          service.executeEvent(_event, type, target, _triggerGroupIds[_event.id], true, extraData);
        }
      });
    } else {
      throw new Error('触发事件的类型不能为空');
    }
  },
  /** 直接触发事件 */
  executeEvent(event: AppEvent, triggerType: EventTriggerType, triggerTarget: string | 'global' = 'global', triggerIds: string[] = [], isElseAction: boolean = false, extraData?: Record<string, any>, addLog: boolean = true) {
    (isElseAction ? event.elseActions : event.actions).forEach((o) => {
      const _action = getEventActions.value.find((i) => i.name === o.name);
      if (_action) {
        _action.action(o.attrs, o, extraData);
        service.eventHook(_action.name, o.target, o.attrs);
        if (addLog) service.addLog(event, triggerType, triggerTarget, triggerIds, isElseAction, extraData);
      }
    });
  },
  /** 添加日志 */
  addLog(event: AppEvent, triggerType: EventTriggerType, triggerTarget: string | 'global' = 'global', triggerIds: string[] = [], isElseAction: boolean = false, extraData?: Record<string, any>) {
    if (state.eventLogs.length > 300) {
      state.eventLogs.splice(0, 1);
    }
    state.eventLogs.splice(0, 0, {
      id: createModelId(12),
      title: `${event.title}`,
      createTime: new Date().getTime(),
      triggerType,
      triggerTarget,
      triggerIds,
      isElseAction,
      isGlobal: !event.triggers.some(i => i.isGlobal === false),
      event: cloneLoop(event),
      extraData
    });
  },
  /** 清空日志 */
  clearLog() {
    state.eventLogs = [];
  },
  /** 是否为完整事件 */
  isCompleteEvent(event: AppEvent) {
    const _re = event.actions.length && event.triggers.length;
    if (_re) {
      const triggerSuccess = event.triggers.every((trigger) => {
        return Object.entries(trigger.config).every(([triggerName, triggerConfig]) => {
          if (triggerConfig.required) {
            return !!trigger.attrs[triggerName];
          } else return true;
        });
      });
      const actionSuccess = event.actions.every((action) => {
        return Object.entries(action.config).every(([actionName, actionConfig]) => {
          if (actionConfig.required) {
            return !!action.attrs[actionName];
          } else return true;
        });
      });
      return triggerSuccess && actionSuccess;
    } else return _re;
  },
  /** 是否为全局事件 */
  isGlobalEvent(event: AppEvent) {
    if (!event.triggers?.length) return undefined;
    return event.triggers.some(i => i.target === 'global');
  },
};

export default {
  state,
  service
}