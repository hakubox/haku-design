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

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Component } from '@/@types';

export default defineComponent({
  name: 'q-flex',
  props: {
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
  },
  computed: {
    /** 子组件列表 */
    components() {
      return (this.$attrs.component as Component).children;
    },
  },
  setup(props) {
    return {};
  },
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
