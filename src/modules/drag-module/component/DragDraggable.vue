<template>
    <slot
      v-if="visual"
      :drag-id="props.dragId"
      :style="useTransformPosition ?
        { transform: `translate(${props.x}px, ${props.y}px)` } : 
        { left: `${props.x}px`, top: `${props.y}px` }
      "
    >
    </slot>
    <div
      ref="rootEl"
      :drag-id="props.dragId"
      :style="useTransformPosition ?
        { transform: `translate(${props.x}px, ${props.y}px)` } : 
        { left: `${props.x}px`, top: `${props.y}px` }
      "
      v-else
    >
      <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, getCurrentInstance, inject, provide, onBeforeMount, PropType } from 'vue';
import { DragHook } from '../index.d';
import { createModelId } from '@/tools/common';
import { message } from 'ant-design-vue';
import { onUpdated } from 'vue';
import { onBeforeUnmount } from 'vue';

// defineOptions({
//   inheritAttrs: false,
// });

const slots = defineSlots();

const props = defineProps({
  data: {
    type: Object as PropType<(any & { id: string })>,
    default: () => ({})
  },
  visual: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  dragId: {
    type: String,
    default: () => createModelId(10)
  },
  /** 允许自由拖拽 */
  freeDrag: {
    type: Boolean,
    default: false
  },
  /** 拖拽钩子名称 */
  hookname: {
    type: String,
    default: 'dragHook',
  },
  /** 拖拽副本 */
  useDuplicate: {
    type: Boolean,
    default: true
  },
  /** 拖拽副本样式 */
  duplicateClass: {
    type: String,
    default: ''
  },
  /** 拖拽手柄 */
  handleSelector: {
    type: String,
    default: ''
  },
  /** 使用Transform坐标 */
  useTransformPosition: {
    type: Boolean,
    default: true
  },
  /** 最小拖拽距离 */
  minDistance: {
    type: Number,
    default: 0
  },
  /** 允许Y轴拖拽 */
  yAxis: {
    type: Boolean,
    default: true
  },
  /** 允许X轴拖拽 */
  xAxis: {
    type: Boolean,
    default: true
  },
});

const dragHook = inject<DragHook>(props.hookname);

const rootEl = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'update:x', value: number): void;
  (event: 'update:y', value: number): void;
  (event: 'update:data', value: (any & { id: string })[]): void;
}>();

const state = reactive({
  rootDom: undefined as HTMLElement | undefined,
});

provide<string>(`draghook-${props.hookname}`, props.dragId);

// const getRootRect = () => {
//   const _dom = getRootDom();
//   return _dom.getBoundingClientRect();
// };

/** 获取根节点 */
const getRootDom = (): HTMLElement => {
  let _context: HTMLElement | undefined;
  if (props.visual) {
    const _instance = getCurrentInstance();
    if (_instance) {
      try {
        _context = _instance.subTree.el!.nextElementSibling;
      } catch (error) {
        console.error('未获取到DragContext绑定的DOM节点');
        throw new Error('未获取到DragContext绑定的DOM节点');
      }
    }
  } else {
    // debugger;
    _context = rootEl.value;
  }
  return _context!;
};

const destory = () => {
  if (dragHook) {
    dragHook.removeDraggable(props.dragId);
    state.rootDom?.remove();
  }
}

onMounted(() => {
  if (!dragHook) {
    throw new Error('未查询到拖拽钩子，请确认外部是否包含DragContext组件');
  }

  console.log('添加state.draggableMap', props.dragId);


  const parentId = inject<string>(`draghook-${props.hookname}`);

  state.rootDom = getRootDom();
  const rootDomRect = state.rootDom.getBoundingClientRect();
  let _handle: HTMLElement;
  
  if (props.handleSelector) {
    _handle = state.rootDom.querySelector(props.handleSelector) as HTMLElement;
    if (_handle) {
      _handle.classList.add('drag-handle');
      const _handleRect = _handle.getBoundingClientRect();
      _handle.addEventListener('mousedown', (e) => {
        dragHook.startDrag({
          target: state.rootDom,
          layerX: e['layerX'] - props.x + _handleRect.left - rootDomRect.left,
          layerY: e['layerY'] - props.y + _handleRect.top - rootDomRect.top,
        } as unknown as MouseEvent, dragHook.config);
      }, { passive: true });
    } else {
      throw new Error('未查询到手柄节点');
    }
  } else {
    state.rootDom.addEventListener('mousedown', (e) => {
      dragHook.startDrag({
        target: state.rootDom,
        layerX: e['layerX'] - props.x,
        layerY: e['layerY'] - props.y,
      } as unknown as MouseEvent, dragHook.config);
    }, { passive: true });
  }

  if (state.rootDom) {
    state.rootDom.classList.add('drag-draggable');
    dragHook.addDraggable(props.dragId, getRootDom, {
      handleDom: _handle!,
      freeDrag: props.freeDrag,
      useDuplicate: props.useDuplicate,
      duplicateClass: props.duplicateClass,
      useTransformPosition: props.useTransformPosition
    });
  } else {
    throw new Error('未查询到根节点');
  }

  dragHook.addDataParent(props.dragId, parentId);

  dragHook.setDraggableLoc(props.dragId, props.x, props.y);

  dragHook.onDrag(props.dragId, (e) => {
    if (e.state.inArea) {
      emit('update:x', 0);
      emit('update:y', 0);
    } else {
      emit('update:x', e.state.x);
      emit('update:y', e.state.y);
    }
  });
  dragHook.bingData(props.dragId, {
    type: 'draggable',
    get() {
      return props.data;
    },
    set(data: (any & { id: string })[]) {
      // console.warn('设置值', props.dragId, data);
      emit('update:data', data);
    }
  });

  dragHook.onEndDrag(props.dragId, (e) => {
    if (e.droppableId) {
      message.success('拖拽成功');
      // destory();
    }
  });
});
onUpdated(() => {
  // console.log('drag-draggable onUpdated', props.dragId, rootEl.value);
});

onBeforeUnmount(() => {

});

onUnmounted(() => {
  // console.log('drag-draggable onUnmounted', props.dragId);
  if (dragHook) {
    dragHook.removeDraggable(props.dragId);
    dragHook.removeDataParent(props.dragId);
  }
})
</script>

<style scoped>
.drag-draggable {
  
}
</style>