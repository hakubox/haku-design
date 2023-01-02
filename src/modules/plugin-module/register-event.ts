import type { AppEventAction, AppEventTrigger } from '../event-module/@types';
import { eventTriggers } from '../event-module/data/event-trigger';
import { eventActions } from '../event-module/data/event-action';

/** 注册事件触发 */
export function registerEventTrigger(trigger: AppEventTrigger) {
  eventTriggers.push(trigger);
}

/** 注册事件行为 */
export function registerEventAction(action: AppEventAction) {
  eventActions.push(action);
}
