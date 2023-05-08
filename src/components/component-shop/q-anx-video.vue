<template>
  <ComponentBasic
    class="component-anx-video"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="''"
    :componentDescription="''"
    :className="$attrs.className"
  >
    <div class="anx-video">
      <div
        :class="[
          'anx-video-wrapper',
          {
            'anx-video-wrapper-fullscreen': state.fullScreen,
          },
        ]"
        ref="refVideoWrapper"
      >
        <video
          class="video"
          :style="{
            'object-fit': state.fullScreen ? 'contain' : 'fill',
          }"
          ref="refVideo"
          preload="auto"
          :controls="false"
          :src="currentVideo?.src ? storageService.getFileInfo(currentVideo?.src)?.src : ''"
          :poster="currentVideo?.poster ? storageService.getFileInfo(currentVideo?.poster)?.src : defaultImg"
          :loop="false"
          :webkit-playsinline="true"
          :playsinline="true"
          :x-webkit-airplay="false"
          :x5-video-player-type="true"
          :x5-video-player-fullscreen="true"
          v-bind="videoEvents"
          @dblclick="videoClick"
          @mousemove="state.showCover = true"
        />

        <div
          :class="['anx-video-controls-wrapper']"
          :style="{
            transform: `translateY(${state.showCover ? 0 : '100%'})`,
          }"
        >
          <div v-if="state.showHistory" class="anx-vidoe-controls_history">
            <span>上次播放到{{ currentVideo?.prevTime ? timeFormat(currentVideo?.prevTime) : '???' }}处，</span>
            <span @click="turnHistory">点击跳转</span>
          </div>
          <div class="anx-video-controls">
            <i
              v-if="state.fullScreen"
              :class="[state.isPlaying ? 'anx-video-icon-pause' : 'anx-video-icon-play']"
              @click="togglePlay"
            />
            <span class="anx-video-controls-time">{{ timeFormat(state.currentTime) }}</span>
            <Slider
              class="anx-video-controls_slider"
              :max="~~(state.duration * 10 || 100)"
              active-color="#ffffff"
              inactive-color="rgba(255, 255, 255, 0.2)"
              v-model="sliderValue"
              @change="onSliderChange"
              @dragStart="onDragStart"
              @dragEnd="onDragEnd"
            >
              <template #button>
                <div class="anx-video-controls_slider-thumb"></div>
              </template>
            </Slider>
            <span class="anx-video-controls-time">{{ timeFormat(state.duration) }}</span>
            <i
              :class="[state.fullScreen ? 'anx-video-icon-exit-fullscreen' : 'anx-video-icon-fullscreen']"
              @click="toggleScreen"
            />
          </div>
        </div>
      </div>

      <PlayControl
        :play-status="state.isPlaying ? 'pause' : 'play'"
        :show-fastforward="true"
        :showPreAndNextButton="dataList.length > 0"
        :prevDisabled="dataList.length === 0 || state.currentIndex === 0"
        :nextDisabled="dataList.length === 0 || state.currentIndex === dataList.length - 1"
        @togglePlay="togglePlay"
        @fastForward="fastForward"
        @backForward="backForward"
        @prev="prev"
        @next="next"
      />
    </div>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import PlayControl from './q-anx-video-play-control.vue';
import { computed, onMounted, onUnmounted, PropType, reactive, ref, useAttrs, watch, watchEffect } from 'vue';
import { timeFormat, toggleFullScreen, getQBasicProps } from '@/tools/common';
import { Slider } from 'vant';
import { state as eventState, service as eventService } from '@haku-design/event';
import { state as storageState, service as storageService } from '@/modules/storage-module';
import { MediaEvents, setMediaPlayPosition } from '@/lib/media';
import { EventTriggerType } from '@haku-design/event/enum';

const defaultImg = new URL('@/assets/img/temp/default-img.webp', import.meta.url).href;

interface VideoInfo {
  /** 视频地址 */
  src: string;
  /** 视频预览图地址 */
  poster: string;
  /** 视频总时长 */
  duration: string | number;
  /** 上次播放的时间点 */
  prevTime?: number;
}

const props = defineProps({
  /** 视频列表 */
  dataList: {
    type: Array as PropType<VideoInfo[]>,
    required: true,
    default: () => [],
  },
  /** 进入后播放资源的位置 */
  playPosition: {
    type: Number,
    default: 0,
  },
  /** 记住播放位置 */
  rememberPosition: {
    type: Boolean,
    default: true,
  },
});

const attrs = useAttrs() as Record<string, any>;

const emit = defineEmits<{
  (event: 'play', e: HTMLVideoElement): void;
  (event: 'pause', e: HTMLVideoElement): void;
  (event: 'timeupdate', e: HTMLVideoElement): void;
  (event: 'ended', e: HTMLVideoElement): void;
  (event: 'fastforward'): void;
  (event: 'backforward'): void;
  (event: 'prev'): void;
  (event: 'next'): void;
}>();

const refVideoWrapper = ref<HTMLElement>();
const refVideo = ref<HTMLVideoElement>();
/** 快进时间梯度5秒 */
const speed = 3;

const state = reactive({
  /** 当前播放视频的索引 */
  currentIndex: 0,
  /** 是否正在播放 */
  isPlaying: false,
  /** 总时长 */
  duration: 0,
  /** 当前时间点 */
  currentTime: 0,
  /** 是否全屏 */
  fullScreen: false,
  /** 是否显示播放控件 */
  showCover: true,
  /** 是否正在拖动进度条 */
  isDraging: false,
  /** 是否显示上次播放的进度 */
  showHistory: false,
  /** 视频是否能播放 */
  videoCanPlay: false,
  /** 记录有效播放时间段 */
  timeInfos: [] as { startTime: number; endTime: number }[],
  /** 是否是跳转指定位置 */
  seeking: false,
});

const sliderControl = () => {
  /** 时间轴的值 */
  const sliderValue = ref(0);
  /** 拖动进度条时视频是否在播放 */
  let dragBeforePlaying = false;

  const onSliderChange = (value: number) => {
    seekTo(value / 10);
  };

  const onDragStart = () => {
    state.isDraging = true;
    dragBeforePlaying = state.isPlaying;
    pause();
  };

  const onDragEnd = () => {
    state.isDraging = false;
    if (dragBeforePlaying) {
      play();
    }
  };

  watch(sliderValue, (value) => {
    if (state.isDraging) {
      seekTo(value / 10);
    }
  });

  return { sliderValue, onSliderChange, onDragStart, onDragEnd };
};

const { sliderValue, onSliderChange, onDragStart, onDragEnd } = sliderControl();

let timerId: number | null = null;
watchEffect(() => {
  if ((!state.isPlaying || state.isDraging) && timerId != null) {
    clearTimeout(timerId);
  }
  if (!state.isPlaying) {
    state.showCover = true;
  } else if (state.isPlaying && state.showCover && !state.isDraging) {
    if (timerId != null) {
      clearTimeout(timerId);
    }
    timerId = window.setTimeout(() => {
      state.showCover = false;
      timerId = null;
    }, 2000);
  }
});

/** 当前的视频信息 */
const currentVideo = computed(() => {
  if (props.dataList.length > 0) {
    return props.dataList[state.currentIndex];
  } else {
    return null;
  }
});

/** 播放暂停切换*/
const togglePlay = () => {
  if (state.isPlaying) {
    pause();
  } else {
    play();
  }
};

/** 播放 */
const play = async () => {
  refVideo.value?.play();
};

/** 暂停 */
const pause = () => {
  refVideo.value?.pause();
};

/** 停止 */
const stop = () => {
  if (refVideo.value) {
    refVideo.value.pause();
    refVideo.value.currentTime = 0;
  }
};

/** 跳转指定位置 */
const seekTo = (time: number) => {
  if (refVideo.value != null) {
    refVideo.value.currentTime = time;
  }
};

/** 播放上一个视频 */
const prev = () => {
  if (state.currentIndex > 0) {
    resetVideoInfo(state.currentIndex - 1);
  }
  emit('prev');
};

/** 播放下一个视频 */
const next = () => {
  if (state.currentIndex < props.dataList.length - 1) {
    resetVideoInfo(state.currentIndex + 1);
  }
  emit('next');
};

/** 快进 */
const fastForward = () => {
  let currentTime = state.currentTime;
  currentTime += speed;
  if (currentTime > state.duration) {
    currentTime = state.duration;
    pause();
  }
  seekTo(currentTime);
  emit('fastforward');
};

/** 快退 */
const backForward = () => {
  let currentTime = state.currentTime;
  currentTime -= speed;
  if (currentTime < 0) {
    currentTime = 0;
    pause();
  }
  seekTo(currentTime);
  emit('backforward');
};

/** 重置视频状态 */
const resetVideoInfo = (index: number, resetPrevTime = true) => {
  if (index < 0 || index > props.dataList.length - 1) {
    return;
  }
  if (resetPrevTime && currentVideo.value != null) {
    currentVideo.value.prevTime = 0;
  }
  if (state.isPlaying) {
    pause();
    state.isPlaying = false;
  }
  setTimeout(() => {
    state.currentIndex = index;
    state.timeInfos.splice(0);
    state.duration = parseFloat((currentVideo.value?.duration ?? 0).toString());
    state.currentTime = 0;
    sliderValue.value = 0;
    initHistory();
  });
};

/** 视频点击事件 */
const videoClick = () => {
  if (state.fullScreen) {
    state.showCover = !state.showCover;
  }
};

/** 全屏按钮 */
const toggleScreen = () => {
  if (!state.videoCanPlay) {
    // ios 上不会自动加载
    refVideo.value?.load();
    if (refVideo.value != null) {
      refVideo.value.oncanplay = function (e) {
        state.fullScreen = !state.fullScreen;
        toggleFullScreen(refVideoWrapper.value!, () => {
          state.fullScreen = false;
        });
      };
    }
  } else {
    state.fullScreen = !state.fullScreen;
    toggleFullScreen(refVideoWrapper.value!, () => {
      state.fullScreen = false;
    });
  }
};

/** 统计时长 */
const statisticsTime = (time: number, isBegin = true) => {
  if (isBegin) {
    state.timeInfos.push({ startTime: time, endTime: 0 });
  } else {
    state.timeInfos[state.timeInfos.length - 1].endTime = time;
  }
};

/** 有效时长 */
const effectiveTime = computed(() => {
  return state.timeInfos.reduce((prev, curr) => {
    return prev + (curr.endTime > curr.startTime ? curr.endTime - curr.startTime : 0);
  }, 0);
});

const videoEvents = {
  onCanplay: (e) => {
    state.videoCanPlay = true;
    state.duration = e.target.duration;
    currentVideo.value!.duration = e.target.duration;
  },
  onPlay: (e) => {
    state.isPlaying = true;
    state.showHistory = false;
    state.seeking = false;
    statisticsTime(e.target.currentTime);
    emit('play', e);
    eventService.emit(EventTriggerType.startPlay, attrs?.component?.id);
  },
  onPause: (e) => {
    state.isPlaying = false;
    state.showCover = true;
    if (!state.isDraging) {
      statisticsTime(e.target.currentTime, false);
    }
    emit('pause', e);
    eventService.emit(EventTriggerType.pausePlay, attrs?.component?.id);
  },
  onSeeking: (e) => {
    state.seeking = true;
  },
  onPlaying: (e) => {
    eventService.emit(EventTriggerType.loadingComplete, attrs?.component?.id);
  },
  onWaiting: (e) => {
    eventService.emit(EventTriggerType.loadingWaiting, attrs?.component?.id);
  },
  onTimeupdate: (e) => {
    state.currentTime = e.target.currentTime;
    if (!state.isDraging) {
      if (state.isPlaying) {
        statisticsTime(e.target.currentTime, state.seeking);
      }
      sliderValue.value = ~~(state.currentTime * 10);
    }
    state.seeking = false;
    emit('timeupdate', e);
  },
  onEnded: (e) => {
    state.isPlaying = false;
    state.showCover = true;
    emit('ended', e);
    eventService.emit(EventTriggerType.stopPlay, attrs?.component?.id);
    setMediaPlayPosition(attrs.component.id, state.currentIndex, undefined);
  },
} as MediaEvents;

/** 初始化上次播放数据 */
const initHistory = () => {
  if (currentVideo.value?.prevTime ?? 0 > 0) {
    state.showHistory = true;
    setTimeout(() => {
      state.showHistory = false;
    }, 5000);
  }
};

/** 跳转到上次播放的位置 */
const turnHistory = () => {
  if (!state.videoCanPlay) {
    if (refVideo.value != null) {
      refVideo.value.load();
      refVideo.value.oncanplay = function (e) {
        seekTo(currentVideo.value!.prevTime!);
        setTimeout(() => {
          play();
        }, 0);
      };
    }
  } else {
    seekTo(currentVideo.value!.prevTime!);
    play();
  }
};

/** 监听全屏变化 */
const handleFullscreenchange = () => {
  state.fullScreen = document.fullscreenElement != null;
};

/** 监听页面显示变化 */
const handleVisiable = (e) => {
  const visibilityState = e.target.visibilityState;
  if (visibilityState === 'hidden') {
    refVideo.value?.pause();
  }
};

onMounted(() => {
  refVideoWrapper.value?.addEventListener('fullscreenchange', handleFullscreenchange);
  document.addEventListener('visibilitychange', handleVisiable);
  resetVideoInfo(props.playPosition, false);
});

onUnmounted(() => {
  refVideoWrapper.value?.removeEventListener('fullscreenchange', handleFullscreenchange);
  document.removeEventListener('visibilitychange', handleVisiable);
});

defineExpose({
  play,
  pause,
  stop,
  prev,
  next,
  fastForward,
  backForward,
  seekTo,
  currentMediaInfo: currentVideo,
  effectiveTime,
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/app-variable.less';

.component-anx-video {
  padding: 0px;
}

.anx-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  .anx-video-wrapper {
    width: var(--anx-video-width);
    height: var(--anx-video-height);
    max-width: var(--anx-video-max-width);
    margin-bottom: var(--anx-video-controls-margin-top);
    position: relative;
    overflow: hidden;

    &.anx-video-wrapper-fullscreen {
      width: 100%;
      max-width: unset;
    }

    .video {
      height: 100%;
      width: 100%;
      background-color: #f2f2f2;

      &:focus {
        outline: none;
      }
    }

    .anx-video-controls-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      min-height: var(--anx-video-controls-wrapper-height);
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      transition: all 0.3s;
      z-index: 99;

      .anx-vidoe-controls_history {
        background: rgba(0, 0, 0, 0.7);
        border-radius: 6px;
        font-size: var(--anx-video-controls-font-size);
        padding: 8px;
        box-sizing: border-box;

        span {
          color: #fff;

          & + span {
            color: var(--anx-text-primary-color);
            cursor: pointer;
          }
        }
      }

      .anx-video-controls {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 3px 16px 15px 16px;
        box-sizing: border-box;

        .anx-video-controls-time {
          font-size: var(--anx-video-controls-font-size);
          color: #fff;
        }

        .anx-video-controls_slider {
          width: 0;
          flex-grow: 1;
          margin: 0 12px;

          .anx-video-controls_slider-thumb {
            width: var(--anx-video-controls-thumb-width);
            height: var(--anx-video-controls-thumb-height);
            background: #ffffff;
            border-radius: 1px;
          }
        }

        .anx-video-icon-play {
          .anx-video-icon();
          .icon-full-background-image();
          margin-right: var(--anx-video-controls-icon-space);
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAACfklEQVRoQ+2auY4UMRRFz0WCkIjhOyAjgZCZBIk/ICBg3/6ECCQixL6JXQKJGCT+gABBxr4EJBCA0ZXKaCSm6bKratq2qKy733P59PXy/PxExhNC2AUcAnYCS8Bn4ClwTtKTjCYnc1FKyyGEjcBZYP8//B4CByS9SWl7KttUwPPAvh6d+QqclHShh+2kJr0BQwgrwKPE3jzo1Hyb6DeaeQrgfWBPxpu/dGpezPAd7JIC+BHYMuCN/oM8N98NaCPZNQXwF9DbfkZPrOYJSZeSe5rp0LvDIYSQ+Y613O4BB9dDzUUBGtp7p9W8POIf91dTiwSMnbnbqfl+CtASAKOaxyRdHRuyFMDJ1CwNMKp5VNK1MdQsETBy3enm5ochoCUDmusTYDWv50KWDhi5bvt4JilZzVoAo5pHJN1IUbMmwMh1CzgsybHx3KdGQEMZzmrenEdYK2DkMqBBZ6pZO6BBvfAY0kO3yFh03ijr+7sXH89NB/F/nhYUXM3zGtgt6WX8sjVAc70Atkn64Q8tAprrlKTTLQM+l7SjZcBvkjb/B1y9PI2cdOq79OfaNT9Em15kvE1sl/S9xTn4ClhudaNvNlTzScIxaJPBdrPHJavmZNTc9EWNsaiHos9/vRJQNQFmpRBrAWw2bWjVfCmTncYvWUGn7p3sHXStViKgcyqjXaWVBjj6ZWgpgFbtuKQrueejWX4lAFo1z7VJyksWCeiSEqvWZBFCkWUkP4ENA+dI0YVA3o+2DgB0KZeLf9a1MC9lDnrj3ZsBWE0x3jLwOBGwnnJKg4UQ2i2I7QA3AWeaLWmOw3ONonSXMD/ritJTh3HiqE8z773IpDVbjnXzgL8Bl/tASN5kR+EAAAAASUVORK5CYII=');
        }

        .anx-video-icon-pause {
          .anx-video-icon();
          .icon-full-background-image();
          margin-right: var(--anx-video-controls-icon-space);
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAABMElEQVRoQ+2awQkCQRAEexJQTMIYDMAINBojMBqNwACMwSREExhRFA5R3BEK7o6+1z2W2umu/e2GRv7FyPPJAYdu2AZtsOcN+Ih2BWXmXNJW0lLS5E3eVdJB0iYiTv+IJfjNBp+bHyXNfgx/lrSohqT4lYA7SatGM/uIWDeufSzLTIRfCXj5cCy/ZbhGxLQYEOFXAmZl4IhoZj8NIvzmITITGeBVGsV3QLphmm+DdMM03wbphmm+DdIN03wbpBum+TZIN0zzbZBumObbIN0wzbdBumGab4N0wzTfBumGab4N0g3TfBukG6b5Nkg3TPNtkG6Y5lcMIheUnYAIvxIQuWLuBET4lYD3FxbjfYRwb5p45vEySPGbDXYHGdK/Aw7J1qdZbdAGe96Aj2jPBf0c7wZFwFxIcQWKIgAAAABJRU5ErkJggg==');
        }

        .anx-video-icon-exit-fullscreen {
          .anx-video-icon();
          .icon-full-background-image();
          margin-left: var(--anx-video-controls-icon-space);
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABEUlEQVRYR+2VMU5CQRRFz90AvdECEjtLNyCNlZGOuAobF4D0ykpsRHoJa6CjkMrE1g1cMuZrCEH+//OH/GamfTPvnbnz3h3R8lLL9ckAUQrYvgYmwIukxybPGAvwDlyFwpKicvxCRx22nQGyAlmBJXABfEo6TeoDtm+AhwNJz4DzIj6VNEgN8AF0qyRtakI/RrZbyHaw1tEBgC9gIWlYBbJsT5QTliWtE08KYPsOuAVO/oF4ljTbjiUBsB0+pifgsuT2a0m9YwD8GVMJwHj3+26sgO0wkqui8BtwL2ldtQ9SAAT5gwJh9SXNqxbfO4Z1Doe9xftngKxAqwp0gNeieQeSvus0cuMxrFNs394M0LoCG5aHbSFtgZHcAAAAAElFTkSuQmCC');
        }

        .anx-video-icon-fullscreen {
          .anx-video-icon();
          .icon-full-background-image();
          margin-left: var(--anx-video-controls-icon-space);
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABF0lEQVRYR+2WMWpCQRiEv7mAeIJAQCy9QmIbbLxCcgUbO9MFQirrBHIEIYWFEC+QQjsLwSN4gwkLEdSseUtW8lLstjv/zOy8/ff9oualmvUpBv5vArZvgD7Q+uGePEl6y7lH0QRsPwO3CcQbSZcJuJOQbwZsPwKDRNJ7SaNEbBQWM7AC2sA2fAJJ8xyBqtqYAX8VzSV1qwhy94uBkkBJIJbAO3ANZD8yuxa13QPGwOvxwxUz0AQuJC1ze3zPwO5QSDrQ/JO/oe1ioCRQXwK2Q0tPgAawlnQwYWV3ge1AHASCUNV6kDTcB53DQAdYVCkDL5LujnHZBgKh7TCWXZ0w8QHMJE1j+2cxkHD69KE0h+w3tSWB2hP4BCvFcyEtf8FnAAAAAElFTkSuQmCC');
        }

        .anx-video-icon {
          width: var(--anx-video-controls-icon-size);
          height: var(--anx-video-controls-icon-size);
        }

        .icon-full-background-image {
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center center;
        }
      }
    }
  }
}
</style>
