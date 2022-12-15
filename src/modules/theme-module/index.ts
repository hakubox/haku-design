import { render } from 'less/lib/less/render';
import type { ThemeConfig } from './@types';
import { themePropertys } from './data/theme-propertys';
import { cloneLoop } from '@/lib/clone';
import { themeList } from './data/theme-list';
import { computed, reactive } from 'vue';
import { toast } from '@/common/message';

/** 主题模块状态 */
export const state = reactive({
  /** 变量 */
  variableMap: {
    
  },
  /** 主题列表 */
  themeList: themeList,
  /** 主题配置 */
  themeConfig: {

  } as ThemeConfig,
  /** 当前主题名称 */
  currentThemeCode: 'theme-default',
  /** 当前主题 */
  currentTheme: computed<ThemeConfig | undefined>(() => {
    return state.themeList.find(i => i.code === state.currentThemeCode);
  }),
});

/** 变量模块逻辑 */
export const service = {
  /** 加载主题 */
  changeTheme(theme?: string | ThemeConfig) {
    if (theme === undefined || typeof theme === 'string') {
      if (theme) state.currentThemeCode = theme;
      const _index = state.themeList.findIndex(i => i.code === state.currentThemeCode);
      if (_index >= 0) {
        state.themeConfig = cloneLoop(state.themeList[_index]);
        themePropertys.forEach(prop => {
          if (prop.default && !state.themeConfig[prop.name as string]) {
            state.themeConfig[prop.name as string] = typeof prop.default === 'function' ? prop.default() : prop.default;
          }
          if (prop.attrs?.cssVariable && state.themeConfig[prop.name as string]) {
            service.setVariable(prop.attrs?.cssVariable, state.themeConfig[prop.name as string]);
          }
          if (prop.name === 'css') {
            service.loadCSS(state.themeConfig[prop.name]);
          }
        });
      } else {
        throw new Error('根据Id未查询到主题');
      }
    } else {
      state.themeConfig = cloneLoop(theme);
      themePropertys.forEach(prop => {
        if (prop.default && !state.themeConfig[prop.name as string]) {
          state.themeConfig[prop.name as string] = typeof prop.default === 'function' ? prop.default() : prop.default;
        }
        if (prop.attrs?.cssVariable && state.themeConfig[prop.name as string]) {
          service.setVariable(prop.attrs?.cssVariable, state.themeConfig[prop.name as string]);
        }
        if (prop.name === 'css') {
          service.loadCSS(state.themeConfig[prop.name]);
        }
      });
    }
  },
  /** 加载CSS */
  loadCSS(css: string) {
    render(css).then((val) => {
      document.querySelector('[formfill-theme-style]')?.remove();
      const _style = document.createElement('style') as HTMLStyleElement;
      _style.setAttribute('formfill-theme-style', '');
      _style.innerHTML = val.css;
      document.body.appendChild(_style);
    }).catch(err => {
      toast('LESS代码编译出错', 'error');
      // notification.error({
      //   message: 'LESS代码编译出错',
      //   description: err.message,
      // });
      console.error('CSS样式错误', err);
    });
  },
  /** 设置变量 */
  setVariable(key: string, value: string) {
    document.documentElement.style.setProperty(key.startsWith('--') ? key : `--${key}`, value);
  },
  /** 远程加载主题列表 */
  loadThemeList() {

  },
  /** 设置主题 */
  setTheme(theme: ThemeConfig) {

  },
  /** 根据当前主题重设（重新从远程加载当前主题） */
  resetTheme() {

  },
  /** 清除当前主题 */
  clearTheme() {

  }
};

export default {
  state,
  service,
}