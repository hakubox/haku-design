import { state as globalState } from '@/common/global';
import { NavigationFailure } from 'vue-router';
import NProgress from 'nprogress';
import { Toast } from 'vant';

/** 评分模块 */
export const service = {
  /** 页面跳转函数 */
  async turnPage(page: string) {
    try {
      let _navigationResult: void | NavigationFailure | undefined;
      if (page.startsWith('http')) {
        window.open(page);
      } else {
        await globalState.router.push(page);
      }
      if (_navigationResult) {
        NProgress.done();
        Toast({
          type: 'fail', 
          message: '页面跳转失败'
        });
      }
    } catch (error) {
      NProgress.done();
      Toast({
        type: 'fail', 
        message: '页面跳转失败'
      });
    }
  },
};