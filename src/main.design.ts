import { createApp } from 'vue';
import globalStore from '@/common/global';
import { setLocaleData } from 'monaco-editor-nls';
import { changeConfig, serverConfig } from './config';
import Antd from 'ant-design-vue';
import Menus from 'vue3-menus';
import Vant from 'vant';
import App from './App.vue';
import router from './router';
import AntdIcon from '@/common/antd-icon';
import components from '@/common/register-global-components';
import directives from '@/directives';
import AntdZHCN from 'ant-design-vue/es/locale/zh_CN';

import '@vant/touch-emulator';
import 'vant/lib/index.less';
import '@/assets/less/main.less';
import type { ServerEnvironment } from './@types';
import { state as configState } from '@/common/config-module';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';
import '@/common/theme';

dayjs.locale(zhCN);
dayjs.extend(relativeTime);

globalStore.state.antdConfigProvider.locale = AntdZHCN;

// import zh_CN from 'monaco-editor-nls/locale/zh-hans.json';

import zhHans from 'monaco-editor-nls/locale/zh-hans.json';

import * as editorApi from 'monaco-editor/esm/vs/editor/editor.api';

import FilePicker from '@/modules/storage-module/component/file-picker/FilePicker.vue';

import FormulaEditor from '@/modules/formula-module/components/formula-editor/FormulaEditor.vue';

import ConfigDialog from '@/components/module/ConfigDialog.vue';

import packageInfo from '../package.json';

import { init as messageInit } from '@/common/message';

import { message, Modal } from 'ant-design-vue';

configState.ConfigDialog = ConfigDialog;

messageInit({ toastModule: message, confirmModule: Modal });

setLocaleData(zhHans);
window['monaco'] = editorApi;

window.addEventListener('load', () => {
  if (window.opener) {
    serverConfig.whiteList.forEach(path => {
      window.opener.postMessage({ msg: '加载完毕' }, path);
    });
  }
});

window.addEventListener('message', (event) => {
  if (!serverConfig.whiteList.includes(event.origin)) return;
  try {
    if (event.data.token) {
      localStorage.setItem('Authorization', event.data.token);
    }
    if (event.data.page) {
      router.push(event.data.page);
    } else {
      router.back();
    }
  } catch (error) {}
}, false);

const app = createApp(App);
globalStore.install(app, router);

// 安装组件
app.component('FilePicker', FilePicker);
app.component('ConfigDialog', ConfigDialog);
app.component('FormulaEditor', FormulaEditor);

changeConfig(process.env.VUE_APP_Environment as ServerEnvironment);

app.use(directives);
app.use(Menus);
app.use(components);
app.use(AntdIcon);

app.config.globalProperties.$message = message;
app.config.globalProperties.$packageInfo = packageInfo;

app.use(Vant).use(Antd).use(router).mount('#app');
