import { createApp } from 'vue';
import globalStore from '@/common/global';
import { setLocaleData } from 'monaco-editor-nls';
import { changeConfig, serverConfig } from './config';
import Menus from 'vue3-menus';
import Vant from 'vant';
import App from './App.vue';
import router from './router';
import AntdIcon from '@/common/antd-icon';
import components from '@/common/register-global-components';
import directives from '@/directives';
import AntdZHCN from 'ant-design-vue/es/locale/zh_CN';
import { message, Modal } from 'ant-design-vue';

import '@vant/touch-emulator';
import 'vant/lib/index.css';
import '@/assets/less/main.less';
import 'accessible-nprogress/dist/accessible-nprogress.min.css';
import type { ServerEnvironment } from './@types';
import { state as configState } from '@/modules/config-module';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';
import '@/common/theme';

// import zhHans from 'monaco-editor-nls/locale/zh-hans.json';

import FilePicker from '@/modules/storage-module/component/file-picker/FilePicker.vue';
import FormulaEditor from '@/modules/formula-module/components/formula-editor/FormulaEditor.vue';
import RulesEditor from '@/modules/validate-module/component/RulesEditor.vue';
import ConfigDialog from '@/components/module/ConfigDialog.vue';
import packageInfo from '../package.json';
import { init } from '@/lib/monitor';
import { service as pluginModule } from '@/modules/plugin-module';
import { init as messageInit } from '@/common/message';
import BackgroundEditor from '@/modules/background-editor-module/component/BackgroundEditor.vue';
// import { registerTestPlugin } from '@/plugin/test-plugin';
// import { registerLogoComponent } from '@/plugin/logo-component-plugin';
// import { registerImageEditor } from '@/plugin/image-editor-plugin';
// import { registerImageLoadedEventTrigger } from '@/plugin/image-loaded-event-trigger';

import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/less/less.contribution';
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// @ts-ignore
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// @ts-ignore
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// @ts-ignore
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';

configState.ConfigDialog = ConfigDialog;

const app = createApp(App);
init(app);

dayjs.locale(zhCN);
dayjs.extend(relativeTime);

globalStore.state.antdConfigProvider.locale = AntdZHCN;

messageInit({ toastModule: message, confirmModule: Modal });

window['MonacoEnvironment'] = {
  getWorker(_: string, label: string) {
    console.log('getWorker', label);
    if (label === 'typescript' || label === 'javascript') return new TsWorker();
    if (label === 'json') return new JsonWorker();
    if (label === 'css' || label === 'less') return new CssWorker();
    if (label === 'html') return new HtmlWorker();
    return new EditorWorker();
  },
};

// setLocaleData(zhHans);
// window['monaco'] = editorApi;
// window['monacoEditor'] = monaco;

window.addEventListener('load', () => {
  if (window.opener) {
    serverConfig.whiteList.forEach((path) => {
      window.opener.postMessage({ msg: '加载完毕' }, path);
    });
  }
});

window.addEventListener(
  'message',
  (event) => {
    if (!serverConfig.whiteList.includes(event.origin)) return;
    try {
      if (event.data.token) {
        localStorage.setItem('Authorization', event.data.token);
      }
      if (event.data.url) {
        router.push(event.data.url);
      } else {
        router.back();
      }
    } catch (error) {}
  },
  false,
);

globalStore.install(app, router);

// 安装组件
app.component('FilePicker', FilePicker);
app.component('ConfigDialog', ConfigDialog);
app.component('FormulaEditor', FormulaEditor);
app.component('RulesEditor', RulesEditor);
app.component('BackgroundEditor', BackgroundEditor);

changeConfig(process.env.Environment as ServerEnvironment);

app.use(directives);
Menus(app, { name: 'vue3-menus' });
app.use(components);
app.use(AntdIcon);

app.config.globalProperties.$message = message;
app.config.globalProperties.$packageInfo = packageInfo;

app.use(Vant).use(router).mount('#app');

// 加载测试插件
// registerTestPlugin();
// registerLogoComponent();
// registerImageEditor();
// registerImageLoadedEventTrigger();

pluginModule.onInit();
