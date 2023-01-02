
import { state as configState } from '@/common/config-module';

/** 
 * 引入全局配置
 * @deprecated 未完成
 */
export function importConfig(configName: string, defaultValue: any = '') {
  configState.config[configName] = defaultValue;
}