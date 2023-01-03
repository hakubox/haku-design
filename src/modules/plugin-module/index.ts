import { reactive } from 'vue';
import { PluginInstance } from './@types';
import message from '@/common/message';
import { PluginStatus } from './enum';

export type { PluginConfig } from './@types';
export { PluginType, PluginStatus, PluginLoadType } from './enum';
export { registerPlugin } from './register-plugin';
export { registerComponent, registerMenu } from './register-component';
export { registerEditor } from './register-editor';
export { registerEventTrigger, registerEventAction } from './register-event';

/** 插件模块状态 */
export const state = reactive({
  /** 插件列表 */
  plugins: [] as PluginInstance[],
  /** 当前状态 */
  status: 'un-init' as PluginStatus,
});

/** 插件模块逻辑 */
export const service = {
  /** 整体插件模块初始化 */
  async onInit() {
    try {
      state.status = PluginStatus.unInit;
      for await (const plugin of state.plugins) {
        const checkResult = this.checkPlugin(plugin);
        if (!checkResult.isSuccess) {
          message.toast(`插件加载错误, 错误原因：${checkResult?.errorContent}`);
          console.error(`插件加载错误, 错误原因：${checkResult?.errorContent}`);
          plugin.status = PluginStatus.error;
        }
        if (plugin.status === PluginStatus.unInit) {
          if (plugin.register) await plugin.register();
          plugin.status = PluginStatus.complete;
        }
      }
      state.status = PluginStatus.complete;
    } catch (err) {
      state.status = PluginStatus.error;
      message.toast('插件加载错误');
      console.error('插件加载错误', err);
    }
  },
  /** 校验插件 */
  checkPlugin(plugin: PluginInstance): { isSuccess: boolean, errorContent?: string } {
    return { isSuccess: true, errorContent: '' };
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