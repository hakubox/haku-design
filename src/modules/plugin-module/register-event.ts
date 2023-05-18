import type { AppEventAction, AppEventTrigger } from '../event-module/index.d';
import { eventTriggers } from '../event-module/data/event-trigger';
import { eventActions } from '../event-module/data/event-action';
import { registerPlugin } from './register-plugin';
import type { PluginInfo } from './index.d';
import { PluginLoadType, PluginType } from './enum';

/** 注册事件触发 */
export function registerEventTrigger(plugin: PluginInfo, trigger: AppEventTrigger) {
  registerPlugin({
    ...plugin,
    name: trigger.name,
    title: plugin.title ?? trigger.title,
    pluginType: PluginType.eventTrigger,
  });
  eventTriggers.push(trigger);
}

/** 注册事件行为 */
export function registerEventAction(plugin: PluginInfo, action: AppEventAction) {
  registerPlugin({
    ...plugin,
    name: action.name,
    title: plugin.title ?? action.title,
    pluginType: PluginType.eventAction,
  });
  eventActions.push(action);
}
