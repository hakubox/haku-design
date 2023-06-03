<template>
  <ComponentBasic
    class="component-video"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :component-label="!$attrs.showLabel ? '' : $attrs.label"
  >
    <div
      class="full-screen-video-mask"
      :style="{ backgroundColor: $attrs.maskColor as string }"
    ></div>
    <video
      ref="video"
      :src="($attrs.src as string)"
      :autoplay="($attrs.isPreview as boolean && $attrs.autoplay as boolean)"
      :poster="($attrs.poster as string)"
      :muted="($attrs.muted as boolean)"
      :loop="($attrs.loop as boolean)"
      :preload="($attrs.isPreview as boolean ? $attrs.muted as string : 'none')"
      :controls="($attrs.controls as boolean)"
      style="width: 100%"
      :style="{
        'object-fit': $attrs.fillType as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down',
        height: (props.height - props.padding[0] - props.padding[2]) + 'px'
      }"
    >
      您的浏览器不支持视频元素
    </video>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import { getQBasicProps } from '@/tools/common';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  /** 记住播放位置 */
  rememberPosition: {
    type: Boolean,
    default: true,
  },
  /** 内边距 */
  padding: {
    type: Array as PropType<number[]>,
    default: () => [15, 15, 15, 15],
  },
  /** 高度 */
  height: {
    type: Number,
    default: 200,
  },
});

const state = reactive({});
</script>

<style lang="less" scoped>
.component-video {
  padding: 5px;

  video {
    object-fit: cover;
    &.hidden {
      height: 2px;
    }
  }
}
.video-tooltip {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 10px 0px;
}
</style>
