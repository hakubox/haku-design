<template>
  <div
    class="component-item component-canvas layout-component"
    :class="{ required: $attrs.required, 'has-children': components?.length }"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    tip="canvas"
  >
    <slot></slot>
    <q-blank v-if="!components?.length" />
    <div class="component-canvas-item" v-else>
      <div v-for="(detailItem, index) in components" :key="index" class="component-canvas-item-content">
        ++{{ `child_0_${detailItem.id}` }}++
        <slot :name="`child_0_${detailItem.id}`"><q-blank /></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { Component } from '@haku-design/core';

const props = defineProps({
});

const attrs = useAttrs();

const components = computed(() => {
  return (attrs.component as Component).children;
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-canvas {
  display: block;

  > .component-canvas-item {
  }
}
</style>
