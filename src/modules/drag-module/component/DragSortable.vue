<template>
  <slot class="drag-sortable" :drag-id="props.dragId" v-if="visual"></slot>
  <div
    class="drag-sortable"
    ref="rootEl"
    :drag-id="props.dragId"
    :style="{
      'flex-direction': props.direction,
      'flex-wrap': props.warp ? 'wrap' : 'nowrap', // justify-content
      'justify-content': props.mainAxisAlignment
    }"
    v-else
  >
    <TransitionGroup v-if="props.transitionName" :name="props.transitionName">
      <slot></slot>
      <template v-for="item in props.data">
        <slot :item="item"></slot>
      </template>
    </TransitionGroup>
    <template v-else>
      <slot></slot>
      <template v-for="item in props.data">
        <slot :item="item"></slot>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted, onUnmounted, reactive, ref, getCurrentInstance, inject, provide, onBeforeMount } from 'vue';
import { DragHook, DragHookState } from '../index.d';
import { createModelId, toDecimal } from '@/tools/common';
import { useAttrs, type computed } from 'vue';

// defineOptions({
//   inheritAttrs: false,
// });
const slots = defineSlots<{
  default(props: {}): any;
  item(props: { item: { id: string } }): any;
}>()

const attrs = useAttrs();

const props = defineProps({
  dragId: {
    type: String,
    default: () => createModelId(10)
  },
  /** transitionName */
  transitionName: {
    type: String,
    default: ''
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array as PropType<(any & { dragId: string })[]>,
    default: () => []
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
  /** 拖拽钩子名称 */
  hookname: {
    type: String,
    default: 'dragHook',
  },
  /** 使用Transform坐标 */
  useTransformPosition: {
    type: Boolean,
    default: true
  },
  /** 方向（row:行 / column:列） */
  direction: {
    type: String as PropType<'row' | 'column'>,
    default: 'column'
  },
  /** 允许换行 */
  warp: {
    type: Boolean,
    default: false
  },
  /** 主轴对齐方式 */
  mainAxisAlignment: {
    type: String as PropType<'flex-start' | 'flex-end' | 'center'>,
    default: 'flex-start'
  },
  /** 是否反向 */
  reverse: {
    type: Boolean,
    default: false
  }
});

const dragHook = inject<DragHook>(props.hookname);

const rootEl = ref<HTMLElement>();

const { proxy } = getCurrentInstance()!;

const emit = defineEmits<{
  (event: 'update:x', value: number): void;
  (event: 'update:y', value: number): void;
  (event: 'update:data', value: (any & { dragId: string })[]): void;
}>();

const state = reactive({
  rootDom: undefined as HTMLElement | undefined,
});

// const data = computed({
//   get() {
//     return props.data;
//   },
//   set(data: (any & { dragId: string })[]) {
//     emit('update:data', data);
//   }
// });

provide<string>(`draghook-${props.hookname}`, props.dragId);

const parentId = inject<string>(`draghook-${props.hookname}`);

/** 获取根节点 */
const getRootDom = (): HTMLElement => {
  let _context;
  if (props.visual) {
    // console.log('proxy', proxy);
    _context = proxy?.$el.nextElementSibling as HTMLElement;
    _context.classList.add('drag-sortable');
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
    dragHook.addDroppable(props.dragId, getRootDom, {
      component: 'sortable',
      direction: props.direction,
      reverse: props.reverse
    });
  } else {
    throw new Error('未查询到根节点');
  }

  dragHook.addDataParent(props.dragId, parentId);
  dragHook.setDroppableLoc(props.dragId, props.x, props.y);
  dragHook.bingData(props.dragId, {
    get() {
      return props.data;
    },
    set(data: (any & { dragId: string })[]) {
      emit('update:data', data);
    }
  });

});

onUnmounted(() => {
  if (dragHook) {
    dragHook.removeDroppable(props.dragId);
    dragHook.removeDataParent(props.dragId);
    dragHook.unBingData(props.dragId);
  }
})
</script>

<style>
.drag-sortable {
  display: flex;
}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.fade-leave-active {
  position: absolute;
}
</style>