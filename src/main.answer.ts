import { createApp } from 'vue';
import globalStore from '@/common/global';
import { changeConfig, serverConfig } from './config';
import App from './App.answer.vue';
import router from './packages/answer/router';
import components from '@/packages/answer/common/register-global-components';

import '@vant/touch-emulator';
import 'vant/lib/index.less';
import '@/packages/answer/assets/less/main.less';
import 'accessible-nprogress/dist/accessible-nprogress.min.css';
import type { ServerEnvironment } from './@types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';

import scoringStore from '@/modules/scoring-module';
import { service as answerScoringService } from './modules/scoring-module';
import authStore from '@/common/auth-module';
import { service as answerAuthService } from '@/packages/answer/modules/auth-module';

import { init as messageInit } from '@/common/message';

import { Toast, Dialog } from 'vant';

messageInit({ toastModule: Toast, confirmModule: Dialog });

/** @ts-ignore */
scoringStore.service = answerScoringService;
/** @ts-ignore */
authStore.service = answerAuthService;

dayjs.locale(zhCN);
dayjs.extend(relativeTime);

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

changeConfig(process.env.Environment as ServerEnvironment);

app.use(components);

app.use(router).mount('#app');