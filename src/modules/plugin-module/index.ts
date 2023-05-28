import { reactive, computed } from 'vue';
import type { PluginInstance, PluginDependency } from './index.d';
import message from '@/common/message';
import { PluginType, PluginStatus } from './enum';
import { compareVersion } from '@/tools/common';

export * from './index.d';
export * from './enum';
export * from './register-plugin';
export * from './register-component';
export * from './register-editor';
export * from './register-event';

/** 插件模块状态 */
export const state = reactive({
  /** 获取插件分类信息 */
  typeCategorys: {
    /** 工具栏组件 */
    component: {
      name: 'component',
      label: '工具栏组件',
      icon: 'iconfont icon-box3',
    },
    /** 事件触发 */
    eventTrigger: {
      name: 'event-trigger',
      label: '事件触发',
      icon: 'iconfont icon-rule',
    },
    /** 事件行为 */
    eventAction: {
      name: 'event-action',
      label: '事件行为',
      icon: 'iconfont icon-rule',
    },
    /** 配置 */
    config: {
      name: 'config',
      label: '配置',
      icon: 'iconfont icon-box3',
    },
    /** 菜单工具栏 */
    menuComponentItem: {
      name: 'menu-component-item',
      label: '菜单工具栏',
      icon: 'iconfont icon-box3',
    },
    /** 基础插件 */
    basicPlugin: {
      name: 'basic-plugin',
      label: '基础插件',
      icon: 'iconfont icon-plugin'
    },
  } as Record<string, { name: string, label: string, icon: string }>,
  /** 插件列表 */
  plugins: [] as PluginInstance[],
  /** 当前状态 */
  status: 'un-init' as PluginStatus,
});

/** 插件模块逻辑 */
export const service = {
  /** 获取所有依赖项 */
  getAllDependencies(): PluginDependency[] {
    const _dependencies = state.plugins.map(plugin => plugin.dependencies ?? ([] as PluginDependency[]));
    return ([] as PluginDependency[]).concat.apply([], _dependencies);
  },
  /** 远程获取插件被依赖项 */
  async getDependenciesByPlugin(pluginName: string): Promise<PluginDependency[]> {
    throw new Error('功能未完成');
  },
  /** 远程获取插件被依赖项 */
  async getDependentsByPlugin(pluginName: string): Promise<PluginDependency[]> {
    throw new Error('功能未完成');
  },
  /** 整体插件模块初始化 */
  async onInit() {
    try {
      state.status = PluginStatus.unInit;
      for await (const plugin of state.plugins) {
        const checkResult = this.checkPlugin(plugin);
        if (!checkResult.isSuccess) {
          message.toast(`插件加载错误, 错误原因：${checkResult.errorContent}`);
          console.error(`插件加载错误, 错误原因：${checkResult.errorContent}`);
          plugin.status = PluginStatus.error;
        }
        if (plugin.status === PluginStatus.unInit) {
          if (plugin.register) await plugin.register();
          plugin.status = PluginStatus.complete;
        }
      }
      state.status = PluginStatus.complete;
    } catch (err) {
      state.status = PluginStatus.error;
      message.toast('插件加载错误');
      console.error('插件加载错误', err);
    }
  },
  /** 移除插件 */
  removePlugin(plugin: PluginInstance) {
    this.disabledPlugin(plugin.name);
    const _pluginIndex = state.plugins.findIndex(i => i.id === plugin.id);
    if (_pluginIndex >= 0) {
      state.plugins.splice(_pluginIndex, 1);
    }
  },
  /** 启用插件 */
  enablePlugin(pluginName: string) {
    const _plugin = state.plugins.find(i => i.name === pluginName);
    if (_plugin) {
      if (_plugin.isEnable) return;
      _plugin.dependencies?.forEach(dependenciesPlugin => {
        this.enablePlugin(dependenciesPlugin.pluginName);
      });
      _plugin.register?.();
      _plugin.isEnable = true;
    } else {
      throw new Error(`未查询到插件 [${pluginName}]`);
    }
  },
  /** 禁用插件 */
  disabledPlugin(pluginName: string) {
    const _plugin = state.plugins.find(i => i.name === pluginName);
    if (_plugin) {
      if (!_plugin.isEnable) return;
      _plugin.dependencies?.forEach(dependenciesPlugin => {
        this.disabledPlugin(dependenciesPlugin.pluginName);
      });
      _plugin.unRegister?.();
      _plugin.isEnable = false;
    } else {
      throw new Error(`未查询到插件 [${pluginName}]`);
    }
  },
  /** 启用/禁用插件 */
  togglePlugin(plugin: PluginInstance, enable: boolean) {
    if (plugin.isEnable === enable) return;
    if (!enable) {
      this.disabledPlugin(plugin.name);
      message.toast('插件已关闭');
    } else {
      this.enablePlugin(plugin.name);
      message.toast('插件已开启');
    }
  },
  /** 校验插件 */
  checkPlugin(plugin: PluginInstance) {
    let _checkResult: { isSuccess: true } | { pluginId: string, isSuccess: false, errorContent: string } = { isSuccess: true };

    /**
     * 1.   校验插件是否已弃用
     * 2.   校验所有依赖项是否已安装
     * 2.1. 校验当前依赖项版本号是否达到要求
     */
    if (plugin.deprecated === false) {
      _checkResult = {
        pluginId: plugin.id,
        errorContent: '当前插件已过期或弃用',
        isSuccess: false
      };
    }

    // 后续会收集所有相关依赖项来判断版本号
    for (let i = 0; i < state.plugins.length; i++) {
      const _plugin = state.plugins[i];
      if (_plugin.dependencies) {

      }
    }
    if (!compareVersion('99.0.0', plugin.version)) {
      _checkResult = {
        pluginId: plugin.id,
        errorContent: `当前插件版本号[${plugin.version}]过低，请尽快升级`,
        isSuccess: false
      };
    }

    return _checkResult;
  },
  /** APP加载事件 */
  onAppLoad() {
    state.plugins.forEach(async plugin => {
      if (plugin.onloadApp) await plugin.onloadApp();
    });
  },
};

export default {
  /** 插件模块状态 */
  state,
  /** 插件模块逻辑 */
  service,

  install() {
    service.onInit();
  }
};