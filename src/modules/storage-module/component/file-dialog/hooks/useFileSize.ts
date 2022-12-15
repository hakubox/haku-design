import { state as storageState } from '@/modules/storage-module';
import { computed } from 'vue';
import { parseByte } from '../tools/transFileSize';

/** 文件大小相关hooks */
export const useFileSize = () => {
  const usedByte = computed(() => storageState.fileSizeInfo.usedByte);
  const maxByte = computed(() => storageState.fileSizeInfo.maxByte);

  /** 当前文件总大小 */
  const totalSize = computed(() => {
    return parseByte(usedByte.value);
  });
  const maxSize = computed(() => {
    return parseByte(maxByte.value);
  });

  /** 当前文件与仓库总容量占比 */
  const sizePercent = computed(() => (usedByte.value / maxByte.value) * 100);

  /** 检查文件大小是否超过剩余容量 */
  const checkFileSize = (fileSizeByte: number) => {
    return fileSizeByte <= maxByte.value - usedByte.value;
  };

  return {
    totalSize,
    maxSize,
    sizePercent,
    checkFileSize,
  };
};
