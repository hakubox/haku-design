import Answer from './components/AnswerCanvas.vue';
import answerComponents from '@/packages/answer/common/register-global-components';
import { Toast, Dialog } from 'vant';
import './assets/less/main.less';
import 'vant/lib/index.css';
import { init as messageInit } from '@/common/message';

messageInit({ toastModule: Toast, confirmModule: Dialog });

export function install(vue) {
  if (install['installed']) return;
  // vue.use(Vant);
  vue.use(answerComponents);
};

export const AnswerCanvas = Answer;

//  全局引用可自动安装
if (window?.['Vue']) {
  install(window['Vue']);
}

export default {
  install,
  AnswerCanvas,
};