import { SetPartial } from '@haku-design/core';

/** 媒体事件 */
export interface MediaEvents {
  /** 播放准备完毕事件 */
  onCanplay(e: any): void;
  /** 开始播放事件 */
  onPlay(e: any): void;
  /** 暂停播放事件 */
  onPause(e: any): void;
  /** 跳转事件 */
  onSeeking(e: any): void;
  /** 时间更新事件 */
  onTimeupdate(e: any): void;
  /** 播放结束事件 */
  onEnded(e: any): void;
}

/** 媒体信息 */
interface MediaInfo {
  /** 组件Id */
  componentId: string;
  /** 组件存在多个音视频时，当前项索引 */
  index: number;
  /** 对应文件Id */
  fileId?: string;
  /** 总时长（毫秒） */
  duration?: number;
  /** 播放位置（毫秒） */
  playPosition?: number;
  /** 是否全屏 */
  fullScreen?: boolean;
  /** 创建时间 */
  createTime: number;
}

/** 记录媒体信息的缓存KEY */
const MediaInfoStorageKey = '__hakuform__mediainfo__';

/** 获取媒体信息列表 */
export function getMediaInfoList(): MediaInfo[] {
  const _list = localStorage.getItem(MediaInfoStorageKey);
  return _list ? JSON.parse(_list) : [];
}

/** 获取特定媒体信息列表 */
export function getMediaInfo(componentId: string, index: number = 0): { index: number; info?: MediaInfo } | undefined {
  const _list = getMediaInfoList();
  if (!_list.length) return undefined;
  const _index = _list.findIndex((i) => i.componentId === componentId && i.index === index);
  if (_index >= 0) return { index: _index, info: _list[_index] };
  return undefined;
}

/** 记录媒体信息 */
export function setMediaInfo(info: SetPartial<MediaInfo, 'createTime'>) {
  const _list = getMediaInfoList();
  if (_list.length) {
    const _index = _list.findIndex((i) => i.componentId === info.componentId && i.index === info.index);
    if (_index >= 0) {
      _list[_index] = {
        ..._list[_index],
        ...info,
        createTime: new Date().getTime(),
      };
    } else {
      _list.push({
        ...info,
        createTime: new Date().getTime(),
      });
    }
  }
  localStorage.setItem(MediaInfoStorageKey, JSON.stringify(_list));
}

/** 记录媒体播放位置 */
export function setMediaPlayPosition(componentId: string, index: number = 0, playPosition?: number) {
  const _list = getMediaInfoList();
  if (_list.length) {
    const _index = _list.findIndex((i) => i.componentId === componentId && i.index === index);
    if (_index >= 0) {
      _list[_index].playPosition = playPosition;
    } else if (playPosition !== undefined) {
      _list.push({
        componentId,
        index,
        createTime: new Date().getTime(),
      });
    }
  }
  localStorage.setItem(MediaInfoStorageKey, JSON.stringify(_list));
}

/** 清除旧媒体信息（默认清除30天以前的） */
export function clearOldMediaInfo(dayCount: number = 30): void {
  const _list = getMediaInfoList();
  if (_list.length) return;
  localStorage.setItem(
    MediaInfoStorageKey,
    JSON.stringify(
      _list.filter((i) => {
        return i.createTime > new Date().getTime() - 3600000 * 24 * dayCount;
      }),
    ),
  );
}
