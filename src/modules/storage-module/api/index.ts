import { deletes, get, post, put } from '@/lib/api';
import type { FileListResponse, StorageFileInfo } from '../index.d';
import { SortType } from '../enum';
import { transFileListResponse } from '../utils';

/** 查询文件目录树 */
export const getDirTree = () => {
  return get('/file/resource/getDirTree');
};

/** 创建文件夹 */
export const mkDir = (params: { dirName: string; parentId: string; remark: string }) => {
  return post('/file/resource/mkdir', params, { returnResponse: true });
};

/** 重命名、移动文件夹 */
export const changeDir = (params: { id: string; dirName?: string; parentId: string }) => {
  return put('/file/resource', {
    parentId: params.parentId,
    resourceId: params.id,
    resourceName: params.dirName,
  });
};

/** 添加标签 */
export const addTag = (params: { tagContent: string }) => {
  return post('/file/resource/tag', params);
};

/** 根据Id列表获取文件夹 */
export const getFileListByIds = async (...ids: string[]): Promise<StorageFileInfo[]> => {
  const res = (await get(`/file/resource/getListByIds/`, { ids: ids.join(',') })) as FileListResponse;
  return res ? transFileListResponse(res) : [];
};

/** 获取文件夹下所有文件 */
export const getFileListByDir = async (
  dirId: string,
  orderBy: SortType = SortType.letter,
): Promise<StorageFileInfo[]> => {
  const res = (await get(`/file/resource/getList/${dirId}/${orderBy}`)) as FileListResponse;
  return res ? transFileListResponse(res) : [];
};

/** 获取文件属性 */
export const getFileInfo = (id: string) => {
  return get(`/file/resource/getFileInfo/${id}`);
};

/** 获取对象键值对,上传前调用 */
export const getFileKey = (params: { fileName: string; parentId: string }) => {
  return get(`/file/resource/getKey/${params.parentId}/${params.fileName}`);
};

/** 通过fileKey获取资源的下载链接 */
export const getDownloadUrl = (fileKey: string) => {
  return get('/file/download/url', { key: fileKey }) as Promise<string>;
};

/** 完成上传后调用，通知后端更新列表 */
export const finishUpload = (params: {
  fileKey: string; // 文件key
  fileName: string; // 文件名
  parentId: string; // 所处文件夹id
  tags: string[]; // 标签数组
  remark: string; // 文件描述
}) => {
  return post('/file/resource/finishUpload', params);
};

/** 复制文件 */
export const copyFile = (params: {
  id: string; //文件id
}) => {
  //TODO 目前接口只支持这样，待接口改正再修改
  return post('/file/resource/copy',params);
};

/** 删除文件/文件夹 */
export const deleteFile = (id: string) => {
  return deletes(`/file/resource/${id}`);
};

/** 条件查询 */
export const searchFile = async (searchValue: string, orderBy: SortType = SortType.letter) => {
  const res = (await get(`/file/resource/searchFile/${searchValue}/${orderBy}`)) as FileListResponse;
  if (res) {
    return transFileListResponse(res);
  }
};

/** 获取资源容量信息 */
export const getResourceSizeInfo = () => {
  return get('https://saas-api.vansunscience.com/file/resource/getUserResourceInfo') as Promise<{
    usedByte: number;
    maxByte: number;
  }>;
};

/** 获取cos认证信息 */
export const getCosAuthorization = () => get('/file/cos/temInfo/secret');
