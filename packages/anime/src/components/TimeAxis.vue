<template>
  <div class="time-axis" v-if="!state.isError">
    <!-- 示例：横向时间区间滚动条 -->

    <div class="time-axis-tools">
      <button type="button" class="time-axis-tool" @click="startPlay">{{ state.isPlaying ? '暂停' : '开始' }}</button>
      <button type="button" class="time-axis-tool" @click="reset">重置</button>

      <button type="button" class="time-axis-tool checkbox" @click="state.isLoop = !state.isLoop" :class="{ checked: state.isLoop }">循环</button>
      <button type="button" class="time-axis-tool checkbox" @click="state.isReverse = !state.isReverse" :class="{ checked: state.isReverse }">倒放</button>

      <select title="播放速度" class="time-axis-tool select" v-model="state.playSpeed" @change="changeSpeed">
        <option :value="item.value" v-for="item in state.speedList">{{ item.label }}</option>
      </select>

      <label class="time-axis-label right">{{ animeService.formatTimeStr(state.currentTime / 1000, true) }}</label>
    </div>

    <!-- 内容区域 -->
    <div class="time-axis-body" ref="timeAxisEl">

      <!-- 左侧栏 -->
      <div class="left-tools">
        
      </div>

      <!-- 右侧内容 -->
      <div class="right-content" ref="timeAxisContentEl">
        
        <!-- 上方时间轴 -->
        <div class="timer-list" :style="{ '--unit-length': `${props.unitLength}px` }">
          <div class="timer-item"
            :value="item[1]"
            v-for="item in getTimeCount()"
            :key="item[0]"
          >
          </div>
        </div>

        <!-- 游标 -->
        <div class="cursor" ref="cursorEl" :style="{
          transform: `translateX(${getCursorLocation()}px)`
        }"></div>

        <!-- 轨道列表 -->
        <div class="track-list">

          <div
            v-for="track in animeState.trackList"
            :key="track.id"
            class="track-item"
            :class="`track-${track.type}`"
          >
            <div class="fragment-list">
              <div
                v-for="fragment in animeState.fragmentList.filter(i => i.trackId === track.id)"
                class="fragment-item"
                :class="`fragment-${getTrackType(track.id)}`"
                :style="{
                  left: `${fragment.startTime / 1000 * props.unitLength}px`,
                  width: `${(fragment.endTime - fragment.startTime) / 1000 * props.unitLength}px`
                }"
              >
                <span class="fragment-item-title">{{ fragment.title }}</span>
                <div class="keyframe-list">
                  <div
                    v-for="keyframe in animeState.keyframeList.filter(i => i.fragmentId === fragment.id)"
                    class="keyframe-item"
                    :class="{
                      enabled: keyframe.isEnabled
                    }"
                    :style="{
                      left: `${keyframe.time / 1000 * props.unitLength - 3}px`
                    }"
                    @click="clickKeyFrame(keyframe)"
                  ></div>
                </div>
                <img v-if="fragment.bgUrl" :src="fragment.bgUrl" class="keyframe-item-bg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="time-axis">
    发生异常!!!
  </div>
</template>

<script lang="ts" setup>
import { createModelId } from '@haku-design/common';
import { PropType, reactive, ref, onMounted, computed, onUnmounted } from 'vue';
import gsap from 'gsap';
import type { AudioTimelineFragment, ComponentTimelineFragment, KeyFrame, TimelineFragment, TimelineTrack } from '../@types/timeline';
import { state as animeState, service as animeService } from '../../';
import { TimeAxis } from '../@types';

/** 时间轴节点 */
const timeAxisEl = ref<HTMLElement>();
/** 时间轴内容区节点（滚动条） */
const timeAxisContentEl = ref<HTMLElement>();
/** 游标节点 */
const cursorEl = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'progress', second: number, attrs: { fragmentId: string, attrs: Record<string, any> }[]): void;
}>();

const props = defineProps({
  /** 方向 */
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    required: true
  },
  /** 时间轴Id */
  axisId: {
    type: String,
    required: true
  },
  /** 是否仅能拖拽到刻度上 */
  onlydot: {
    type: Boolean,
    default: true,
  },
  /** 单位长度（1单位长度，默认100px） */
  unitLength: {
    type: Number,
    default: 100
  },
  /** 最小值 */
  min: {
    type: Number,
    default: 0,
  },
  /** 最大值 */
  max: {
    type: Number,
  },
  /** 单位 */
  unit: {
    type: String,
  }
});

const state = reactive({
  /** 放大系数 */
  scale: 1.0,
  /** 是否错误 */
  isError: false,
  /** 绑定时间轴 */
  timeAxis: {} as TimeAxis,
  /** 是否播放中 */
  isPlaying: false,
  /** 当前时间（毫秒） */
  currentTime: 0,
  /** 游标跟随 */
  isCursorFollow: true,
  /** 是否倒放 */
  isReverse: false,
  /** 是否循环 */
  isLoop: false,
  /** 播放速度 */
  playSpeed: 1.0,
  /** 播放速度列表 */
  speedList: [
    { label: 'x0.1', value: 0.1 },
    { label: 'x0.2', value: 0.2 },
    { label: 'x0.5', value: 0.5 },
    { label: 'x1.0', value: 1.0 },
    { label: 'x2.0', value: 2.0 },
    { label: 'x5.0', value: 5.0 },
  ],
  /** 测试用的属性组 */
  testAttrs: {} as Record<string, number>,
  /** 原始属性 */
  originTestAttrs: {} as Record<string, any>,
  /** 时间线 */
  timeLine: {} as gsap.core.Timeline,
});

/** 重设时间线 */
const resetTimeLine = () => {
  
  gsap.globalTimeline.pause();
  // gsap.globalTimeline.add()
  // gsap.globalTimeline.
};

/** 动画回调 */
const onTicker = (
  /** 时间 */
  time: number,
  /** 时间增量 */
  deltaTime: number,
  /** 帧数 */
  frame: number,
  /** 经过时间 */
  elapsed: number
) => {
  console.log(time, deltaTime, frame);
};

/** 点击关键帧（禁用） */
const clickKeyFrame = (keyFrame: KeyFrame) => {
  keyFrame.isEnabled = !keyFrame.isEnabled;
};

/** 获取某个时间点下的属性组 */
const getAttrsByTime = (time: number) => {
  // 1. 判断进入了某个片段
  return animeState.fragmentList.map(fragment => {

    if (time >= fragment.startTime && time < fragment.endTime) {
      
      if (fragment.trackType === 'component') {
        // 2. 判断是否有关键帧
        const _keyframes = animeState.keyframeList.filter(i => i.fragmentId === fragment.id && i.isEnabled);
        if (_keyframes.length) {
          // 3. 判断目前在哪一段区间
          let _keyframe: KeyFrame | undefined;
          let _keyframeIndex = 0;
          const _time = time - fragment.startTime;
          for (let i = 0; i < _keyframes.length; i++) {
            if (_time < _keyframes[i].time && (i === 0 || _time > _keyframes[i - 1].time)) {
              _keyframe = _keyframes[i];
              _keyframeIndex = i;
              break;
            }
          }
          // 4. 根据距离拿到当前应该设置的属性值
          if (_keyframe) {
            let progress = 0;
            const _attrs = {} as Record<string, any>;
            if (_keyframeIndex === 0) {
              progress = _time / _keyframe.time;
              Object.entries(_keyframe.attrs).map(([key, value]) => {
                _attrs[key] = state.testAttrs[key] + (value - state.testAttrs[key]) * progress;
                // fragment.element.style[key] = value;
              });
            } else {
              progress = (_time - _keyframes[_keyframeIndex - 1].time) / (_keyframe.time - _keyframes[_keyframeIndex - 1].time);
              const _oldAttrs = _keyframes[_keyframeIndex - 1].attrs;
              Object.entries(_keyframe.attrs).map(([key, value]) => {
                _attrs[key] = _oldAttrs[key] + (value - _oldAttrs[key]) * progress;
                // fragment.element.style[key] = value;
              });
            }
            
            return { fragmentId: fragment.id, attrs: _attrs };
          }
        }
      } else if (fragment.trackType === 'audio') {
        if (!fragment.howl.playing()) {
          fragment.howl.play();
        }
      }
    } else {
      if (fragment.trackType === 'audio') {
        if (fragment.howl.playing()) {
          console.log('fragment.howl', fragment.howl);
          fragment.howl.stop(fragment.howl._id);
        }
      }
    }
    
    return undefined;
  }).filter(i => i !== undefined) as unknown as { fragmentId: string, attrs: Record<string, any> }[];
};

let _prevTime = 0;
/** 自动调用的全局时间轴计时器 */
const _globalTimerFn = () => {
  if (state.isPlaying) {
    const _now = Date.now();
    if (!state.isReverse) {
      state.currentTime += (_now - _prevTime) * state.playSpeed;
      _prevTime = _now;

      if (state.currentTime > getMaxTime.value) {
        state.currentTime = 0;
        timeAxisContentEl.value!.scrollLeft = 0;
        
        if (!state.isLoop) {
          state.isPlaying = false;
        }
        emit('progress', 0, [{ fragmentId: '', attrs: state.originTestAttrs }]);
      }
    } else {
      state.currentTime -= (_now - _prevTime) * state.playSpeed;
      _prevTime = _now;

      if (state.currentTime <= 0) {
        state.currentTime = getMaxTime.value;
        timeAxisContentEl.value!.scrollLeft = timeAxisContentEl.value!.scrollWidth;
        
        if (!state.isLoop) {
          state.isPlaying = false;
        }
        emit('progress', 0, [{ fragmentId: '', attrs: state.originTestAttrs }]);
      }
    }

    if (state.isCursorFollow && timeAxisContentEl.value) {
      const _cursorLocation = getCursorLocation();
      if (_cursorLocation < timeAxisContentEl.value.scrollLeft + 30) {
        timeAxisContentEl.value.scrollLeft = _cursorLocation - 30;
      } else if (_cursorLocation > timeAxisContentEl.value.scrollLeft + timeAxisContentEl.value.offsetWidth - 30) {
        timeAxisContentEl.value.scrollLeft = _cursorLocation - timeAxisContentEl.value.offsetWidth + 30;
      }
    }
    
    getAttrsByTime(state.currentTime);
    emit('progress', state.currentTime / 1000, [{ fragmentId: '', attrs: {} }]);
  }

  requestAnimationFrame(_globalTimerFn);
};

/** 获取轨道类型 */
const getTrackType = (trackId: string) => {
  return animeState.trackList.find(i => i.id === trackId)?.type;
}

/** 获取游标位置 */
const getCursorLocation = () => {
  return props.unitLength * state.currentTime / 1000;
}

/** 修改声音 */
const changeSpeed = () => {
  getActiveAudioFragmentList().forEach(i => {
    if (i.trackType === 'audio') {
      i.howl.rate(state.playSpeed);
    } else if (i.trackType === 'component') {
      
    }
  });
};

/** 开始播放 */
const startPlay = () => {
  getActiveAudioFragmentList().forEach(i => {
    if (i.trackType === 'audio') {
      if (state.isPlaying) {
        i.howl.pause();
      } else {
        i.howl.play();
      }
    } else if (i.trackType === 'component') {
      
    }
  });
  state.isPlaying = !state.isPlaying;
  _prevTime = Date.now();
};

/** 获取激活状态音频片段列表 */
const getActiveAudioFragmentList = () => {
  const _fragmentList = animeState.fragmentList.filter(i => {
    return i.timeAxisId == props.axisId && 
      state.isPlaying && 
      state.currentTime >= i.startTime && 
      state.currentTime < i.endTime;
  });
  return _fragmentList as (AudioTimelineFragment | ComponentTimelineFragment)[];
}

/** 重置 */
const reset = () => {
  state.currentTime = 0;
  getActiveAudioFragmentList().forEach(i => {
    if (i.trackType === 'audio') {
      i.howl.stop();
    } else if (i.trackType === 'component') {

    }
  });
};

const getMaxTime = computed(() => {
  return 5000;
});

/** 获取时间列表 */
const getTimeCount = () => {
  if (timeAxisEl.value) {
    // const _width = timeAxisEl.value.offsetWidth;
    // let _count = Math.ceil(_width / props.unitLength);
    // if (props.max && _count > props.max) _count = Math.ceil(props.max);
    // else if (props.min && _count < props.min) _count = Math.floor(props.min);
    const _count = getMaxTime.value / 1000;
    const _arr = [] as [number, string][];
    for (let i = props.min; i <= _count; i++) {
      _arr.push([i, animeService.formatTimeStr(i)]);
    }
    return _arr;
  } else {
    return 0;
  }
};

/** 鼠标滚轮设置缩放比事件 */
const onSetScale = (e: WheelEvent) => {
  if (e.deltaY > 0) {
    state.scale -= 0.2;
  } else if (e.deltaY < 0) {
    state.scale += 0.2;
  }
}

onMounted(async () => {

  const _timeAxis = animeState.timeAxisList.find(i => i.id === props.axisId);
  if (!_timeAxis) {
    state.isError = true;
    throw new Error('未查询到时间轴');
  } else {
    state.timeAxis = _timeAxis;
  }

  window.addEventListener('wheel', onSetScale);
  _globalTimerFn();
  // gsap.ticker.add(onTicker);
  resetTimeLine();
});

onUnmounted(() => {
  gsap.ticker.remove(onTicker);
});

defineExpose({
})
</script>

<style lang="less" scoped>
.time-axis {
  position: relative;
  background-color: #1B1B1C;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  border-radius: 6px;
  
  > .time-axis-tools {
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 34px;
    background-color: #29292D;
    padding-left: 6px;
    margin-bottom: 2px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    > .time-axis-label {
      color: #BBB;
      border: none;
      font-size: 12px;
      border: 1px solid #666;
      padding: 1px 8px;
      border-radius: 3px;

      + .time-axis-label,
      + .time-axis-tool {
        margin-left: 6px;
      }
    }

    > .time-axis-tool {
      color: #888;
      border: none;
      background-color: rgba(255,255,255,0.0);
      font-size: 12px;
      border-radius: 4px;
      transition: 0.12s background-color;

      + .time-axis-tool,
      + .time-axis-label {
        margin-left: 6px;
      }

      &:hover {
        background-color: rgba(255,255,255,0.2);
      }

      &.checkbox {

        &.checked {
          color: #EEE;
          outline: 1px solid #666;
        }
      }

      &.right {
        float: right;
      }

      &.select {
        background-color: transparent;
        height: 21px;

        &:focus {
          outline: 1px solid #666;
        }

        > option {
          background-color: #29292D;
          border: none;
          line-height: 30px;
          font-size: 12px;
        }
      }
    }
  }

  > .time-axis-body {
    flex-grow: 1;
    flex-shrink: 1;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    padding: 0px 0px 0px 0px;
    height: 100%;

    > .left-tools {
      flex-shrink: 0;
      flex-grow: 0;
      width: 150px;
      border-right: 1px solid #222223;
      margin-right: 4px;
    }

    > .right-content {
      position: relative;
      flex-shrink: 1;
      flex-grow: 1;
      overflow-x: auto;
      overflow-y: hidden;
      width: 100%;
      padding-left: 5px;

      // 轨道列表
      > .track-list {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(100% - 20px);

        > .track-item {
          position: relative;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 60px;
              
          + .track-item {
            margin-top: 5px;
          }

          > .fragment-list {
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 60px;

            // 片段
            > .fragment-item {
              cursor: grab;
              user-select: none;
              position: absolute;
              display: block;
              background-color: #CCC;
              height: 60px;
              border-radius: 4px;

              &:active {
                cursor: grabbing;
              }

              &.fragment-component {
                background-color: #284B51;

                &.active {
                  outline: 2px solid #205963;
                }
              }

              &.fragment-audio {
                background-color: #1C3056;
                
                &.active {
                  outline: 2px solid #153570;
                }
              }

              > .fragment-item-title {
                position: relative;
                display: inline-block;
                margin-top: 2px;
                margin-left: 4px;
                font-size: 12px;
                color: white;
              }

              > .keyframe-item-bg {
                pointer-events: none;
                display: block;
                width: 100%;
                height: 37px;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
              }

              // 关键帧
              > .keyframe-list {
                position: absolute;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                height: 18px;

                > .keyframe-item {
                  position: absolute;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  width: 18px;
                  height: 18px;
                  transform: scaleX(0.7);
                  padding: 2px;

                  &:before {
                    content: '';
                    position: absolute;
                    display: block;
                    left: 7px;
                    top: 7px;
                    width: 5px;
                    height: 5px;
                    transform: rotate(45deg);
                    outline: 2px solid #AAA;
                  }

                  &.enabled {

                    &:before {
                      outline: 2px solid #EEE;
                      background-color: #EEE;
                    }
                  }
                }
              }
            }
          }
        }
      }

      > .timer-list {
        --unit-length: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        height: 25px;

        > .timer-item {
          position: relative;
          flex-shrink: 0;
          flex-grow: 0;
          display: block;
          top: 4px;
          border-left: 1px solid #686868;
          width: var(--unit-length);
          height: 14px;

          &:after {
            content: attr(value);
            position: absolute;
            top: 4px;
            left: 3px;
            color: #727272;
            font-size: 12px;
            transform: scale(0.9);
          }

          &:before {
            content: '';
            position: absolute;
            left: -1px;
            top: 0px;
            width: 1px;
            height: 6px;
            box-shadow: calc(var(--unit-length) / 10) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 2) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 3) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 4) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 5) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 6) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 7) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 8) 0px 0px 0px rgba(255,255,255,0.15),
              calc(var(--unit-length) / 10 * 9) 0px 0px 0px rgba(255,255,255,0.15);
          }
        }
      }

      > .cursor {
        position: absolute;
        display: block;
        top: 16px;
        left: 5px;
        bottom: 0px;
        width: 0px;
        height: 100%;
        border-left: 2px solid #818182;
        will-change: transform;
        z-index: 1;

        &:before {
          content: '';
          position: absolute;
          top: -16px;
          left: -5px;
          border: 2px solid #FFFFFF;
          width: 8px;
          height: 16px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }

    
  }
}
</style>