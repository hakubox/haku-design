<template>
  <div>
    <!-- 目前暂时用于Monaco编辑器测试 -->
    <!-- <code-editor style="height: 70vh" language="json" v-model:value="state.editorJson" @change="valueChange"> </code-editor> -->
    <hr />
    <!-- <button @click="setValue">值改变</button>
    {{ state.editorJson }} -->

    <!-- <div class="my-drag-box" :class="{ isdrag: state.isDrag }"></div> -->
    
    <SimpleAnimePicker />
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
import SimpleAnimePicker from '@/modules/anime-module/components/SimpleAnimePicker.vue';

const defaultImg = new URL('@/modules/anime-module/assets/img/block.png', import.meta.url).href;

const state = reactive({
  index: 200,
  editorJson: '',
  /** 是否焦点 */
  isDrag: false,
  value: [],
});

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

onMounted(() => {
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
</style>
