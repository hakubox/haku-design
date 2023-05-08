import { SetPartial } from '@/@types';
import { getAudioFile, getAudioImg } from '@/lib/audio';
import { createModelId } from '@/tools/common';
import { Howl } from 'howler';
import { reactive } from 'vue';
import type { AudioTimelineFragment, ComponentTimelineFragment, KeyFrame, SimpleAnimeConfig, TimeAxis, TimelineFragment, TimelineTrack } from './index.d';
import { simpleAnimeList } from './data/simple-anime';

export { simpleAnimeList } from './data/simple-anime';
export * from './index.d';

// http://cssanimation.io/index.html


/** 动画模块状态 */
export const state = reactive({
  /** 已绑定动画 */
  simpleAnimeConfig: {} as SimpleAnimeConfig,
  /** 简单动画列表 */
  simpleAnimeList,
  /** 时间轴列表 */
  timeAxisList: [
    { id: '123', isPlay: false }
  ] as TimeAxis[],
  /** 轨道列表 */
  trackList: [
    { id: 'aaa', timeAxisId: '123', type: 'component', },
    { id: 'bbb', timeAxisId: '123', type: 'audio', },
  ] as TimelineTrack[],
  /** 片段列表 */
  fragmentList: [
  ] as (AudioTimelineFragment | ComponentTimelineFragment)[],
  /** 关键帧列表（自动按时间升序排序） */
  keyframeList: [
    { id: 'aaa-1-1', fragmentId: 'aaa-1', isEnabled: true, time: 500, attrs: { x: 100, y: 120 } },
    { id: 'aaa-1-2', fragmentId: 'aaa-1', isEnabled: true, time: 1200, attrs: { x: 300, y: 20 } },
    { id: 'aaa-1-3', fragmentId: 'aaa-1', isEnabled: true, time: 2200, attrs: { x: 50, y: 200 } },
  ] as KeyFrame[],
});

/** 动画模块逻辑 */
export const service = {
  /** 获取轨道类型 */
  getTrack: (trackId: string) => {
    return state.trackList.find(i => i.id === trackId);
  },
  /** 新增片段 */
  addFragment: async (fragment: SetPartial<TimelineFragment, 'id' | 'type' | 'trackType' | 'timeAxisId' | 'lock' | 'disabled'>) => {
    const _basicFragment = {
      id: createModelId(5),
      type: 'normal',
      disabled: true,
      lock: false,
      ...fragment
    } as TimelineFragment;
    const _track = service.getTrack(_basicFragment.trackId);
    if (_track) {
      _basicFragment.timeAxisId = _track.timeAxisId;
      _basicFragment.trackType = _track.type;
    } else {
      throw new Error('未找到对应轨道');
    }
    if (_basicFragment.trackType === 'audio') {
      const _fragment = {
        ..._basicFragment,
        src: _basicFragment.target,
        buffer: new ArrayBuffer(0),
      } as SetPartial<AudioTimelineFragment, 'howl'>;
      if (typeof _basicFragment.target === 'string') {
        _fragment.buffer = await getAudioFile(_basicFragment.target);
      } else {
        _fragment.buffer = _basicFragment.target as ArrayBuffer;
      }
      const imageData = "data:audio/x-wav;base64," + btoa(new Uint8Array(_fragment.buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
      _fragment.howl = new Howl({
        src: imageData,
      });
      state.fragmentList.push(_fragment as AudioTimelineFragment);
      const _bgUrl = await getAudioImg(_fragment.buffer, {
        width: 200,
        height: 37,
        barColor: 'rgba(255,255,255,0.7)',
      });
      const _index = state.fragmentList.findIndex(i => i.id === _fragment.id);
      state.fragmentList[_index].bgUrl = _bgUrl;
    } else if (_basicFragment.trackType === 'component') {
      const _fragment = {
        ..._basicFragment,
        element: typeof _basicFragment.target === 'string' ? document.querySelector(_basicFragment.target) : _basicFragment.target,
      } as ComponentTimelineFragment;
      state.fragmentList.push(_fragment);
    }
  },
  /** 转换为时间 */
  formatTimeStr: (second: number, isMillisecond = false) => {
    if (!isMillisecond) {
      const _time = Math.floor(second);
      const _second = _time % 60;
      const _minute = (_time - _second) / 60;
      return `${('' + _minute).padStart(2, '0')}:${('' + _second).padStart(2, '0')}`;
    } else {
      const _time = Math.floor(second);
      const _second = _time % 60;
      const _minute = (_time - _second) / 60;
      const _millisecond = (second - _time);
      return `${('' + _minute).padStart(2, '0')}:${('' + _second).padStart(2, '0')}:${('' + _millisecond.toFixed(3).substring(2)).padStart(3, '0')}`;
    }
  },
}

export default {
  state,
  service
}