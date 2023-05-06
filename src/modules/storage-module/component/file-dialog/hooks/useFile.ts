import { computed } from 'vue';
import { h, reactive, Ref, watch } from 'vue';
import { fileDialogState } from '../fileDialogController';
import { getType } from 'mime';
import { isDir } from '../../../tools/fileTypeHandler';
import { message, notification, UploadFile } from 'ant-design-vue';
import { state as storageState, service as storageService } from '../../../';
import { getFileKey } from '../../../api';
import GlobalUploadProgressContent from '../components/GlobalUploadProgressContent.vue';
import { StorageServiceType } from '../../../enum';
import { ProgressStateItem } from '../../../@types';

/** 全局上传进度状态 */
const globalUploadProgressState = reactive([] as ProgressStateItem[]);

// TODO: 将useStorageStore中的的文件相关逻辑逻辑搬过来
// 文件相关业务逻辑
export const useFile = (curDirId: Ref<string>) => {

  /** 当前文件夹内的进度状态 */
  const dirProgressState = computed(() => globalUploadProgressState.filter((item) => item.dirId === curDirId.value));

  /**
   * 处理文件类型限制
   * 打开文件选择器弹窗时候，可以限制只显示某些类型文件类型，这里进行了文件类型的过滤
   * 过滤格式有三种： 1. 后缀类型（.png） 2. 精确mime类型（image/png）3. mime + 通配符类型（image/*）
   */
  const FilteredFileList = computed(() => {
    const dialogFileType = fileDialogState.dialogFileType;
    const fileTypes = dialogFileType.split(',').map((item) => item.trim());
    // 后缀类型
    const suffixFileTypes = fileTypes.filter((item) => item.startsWith('.'));
    // 通配符mime类型
    const wildcardMimeFileTypes = fileTypes.filter((item) => item.endsWith('/*'));
    // 精确mime类型
    const exactMimeFileTypes = fileTypes.filter((item) => !item.startsWith('.') && !item.endsWith('/*'));

    if (fileTypes.includes('*')) {
      return storageState.dialogFileList;
    }
    return storageState.dialogFileList.filter((file) => {
      const suffix = file.suffix.trim();
      if (isDir(suffix)) {
        return true;
      }
      // 处理文件后缀类型
      if (suffixFileTypes.includes(suffix.startsWith('.') ? suffix : `.${suffix}`)) {
        return true;
      }

      const mimeType = getType(suffix);
      if (mimeType) {
        // 处理mime通配符类型
        if (wildcardMimeFileTypes.includes(`${mimeType.split('/')[0]}/*`)) {
          return true;
        }
        // 处理mime精确类型
        if (exactMimeFileTypes.includes(mimeType)) {
          return true;
        }
      }
      return false;
    });
  });

  /**
   * 添加新的上传进度数据
   */
  const addNewUploadProgress = (fileName: string, dirId: string) => {
    const initTaskFn = () => {
      message.error('上传任务尚未准备就绪，请稍等');
    };
    const progressState: ProgressStateItem = reactive({
      filename: fileName,
      progress: {
        loaded: 0,
        total: 0,
        speed: 0,
        percent: 0,
      },
      dirId,
      isPaused: false,
      pause: initTaskFn,
      cancel: initTaskFn,
      resume: initTaskFn,
    });
    globalUploadProgressState.push(progressState);
    const onProgress = (progress: any) => {
      // 更新进度
      progressState.progress.percent = progress.percent;
      progressState.progress.loaded = progress.loaded;
      progressState.progress.total = progress.total;
      progressState.progress.speed = progress.speed;
    };

    // 移除进度条
    const removeProgress = () => {
      globalUploadProgressState.splice(
        globalUploadProgressState.findIndex((i) => i.filename === fileName),
        1,
      );
    };

    // 上传工作准备完成后的回调
    const onTaskReady = (taskId: string, resumeUpload: () => void) => {
      const cos = storageService.getServiceInstance(StorageServiceType.cos).sdk;
      if (cos) {
        // 暂停上传
        progressState.pause = () => {
          cos.cancelTask(taskId);
        };
        // 取消上传
        progressState.cancel = () => {
          cos.cancelTask(taskId);
          removeProgress();
        };
        // 恢复上传
        progressState.resume = () => {
          resumeUpload();
        };
      }
    };

    return {
      onProgress,
      removeProgress,
      onTaskReady,
    };
  };

  /** 上传文件 */
  const uploadFile = async (params: {
    file: UploadFile; // 文件资源
    dirId: string; // 所处文件夹id
    tags?: string[]; // 标签
    fileName?: string; // 文件名
    remark?: string; // 文件描述
  }) => {
    const { dirId, file, fileName = params.file.name } = params;
    /** 上传前获取fileKey */
    const fileKey = (await getFileKey({
      parentId: dirId,
      fileName,
    })) as string;
    if (fileKey) {
      const { onProgress, removeProgress, onTaskReady } = addNewUploadProgress(fileName, dirId);

      const callback = () => {
        // 上传完成移除进度条
        removeProgress();

        // 文件所在的id和当前文件夹一致的时候，才更新文件列表
        if (dirId === curDirId.value) {
          storageService.updateFileList(dirId);
          storageService.getFileSizeInfo();
        }
      };

      await storageService.uploadFile({ ...params, file: file as any, fileKey, onProgress, onTaskReady, callback });
    }
  };

  // 全局上传进度
  const progressKey = 'progressKey';
  watch(globalUploadProgressState, (progressState) => {
    if (progressState.length) {
      notification.open({
        key: progressKey,
        message: '上传进度',
        description: h(GlobalUploadProgressContent, { globalUploadProgressState }),
        duration: null,
        placement: 'bottomRight',
        style: {
          maxHeight: '300px',
          overflow: 'scroll',
        },
      });
    } else {
      notification.close(progressKey);
    }
  });
  return {
    fileList: FilteredFileList,
    uploadFile,
    globalUploadProgressState,
    dirProgressState,
  };
};
