import { VarType } from "@/@types/enum";
import { defineCommand } from "@/data/form-commands";
import { state as editorState, service as editorService } from '@/modules/editor-module';

const themeCache: Record<string, () => Promise<unknown>> = {};

const themes = Object.values(import.meta.glob([
  '@/assets/theme/theme-default/index.lazy.less',
  '@/assets/theme/theme-dark/index.lazy.less',
  '@/assets/theme/theme-translucent/index.lazy.less'
]));

const themeAction = {
  /** 默认主题 */
  default() {
    if (!themeCache.default) {
      themeCache.default = themes[0];
    }
    return themeCache.default;
  },
  /** 深色主题 */
  dark() {
    if (!themeCache.dark) {
      themeCache.dark = themes[1];
    }
    return themeCache.dark;
  },
  /** 半透明主题 */
  translucent() {
    if (!themeCache.translucent) {
      themeCache.translucent = themes[2];
    }
    return themeCache.translucent;
  },
};

/** 当前主题 */
let currentTheme: Array<any> = [];

/** 设置主题 */
async function setTheme(theme) {
  if (themeAction[theme]) {
    const style = await themeAction[theme]()();
    currentTheme.forEach((i) => i.default.unuse());
    style.default.use();
    currentTheme = style;
  }
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
  exec(command) {
    command.oldVal = editorState.appConfig.formTheme;
    editorState.appConfig.formTheme = command.newVal;
    setTheme(command.newVal);
  },
  undo(command) {
    editorState.appConfig.formTheme = command.oldVal;
    setTheme(command.oldVal);
  },
});

export default setTheme;
