import { state as pluginState, type PluginInstance, type PluginConfig } from "./";

/** 注册插件 */
export async function registerPlugin(plugin: PluginConfig) {
  const _plugin: PluginInstance = {
    ...plugin,
    isInit: false
  };
  pluginState.plugins.push(_plugin);
  if (pluginState.isInit) {
    if (_plugin.register) await _plugin.register();
    _plugin.isInit = true;
  }
}