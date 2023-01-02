import { state as editorState } from '@/modules/editor-module';
import { EventActionGroup, EventTriggerGroup, EventTriggerType } from '@/modules/event-module/enum';
import { registerEventAction, registerEventTrigger } from '@/modules/plugin-module/register-event';

/** 注册图片加载完成事件触发（插件测试） */
export function registerImageLoadedEventTrigger() {
  registerEventTrigger({
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