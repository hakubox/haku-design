<template>
  <div>
    <!-- 目前暂时用于Monaco编辑器测试 -->
    <!-- <code-editor style="height: 70vh" language="json" v-model:value="state.editorJson" @change="valueChange"> </code-editor> -->

    <!-- <button @click="setValue">值改变</button>
    {{ state.editorJson }} -->

    <!-- <div class="my-drag-box" :class="{ isdrag: state.isDrag }"></div> -->
    
    <!-- <SimpleAnimePicker /> -->

    <TimeAxis
      ref="timeAxis"
      direction="horizontal"
      axisId="123"
      style="width: 600px; height: 300px;"
      @progress="onProgress"
    />

    <button @click="loadAxisData()">加载初始化数据</button>

    <div class="playground">
      <!-- 用于操作的一个圆 -->
      <div class="test-circle-aaa"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
// import { Gesture, DragGesture } from '@use-gesture/vanilla';
// import SimpleAnimePicker from '@/modules/anime-module/components/SimpleAnimePicker.vue';
import TimeAxis from '@/modules/anime-module/components/TimeAxis.vue';
// import { cloneLoop } from '@/lib/clone';
import { state as animeState, service as animeService } from '@/modules/anime-module';

const timeAxis = ref<typeof TimeAxis>();

const state = reactive({
  index: 200,
  editorJson: '',
  /** 是否焦点 */
  isDrag: false,
  value: [],
});

/** 进度 */
const onProgress = (second: number, detail: { fragmentId: string, attrs: Record<string, any> }[]) => {
  // detail.forEach(i => {
  //   Object.entries(i.attrs).forEach(([key, value]) => {
  //     state.circleAttrs[key] = value;
  //   });
  // });
};

/** 加载时间轴数据 */
const loadAxisData = async () => {
  await animeService.addFragment({ target: '.test-circle-aaa', trackId: 'aaa', title: '组件轨道 - 测试1', startTime: 1000, endTime: 3600 });
  await animeService.addFragment({ target: '/assets/audio/sound2.mp3', trackId: 'bbb', title: '音频轨道 - 测试2', startTime: 2600, endTime: 4800 });
};

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

.playground {
  position: relative;
  margin: 10px;
  width: 700px;
  height: 300px;
  border-radius: 4px;
  background-color: #F5F5F5;
  border: 1px solid #888;

  > .test-circle-aaa {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-color: darkcyan;

    
    transform: translate(20px, 20px);
    width: 100px;
    height: 100px;
  }
}
</style>
