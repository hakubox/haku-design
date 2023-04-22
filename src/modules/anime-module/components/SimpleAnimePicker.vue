<template>
  <div>
    <div class="anime-body" style="width: 500px;">
      <div class="anime-header">
        <ul class="anime-categorys">
          <li
            class="anime-category"
            :class="{ active: state.currentAnimeCategory === item.name }"
            v-for="item in state.animeCategory"
            @click="setAnimeCategory(item.name)"
          >{{ item.title }}</li>
        </ul>
      </div>
      <ul class="anime-list" ref="animeList">
        <li class="anime-item"
          v-for="(anime, index) in simpleAnimeList.filter(i => state.currentAnimeCategory === i.animeType)"
          :key="index"
          :anime="anime.animeName"
          :class="{ current: state.currentAnimeName === anime.animeName }"
          @click="setAnime(anime.animeName)"
          @mouseenter="$event => startAnime($event.target as HTMLElement, anime)"
        >
          <img src="@/modules/anime-module/assets/img/block.png" />
          <span>{{ anime.animeTitle }}</span>
        </li>
      </ul>
      <GeneralEditor
        :style="{ width: '100%' }"
        labelWidth="80px"
        :showTitle="false"
        :model="state.animeConfig"
        :propertys="state.animeConfigList"
        :groups="[{ title: '动画配置', name: 'anime', icon: '' }]"
        @change="replay"
      ></GeneralEditor>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { simpleAnimeList } from '@/modules/anime-module';
import { SimpleAnime, SimpleAnimeConfig } from '@/modules/anime-module/@types';
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';
import { GeneralProperty } from '@/@types';
import { ComponentPropertyEditor } from '@/@types/enum';

const state = reactive({
  /** 当前动画名称 */
  currentAnimeName: '',
  /** 当前动画类型 */
  currentAnimeCategory: 'in',
  /** 动画类别 */
  animeCategory: [
    { name: 'in', title: '入场动画' },
    { name: 'emphasize', title: '强调动画' },
    { name: 'out', title: '离场动画' },
  ],
  /** 运行中的动画列表 */
  playingAnimeNames: [] as string[],
  /** 运行中的动画列表 */
  playingAnimes: [] as (gsap.core.Tween | gsap.core.Timeline)[],
  /** 动画配置 */
  animeConfig: {} as Record<string, any>,
  /** 动画配置列表 */
  animeConfigList: [] as GeneralProperty[],
});

const animeList = ref<HTMLElement>();

const startAnime = (target: HTMLElement, anime: SimpleAnime) => {
  const _dom = target.firstChild as HTMLElement;
  clearAnime(anime.animeName);
  if (anime.animeFn) {
    const defaultAttrs = getDefaultProps(anime);
    const attrs = state.currentAnimeName === anime.animeName ? state.animeConfig : defaultAttrs;
    const _anime = anime.animeFn(_dom, {
      ...attrs,
    })?.duration(state.animeConfig.duration ?? 1000)
      .repeat((() => anime.animeType === 'emphasize' ? state.animeConfig.repeat - 1 : 0)())!;
    _anime.then(() => {
      if (anime.animeType !== 'in') {
        _anime.reverse(0.001);
      }
      setTimeout(() => {
        const _index = state.playingAnimeNames.indexOf(anime.animeName);
        state.playingAnimeNames.splice(_index, 1);
        state.playingAnimes.splice(_index, 1);
      }, 10);
    });
    state.playingAnimeNames.push(anime.animeName);
    state.playingAnimes.push(_anime);
  }
};

/** 是否运行中 */
const isPlaying = (animeName: string) => {
  return state.playingAnimeNames.includes(animeName);
};

/** 获取默认属性 */
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

/** 清除动画 */
const clearAnime = (animeName?: string) => {
  state.playingAnimeNames.forEach((i, index) => {
    if (animeName === undefined || animeName === i) {
      const _animeName = animeName ?? i;
      const _anime = state.playingAnimes[index];
      const _animeConfig = simpleAnimeList.find(i => i.animeName === _animeName);
      if (_animeConfig?.animeType !== 'in') {
        _anime.reverse(0.01);
        _anime.kill();
      } else {
        _anime.duration(0.01);
      }
      if (animeName) {
        state.playingAnimeNames.splice(index, 1);
        state.playingAnimes.splice(index, 1);
      }
    }
  });
  if (animeName === undefined) {
    state.playingAnimeNames = [];
    state.playingAnimes = [];
  }
}

/** 重新播放动画 */
const replay = () => {
  clearAnime(state.currentAnimeName);
  const _dom = animeList.value?.querySelector(`[anime='${state.currentAnimeName}']`) as HTMLElement;
  startAnime(_dom, simpleAnimeList.find(i => i.animeName === state.currentAnimeName)!);
};

/** 设置动画分类 */
const setAnimeCategory = (category: string) => {
  clearAnime();
  state.currentAnimeCategory = category;
  const _animes = simpleAnimeList.filter(i => state.currentAnimeCategory === i.animeType);
  if (_animes.length) {
    setAnime(_animes[0].animeName);
    setTimeout(() => {
      replay();
    }, 100);
  } else {
    state.currentAnimeName = '';
    state.animeConfig = {
      animeName: '——',
      duration: state.animeConfig.duration ?? 1,
      repeat: state.animeConfig.repeat ?? 1,
    };
    state.animeConfigList = [];
  }
}

/** 设置动画 */
const setAnime = (animeName: string) => {
  const _animeIndex = simpleAnimeList.findIndex(i => i.animeName === animeName);
  const _props = simpleAnimeList[_animeIndex].propertys;
  state.currentAnimeName = simpleAnimeList[_animeIndex].animeName;
  state.animeConfigList = [
    {
      name: 'animeName', title: '动画名称', group: 'anime',
      editor: ComponentPropertyEditor.label,
    }, {
      name: 'duration', title: '时长', group: 'anime',
      editor: ComponentPropertyEditor.slider,
      attrs: {
        suffix: 's',
        step: 0.1,
        min: 0.1,
        max: 8
      }
    },
    (simpleAnimeList[_animeIndex].animeType === 'emphasize' ? {
      name: 'repeat', title: '循环次数', group: 'anime',
      editor: ComponentPropertyEditor.slider,
      attrs: {
        suffix: '次',
        step: 1,
        min: -1,
        max: 50
      }
    }: undefined),
    ...(_props ?? [])
  ].filter(i => i !== undefined) as GeneralProperty[];
  state.animeConfig = {
    animeName: state.currentAnimeName,
    duration: state.animeConfig.duration ?? 1,
    repeat: state.animeConfig.repeat ?? 1,
    ...(simpleAnimeList[_animeIndex]?.attrs ?? {})
  };
  state.animeConfigList.forEach(item => {
    if (item.default) {
      if (typeof item.name === 'string') {
        if (['duration', 'repeat'].includes(item.name)) {
          if (state.animeConfig[item.name] === undefined) {
            state.animeConfig[item.name] = item.default;
          }
        } else {
          state.animeConfig[item.name] = item.default;
        }
      }
    }
  });
};

onMounted(() => {
  setAnime(simpleAnimeList[0].animeName);
});
</script>

<style lang="less" scoped>

.anime-body {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #F5F5F5;

  > .anime-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;

    > .anime-categorys {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 0px;

      > .anime-category {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #F5F5F5;
        width: 100%;
        height: 40px;
        text-align: center;

        &:first-child {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        &:last-child {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }

        &.active {
          cursor: default;
          background-color: rgba(51, 122, 183, 0.2);
        }
      }
    }
  }

  > .anime-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding-bottom: 20px;
    margin-bottom: 10px;
    border-bottom: 1px dashed #EEEEEE;

    > .anime-item {
      cursor: pointer;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 117px;
      height: 117px;
      outline: 1px solid #DDD;
      padding-top: 10px;
      background-color: white;
      transition: 0.15s background-color, 0.15s outline;

      &:hover {
        background-color: rgba(51, 122, 183, 0.2);
      }

      &.current {
        cursor: default;
        outline: 2px solid #4079F7;
        background-color: rgba(51, 122, 183, 0.2);
        z-index: 1
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
        font-size: 14px;
      }
    }
  }
}

:deep(.property-collapse-item-content) {
  padding: 0px !important;
}


.heartbeatSlow { animation-name: heartbeatSlow; animation-iteration-count: infinite; animation-duration: 500ms; }
@keyframes heartbeatSlow {
    35%, 65% { transform: scale(1.2) }
}

.heartbeatFast { animation-name: heartbeatFast; animation-iteration-count: infinite; animation-duration: 1000ms; }
@keyframes heartbeatFast {
    14%, 42% { transform: scale(1.3) }
    28%, 70% { transform: scale(1) }
}
</style>
