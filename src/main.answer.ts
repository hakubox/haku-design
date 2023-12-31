import { createApp } from 'vue';
import globalStore from '@/common/global';
import { changeConfig, serverConfig } from './config';
import App from './App.user.vue';
import router from './packages/user/router';
import components from '@/packages/user/common/register-global-components';

import '@vant/touch-emulator';
import 'vant/lib/index.css';
import '@/packages/user/assets/less/main.less';
import 'accessible-nprogress/dist/accessible-nprogress.min.css';
import type { ServerEnvironment } from './@types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';

import scoringStore from '@/modules/scoring-module';
import { service as userScoringService } from './modules/scoring-module';
import authStore from '@/common/auth-module';
import { service as userAuthService } from '@/packages/user/modules/auth-module';

import { init as messageInit } from '@/common/message';

import { showToast, Dialog } from 'vant';

messageInit({ toastModule: showToast, confirmModule: Dialog });

scoringStore.service = {
  ...scoringStore.service,
  ...userScoringService
};
authStore.service = {
  ...authStore.service,
  ...userAuthService
};

dayjs.locale(zhCN);
dayjs.extend(relativeTime);

window.addEventListener('load', () => {
  if (window.opener) {
    serverConfig.whiteList.forEach(path => {
      window.opener.postMessage({ event: 'onload', msg: '加载完毕' }, path);
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

changeConfig(process.env.Environment as ServerEnvironment);

app.use(components);

app.use(router).mount('#app');