import type { FileListResponse, StorageFileInfo } from './index.d';
import { FileType, getFileType } from './tools/fileTypeHandler';
import dayjs from 'dayjs';

export const transFileListResponse = (fileListResponse: FileListResponse): StorageFileInfo[] => {
  if (fileListResponse?.length) {
    return fileListResponse.map((item) => {
      const { id, fileSize, fileType, resourceName, updateTime, createTime, resourceKey, ...rest } = item.fileResource;
      return {
        id: id.toString(),
        type: fileType === '#' ? FileType.dir : getFileType(fileType),
        name: resourceName,
        key: resourceKey,
        suffix: fileType,
        fileSize: fileSize,
        updateTime: dayjs(updateTime ?? createTime).valueOf(),
        linked: [],
        previewSrc: item.url,
        src: item.url,
        tags: item.tags ? item.tags.toString() : '',
        ...rest,
      };
    });
  }
  return [];
};
