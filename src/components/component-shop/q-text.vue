<template>
  <ComponentBasic
    class="component-text"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :component-label="''"
    :component-description="''"
    :class-name="$attrs.className"
  >
    <div class="component-content" :class="{ autowidth: $attrs.autowidth }">
      <div v-if="$attrs.text" class="component-text-content" :class="$attrs.textClassName" v-html="($attrs.text as string)?.replace(/\n/g, '<br />')"></div>
      <div
        v-if="$attrs.description"
        class="component-text-content richtext-value"
        :class="$attrs.textClassName"
        :style="{ marginTop: $attrs.text ? '10px' : '0px' }"
        v-html="variableService.getVarText($attrs.description as string)?.replace(/\n/g, '<br />')"
      ></div>
    </div>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { service as variableService } from '@/modules/variable-module';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
});

const state = reactive({});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-text {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;

  > .component-content {
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
