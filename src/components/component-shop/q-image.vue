<template>
  <ComponentBasic
    class="component-image"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="!props.showLabel ? '' : props.label"
  >
    <img
      class="component-image-content"
      :src="src ? storageService.getFileInfo(src)?.src : defaultImg"
      :padding="getBoxModel(padding)"
      :style="{
        'border-radius': props.borderRadius + 'px',
        'object-fit': $attrs.fillType as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down',
        'filter': `blur(${$attrs.blur}px)`,
        opacity: $attrs.opacity as number / 100
      }"
    />
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import { getBoxModel } from '@/tools/common';
import { state as storageState, service as storageService } from '@/modules/storage-module';
import { getQBasicProps } from '@/tools/common';
import ComponentBasic from '@/components/common/ComponentBasic.vue';

defineOptions({
  inheritAttrs: false
});

const defaultImg = new URL('@/assets/img/temp/default-img.webp', import.meta.url).href;

const props = defineProps({
  /** 是否显示标签 */
  showLabel: {
    type: Boolean,
    default: false,
  },
  /** 标签 */
  label: {
    type: String,
    default: ''
  },
  /** 圆角 */
  borderRadius: {
    type: Number,
    default: 0,
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  padding: {
    type: Array as PropType<number[]>,
    default: () => [0, 0, 0, 0],
  },
  src: {
    type: String,
    default: '',
  },
});

const state = reactive({
});

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-image {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0px;
  height: 100%;

  > .component-image-content {
    width: 100%;
    height: 100%;
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
