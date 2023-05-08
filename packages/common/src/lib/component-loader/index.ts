import type { ModalFuncProps } from 'ant-design-vue';
import { h, render, type VNode, ConcreteComponent } from 'vue';
import { message } from '@haku-design/common';

/** 加载组件 */
export function loadComponent(component: ConcreteComponent, options: Record<string, any> = {}, rootEl = document.body): { dom: HTMLElement, vnode: VNode } {
  const _container: HTMLDivElement = document.createElement('div');
  const _component: VNode = h(component, options);
  render(_component, _container);
  rootEl.appendChild(_container);
  return {
    dom: _container,
    vnode: _component
  };
}

/** 加载组件并弹出框 */
export async function loadComponentForDialog(component: ConcreteComponent, options: ModalFuncProps = {}, rootEl = document.body) {
  return message.confirm(undefined, () => h(component, options), {
    closable: true,
    okText: '确认',
    cancelText: '取消',
    maskClosable: true,
    ...options,
  });
}

/** 销毁组件 */
export function destoryComponent(dom: HTMLElement) {
  render(null, dom);
  dom.remove();
}