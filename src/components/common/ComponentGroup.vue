<template>
  <div
    class="component-item component-group layout-component"
    :class="{ required: $attrs.required, 'has-children': components?.length }"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    tip="canvas"
  >
    <div v-for="(detailItem, index) in components" :key="index" class="component-group-item">
      <slot :name="`child_0_${detailItem.id}`"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { Component } from '@haku-design/core/@types';

const props = defineProps({
});

const attrs = useAttrs();

const components = computed(() => {
  return (attrs.component as Component).children;
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-group {
  display: block;
  background-image: none !important;

  > .component-canvas-item {
  }
}
</style>
