import axios from 'axios';
import { reactive } from 'vue';
import type { ServerConfig, ServerEnvironment } from '@/@types';
import { serverConfig as developmentServerConfig } from './environment/development';
import { serverConfig as testServerConfig } from './environment/test';
import { serverConfig as productionServerConfig } from './environment/production';

let _config: ServerConfig;
/** 是否初始化 */
let _isInit = false;

/** 切换全局配置 */
export function changeConfig(environment: ServerEnvironment) {
  let _serverConfig: ServerConfig;
  switch (environment) {
    case 'development':
      _serverConfig = developmentServerConfig;
      break;
    case 'test':
      _serverConfig = testServerConfig;
      break;
    case 'production':
      _serverConfig = productionServerConfig;
      break;
    default:
      _serverConfig = developmentServerConfig;
      break;
  }
  _config = reactive(_serverConfig);
  _isInit = true;
  /** 设置axios默认访问地址 */
  axios.defaults.baseURL = _config.apiSrc;
}

/** 当前环境配置 */
export const serverConfig = {
  get apiSrc() {
    return _config.apiSrc;
  },
  get whiteList() {
    return _config.whiteList;
  },
  get serverConfig() {
    if (!_isInit || !_config) {
      throw new Error('环境尚未初始化');
    }
    return _config;
  },
};
