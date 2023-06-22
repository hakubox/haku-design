<template>
  <ComponentBasic
    class="component-audio"
    v-bind="$props"
    :componentLabel="!$attrs.showLabel ? '' : $attrs.label"
  >
    <audio
      :src="($attrs.src as string)"
      :autoplay="(isPreview as boolean && $attrs.autoplay as boolean)"
      :controls="($attrs.showControls as boolean)"
      style="width: 100%"
      ref="audioEl"
    >
      当前浏览器不支持音频元素
    </audio>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  /** 是否预览状态 */
  isPreview: {
    type: Boolean,
    required: true,
  },
  /** 记住播放位置 */
  rememberPosition: {
    type: Boolean,
    default: true,
  },
});

const audioEl = ref<HTMLAudioElement>();

// watch(() => props.isPreview, (val, oldVal) => {
//   test();
// });

// onMounted(() => {
//   setTimeout(() => {
//     test();
//   }, 100);
// });

// onBeforeUnmount(() => {
//   if (audioObj) {
//     audioObj.pause();
//     audioObj = undefined;
//   }
// })
</script>

<style lang="less" scoped>
.audio-tooltip {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 10px 0px;
}

audio {
  &.hidden {
    height: 2px;
  }
}

:deep(.component-item-label) {
  margin-bottom: 0px;
}
</style>
