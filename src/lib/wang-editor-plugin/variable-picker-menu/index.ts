import { IDomEditor, IButtonMenu } from '@wangeditor/editor';
import { createVNode, reactive, h, render, type VNode } from 'vue';
import { Boot } from '@wangeditor/editor';
import bus from '@/tools/bus';
import VariablePickerDialog from './VariablePickerDialog.vue';
import { destoryComponent, loadComponent } from '@/lib/component-loader';

/** 变量弹窗外层DIV节点 */
let variableDialogContainer: HTMLElement;

/** 状态 */
const state = reactive({
});

let _editor: IDomEditor | undefined;

bus.$on('variable-picker-select', (val) => {
  if (_editor) {
    _editor.focus();
    _editor.insertText(`{{ ${val} }}`);
    destoryComponent(variableDialogContainer);
  }
});

/** wang-editor-plugin 变量选择菜单 */
export class VariablePickerMenu implements IButtonMenu {
  /** 标题 */
  title: string = '选择变量';
  /** 图标 */
  iconSvg: string = '<svg t="1667202546653" class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2162"><path d="M76.818347 981.333333a188.330667 188.330667 0 0 1-57.6-12.8A57.344 57.344 0 0 1 0.018347 924.245333a54.613333 54.613333 0 0 1 19.2-38.058666 91.52 91.52 0 0 1 38.4-12.8h32c19.2 0 38.4 6.357333 64 6.357333a69.418667 69.418667 0 0 0 51.2-12.8 297.472 297.472 0 0 0 38.4-95.146667l89.6-361.514666H224.018347l19.2-69.76h115.2v-12.8a428.970667 428.970667 0 0 1 51.2-152.234667 243.2 243.2 0 0 1 102.4-95.146667 388.608 388.608 0 0 1 121.6-38.058666 121.429333 121.429333 0 0 1 51.2 12.8 57.344 57.344 0 0 1 19.2 44.416 89.6 89.6 0 0 1-12.8 38.058666 91.52 91.52 0 0 1-38.4 12.8 229.205333 229.205333 0 0 1-64-12.8c-12.8 0-19.2-6.357333-32-6.357333a66.261333 66.261333 0 0 0-44.8 31.701333 554.666667 554.666667 0 0 0-32 95.146667l-25.6 82.432 275.2-6.357333h6.4a55.466667 55.466667 0 0 1 38.4 19.029333 434.517333 434.517333 0 0 1 19.2 50.730667l6.4 25.386666 19.2-25.386666a302.037333 302.037333 0 0 1 64-63.402667 199.168 199.168 0 0 1 83.2-38.058667 91.52 91.52 0 0 1 38.4 12.8 42.112 42.112 0 0 1 0 63.402667l-6.4 6.357333c-6.4 6.357333-19.2 12.8-57.6 12.8a73.045333 73.045333 0 0 0-51.2 19.029334A437.717333 437.717333 0 0 0 819.218347 499.2v12.8l25.6 133.205333c12.8 50.730667 44.8 101.461333 64 101.461334s19.2-12.8 25.6-19.029334v-6.357333a67.498667 67.498667 0 0 1 44.8-38.058667c12.8 0 19.2 6.357333 32 12.8a48.213333 48.213333 0 0 1 12.8 31.701334 66.474667 66.474667 0 0 1-32 57.088 96.768 96.768 0 0 1-70.4 25.386666 157.866667 157.866667 0 0 1-102.4-38.058666 356.736 356.736 0 0 1-70.4-126.848l-6.4-25.386667-19.2 19.029333A641.578667 641.578667 0 0 1 640.018347 740.309333a96.768 96.768 0 0 1-70.4 25.386667 58.368 58.368 0 0 1-44.8-19.029333 54.613333 54.613333 0 0 1-19.2-38.058667 46.336 46.336 0 0 1 12.8-38.058667c6.4-12.8 19.2-12.8 32-12.8a45.738667 45.738667 0 0 1 38.4 19.029334l6.4 12.8 12.8-6.357334 19.2-19.029333a318.549333 318.549333 0 0 0 44.8-50.730667l57.6-82.432-25.6-120.490666-256-6.357334-70.4 285.397334a530.517333 530.517333 0 0 1-108.8 215.637333A317.738667 317.738667 0 0 1 76.818347 981.333333z" p-id="2163" data-spm-anchor-id="a313x.7781069.0.i0"></path></svg>';
  /** Tag */
  tag: string = 'button';

  constructor() {
  }

  /** 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false */
  isActive(editor: IDomEditor): boolean {
    return false;
  }

  /** 获取菜单执行时的 value ，用不到则返回空 字符串或 false */
  getValue(editor: IDomEditor): string | boolean {
    return '';
  }

  /** 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false */
  isDisabled(editor: IDomEditor): boolean {
    return false;
  }

  /** 点击菜单时触发的函数 */
  exec(editor: IDomEditor, value: string | boolean) {
    _editor = editor;
    variableDialogContainer = loadComponent(VariablePickerDialog).dom;
  }
}

export const installPlugin = () => {
  /** 变量选择菜单 */
  const variablePickerMenu = {
    key: 'variablePicker',
    factory: () => new VariablePickerMenu(),
  };
  Boot.registerMenu(variablePickerMenu);
}

installPlugin();