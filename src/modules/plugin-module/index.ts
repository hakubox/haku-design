import { reactive, provide, inject } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { registerEventAction, registerEventTrigger } from './register-event';
import { importConfig } from './import-config';

/** 插件配置 */
export interface PluginConfig {
  /** 插件名称 */
  name: string;
  /** 插件标题 */
  title: string;
  /** 插件图标URL */
  icon?: string;
  /** 插件类型 */
  type: 'component' | 'event-trigger' | 'event-action' | 'config' | 'menu-component-item' | 'ui-tool';
  /** 注册 */
  register?: (() => void) | (() => Promise<void>);
  /** 取消注册 */
  unRegister?: (() => void) | (() => Promise<void>);
  /** 应用加载事件 */
  onloadApp?: (() => void) | (() => Promise<void>);
}

/** 插件实例 */
export interface PluginInstance extends PluginConfig {
  /** 是否已初始化 */
  isInit: boolean;
  /** DOM节点 */
  element?: HTMLElement;
}

/** 插件模块状态 */
export const state = reactive({
  /** 插件列表 */
  plugins: [] as PluginInstance[],
  /** 是否已初始化 */
  isInit: false,
});

/** 插件模块逻辑 */
export const service = {
  /** 整体插件模块初始化 */
  onInit() {
    state.isInit = true;
    state.plugins.forEach(async plugin => {
      if (!plugin.isInit) {
        if (plugin.register) await plugin.register();
        plugin.isInit = true;
      }
    });
  },
  /** APP加载事件 */
  onAppLoad() {
    state.plugins.forEach(async plugin => {
      if (plugin.onloadApp) await plugin.onloadApp();
    });
  },
};

export default {
  /** 插件模块状态 */
  state,
  /** 插件模块逻辑 */
  service,
};