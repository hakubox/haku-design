<template>
  <div
    class="component-item component-center layout-component"
    :class="{ required: $attrs.required, 'has-children': components?.length }"
    :style="{
      'flex-direction': direction,
      'justify-content': mainAxisAlignment,
      'align-items': crossAxisAlignment,
      'min-height': $attrs.minHeight as string
    }"
    tip="center"
  >
    ++{{ $attrs.minHeight }}++
    <template v-if="!components?.length">
      <q-blank />
    </template>
    <template v-else>
      <div class="component-center-item">
        <slot name="child0"><q-blank /></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, useAttrs } from 'vue';
import { Component } from '@haku-design/core/@types';

const props = defineProps({
  /** flex方向 */
  direction: {
    type: String as PropType<'column' | 'column-reverse' | 'row' | 'row-reverse'>,
    default: 'column',
  },
  /** 主轴对齐方式 */
  mainAxisAlignment: {
    type: String,
    default: 'flex-start',
  },
  /** 次轴对齐方式 */
  crossAxisAlignment: {
    type: String,
    default: 'flex-start',
  },
});

const attrs = useAttrs();

const components = computed(() => {
  return (attrs.component as Component).children;
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > .component-center-item {
    width: 100%;
  }
}
</style>
