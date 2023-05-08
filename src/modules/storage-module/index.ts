import { QiniuService } from './service/qiniu.service';
import { COSService } from './service/cos.service';
import type {
  StorageService,
  StorageServiceInstance,
  FileDialogConfig,
  StorageFileInfo,
  DirItem
} from './index.d';
import {
  changeDir,
  finishUpload,
  getDirTree,
  getFileListByDir,
  mkDir,
  deleteFile as deleteServerFile,
  searchFile as searchServerFile,
  getResourceSizeInfo,
  copyFile as copyServerFile,
} from './api';
import { reactive } from 'vue';
import { StorageServiceStatus, StorageServiceType } from './enum';
import { createModelId, downLoadFile } from '@/tools/common';
import { FileType, getFileType } from './tools/fileTypeHandler';
import { getVideoDuration } from './tools/getVideoDuration';
import { toast, confirm } from '@/common/message';

export * from './index.d';

/** 存储模块状态 */
export const state = reactive({
  /** 存储服务类型 */
  storageTypes: {
    [StorageServiceType.qiniu]: QiniuService,
    [StorageServiceType.cos]: COSService,
  },
  /** 存储服务列表 */
  storageServices: [] as StorageServiceInstance[],
  /** 文件选择框配置 */
  fileDialogConfig: {} as FileDialogConfig | undefined,
  /** 文件夹树 */
  dirTree: [] as DirItem[],
  /** 文件列表 */
  fileList: [] as StorageFileInfo[],
  /** 弹出框展示的当前文件列表 */
  dialogFileList: [] as StorageFileInfo[],
  /** 选择文件的承诺 */
  selectFilePromise: undefined as ((files: any[]) => void) | undefined,
  /** 用户的文件容量信息 */
  fileSizeInfo: {
    usedByte: 0, // 已经使用的容量
    maxByte: 0, // 总共可用的容量
  },
});

/** 存储模块逻辑 */
export const service = {
  /** 获取文件信息 */
  getFileInfo(id: string) {
    const _index = state.fileList.findIndex((i) => '' + i.id === '' + id);
    if (_index >= 0) {
      return state.fileList[_index];
    } else {
      return undefined;
    }
  },
  /** 获取文件列表信息 */
  getFileList(...ids: string[]) {
    const _fileList = [] as any[];
    ids.forEach((id) => {
      const _index = state.fileList.findIndex((i) => '' + i.id === '' + id);
      if (_index >= 0) {
        _fileList.push(state.fileList[_index]);
      }
    });
  },
  /** 确认文件依赖 */
  checkFileDependent() {
    return [];
  },
  /** 移除所有文件依赖 */
  removeAllFile() {
    confirm('是否确认清空所有文件列表？', '注意当前操作不可恢复').then(() => {
      state.fileList.splice(0, state.fileList.length);
    });
  },
  /** 创建新存储实例 */
  createStorageService(type: StorageServiceType, instance?: StorageServiceInstance): StorageServiceInstance {
    let _instance = {} as StorageServiceInstance;
    switch (type) {
      case StorageServiceType.qiniu:
        _instance = {
          id: createModelId(10),
          type: StorageServiceType.qiniu,
          status: StorageServiceStatus.unknown,
          title: instance ? instance.title : `七牛云存储 ${state.storageServices.length + 1}`,
          config: {
            bucket: 'haku-design',
            secretKey: 'Syt_tReFgx3CURPT9WiIMC04zs0rAkREHiRw7XTh',
            accessKey: 'TvNrSc9tOmFcp0Hfuub4fjeNSnkJcdglhsoQg6WV',
          },
          headers: {},
          remark: '',
        };
        break;
      case StorageServiceType.cos:
        _instance = {
          id: createModelId(10),
          type: StorageServiceType.cos,
          status: StorageServiceStatus.unknown,
          title: instance ? instance.title : `腾讯云COS存储 ${state.storageServices.length + 1}`,
          config: {},
          headers: {},
          remark: '',
        };
        break;
      default:
        break;
    }
    const _index = state.storageServices.push(_instance);
    this.initService(state.storageServices[_index - 1]);
    return _instance;
  },
  /** 获取存储服务 */
  getService(type: StorageServiceType) {
    return state.storageTypes[type] as StorageService;
  },
  getServiceInstance(type: StorageServiceType) {
    return state.storageServices.find((item) => item.type === type) as StorageServiceInstance;
  },
  getServiceInstanceName() {},
  /** 初始化存储服务 */
  initService(instance: StorageServiceInstance) {
    return new Promise((resolve, reject) => {
      this.getService(instance.type)
        .api.init(instance)
        .then(() => {
          this.testService(instance);
        });
    });
  },
  /** 测试连接存储服务 */
  testService(instance: StorageServiceInstance) {
    this.getService(instance.type)
      .api.connectionTest(instance)
      .then((d) => {
        instance.status = StorageServiceStatus.normal;
        instance.errorStr = undefined;
      })
      .catch((err) => {
        toast(`[${instance.title + '连接失败'}] err.message`);
        instance.status = StorageServiceStatus.fail;
        instance.errorStr = err.message;
      });
  },
  /** 上传文件 */
  async uploadFile(
    params: {
      file: File; // 文件资源
      dirId: string; // 所处文件夹id
      fileKey: string; // cos文件存储所用的key
      tags?: string[]; // 标签
      fileName?: string; // 文件名
      remark?: string; // 文件描述
      onProgress?: (progress: any) => void; // 上传进度回调
      onTaskReady?: (taskId: string, resumeUpload: () => void) => void; // 获取taskId，通过cos控制进度
      callback?: () => void; // 上传完成回调
    },
    serviceType: StorageServiceType = StorageServiceType.cos,
  ) {
    const {
      file,
      dirId,
      fileKey,
      tags = [],
      fileName = params.file.name,
      remark = '',
      onProgress,
      onTaskReady,
      callback: _callback,
    } = params;
    const serviceInstance = this.getServiceInstance(serviceType);
    const _service = this.getService(serviceType);
    if (serviceInstance && _service) {
      const callback = async () => {
        toast('上传成功!', 'success');
        const params = {
          fileKey,
          fileName,
          tags,
          parentId: dirId,
          remark,
        };

        const fileType = getFileType(fileName);
        // 获取视频时长
        if (fileType === FileType.video || fileType === FileType.audio) {
          const duration = await getVideoDuration(file as any);
          params['timeLength'] = duration;
        }

        /** 上传成功后通知后端更新文件列表 */
        await finishUpload(params);
        _callback?.();
      };

      _service.api
        .upload(serviceInstance, file, { cosConfig: { Key: fileKey, onProgress, onTaskReady }, callback })
        .catch((err) => {
          toast(err, 'error');
        });
    }
  },
  /** copy文件 */
  async copyFile(
    fileId: string, // 文件资源
    dirId: string, // 所处文件夹id
  ) {
    await copyServerFile({
      id: fileId,
    });
    this.updateFileList(dirId);
    this.getFileSizeInfo();
  },
  /** 获取文件列表 */
  async updateFileList(...params: Parameters<typeof getFileListByDir>) {
    const res = await getFileListByDir(...params);
    if (res) {
      state.dialogFileList = res;
    }
  },
  /** 删除文件 */
  async deleteFile(
    {
      fileId,
      fileKey,
      dirId,
    }: {
      fileId: string;
      fileKey: string;
      dirId: string;
    },
    serviceType: StorageServiceType = StorageServiceType.cos,
  ) {
    const serviceInstance = this.getServiceInstance(serviceType);
    const service = this.getService(serviceType);
    if (serviceInstance && service) {
      const res = await service.api.delete(fileKey, serviceInstance).catch((err) => {
        toast(err, 'error');
      });
      if (res) {
        /** 同步服务器数据 */
        await deleteServerFile(fileId);
        toast(res, 'success');
        this.initFileModule(dirId);
      }
    }
  },
  /** 移除文件夹 */
  async deleteDir(targetDirId: string, parentDirId: string) {
    await deleteServerFile(targetDirId);
    toast('删除成功!', 'success');
    this.initFileModule(parentDirId);
  },
  /** 下载文件 */
  async downloadFile(fileKey: string, serviceType: StorageServiceType = StorageServiceType.cos) {
    const serviceInstance = this.getServiceInstance(serviceType);
    const service = this.getService(serviceType);
    if (serviceInstance && service) {
      const res = await service.api.download(fileKey, serviceInstance).catch((err) => {
        toast(err, 'error');
      });
      if (res) {
        downLoadFile(fileKey, res);
      }
    }
  },
  /** 获取文件夹树 */
  async getDirTree() {
    const res = await getDirTree();
    if (res) {
      state.dirTree = res;
    }
  },
  async addNewDir(params: Parameters<typeof mkDir>[0]) {
    const res = await mkDir(params);
    if (res.code === 200) {
      toast('新建文件夹成功', 'success');
      this.getDirTree();
      this.updateFileList(params.parentId);
    }
  },
  /** 移动文件/文件夹 */
  async moveResource(params: Parameters<typeof changeDir>[0]) {
    await changeDir(params)
      .catch(() => {
        toast('修改文件夹失败，请重试', 'error');
      })
      .finally(() => {
        this.getDirTree();
        this.updateFileList(params.parentId);
      });
  },
  /** 移动文件并更新原来文件夹 */
  async dragResource(params: Parameters<typeof changeDir>[0], oldParentId: string) {
    await changeDir(params)
      .catch(() => {
        toast('修改文件夹失败，请重试', 'error');
      })
      .finally(() => {
        this.getDirTree();
        this.updateFileList(oldParentId);
      });
  },
  /** 重命名文件/文件夹 */
  async renameResource(params: Parameters<typeof changeDir>[0]) {
    await this.moveResource(params);
  },
  async searchFile(...params: Parameters<typeof searchServerFile>) {
    const res = await searchServerFile(...params);
    if (res) {
      state.dialogFileList = res;
    }
  },
  /** 获取文件资源信息 */
  async getFileSizeInfo() {
    const res = await getResourceSizeInfo();
    if (res) {
      state.fileSizeInfo = {
        maxByte: res.maxByte,
        usedByte: res.usedByte,
      };
    }
  },
  /** 初始化文件模块所需的所有信息 */
  async initFileModule(dirId: string) {
    Promise.all([this.updateFileList(dirId), this.getDirTree(), this.getFileSizeInfo()]);
  },
};

service.createStorageService(StorageServiceType.cos);

export default {
  state,
  service
}