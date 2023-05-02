import { VarType } from "@/@types/enum";
import { defineCommand } from "@/data/form-commands";
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as themeState } from '@/modules/theme-module';

// @ts-ignore
import defaultTheme from '@/assets/theme/theme-default/index.lazy.less?inline';
// @ts-ignore
import darkTheme from '@/assets/theme/theme-dark/index.lazy.less?inline';
// @ts-ignore
import translucentTheme from '@/assets/theme/theme-translucent/index.lazy.less?inline';

const themes = {
  'theme-default': defaultTheme,
  'theme-dark': darkTheme,
  'theme-translucent': translucentTheme,
}

defineCommand({
  name: 'change-theme',
  description: '修改系统主题',
  icon: 'iconfont icon-theme',
  format: '修改为{{themeTitle}}',
  updatable: true,
  objectType: 'global',
  propertys: {
    themeTitle: { type: VarType.string, required: true },
  },
  async exec(command) {
    command.oldVal = editorState.appConfig.formTheme;
    editorState.appConfig.formTheme = command.newVal;
    themeState.currentThemeCode = `theme-${command.newVal}`;
    document.documentElement.className = `theme-${command.newVal}`;

    document.head.querySelector(`[name='design-theme']`)?.remove();
    const _dom = document.createElement('style');
    _dom.setAttribute('name', 'design-theme');
    _dom.setAttribute('type', 'text/css');
    _dom.innerHTML = themes[`theme-${command.newVal}`];
    document.head.appendChild(_dom);
  },
  undo(command) {
    editorState.appConfig.formTheme = command.oldVal;
    themeState.currentThemeCode = `theme-${command.oldVal}`;
    document.documentElement.className = `theme-${command.newVal}`;
    
    document.head.querySelector(`[name='design-theme']`)?.remove();
    const _dom = document.createElement('style');
    _dom.setAttribute('name', 'design-theme');
    _dom.setAttribute('type', 'text/css');
    _dom.innerHTML = themes[`theme-${command.oldVal}`];
    document.head.appendChild(_dom);
  },
});