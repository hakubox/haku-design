<template>
  <slot :drag-id="state.id" v-if="visual"></slot>
  <div :drag-id="state.id" ref="rootEl" v-else>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted, onUnmounted, reactive, ref, getCurrentInstance, inject, provide } from 'vue';
import { DragHook, DragHookState } from '../index.d';
import { createModelId, toDecimal } from '@/tools/common';
import { onBeforeMount } from 'vue';

// defineOptions({
//   inheritAttrs: false,
// });

const slots = defineSlots();

const props = defineProps({
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
  /** 拖拽钩子名称 */
  hookname: {
    type: String,
    default: 'dragHook',
  },
  /** 使用Transform坐标 */
  useTransformPosition: {
    type: Boolean,
    default: true
  }
});

const dragHook = inject<DragHook>(props.hookname);

const rootEl = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'update:x', value: number): void;
  (event: 'update:y', value: number): void;
}>();

const state = reactive({
  id: createModelId(10),
  rootDom: undefined as HTMLElement | undefined,
});

provide<string>(`draghook-${props.hookname}`, state.id);

const parentId = inject<string>(`draghook-${props.hookname}`);

const { proxy } = getCurrentInstance()!;

/** 获取根节点 */
const getRootDom = (): HTMLElement => {
  let _context;
  if (props.visual) {
    _context = proxy?.$el.nextElementSibling;
  } else {
    _context = proxy?.$el;
  }
  return _context;
};

onMounted(() => {
  if (!dragHook) {
    throw new Error('未查询到拖拽钩子，请确认外部是否包含DragContext组件');
  }

  state.rootDom = getRootDom();
  if (state.rootDom) {
    dragHook.addDroppable(state.id, getRootDom, {
      component: 'droppable',
    });
  } else {
    throw new Error('未查询到根节点');
  }

  // @ts-ignore
  dragHook.addDataParent(state.id, parentId);

  dragHook.setDroppableLoc(state.id, props.x, props.y);
});
onUnmounted(() => {
  if (dragHook) {
    dragHook.removeDroppable(state.id);
    dragHook.removeDataParent(state.id);
  }
})
</script>