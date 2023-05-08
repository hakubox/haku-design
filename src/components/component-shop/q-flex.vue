<template>
  <div
    class="component-item component-flex layout-component"
    :class="{ required: $attrs.required, 'has-children': components?.length }"
    :style="{
      'flex-direction': direction,
      'justify-content': mainAxisAlignment,
      'align-items': crossAxisAlignment,
    }"
    tip="flex"
  >
    <slot></slot>
    <q-blank v-if="!components?.length" />
    <div class="component-flex-item" v-else>
      <div v-for="(detailItem, index) in components" :key="index" class="component-flex-item-content">
        ++{{ `child_0_${detailItem.id}` }}++
        <slot :name="`child_0_${detailItem.id}`"><q-blank /></slot>
      </div>
    </div>
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

.component-flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > .component-flex-item {
    width: 100%;
  }
}
</style>
