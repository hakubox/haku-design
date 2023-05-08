import { reactive, inject, App } from 'vue';
import hotkeys, { KeyHandler } from 'hotkeys-js';

/** 按键项 */
export interface HotkeyItem {
  /** 按键 */
  keys: string;
  /** 热键配置 */
  config: Options;
  /** 回调函数 */
  method: KeyHandler;
}

/** 热键配置 */
export interface Options {
  /** 作用域 */
  scope?: string;
  /** DOM节点 */
  element?: HTMLElement | null;
  /** 是否开启KeyUp */
  keyup?: boolean | null;
  /** 是否开启KeyDown */
  keydown?: boolean | null;
  /** 是否捕获？ */
  capture?: boolean;
  /** 分隔符（默认+） */
  splitKey?: string;
}

/** 热键模块状态 */
export const state = reactive({
  /** 作用域列表 */
  scopeList: [] as string[],
  /** 热键列表 */
  hotkeyList: [] as HotkeyItem[],
});

/** 热键模块逻辑 */
export const service = {
  /** 创建新热键 */
  createHotkey(keys: string, config: Options, method: KeyHandler) {
    hotkeys(keys, config, method);
    if (config.scope) {
      state.scopeList.push(config.scope);
    }
    state.hotkeyList.push({ keys, config, method });
  },
  /** 删除热键 */
  removeHotkey(keys: string, scope: string = 'all') {
    if (!scope) {
      scope = hotkeys.getScope();
    }
    hotkeys.unbind(keys, scope);
    const _count = state.hotkeyList.filter(i => i?.config?.scope === scope).length;
    if (_count === 1) {
      const _scopeIndex = state.hotkeyList.findIndex(i => i?.config?.scope === scope);
      state.scopeList.splice(_scopeIndex, 1);
    }
    const _hotkeyIndex = state.hotkeyList.findIndex(i => i.keys === keys);
    state.hotkeyList.splice(_hotkeyIndex, 1);
  }
};

hotkeys.filter = function(event) {
  return true;
}

export default {
  state,
  service
}