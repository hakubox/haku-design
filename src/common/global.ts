import { type App, reactive } from 'vue';
import mobile from 'is-mobile';
import { Router } from 'vue-router';

/** 全局模块状态 */
export const state = {
  app: {} as App<Element>,
  router: {} as Router,
  /** 用户信息 */
  userInfo: {
    /** Id */
    id: undefined as string | undefined,
    /** 昵称 */
    nickName: '' as string | undefined,
    /** 用户名 */
    name: '',
    /** 头像 */
    avatar: '',
    /** 角色列表 */
    roles: [] as string[],
  },
  /** 当前是否为移动端 */
  isMobile: false,
  /** 当前用户的权限列表 */
  permissions: [] as string[],
  /** antd的config-provide组件配置 */
  antdConfigProvider: {
    locale: {} as any,
  }
};

/** 全局模块逻辑 */
export const service = {
  /** 校验是否为移动端 */
  checkIsMobile() {
    if (mobile()) {
      document.body.classList.add('mobile');
      state.isMobile = true;
      return true;
    } else {
      document.body.classList.remove('mobile');
      state.isMobile = false;
      return false;
    }
  },
};

/** 全局模块 */
export default {
  /** 全局模块状态 */
  state,
  /** 全局模块逻辑 */
  service,
  /** 设置App */
  install(app: App<Element>, router) {
    state.app = app as unknown as typeof state.app;
    state.router = router;
  }
};
