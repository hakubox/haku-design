import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";

const buildProj = process.env.buildProj;

let _toastModule;
let _confirmModule;

export const init = async ({ toastModule, confirmModule }) => {
  if (buildProj === 'design') {
    _toastModule = toastModule;
    _confirmModule = confirmModule;
  } else if (buildProj === 'answer') {
    _toastModule = toastModule;
    _confirmModule = confirmModule;
  }
};

/** 提示框 */
export const toast = (messageInfo: string, type: 'info' | 'success' | 'error' | 'warning' | 'loading' = 'info', duration: number = 2000): () => void => {
  let _type = type as string;
  if (buildProj === 'design') {
    const message = _toastModule;
    message[_type](messageInfo, duration / 1000);
    return () => {
      message.destroy();
    }
  } else {
    const Toast = _toastModule;
    if (_type === 'info') _type = 'text';
    else if (_type === 'warning') _type = 'fail';
    else if (_type === 'error') _type = 'fail';
    return Toast[_type]({
      message: messageInfo,
      duration: duration,
    });
  }
};

/** 确认弹出框 */
export const confirm = (title: string | undefined, content: string | (() => any), config: Record<string, any> = {}): Promise<void> => {
  if (buildProj === 'design') {
    return new Promise((resolve, reject) => {
      _confirmModule.confirm({
        title,
        icon: createVNode(ExclamationCircleOutlined),
        content: typeof content === 'string' ? createVNode('div', { style: 'color:red;' }, content) : content,
        onOk() {
          resolve();
        },
        onCancel() {
          reject();
        },
        ...config,
      });
    });
  } else {
    return _confirmModule.confirm({
      title,
      message: content,
      ...config,
    })
  }
};

export default {
  toast
}