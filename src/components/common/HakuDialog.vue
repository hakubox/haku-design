<template>
  <!-- 预览界面 -->
  <div class="haku-dialog"
    :class="{
      show: typeof props.visible === 'boolean' ? props.visible : props.visible.value,
      leave: state.isLeaving,
      drag: props.drag
    }"
    @click.self.stop="closeDialog"
  >
    <div class="haku-dialog-body" :class="props.bodyClass" :style="props.bodyStyle">
      <!-- 顶部栏 -->
      <div class="haku-dialog-header" v-if="props.header === true && !slots.header">
        <!-- 标题 -->
        <div class="haku-dialog-title">{{ props.title }}</div>
        <!-- 顶部工具栏 -->
        <div class="haku-dialog-header-tools">
          <slot name="header-tools"></slot>
          <!-- 关闭按钮 -->
          <div class="haku-dialog-header-tool haku-dialog-close" @click="closeDialog">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </div>
      </div>
      <slot v-else-if="props.header === true && slots.header" name="header"></slot>
      <div v-else-if="typeof props.header !== 'boolean' && !slots.header" class="haku-dialog-header">
      </div>
      <!-- 内容区域 -->
      <div class="haku-dialog-content">
        <slot></slot>
      </div>
      <!-- 底部栏 -->
      <div v-if="props.footer !== false" class="haku-dialog-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, PropType, Ref, onMounted, onUnmounted, VNode, StyleValue } from "vue";
import { useSlots } from "vue";

const slots = useSlots();

const props = defineProps({
  /** 是否显示预览框 */
  visible: {
    type: [Boolean, Object] as PropType<boolean | Ref<boolean>>,
    default: false,
  },
  /** 顶部栏 */
  header: {
    type: [Function, Boolean] as PropType<(() => VNode) | boolean>,
    default: () => true
  },
  /** 底部栏 */
  footer: {
    type: [Function, Boolean] as PropType<(() => VNode) | boolean>,
    default: () => true
  },
  /** 标题栏 */
  title: {
    type: String,
    default: '弹出框'
  },
  /** 主题类样式 */
  bodyClass: {
    type: String,
    default: ''
  },
  bodyStyle: {
    type: Object as PropType<StyleValue>,
    default: () => ({})
  },
  /** 拖拽 */
  drag: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
  (event: 'close'): void;
}>();

const state = reactive({
  /** 预览框关闭中 */
  isLeaving: false,
});

/** 关闭弹出框 */
const closeDialog = () => {
  state.isLeaving = true;
  emit('close');
  setTimeout(() => {
    emit('update:visible', false);
    setTimeout(() => {
      state.isLeaving = false;
    }, 200);
  }, 500);
};

onMounted(() => {
});

onUnmounted(() => {
})

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

// 自定义弹窗
.haku-dialog {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.25s;

  &.show {
    visibility: visible;
    opacity: 1;

    > .haku-dialog-body {
      transform: translateY(0px);
    }
  }

  &.leave {
    opacity: 0;

    > .haku-dialog-body {
      transform: translateY(-30px);
    }
  }
  
  &.drag {
    width: auto;
    height: auto;
    bottom: initial;
    right: initial;
    background-color: transparent;
  }

  > .haku-dialog-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: 0.25s;
    transform: translateY(-30px);
    background-color: white;
    padding: 0px 0px 10px 0px;
    border-radius: 6px;
    box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.18);

    > .haku-dialog-header {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 12px 6px 12px;
      border-bottom: 1px solid #EEE;
      margin-bottom: 10px;

      > .haku-dialog-title {
        flex-shrink: 1;
        flex-grow: 1;
        font-size: 12px;
        font-weight: 500;
      }

      > .haku-dialog-header-tools {
        flex-shrink: 0;
        flex-grow: 0;
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        > :deep(.haku-dialog-header-tool) {
          position: relative;
          transition: 0.12s;
          font-size: 14px;
          color: #666;
          width: 24px;
          text-align: center;

          &:hover {
            color: @primary-color;

            &.haku-dialog-close {
              color: #DF6152;
            }
          }


          + .haku-dialog-header-tool {
            margin-left: 6px;
          }
        }
      }
    }

    > .haku-dialog-content {
      flex-shrink: 1;
      flex-grow: 1;
      position: relative;
      display: block;
      // overflow: hidden;
      will-change: auto;
      padding: 0px 10px;

      > .form-canvas {
        min-height: initial;
        margin: auto;
        
        > .form-canvas-body {
          position: relative;
          // display: block;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          transform: translateY(0px);
        }
      }
    }
  }
}
</style>