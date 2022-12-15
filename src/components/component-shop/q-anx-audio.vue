<template>
  <q-basic
    class="component-anx-audio"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="''"
    :componentDescription="''"
    :className="$attrs.className"
  >
    <div class="anx-audio">
      <span v-if="currentAudio?.title" class="anx-audio-title">{{ currentAudio?.title }}</span>

      <div class="anx-audio-wrapper">
        <audio
          ref="refAudio"
          :src="currentAudio?.src ? storageService.getFileInfo(currentAudio?.src)?.src : ''"
          :controls="false"
          v-bind="audioEvents"
        />
        <img
          class="anx-audio-poster"
          v-if="currentAudio?.poster"
          :src="storageService.getFileInfo(currentAudio?.poster)?.src"
          alt=""
        />
      </div>

      <div class="anx-audio-contorls">
        <div
          class="anx-vidoe-controls_history"
          :style="{
            visibility: state.showHistory ? 'visible' : 'hidden',
          }"
        >
          <span>上次播放到{{ currentAudio?.prevTime ? timeFormat(currentAudio?.prevTime) : '???' }}处，</span>
          <span @click="turnHistory">点击跳转</span>
        </div>

        <Slider
          class="anx-audio-controls_slider"
          :max="~~(state.duration * 10 || 100)"
          active-color="linear-gradient(90deg, #8A9FFF 0%, #7583FF 100%)"
          inactive-color="#CCD0EB"
          v-model="sliderValue"
          @change="onSliderChange"
          @dragStart="onDragStart"
          @dragEnd="onDragEnd"
        >
          <template #button>
            <div class="anx-audio-controls_slider-thumb">
              <div class="anx-audio-controls_slider-thumb-inner" />
            </div>
          </template>
        </Slider>

        <div class="anx-audio-controls-time">
          <span>{{ timeFormat(state.currentTime) }}</span>
          <span>{{ timeFormat(state.duration) }}</span>
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
  </q-basic>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
    components: { Slider }
};
</script>
<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, ref, watch, useAttrs } from 'vue';
import { timeFormat } from '@/tools/common';
import { service as storageService } from '@/modules/storage-module';
import { service as eventService } from '@/modules/event-module';
import { MediaEvents, setMediaPlayPosition } from '@/lib/media';
import { getQBasicProps } from '@/tools/common';
import { EventTriggerType } from '@/modules/event-module/enum';
import PlayControl from './q-anx-video-play-control.vue';
import { Slider } from 'vant';

/** 音频信息 */
interface AudioInfo {
  /** 音频地址 */
  src: string;
  /** 音频预览图地址 */
  poster: string;
  /** 音频总时长 */
  duration: string | number;
  /** 音频标题 */
  title: string;
  /** 上次播放的时间点 */
  prevTime?: number;
}

const props = defineProps({
  dataList: {
    type: Array as PropType<AudioInfo[]>,
    required: true,
    default: () => [],
  },
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

const refAudio = ref<HTMLAudioElement>();
/** 快进时间梯度5秒 */
const speed = 3;

const state = reactive({
  audio: new Audio(),
  /** 当前播放的索引 */
  currentIndex: 0,
  /** 是否正在播放 */
  isPlaying: false,
  /** 总时长 */
  duration: 0,
  /** 当前时间点 */
  currentTime: 0,
  /** 是否正在拖动进度条 */
  isDraging: false,
  /** 是否显示上次播放的进度 */
  showHistory: false,
  /** 音频是否能播放 */
  audioCanPlay: false,
  /** 记录有效播放时间段 */
  timeInfos: [] as Array<{ startTime: number; endTime: number }>,
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

  /** 拖拽开始 */
  const onDragStart = () => {
    state.isDraging = true;
    dragBeforePlaying = state.isPlaying;
    pause();
  };

  /** 拖拽结束 */
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

/** 当前的音频信息 */
const currentAudio = computed(() => props.dataList?.[state.currentIndex]);

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
  state.audio.play();
};

/** 暂停 */
const pause = () => {
  state.audio.pause();
};

/** 停止 */
const stop = () => {
  if (state.audio) {
    state.audio.pause();
    state.audio.currentTime = 0;
  }
};

/** 跳转指定位置 */
const seekTo = (time: number) => {
  state.audio.currentTime = time;
};

/** 播放上一首 */
const prev = () => {
  if (state.currentIndex > 0) {
    resetAudioInfo(state.currentIndex - 1);
  }
  emit('prev');
};

/** 播放下一首 */
const next = () => {
  if (state.currentIndex < props.dataList.length - 1) {
    resetAudioInfo(state.currentIndex + 1);
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

/** 重置状态 */
const resetAudioInfo = (index: number, resetPrevTime = true) => {
  if (index < 0 || index > props.dataList.length - 1) {
    return;
  }
  if (resetPrevTime && currentAudio.value != null) {
    currentAudio.value.prevTime = 0;
  }
  if (state.isPlaying) {
    pause();
    state.isPlaying = false;
  }
  setTimeout(() => {
    state.currentIndex = index;
    state.timeInfos.splice(0);
    state.duration = parseFloat((currentAudio.value?.duration ?? 0).toString());
    state.currentTime = 0;
    sliderValue.value = 0;
    initHistory();
  });
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

const audioEvents = {
  onCanplay: (e) => {
    state.audioCanPlay = true;
    state.duration = e.target.duration;
    currentAudio.value!.duration = e.target.duration;
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
    console.log('onPlaying', e);
  },
  onWaiting: (e) => {
    console.log('onWaiting', e);
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
    emit('ended', e);
    eventService.emit(EventTriggerType.stopPlay, attrs?.component?.id);
    setMediaPlayPosition(attrs.component.id, state.currentIndex, undefined);
  },
} as MediaEvents;

const initAudio = () => {
  state.audio = refAudio.value!;

  state.audio.onended = () => {};
};

/** 初始化上次播放数据 */
const initHistory = () => {
  if (currentAudio.value?.prevTime ?? 0 > 0) {
    state.showHistory = true;
    setTimeout(() => {
      state.showHistory = false;
    }, 5000);
  }
};

/** 跳转到上次播放的位置 */
const turnHistory = () => {
  if (!state.audioCanPlay) {
    state.audio.load();
    state.audio.oncanplay = (e) => {
      seekTo(currentAudio.value!.prevTime!);
      setTimeout(() => {
        play();
      }, 0);
    };
  } else {
    seekTo(currentAudio.value!.prevTime!);
    play();
  }
};

onMounted(() => {
  initAudio();
  resetAudioInfo(props.playPosition, false);
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
  currentMediaInfo: currentAudio,
  effectiveTime,
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/app-variable.less';

.anx-audio {
  width: 100%;
  max-width: var(--anx-audio-max-width);
  margin: 0 auto;
  padding: var(--anx-audio-padding);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .anx-audio-title {
    color: var(--anx-text-content-color);
    font-size: var(--anx-audio-title-font-size);
    font-weight: 600;
    margin-top: var(--anx-audio-title-margin-top);
    text-align: center;
  }

  .anx-audio-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: var(--anx-audio-wrapper-margin-top);
    .anx-audio-poster {
      width: 100%;
      margin-bottom: 30px;
      max-width: var(--anx-audio-poster-max-width);
      height: var(--anx-audio-poster-height);
      background: #d8d8d8;
      border-radius: var(--anx-audio-poster-border-raduis);
    }
  }

  .anx-audio-contorls {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .anx-vidoe-controls_history {
      position: absolute;
      bottom: calc(100% - 6px);
      background: rgba(0, 0, 0, 0.7);
      border-radius: var(--anx-audio-history-border-raduis);
      font-size: var(--anx-audio-font-size);
      padding: var(--anx-audio-history-padding);
      box-sizing: border-box;
      margin: var(--anx-audio-history-margin);

      span {
        color: #fff;

        & + span {
          color: var(--anx-text-primary-color);
          cursor: pointer;
        }
      }
    }

    .anx-audio-controls_slider {
      width: 100%;
      height: var(--anx-audio-slider-height);
      margin-bottom: var(--anx-audio-slider-margin-top);

      .anx-audio-controls_slider-thumb {
        width: var(--anx-audio-slider-thumb-size);
        height: var(--anx-audio-slider-thumb-size);
        padding: 13.6%;
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid #ffffff;
        background: rgba(136, 156, 255, 0.44);
        box-shadow: 0px 8px 10px 0px rgba(136, 156, 255, 0.44);
        cursor: pointer;

        .anx-audio-controls_slider-thumb-inner {
          width: 100%;
          height: 100%;
          background: #7583ff;
          border-radius: 50%;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: 22%;
            left: 22%;
            right: 22%;
            bottom: 22%;
            border-radius: 50%;
            background-color: #ffffff;
          }
        }
      }
    }

    .anx-audio-controls-time {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--anx-text-des-color);
      font-size: 12px;
      margin-bottom: 30px;
    }
  }
}
</style>
