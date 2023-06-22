<template>
  <DragDraggable v-if="props.type === 'item'">
    <slot></slot>
  </DragDraggable>
  <DragSortable v-else-if="props.type === 'list'">
    <slot>
      
    </slot>
    <ExampleDragComponent :children="props.children" />
  </DragSortable>
</template>

<script lang="ts" setup>
import { DragDraggable, DragSortable, DragDroppable } from '@/modules/drag-module';
import { reactive, type PropType } from 'vue';

const props = defineProps({
  type: {
    type: String as PropType<'item' | 'list'>,
    default: 'item'
  },
  children: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

const getComponent = () => {
  switch (props.type) {
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