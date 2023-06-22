import { createApp } from 'vue';
import globalStore from '@/common/global';
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
import type { ServerEnvironment } from '@haku-design/core';
import { state as configState } from '@/modules/config-module';
import { Select, SelectOption } from 'ant-design-vue';
import ChartModule from '@/plugin/chart-plugin';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';
import '@/common/theme';

import FilePicker from '@/modules/storage-module/component/file-picker/FilePicker.vue';
import FormulaEditor from '@/modules/formula-module/components/formula-editor/FormulaEditor.vue';
import RulesEditor from '@/modules/validate-module/component/RulesEditor.vue';
import ConfigDialog from '@/components/module/ConfigDialog.vue';
import packageInfo from '../package.json';
import { init } from '@/lib/monitor';
import pluginModule from '@/modules/plugin-module';
import { init as messageInit } from '@/common/message';
import BackgroundEditor from '@/modules/background-editor-module/component/BackgroundEditor.vue';

configState.ConfigDialog = ConfigDialog;

const app = createApp(App);
init(app);

app.component('ASelect', Select);
app.component('ASelectOption', SelectOption);

dayjs.locale(zhCN);
dayjs.extend(relativeTime);

globalStore.state.antdConfigProvider.locale = AntdZHCN;

messageInit({ toastModule: message, confirmModule: Modal });

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
// app.use(TestPlugin);
// app.use(LogoComponent);
// app.use(ImageEditor);
// app.use(ImageLoadedEventTrigger);

app.use(pluginModule);
app.use(ChartModule);