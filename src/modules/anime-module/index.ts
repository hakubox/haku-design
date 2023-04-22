import { reactive } from 'vue';
import { SimpleAnimeConfig } from './@types';

export { simpleAnimeList } from './data/simple-anime';

// http://cssanimation.io/index.html

/** 动画模块状态 */
export const state = reactive({
  /** 已绑定动画 */
  simpleAnimeConfig: {
    
  } as SimpleAnimeConfig,
});

/** 动画模块逻辑 */
export const service = {
}

export default {
  state,
  service
}