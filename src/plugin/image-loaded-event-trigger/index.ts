import { EventTriggerGroup } from '@/modules/event-module/enum';
import { PluginType, type PluginInfo, registerEventAction, registerEventTrigger } from '@/modules/plugin-module';

/** 注册图片加载完成事件触发（插件测试） */
export function registerImageLoadedEventTrigger() {
  const _pluginInfo: PluginInfo = {
    name: 'image-loaded-event-trigger',
    title: '图片已加载事件触发',
    version: '0.0.1',
    author: 'haku',
    description: '测试用图片已加载触发，仅测试用无效果',
    pluginType: PluginType.component,
  };

  registerEventTrigger(_pluginInfo, {
    title: '图片已加载',
    name: 'image-loaded',
    isGlobal: false,
    group: EventTriggerGroup.component,
    type: 'image-loaded',
    config: {},
    attrs: {},
    hasState: false,
    format: '当前组件图片加载完毕'
  });
}