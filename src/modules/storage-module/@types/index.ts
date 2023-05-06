import { StorageServiceType, StorageServiceStatus } from '../enum';
import { FileType } from '../tools/fileTypeHandler';

/** 文件信息 */
export interface StorageFileInfo {
  /** 关联Id */
  id: string;
  /** 类型（文件夹 / 文件） */
  type: FileType;
  /** 文件地址 */
  src?: string;
  /** 文件名（不包含后缀） */
  name: string;
  /** 预览地址 */
  previewSrc?: string;
  /** cos识别所用的key */
  key: string;
  /** 后缀名 */
  suffix: string;
  /** 文件大小 */
  fileSize: number;
  /** 图片宽度（可选） */
  width?: number;
  /** 图片高度（可选） */
  height?: number;
  /** ETag */
  eTag?: string;
  /** 文件内容 */
  binaryData?: Blob;
  /** 文件 */
  file?: File;
  /** 远程存储原始数据 */
  originData?: any;
  /** 修改日期 */
  updateTime: number;
  /** 关联targetId */
  linked: string[];
  /** 文件描述 */
  remark?: string;
  /** 标签 */
  tags?: string;
  /** 视频时长 */
  timeLength?: number;
}

/** 文件夹信息 */
export interface StorageFolderInfo {
  /** 类型（文件夹 / 文件） */
  type: 'folder';
  /** 关联Id */
  id: string;
  /** 文件夹分类（普通/图片/其他...） */
  category: 'normal' | 'image';
  /** 文件地址 */
  src: string;
  /** 文件名 */
  name?: string;
}

/** 对象存储服务类型 */
export interface StorageServiceApi {
  /** 账号信息 */
  getAuthorization(instance: StorageServiceInstance): string;
  /** 连接测试 */
  connectionTest(instance: StorageServiceInstance);
  /** 初始化 */
  init(instance: StorageServiceInstance): Promise<void>;
  /** 获取文件列表 */
  list(instance: StorageServiceInstance): Promise<any[]>;
  /** 传文件 */
  upload(
    instance: StorageServiceInstance,
    file: File,
    config?: {
      cosConfig?: Omit<any, 'Body' | 'Bucket' | 'Region' | 'onTaskReady'> & {
        onTaskReady?: (taskId: string, resumeUpload: () => void) => void;
      };
      callback?: (err, data) => void;
    },
  ): Promise<string>;
  /** 下载文件 */
  download(fileKey: string, instance: StorageServiceInstance): Promise<any>;
  /** 删除文件 */
  delete(fileKey: string, instance: StorageServiceInstance): Promise<string>;
}

// /** 通过Url上传文件 */
// uploadByUrl(instance: StorageServiceInstance, url: string): Promise<string>;
// /** 通过Url上传文件 */
// uploadByFile(instance: StorageServiceInstance, url: File): Promise<string>;

/** 对象存储服务 */
export interface StorageService {
  /** 服务标题 */
  name: string;
  /** 是否启用 */
  enabled: boolean;
  /** 图标 */
  icon: string;
  /** 服务类型 */
  type: StorageServiceType;
  /** 默认头 */
  defaultHeaders: Record<string, string | number>;
  /** 基础服务 */
  api: StorageServiceApi;
}

/** 对象存储服务实例 */
export interface StorageServiceInstance {
  /** Id */
  id: string;
  /** 对象存储服务 */
  type: StorageServiceType;
  /** 状态 */
  status: StorageServiceStatus;
  /** 错误原因 */
  errorStr?: string;
  /** 服务标题 */
  title: string;
  /** SDK对象 */
  sdk?: any;
  /** Header头 */
  headers: Record<string, string | number>;
  /** 配置 */
  config: Record<string, string | number>;
  /** 备注 */
  remark?: string;
}

/** 文件选择框配置 */
export interface FileDialogConfig {
  /** 文件类型 example: *.jpg;*.png; */
  fileType: string;
}

/** 文件接口返回类型 */
export interface FileItem {
  /** Id */
  id: string;
  /** 资源名称 */
  resourceName: string;
  resourceKey: string;
  resourceType: number;
  fileType: string;
  fileSize: number;
  parentId: number;
  status: number;
  createTime: string;
  updateTime: string;
  remark: string;
  timeLength: number;
}

/** 后端文件列表接口返回数据 */
export type FileListResponse = {
  fileResource: FileItem;
  metadata: null;
  url: string;
  tags: string[];
}[];

/** 文件夹列表 */
export interface DirItem {
  data: FileItem;
  children: DirItem[];
}
