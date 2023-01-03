import { loadComponent, destoryComponent } from '@/lib/component-loader';
import { timeout } from '@/tools/common';
import { computed, ConcreteComponent, reactive } from 'vue';
import type { GlobalSearchGroupInstance, GlobalSearchItem } from './@types';
import GlobalSearchVue from './components/GlobalSearch.vue';
import { getSearchItems } from './data/search-items';
import { service as hotkeyService } from '@/modules/hotkey-module';

/** 组件DOM */
let _container;

/** 全局搜索模块状态 */
export const state = reactive({
  /** 查询字符串 */
  searchTxt: '',
  /** 是否开启 */
  isOpen: false,
  /** 是否展开列表项 */
  isExtend: false,
  /** 是否加载中 */
  isLoading: false,
  /** 分组实例 */
  groupList: [
    { name: 'guide', title: '引导', icon: 'iconfont icon-guide' },
    { name: 'function', title: '功能', icon: 'iconfont icon-app2' },
    { name: 'components', title: '组件', icon: 'iconfont icon-box3' }, // icon-box2
    { name: 'event', title: '事件', icon: 'iconfont icon-rule' },
    { name: 'theme', title: '主题', icon: 'iconfont icon-theme' },
    { name: 'variable', title: '变量', icon: 'iconfont icon-code1' },
    { name: 'config', title: '配置项', icon: 'iconfont icon-config2' }, // icon-rule / icon-zidingyi
    { name: 'plugin', title: '插件', icon: 'iconfont icon-plugin' },
  ] as GlobalSearchGroupInstance[],
  /** 查询历史 */
  searchHistory: [] as string[],
  /** 结果列表 */
  resultList: [] as GlobalSearchItem[],
  /** 查询可显示组列表 */
  searchGroupList: computed((): GlobalSearchGroupInstance[] => {
    const _groupList = state.groupList;
    if (_groupList?.length) {
      return _groupList.filter((i) => state.resultList.find((o) => o.group === i.name));
    }
    return [];
  }),
});

/** 全局搜索模块逻辑 */
export const service = {
  /** 搜索结果列表 */
  async search(txt?: string) {
    const _txt = txt || state.searchTxt || '';
    state.isLoading = true;
    if (!_txt.trim()?.length) state.resultList = [];
    else {
      await timeout(300);
      state.resultList = getSearchItems.value.filter((item) => {
        if (item.title.toLowerCase().includes(_txt.toLowerCase())) return true;
        else if (item.crumbs.some(crumb => crumb.label.toLowerCase().includes(_txt.toLowerCase()))) return true;
        else if (item.description?.toLowerCase().includes(_txt.toLowerCase())) return true;
        else if (item.alias?.some(alias => alias.toLowerCase().includes(_txt.toLowerCase()))) return true;
        return false;
      });
    }
    state.isLoading = false;
  },
  /** 清空列表 */
  clearList() {
    state.resultList = [];
  },
  open() {
    _container = loadComponent(GlobalSearchVue as ConcreteComponent, {
      onClose() {
        destoryComponent(_container);
        _container = undefined;
      },
    }).dom;
    state.isOpen = true;
  },
  close() {
    state.isOpen = false;
    destoryComponent(_container);
    _container = undefined;
    service.clearList();
  },
  /** 标记组件 */
  markElement(el: string | HTMLElement) {
    const ele = typeof el === 'string' ? document.querySelector(el) : el;
    console.log('ele', ele);
  },
  /** 打开提示 */
  openTooltip() {},
  /** 清空提示 */
  clearTooltip() {},
  /** 跳转到 */
  jumpTo(el: HTMLElement) {},
};

hotkeyService.createHotkey('ctrl+p,ctrl+h', { scope: 'all' }, (keyBoard, hotKeys) => {
  if (!state.isOpen) service.open();
  return false;
});

export default {
  state,
  service
}