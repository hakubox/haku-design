import type { PluginInfo, PluginInstance } from "./@types";
import { PluginLoadType, PluginStatus } from "./enum";
import { state as pluginState, service as pluginService } from '@haku-design/plugin';
import { message, createModelId } from '@haku-design/common';

/** 注册基础插件 */
export async function registerPlugin(plugin: PluginInfo) {
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
    // 插件重复安装
    if (pluginState.plugins.findIndex(i => i.name === plugin.name) >= 0) {
      message.toast(`插件[${plugin.name}]重复安装`);
      console.error(`插件[${plugin.name}]重复安装`);
      return;
    }
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

/** 注册远程插件 */
export async function registerRemotePlugin(
  /** 远程插件-Url地址 */
  url: string,
  /** 远程插件-额外信息 */
  extraInfo?: {
    /** 插件名 */
    name: string,
    /** 作者 */
    author: string,
    /** 版本号 */
    version: string,
    /** 主页地址 */
    pagehome: string,
  }
) {
  throw new Error('暂未实现');
}

/** 注册插件市场插件 */
export async function registerMarketPlugin(
  /** 插件市场-插件Id */
  marketPluginId: string
) {
  throw new Error('暂未实现');
}