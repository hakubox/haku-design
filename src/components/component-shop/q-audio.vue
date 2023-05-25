<template>
  <span v-if="!$attrs.isPreview && isBackground" class="audio-tooltip">当前为背景音乐模式</span>
  <ComponentBasic
    class="component-audio"
    v-bind="$props"
    :componentLabel="!$attrs.showLabel || isBackground ? '' : $attrs.label"
    v-else
  >
    <audio
      :src="($attrs.src as string)"
      :autoplay="(isPreview as boolean && $attrs.autoplay as boolean)"
      :controls="($attrs.showControls as boolean)"
      style="width: 100%"
      :class="{ hidden: isBackground }"
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
  /** 是否为背景音乐 */
  isBackground: {
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

// const test = () => {
//   if (props.isBackground) {
//     if (props.isPreview) {
//       if (!audioObj) audioObj = new Audio(attrs.src as string);
//       if (audioObj) {
//         audioObj.onloadstart = (e) => {
//           audioObj?.play();
//         };
//       }
//     } else if (audioObj) {
//       console.log('暂停播放');
//       audioObj.pause();
//     }
//   }
// };

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
