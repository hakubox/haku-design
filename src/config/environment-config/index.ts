import axios from 'axios';
import { reactive } from 'vue';
import type { ServerConfig, ServerEnvironment } from '@/@types';

let _config: ServerConfig;
/** 是否初始化 */
let _isInit = false;

/** 切换全局配置 */
export function changeConfig(environment: ServerEnvironment) {
  _config = reactive({
    subject: process.env.subject as string,
    environment: process.env.buildMode as 'development' | 'test' | 'production',
    apiSrc: process.env.serverApi as string,
    whiteList: (process.env.whiteList || '').split(',') as string[]
  });
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
