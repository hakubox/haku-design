import { deletes, get, post } from '@/lib/api';
import { serverConfig } from '@/config';

/** 文件夹 */
export interface DirectoryDto {
  /** 父文件夹Id */
  parentId: string,
  /** 文件夹名称 */
  directoryName: string,
  /** 备注 */
  remarks?: string,
  /** 序号 */
  displayOrder?: number
}

/** 企业Id */
const businessId = '';
/** 企业名称 */
const businessName = '';

/** 单文件上传 */
export function uploadFile(fileName: string, sign: string, groupId: string) {
  return post(`${process.env.userApi}/File/UploadFile`, {
    file: fileName,
    businessName: businessName,
    businessId: businessId,
    sign: sign,
    groupId: groupId,
  });
}

/** 获取文件列表数据 */
export function getFiles(sign: string, groupId: string, sort: number) {
  return post(`${process.env.userApi}/File/GetFilesList`, {
    businessName: businessName,
    businessId: businessId,
    sign: sign,
    groupId: groupId,
    sort: sort
  });
}

/** 获取文件地址 */
export function getFilePath(fileId: string): Promise<string> {
  return get(`${process.env.userApi}/File/GetFilePath`, {
    fileid: fileId,
  });
}

/** 批量获取文件地址列表 */
export function getFilePaths(fileIds: string[]): Promise<string[]> {
  return post(`${process.env.userApi}/File/GetBatchFilePath`, fileIds);
}

/** 删除文件 */
export function removeFile(fileId: string): Promise<boolean> {
  return post(`${process.env.userApi}/File/DeleteFile`, {
    id: fileId
  });
}

/** 批量删除文件 */
export function removeFiles(fileIds: string[]): Promise<boolean> {
  return post(`${process.env.userApi}/File/BatchDeleteFile`, fileIds);
}

/** 批量修改文件排序 */
export function setFileSorts(fileIds: string[]): Promise<boolean> {
  return post(`${process.env.userApi}/File/SetFileSort`, {
    ids: fileIds
  });
}

/** 修改文件排序 */
export function setFileSort(key: string, value: string): Promise<boolean> {
  return post(`${process.env.userApi}/File/SetFileSort`, {
    key, value
  });
}

/** 修改文件备注 */
export function setFileRemarks(
  /** 文件Id */
  fileId: string, 
  /** 备注 */
  remark: string
): Promise<boolean> {
  return post(`${process.env.userApi}/File/SetFileRemarks`, {
    key: fileId, value: remark
  });
}

/** 新增文件夹 */
export function addDirectory(directory: DirectoryDto) {
  return post(`${process.env.userApi}/AppResource/AddDirectory`, {
    parentId: directory.parentId,
    directoryName: directory.directoryName,
  });
}

/** 编辑文件夹 */
export function editDirectory(directory: DirectoryDto) {
  return post(`${process.env.userApi}/AppResource/EditDirectory`);
}

/** 删除文件夹（最好改成传入数组） */
export function deleteDirectory(directoryId: string) {
  return deletes(`${process.env.userApi}/AppResource/DeleteDirectory?id=${directoryId}`);
}