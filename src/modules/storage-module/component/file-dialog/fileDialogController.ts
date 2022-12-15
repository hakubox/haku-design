import { ConcreteComponent, reactive, watch } from 'vue';
import { StorageFileInfo } from '../../@types';
import { destoryComponent, loadComponent } from '@/lib/component-loader';
import FileDialog from '@/modules/storage-module/component/file-dialog/FileDialog.vue';

/** 变量弹窗外层DIV节点 */
let fileDialogContainer: HTMLElement;

export interface DialogSettings {
  allowMultiSelect?: boolean; // 是否允许多选
  canSelectFile?: boolean; // 是否可以选择文件
  uploadFileType?: string; // 指定上传的文件类型，参考https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#attr-accept
  dialogFileType?: string; // 指定对话框显示的文件类型
  onConfirm?: (fileList: StorageFileInfo[]) => void; // 确认选择的文件
}

// 使用配置化管理组件状态
export const fileDialogState = reactive({
  visible: false,
  allowMultiSelect: false,
  canSelectFile: false,
  onConfirm: (fileList: StorageFileInfo[]) => {},
  uploadFileType: '*',
  dialogFileType: '*',
} as Required<DialogSettings> & { visible: boolean });

/** 暴露给外部的api，用来打开弹窗 */
export const fileDialog = {
  /** 打开文件选择器弹窗，可传入弹窗相关配置 */
  open: (setting?: DialogSettings) => {
    fileDialogContainer = loadComponent(FileDialog as ConcreteComponent).dom;
    fileDialogState.visible = true;
    fileDialogState.allowMultiSelect = setting?.allowMultiSelect ?? false;
    fileDialogState.canSelectFile = setting?.canSelectFile ?? false;
    fileDialogState.onConfirm = setting?.onConfirm ?? (() => {});
    fileDialogState.uploadFileType = setting?.uploadFileType ?? '*';
    fileDialogState.dialogFileType = setting?.dialogFileType ?? '*';
  },
};

watch(
  () => fileDialogState.visible,
  (visible) => {
    if (!visible) {
      fileDialogState.allowMultiSelect = false;
      fileDialogState.canSelectFile = false;
      fileDialogState.onConfirm = () => {};
      fileDialogState.uploadFileType = '*';
      destoryComponent(fileDialogContainer);
    }
  },
);
