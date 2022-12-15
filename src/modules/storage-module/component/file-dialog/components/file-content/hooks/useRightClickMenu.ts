import { state as storageState, service as storageService } from '@/modules/storage-module';
import { getDownloadUrl } from '@/modules/storage-module/api';
import { StorageFileInfo } from '@/modules/storage-module/@types';
import { Modal } from 'ant-design-vue';
import { computed, nextTick, reactive, Ref, toRefs } from 'vue';
import { FileType } from '@/modules/storage-module/tools/fileTypeHandler';
import { toast } from '@/common/message';

/** 处理右键菜单逻辑 */
export const useRightClickMenu = (fileList: Ref<StorageFileInfo[]>, curDirId: Ref<string>, onDblClick: Function) => {
  const state = reactive({
    rightClickId: '', // 右键选中的文件下标
    showRenameInput: false, // 显示重命名输入框
    fileAttributeModalVisible: false, // 文件属性弹窗显示/隐藏
    showPreview: false, //显示预览框
  });

  /** 当前右键选中的文件 */
  const activeMenuFile = computed(() => fileList.value.find((item) => Number(item.id) === Number(state.rightClickId)));

  /** 查看属性 */
  const onShowFileAttribute = () => {
    state.fileAttributeModalVisible = true;
  };

  /** 删除文件 */
  const onDeleteFile = () => {
    const modal = Modal.confirm({
      title: '确认删除',
      content: `确认删除${activeMenuFile.value?.name}吗？`,
      onOk: async () => {
        if (activeMenuFile.value?.type === FileType.dir) {
          storageService.deleteDir(activeMenuFile.value?.id, curDirId.value);
        } else {
          const fileKey = activeMenuFile.value?.key;
          const fileId = activeMenuFile.value?.id;
  
          if (fileKey !== undefined && fileId !== undefined) {
            storageService.deleteFile({
              fileId,
              fileKey,
              dirId: curDirId.value,
            });
          }
        }
        
        modal.destroy();
      },
      onCancel: () => modal.destroy(),
    });
  };
  /** 查看文件 */
  const viewFile = async (fileItem: StorageFileInfo) => {
    if (fileItem.type === FileType.dir) {
      onDblClick(fileItem.id);
    } else if ([ FileType.image, FileType.audio, FileType.video, FileType.pdf ].includes(fileItem.type)) {
      state.rightClickId = fileItem.id;
      if (fileItem.type === FileType.pdf) {
        const imgUrl = await getDownloadUrl(fileItem.key);
        activeMenuFile.value!.previewSrc = imgUrl;
      }
      nextTick(() => {
        state.showPreview = true;
      });
    } else {
      toast('当前文件不支持直接打开', 'error');
    }
  };
  /** 下载文件 */
  const onDownloadFile = () => {
    const fileKey = activeMenuFile.value?.key;
    if (fileKey !== undefined) {
      storageService.downloadFile(fileKey);
    }
  };

  /** 复制文件 */

  const copyFile = () => {
    storageService.copyFile(activeMenuFile.value?.id ?? '', curDirId.value);
  };

  /** 检查输入的文件名是否合法 */
  const checkFileName = (name: string) => {
    /** 是否有同名重复元素 */
    const hasDup = fileList.value.find((item) => item.name === name && item.id !== activeMenuFile.value?.id);
    return !hasDup;
  };

  /** 重命名文件 */
  const renameFile = (name: string) => {
    if (checkFileName(name)) {
      const fileId = activeMenuFile.value?.id;
      if (fileId) {
        storageService.renameResource({
          id: fileId,
          dirName: name,
          parentId: curDirId.value,
        });
      }
      state.showRenameInput = false;
    } else {
      toast('文件名称已重复，请重新输入', 'error');
    }
  };

  const menus = computed(() => {
    const baseMenuConfig = [
      {
        label: '查看',
        click: () => activeMenuFile.value && viewFile(activeMenuFile.value),
      },
      {
        label: '复制',
        click: copyFile,
      },
      {
        label: '移动',
        click: () => {
          console.log('移动');
        },
      },
      {
        label: '重命名',
        click: () => {
          state.showRenameInput = true;
        },
      },
      {
        label: '属性',
        click: onShowFileAttribute,
      },
      {
        label: '下载',
        divided: true,
        click: onDownloadFile,
      },
      {
        label: '删除',
        style: {
          color: '#FF7775',
        },
        click: onDeleteFile,
      },
    ];

    if (activeMenuFile.value?.type === FileType.dir) {
      return baseMenuConfig.filter((item) => item.label !== '下载');
    }
    return baseMenuConfig;
  });

  /** 文件列表右键菜单事件 */
  const onRightClickFile = (fileId: string) => {
    state.rightClickId = fileId;
  };

  /** 关闭预览弹窗 */
  const setPreviewVisible = (visible: boolean) => {
    state.showPreview = visible;
  };
  return {
    ...toRefs(state),
    activeMenuFile,
    menus,
    onRightClickFile,
    renameFile,
    setPreviewVisible,
    onDownloadFile,
    viewFile,
  };
};
