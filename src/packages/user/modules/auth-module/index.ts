import { state as globalState } from '@/common/global';
import { NavigationFailure } from 'vue-router';
import NProgress from 'accessible-nprogress';
import { toast } from '@/common/message';

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
        toast('页面跳转失败', 'error');
      }
    } catch (error) {
      NProgress.done();
      toast('页面跳转失败', 'error');
    }
  },
};