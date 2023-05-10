import { VarType } from "@/@types/enum";
import { defineCommand } from "@/data/form-commands";
import { state as editorState, service as editorService } from '@/modules/editor-module';

import '@/assets/theme/theme-default/index.lazy.less';
import '@/assets/theme/theme-dark/index.lazy.less';
import '@/assets/theme/theme-translucent/index.lazy.less';

/** 切换编辑器主题（非客户端主题） */
const toggleTheme = (loc: { x: number, y: number }, themeCode: 'default' | 'dark' | 'translucent') => {
  if (themeCode === editorState.appConfig.designConfig.themeCode) return;
  
  const x = loc.x;
  const y = loc.y;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  let _isReverse = false;

  const transition = document['startViewTransition'](() => {
    if (editorState.appConfig.designConfig.prevThemeCode === themeCode) {
      _isReverse = true;
      editorState.appConfig.designConfig.prevThemeCode = themeCode;
    } else {
      editorState.appConfig.designConfig.prevThemeCode = editorState.appConfig.designConfig.themeCode;
    }
    const root = document.documentElement;
    
    if (_isReverse) root.classList.add(`reverse`);
    else root.classList.remove(`reverse`);
    root.classList.remove(`theme-${editorState.appConfig.designConfig.themeCode}`);
    root.classList.add(`theme-${themeCode}`);
    editorState.appConfig.designConfig.themeCode = themeCode;
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate({
      clipPath: _isReverse ? clipPath.reverse() : clipPath, // 
    }, {
      duration: 400,
      easing: "ease-in",
      pseudoElement: _isReverse ? "::view-transition-old(root)" : "::view-transition-new(root)",
    });
  });
};

defineCommand({
  name: 'change-theme',
  description: '修改系统主题',
  icon: 'iconfont icon-theme',
  format: '修改为{{themeTitle}}',
  updatable: true,
  objectType: 'global',
  propertys: {
    themeTitle: { type: VarType.string, required: true },
    event: { type: VarType.object, required: true },
  },
  async exec(command) {
    command.oldVal = editorState.appConfig.designConfig.themeCode;
    toggleTheme(command.attrs.event as { x: number, y: number }, command.newVal);
  },
  undo(command) {
    editorState.appConfig.designConfig.themeCode = command.oldVal;
    toggleTheme(command.attrs.event as { x: number, y: number }, command.oldVal);
  },
});
