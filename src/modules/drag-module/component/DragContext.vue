<template>
  <slot v-if="visual"></slot>
  <div ref="rootEl" v-else>
    <!-- {{ dragHook.treeList }} -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted, onUnmounted, reactive, ref, getCurrentInstance, provide, watch } from 'vue';
import { DragHook, DragHookState, DragNode } from '../index.d';
import { useCustomDragHook } from '../drag';

// defineOptions({
//   inheritAttrs: false,
// });

const slots = defineSlots();

const props = defineProps({
  visual: {
    type: Boolean,
    default: false,
  },
  /** 拖拽钩子名称 */
  hookname: {
    type: String,
    default: 'dragHook',
  },
  /** 拖拽到边缘的样式 */
  edgeClass: {
    type: String,
    default: '',
  },
  /** 拖拽完成的拖拽节点样式 */
  successDragDraggableClass: {
    type: String,
    default: '',
  },
  /** 拖拽完成的目标节点样式 */
  successDragDroppableClass: {
    type: String,
    default: '',
  },
  /** 允许超出范围 */
  overflow: {
    type: Boolean,
    default: true
  },
  /** 网格 */
  gridSize: {
    type: Number,
    default: 0
  },
});

const rootEl = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'update:treeData', val: DragNode[]): void;
}>();

const { proxy } = getCurrentInstance()!;

const state = reactive({

});

/** 拖拽钩子 */
const dragHook = useCustomDragHook({
  name: props.hookname,
  edgeClass: props.edgeClass,
  successDragDraggableClass: props.successDragDraggableClass,
  successDragDroppableClass: props.successDragDroppableClass,
  config: {
    /** 是否命中 */
    isHit: false,
  },
  // changeTreeData: () => {

  // }
});

watch(() => props.successDragDraggableClass + props.successDragDroppableClass, () => {
  watchState();
});

const watchState = () => {
  dragHook.setState({
    overflow: props.overflow,
    successDragDraggableClass: props.successDragDraggableClass,
    successDragDroppableClass: props.successDragDroppableClass
  });
}

provide(props.hookname, dragHook);
provide(`draghook-${props.hookname}`, '');

onMounted(() => {
  if (!Object.keys(slots).length) {
    throw new Error('拖拽上下文组件未包含子节点');
  } else if (props.visual && Object.keys(slots).length > 1) {
    throw new Error('虚拟情况下上下文组件只能包含一个节点');
  }

  dragHook.setContext(() => {
    let _context;
    if (props.visual) {
      _context = proxy?.$el.nextElementSibling;
    } else {
      _context = proxy?.$el;
    }
    return _context;
  });

  dragHook.init();
});

onUnmounted(() => {
  dragHook.destory();
});
</script>