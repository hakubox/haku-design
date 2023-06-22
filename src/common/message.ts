import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";

const buildProj = process.env.buildProj;

let _toastModule;
let _confirmModule;

export const init = async ({ toastModule, confirmModule }) => {
  if (buildProj === 'design') {
    _toastModule = toastModule;
    _confirmModule = confirmModule;
  } else if (buildProj === 'user') {
    _toastModule = toastModule;
    _confirmModule = confirmModule;
  }
};

/** 提示框 */
export const toast = (
  messageInfo: string | Record<string, any>,
  type: 'info' | 'success' | 'error' | 'warning' | 'loading' = 'info',
  duration: number = 2000
): { clear: Function } => {
  let _type = type as string;
  if (buildProj === 'design') {
    const message = _toastModule;
    if (typeof messageInfo === 'string') message[_type](messageInfo, duration / 1000);
    else message[_type](messageInfo);
    return {
      clear: () => {
        message.destroy();
      }
    }
  } else {
    const Toast = _toastModule;
    if (_type === 'info') _type = 'text';
    else if (_type === 'warning') _type = 'fail';
    else if (_type === 'error') _type = 'fail';
    if (typeof messageInfo === 'string') return Toast[_type]({
      message: messageInfo,
      duration: duration,
    });
    else return Toast[_type](messageInfo);
  }
};

/** 确认弹出框 */
export const confirm = (title: string | undefined, content: string | undefined | (() => any), config: Record<string, any> = {}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (buildProj === 'design') {
      _confirmModule.confirm({
        title,
        icon: createVNode(ExclamationCircleOutlined),
        content: typeof content === 'string' ? createVNode('div', { style: 'color:red;' }, content) : content,
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
        ...config,
      });
    } else {
      _confirmModule.confirm({
        title,
        message: content,
        ...config,
      }).then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      })
    }
  });
};

export default {
  toast
}