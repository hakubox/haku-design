//公共函数库
import * as common from '@/tools/common';
import { pageFilter, Breadcrumb, UserInfo, PagePagination } from '@/@types/basic.d';
//全局枚举
// import '@/config/enum';
import Axios, { AxiosInstance } from 'axios';
import { Component } from 'vue';
import { VueCookies } from 'vue-cookies';
import { number } from 'vue-types';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.png';

declare global {
  /** Monaco编辑器 */
  const monaco: any;
}

// Vue实例类型添加
declare module 'vue/types/vue' {
  interface VueConstructor {
    /** 当前组件权限 */
    permission: string | Array<string> | Function;
  }

  /** 系统级配置 */
  interface SysConfig {
    /** 系统标题 */
    TITLE: string;
  }

  interface Vue {
    _self: typeof Vue;
    /** 默认Axios实例接口（业务） */
    $cookie: VueCookies;
    /** 公共函数库 */
    $common: typeof common;
    /** 默认Axios实例接口（业务） */
    $axios: AxiosInstance;
    /** 表单设计器后端接口 */
    $api: AxiosInstance;
    /** 全局枚举 */
    // $emum: typeof sysEnum;
    /** EventBus */
    $bus: Vue;
    /** 设置主题 */
    $setTheme(code: string): void;
    /** 系统级配置 */
    $config: SysConfig;
    /** 当前组件权限 */
    permission: string | Array<string> | Function;

    /** 日期格式化 */
    dateFormat(date: string | Date, format?: string): string;
    /** [root]获取用户信息 */
    login(): void;
    /** [root]面包屑 */
    breadcrumbSource: Array<Breadcrumb>;
    /** [root]设置面包屑 */
    setBreadcrumb(arr: Array<Breadcrumb | string>): void;
    /** [root]获取分页器默认参数 */
    getPagination(config?: object): PagePagination;
  }
}
