
import { PluginConfig } from './@types';
import { state as configState } from '@/common/config-module';
import { registerPlugin } from './register-plugin';
import { PluginLoadType, PluginType } from './enum';

/** 
 * 引入全局配置
 * @deprecated 未完成
 */
export function importConfig(plugin: PluginConfig, configName: string, defaultValue: any = '') {
  registerPlugin({
    ...plugin,
    icon: plugin?.icon ?? 'iconfont icon-box3',
    pluginType: PluginType.component,
  });
  configState.config[configName] = defaultValue;
}