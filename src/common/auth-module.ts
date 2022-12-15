import { login, logout, getInfo } from '@/api/common/auth';
import { reactive } from 'vue';
import { removeToken, setToken } from '@/lib/api';
import { toast } from './message';
import { state as globalState } from '@/common/global';
import type { NavigationFailure } from 'vue-router';
import NProgress from 'nprogress';
import mobile from 'is-mobile';

/** 用户模块状态 */
export const state = reactive({
  /** 用户信息 */
  userInfo: {
    /** Id */
    id: '--' as string | undefined,
    /** 昵称 */
    nickName: '' as string | undefined,
    /** 用户名 */
    name: '',
    /** 头像 */
    avatar: '',
    /** 角色列表 */
    roles: [] as string[],
  },
  /** 当前页面标题 */
  currentPageTitle: '',
  /** 当前页面副标题 */
  currentPageSubTitle: '',
  /** 排除页面（非登录页面） */
  excludePage: ['/login', '/register', '/404', '/401', '/auth-redirect', '/bind'],
  /** 当前是否为移动端 */
  isMobile: mobile(),
  /** 当前用户的权限列表 */
  permissions: [] as string[],
});

/** 用户模块逻辑 */
export const service = {
  /** 是否已登录 */
  async isLogin() {
    return !!localStorage.getItem('Authorization');
  },
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
        toast('页面跳转失败', 'warning');
      }
    } catch (error) {
      NProgress.done();
      toast('页面跳转失败', 'error');
    }
  },
  /** 清理用户信息 */
  clearUserInfo() {
    state.userInfo.id = undefined;
    localStorage.removeItem('Authorization');
  },
  /** 登录 */
  login(userInfo: { username: string; password: string; code?: string }): Promise<void> {
    const username = userInfo.username.trim();
    const { password, code } = userInfo;
    return new Promise((resolve, reject) => {
      login(username, password, code)
        .then((data) => {
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  /** 获取当前用户信息 */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((res: any) => {
          const { user } = res;
          // const avatar = user.avatar === '' ? () => import('@/assets/img/user-head-default.png') : user.avatar;
          if (res.roles && res.roles.length > 0) {
            state.userInfo.roles = res.roles;
            state.permissions = res.permissions;
          } else {
            state.userInfo.roles = ['ROLE_DEFAULT'];
          }
          state.userInfo.name = user.userName;
          // state.userInfo.avatar = avatar;
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  /** 登出 */
  logout(): Promise<void> {
    // return new Promise((resolve) => { resolve(); });
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          state.userInfo.roles = [];
          state.permissions = [];
          globalState.router.push('/login');
          removeToken();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  /** 前端 登出 */
  FedLogOut(): Promise<void> {
    return new Promise((resolve) => {
      removeToken();
      resolve();
    });
  },
}

export default {
  state,
  service
}