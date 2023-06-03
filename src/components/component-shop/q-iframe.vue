<template>
  <!-- <span v-if="!$attrs.isPreview" class="image-tooltip">当前为背景图片模式</span> -->
  <ComponentBasic
    class="component-iframe"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="!props.showLabel ? '' : props.label"
  >
    <iframe
      ref="frameEl"
      class="component-iframe-content"
      :seamless="true"
      sandbox="allow-same-origin allow-forms allow-scripts allow-top-navigation allow-orientation-lock allow-top-navigation-by-user-activation"
      :src="state.isLoading ? '' : props.src"
      :style="{
        height: props.height,
        'border-radius': props.borderRadius + 'px',
        opacity: $attrs.opacity as number / 100
      }"
    />
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, watch } from 'vue';
import { getQBasicProps } from '@/tools/common';
import ComponentBasic from '@/components/common/ComponentBasic.vue';

defineOptions({
  inheritAttrs: false
});

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
  /** 网页地址 */
  src: {
    type: String,
    default: '',
  },
  /** 高度 */
  height: {
    type: String,
    default: '280px'
  }
});

const frameEl = ref<HTMLIFrameElement>();

const state = reactive({
  isLoading: false,
});

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-iframe {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0px;
  height: 100%;

  > .component-iframe-content {
    width: 100%;
    height: 100%;
    border: none;
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
