<template>
  <div>
    <!-- 目前暂时用于时间轴及动画模块测试 -->

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
// import SimpleAnimePicker from '@/modules/anime-module/components/SimpleAnimePicker.vue';
import TimeAxis from '@/modules/anime-module/components/TimeAxis.vue';
import { state as animeState, service as animeService } from '@/modules/anime-module';

const timeAxis = ref<typeof TimeAxis>();

const state = reactive({
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
  await animeService.addFragment({ target: 'https://cdn.hakuq.com/temp/audio/sound2.mp3', trackId: 'bbb', title: '音频轨道 - 测试2', startTime: 2600, endTime: 4800 });
};

onMounted(() => {
  
});
</script>

<style lang="less">
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
