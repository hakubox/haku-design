import { state as pluginState } from "./";
import type { PluginConfig, PluginInstance } from "./@types";
import { PluginLoadType, PluginStatus } from "./enum";
import { service as pluginService } from './';
import { createModelId } from '@/tools/common';
import message from "@/common/message";

/** 注册基础插件 */
export async function registerPlugin(plugin: PluginConfig) {
  const _plugin: PluginInstance = {
    ...plugin,
    id: createModelId(6),
    registerDate: Date.now(),
    status: PluginStatus.unInit,
    isEnable: true,
    userConfig: {},
    loadType: PluginLoadType.local,
  };

  try {
    const checkResult = pluginService.checkPlugin(_plugin);
    if (!checkResult.isSuccess) {
      message.toast(`插件加载错误, 错误原因：${checkResult?.errorContent}`);
      console.error(`插件加载错误, 错误原因：${checkResult?.errorContent}`);
    }
    if (_plugin.register) await _plugin.register();
    _plugin.status = PluginStatus.complete;
  } catch (err) {
    _plugin.status = PluginStatus.error;
    message.toast('插件加载错误');
    console.error('插件加载错误', err);
  }

  pluginState.plugins.push(_plugin);
}