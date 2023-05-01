<template>
  <ComponentBasic
    class="component-text"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :component-label="''"
    :component-description="''"
    :class-name="$attrs.className"
  >
    <label v-if="$attrs.text" class="component-text-content" :class="$attrs.textClassName" v-html="$attrs.text"></label>
    <label
      v-if="$attrs.description"
      class="component-description-content richtext-value"
      :class="$attrs.textClassName"
      :style="{ marginTop: $attrs.text ? '10px' : '0px' }"
      v-html="variableService.getVarText($attrs.description as string)"
    ></label>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { reactive } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { service as variableService } from '@/modules/variable-module';

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
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > .component-text-content {
    > :last-child {
      margin-bottom: 0px;
    }
  }
  > .component-description-content {
    font-size: 12px;
    // color: #999;
  }
}
</style>
