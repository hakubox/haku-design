import type { AppEventAction, AppEventTrigger } from '../event-module/@types';
import { eventTriggers } from '../event-module/data/event-trigger';
import { eventActions } from '../event-module/data/event-action';
import { registerPlugin } from './register-plugin';
import { PluginConfig } from './@types';
import { PluginLoadType, PluginType } from './enum';

/** 注册事件触发 */
export function registerEventTrigger(plugin: PluginConfig, trigger: AppEventTrigger) {
  registerPlugin({
    ...plugin,
    name: trigger.name,
    title: trigger.title,
    icon: plugin.icon ?? 'iconfont icon-rule',
    pluginType: PluginType.eventTrigger,
  });
  eventTriggers.push(trigger);
}

/** 注册事件行为 */
export function registerEventAction(plugin: PluginConfig, action: AppEventAction) {
  registerPlugin({
    ...plugin,
    name: action.name,
    title: action.title,
    icon: plugin.icon ?? 'iconfont icon-rule',
    pluginType: PluginType.eventAction,
  });
  eventActions.push(action);
}
