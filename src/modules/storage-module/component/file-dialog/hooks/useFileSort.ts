import { StorageFileInfo } from '@/modules/storage-module/@types';
import { SortType } from '@/modules/storage-module/enum';
import { computed } from 'vue';
import { ref, Ref } from 'vue';
import { FileType } from '@/modules/storage-module/tools/fileTypeHandler';

/** 排序顺序 */
export enum SortOrder {
  /** 顺序 */
  sequence,
  /** 倒序 */
  reverse,
}

/**
 * 对两个字符串字符串进行排序比较
 * @param str1 要比较的字符串1
 * @param str2 要比较的字符串2
 * @param index 当前对比的下标
 * @returns str1在前，返回-1，否则返回-2
 */
const sortStrByLetter = (str1: string = '', str2: string = '') => {
  const sortStr = (str1: string = '', str2: string = '', index: number) => {
    if (str1 === str2) return -1;
    // 字符串短的在前
    if (index >= str1.length || index >= str2.length) {
      return str1.length < str2.length ? -1 : 1;
    }
    const str1Char = str1.charCodeAt(index);
    const str2Char = str2.charCodeAt(index);
    // 字符排序较小的在前
    if (str1Char === str2Char) {
      return sortStr(str1, str2, index + 1);
    }
    return str1Char < str2Char ? -1 : 1;
  };

  return sortStr(str1, str2, 0);
};

/** 文件排序hook */
export const useFileSort = (fileList: Ref<StorageFileInfo[]>) => {
  const sortOrder = ref(SortOrder.sequence);
  const sortType = ref(SortType.letter);

  /** 按文件名字母排序 */
  const sortByLetter = (list: Ref<StorageFileInfo[]>) => {
    return list.value.slice().sort((a, b) => {
      if (a.type === FileType.dir && b.type !== FileType.dir) {
        return -1;
      } else if (b.type === FileType.dir && a.type !== FileType.dir) {
        return 1;
      }

      const compareNum = sortStrByLetter(a.name, b.name);
      const isReverse = sortOrder.value === SortOrder.reverse;
      return isReverse ? compareNum * -1 : compareNum;
    });
  };

  /** 按文件大小排序 */
  const sortBySize = (list: Ref<StorageFileInfo[]>) => {
    const res = list.value.slice().sort((a, b) => {
      if (a.type === FileType.dir && b.type !== FileType.dir) {
        return -1;
      } else if (b.type === FileType.dir && a.type !== FileType.dir) {
        return 1;
      }

      const isReverse = sortOrder.value === SortOrder.reverse;
      return isReverse ? b.fileSize - a.fileSize : a.fileSize - b.fileSize;
    });
    return res;
  };

  /** 按日期排序 */
  const sortByDate = (list: Ref<StorageFileInfo[]>) => {
    return list.value.slice().sort((a, b) => {
      if (a.type === FileType.dir && b.type !== FileType.dir) {
        return -1;
      } else if (b.type === FileType.dir && a.type !== FileType.dir) {
        return 1;
      }

      const isReverse = sortOrder.value === SortOrder.reverse;
      return isReverse ? b.updateTime - a.updateTime : a.updateTime - b.updateTime;
    });
  };
  /** 已经排好序的列表 */
  const sortedList = computed(() => {
    switch (sortType.value) {
      case SortType.letter:
        return sortByLetter(fileList);
      case SortType.size:
        return sortBySize(fileList);
      case SortType.date:
        return sortByDate(fileList);
      default:
        return fileList.value.slice();
    }
  });

  return {
    sortedList,
    sortOrder,
    sortType,
  };
};
