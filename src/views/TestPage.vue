<template>
  <div>
    <!-- 目前暂时用于Monaco编辑器测试 -->
    <!-- <code-editor style="height: 70vh" language="json" v-model:value="state.editorJson" @change="valueChange"> </code-editor> -->
    <hr />
    <!-- <button @click="setValue">值改变</button>
    {{ state.editorJson }} -->

    <!-- <div class="my-drag-box" :class="{ isdrag: state.isDrag }"></div> -->

    <ul class="anime-list" ref="animeList" style="margin-top: 50px;margin-left: 50px;">
      <li class="anime-item"
        v-for="(anime, index) in simpleAnimeList"
        :key="index"
        :anime="anime.animeName"
        :class="{ current: state.currentAnimeIndex === index }"
        @click="setAnime(index)"
        @mouseenter="$event => startAnime($event, anime)"
      >
        <img src="@/modules/anime-module/assets/img/block.png" />
        <span>{{ anime.animeTitle }}</span>
      </li>
    </ul>

    <GeneralEditor
      style="width: 300px; margin-left: 50px;"
      labelWidth="80px"
      :model="state.animeConfig"
      :propertys="state.animeConfigList"
      :groups="[{ title: '动画配置', name: 'anime', icon: '' }]"
      @change="replay"
    ></GeneralEditor>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { Gesture, DragGesture } from '@use-gesture/vanilla';
import { gsap } from 'gsap';
import { message } from 'ant-design-vue';
import { simpleAnimeList } from '@/modules/anime-module';
import { SimpleAnime, SimpleAnimeConfig } from '@/modules/anime-module/@types';
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';
import { GeneralProperty } from '@/@types';
import { ComponentPropertyEditor } from '@/@types/enum';

const defaultImg = new URL('@/modules/anime-module/assets/img/block.png', import.meta.url).href;

const state = reactive({
  index: 200,
  editorJson: '',
  /** 是否焦点 */
  isDrag: false,
  value: [],
  /** 当前动画索引 */
  currentAnimeIndex: 0,
  /** 当前动画名称 */
  currentAnimeName: '',
  /** 动画配置 */
  animeConfig: {} as Record<string, any>,
  /** 动画配置列表 */
  animeConfigList: [] as GeneralProperty[]
});

const animeList = ref<HTMLElement>();

const startAnime = ({ target }, anime: SimpleAnime) => {
  const _dom = (target as HTMLElement)?.firstChild as HTMLElement;
  if (anime.animeFn) {
    const defaultAttrs = getDefaultProps(anime);
    const attrs = state.currentAnimeName === anime.animeName ? state.animeConfig : defaultAttrs;
    anime.animeFn(_dom, {
      loop: 10,
      ...attrs,
      duration: state.animeConfig.duration ?? 1000,
    })?.play();
  }
};

const getDefaultProps = (anime: SimpleAnime) => {
  const _attrs = {} as Record<string, any>;
  anime.propertys?.forEach(item => {
    if (item.default) {
      if (typeof item.name === 'string') {
        _attrs[item.name] = item.default;
      }
    }
  });
  return _attrs;
}

const replay = () => {
  const _dom = animeList.value?.querySelector(`[anime='${state.currentAnimeName}']`) as HTMLElement;
  startAnime({ target: _dom }, simpleAnimeList[state.currentAnimeIndex]);
};

const setAnime = (index: number) => {
  const _props = simpleAnimeList[index].propertys;
  state.currentAnimeIndex = index;
  state.currentAnimeName = simpleAnimeList[index].animeName;
  state.animeConfigList = [
    {
      name: 'animeName', title: '动画名称', group: 'anime',
      editor: ComponentPropertyEditor.label,
    }, {
      name: 'duration', title: '时长', group: 'anime',
      editor: ComponentPropertyEditor.int,
      attrs: {
        suffix: 'ms',
        min: 100
      }
    },
    ...(_props ?? [])
  ];
  state.animeConfig = {
    animeName: state.currentAnimeName,
    duration: state.animeConfig.duration ?? 1000,
  };
  state.animeConfigList.forEach(item => {
    if (item.default) {
      if (typeof item.name === 'string') {
        state.animeConfig[item.name] = item.default;
      }
    }
  });
}

onMounted(() => {
  setAnime(0);
  // const el = document.querySelector('.my-drag-box')!;
  // const gesture = new DragGesture(el, ({ active, swipe: [swipeX, swipeY], movement: [mx, my] }) => {
  //   state.isDrag = active;
  //   gsap.to(el, {
  //     x: active ? mx : 0,
  //     y: active ? my : 0,
  //     // duration: active ? 0 : 1000
  //   });
  //   if (swipeX > 0) {
  //     message.success('往右拖拽');
  //   } else if (swipeX < 0) {
  //     message.success('往左拖拽');
  //   }
  //   if (swipeY > 0) {
  //     message.success('往下拖拽');
  //   } else if (swipeY < 0) {
  //     message.success('往上拖拽');
  //   }
  // })

  // const gesture1 = new Gesture(el, {
  //   onDrag: (state) => doSomethingWith(state, 'onDrag'),
  //   onDragStart: (state) => doSomethingWith(state, 'onDragStart'),
  //   onDragEnd: (state) => doSomethingWith(state, 'onDragEnd'),
  //   // onPinch: (state) => doSomethingWith(state, 'onPinch'),
  //   // onPinchStart: (state) => doSomethingWith(state, 'onPinchStart'),
  //   // onPinchEnd: (state) => doSomethingWith(state, 'onPinchEnd'),
  //   // onScroll: (state) => doSomethingWith(state, 'onScroll'),
  //   // onScrollStart: (state) => doSomethingWith(state, 'onScrollStart'),
  //   // onScrollEnd: (state) => doSomethingWith(state, 'onScrollEnd'),
  //   // onMove: (state) => doSomethingWith(state, 'onMove'),
  //   // onMoveStart: (state) => doSomethingWith(state, 'onMoveStart'),
  //   // onMoveEnd: (state) => doSomethingWith(state, 'onMoveEnd'),
  //   // onWheel: (state) => doSomethingWith(state, 'onWheel'),
  //   // onWheelStart: (state) => doSomethingWith(state, 'onWheelStart'),
  //   // onWheelEnd: (state) => doSomethingWith(state, 'onWheelEnd'),
  //   // onHover: (state) => doSomethingWith(state, 'onHover')
  // }, {});
});
</script>

<style lang="less">
.my-drag-box {
  cursor: grab;
  position: absolute;
  top: 20vh;
  left: 30vw;
  display: block;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  background-color: brown;
  touch-action: none;
  transition: background-color 0.15s;

  &.isdrag {
    background-color: blueviolet;
    cursor: grabbing;
  }
}

.anime-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 500px;

  > .anime-item {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 120px;
    height: 120px;
    outline: 1px solid #DDD;
    padding-top: 10px;
    background-color: white;

    &.current {
      outline: 2px solid #4079F7;
      transform: scale(1.05);
      border-radius: 4px;
    }

    > img {
      position: relative;
      width: 60px;
      height: 60px;
      padding: 0px;
      font-size: 13px;
      color: #666666;
    }

    > span {
      display: block;
      margin-top: 10px;
    }
  }
}
</style>
