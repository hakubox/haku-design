<template>
  <span v-if="!$attrs.isPreview && $attrs.isBackground" class="image-tooltip">当前为背景图片模式</span>
  <q-basic
    class="component-image"
    :class="{ 'full-screen-image': $attrs.isBackground }"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="!$attrs.showLabel || $attrs.isBackground ? '' : $attrs.label"
    v-else
  >
    <div
      v-if="$attrs.isBackground"
      class="full-screen-image-mask"
      :style="{ backgroundColor: $attrs.maskColor as string }"
    ></div>
    <img
      class="component-image-content"
      :src="src ? storageService.getFileInfo(src)?.src : defaultImg"
      :padding="getBoxModel(padding as [number, number, number, number])"
      :style="{
        'border-radius': $attrs.borderRadius + 'px',
        'object-fit': $attrs.fillType as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down',
        'filter': `blur(${$attrs.blur}px)`
      }"
    />
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script lang="ts" setup>
import { reactive } from 'vue';
import { getBoxModel } from '@/tools/common';
import { state as storageState, service as storageService } from '@/modules/storage-module';
import { getQBasicProps } from '@/tools/common';

let defaultImg = new URL('@/assets/img/temp/default-img.webp').href;

const props = defineProps({
  component: {
      type: Object,
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default: '',
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    src: {
      type: String,
      default: '',
    },
});

const state = reactive({
  chart: null as any,
});

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-image {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  padding: 0px;

  &.full-screen-image {
    position: relative;

    > .full-screen-image-mask {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    > .component-image-content {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }
  }

  > .component-image-content {
    width: 100%;
    min-height: 100px;
  }
}
.image-tooltip {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 10px 0px;
}
</style>
