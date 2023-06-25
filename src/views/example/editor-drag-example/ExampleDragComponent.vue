<template>
  <DragDraggable :data="data" :dragId="props.dragId" v-if="props.component === 'item'">
    <slot></slot>
  </DragDraggable>
  <DragSortable :data="data" :dragId="props.dragId" v-else-if="props.component === 'list'">
    <slot>
      
    </slot>
  </DragSortable>
  <div v-else>??? {{ props.component }}</div>
</template>

<script lang="ts" setup>
import { DragDraggable, DragSortable, DragDroppable } from '@/modules/drag-module';
import { createModelId } from '@/tools/common';
import { reactive, type PropType } from 'vue';

const props = defineProps({
  data: {
    type: Object as PropType<(any & { id: string })>,
    default: () => ({})
  },
  component: {
    type: String as PropType<'item' | 'list'>,
    default: 'item'
  },
  dragId: {
    type: String,
    default: () => createModelId(10)
  },
  children: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

const getComponent = () => {
  switch (props.component) {
    case 'item':
      return 'DragDraggable';
    case 'list':
      return 'DragDraggable';
  
    default:
      break;
  }
}

const state = reactive({

});

</script>

<style lang="less" scoped>

</style>