<template>
  <ComponentBasic
    class="component-text"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :component-label="''"
    :component-description="''"
    :class-name="$attrs.className"
    :h-pos="props.hPos"
    :v-pos="props.vPos"
  >
    <div class="component-content" :class="{
      autowidth: $attrs.autowidth,
    }">
      <div v-if="$attrs.text" class="component-text-content" v-html="($attrs.text as string)?.replace(/\n/g, '<br />')"></div>
      <div
        v-if="$attrs.description"
        class="component-text-content richtext-value"
        :style="{ marginTop: $attrs.text ? '10px' : '0px' }"
        v-html="variableService.getVarText($attrs.description as string)?.replace(/\n/g, '<br />')"
      ></div>
    </div>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import { getQBasicProps, getBoxModel } from '@/tools/common';
import { service as variableService } from '@/modules/variable-module';
import { useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false
});

const attrs = useAttrs();

const props = defineProps({
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  /** 水平位置 */
  hPos: {
    type: String,
    default: 'start',
  },
  /** 垂直位置 */
  vPos: {
    type: String,
    default: 'start',
  },
  padding: {
    type: Array as PropType<number[]>,
    default: () => [0, 0, 0, 0],
  },
  margin: {
    type: Array as PropType<number[]>,
    default: () => [0, 0, 0, 0],
  },
});

const state = reactive({});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-text {
  flex-grow: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;

  &[h-pos='start'] {
    .component-text-content {
      text-align: left;
    }
  }
  &[h-pos='center'] {
    .component-text-content {
      text-align: center;
    }
  }
  &[h-pos='end'] {
    .component-text-content {
      text-align: right;
    }
  }

  &[v-pos='start'] {
    justify-content: flex-start;
  }
  &[v-pos='center'] {
    justify-content: center;
  }
  &[v-pos='end'] {
    justify-content: flex-end;
  }

  > .component-content {
    display: flex;
    flex-direction: column;
    width: 100%;

    &.autowidth {
      width: auto;

      > .component-text-content {
        white-space: nowrap;
      }
    }

    > .component-text-content {
      // display: inline;
      display: block;
      font-size: 12px;
      overflow: hidden;
      font-family: inherit;
      vertical-align: text-bottom;
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal;
      width: 100%;
    }
  }
}
</style>
