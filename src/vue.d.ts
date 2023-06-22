import type { Component } from 'vue';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
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
}

declare module '*.png';

declare global {
  /** Monaco编辑器 */
  const monaco: any;
  /** 图像处理库 */
  const AlloyImage: any;
}
