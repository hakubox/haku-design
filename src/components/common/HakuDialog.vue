<template>
  <!-- 预览界面 -->
  <div class="haku-dialog"
    :class="{
      show: typeof props.visible === 'boolean' ? props.visible : props.visible.value,
      leave: state.isLeaving
    }"
    @click.self.stop="closeDialog"
  >
    <div class="haku-dialog-body">
      <!-- 顶部栏 -->
      <div class="haku-dialog-header" v-if="props.header === true && !slots.header">
        <!-- 标题 -->
        <div class="haku-dialog-title">{{ props.title }}</div>
        <!-- 顶部工具栏 -->
        <div class="haku-dialog-header-tools">
          <!-- 关闭按钮 -->
          <div class="haku-dialog-header-tool haku-dialog-close"></div>
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
import { reactive, watch, computed, PropType, Ref, onMounted, onUnmounted, ref, VNode } from "vue";
import { AppType, ComponentPropertyEditor, PageType } from '@/@types/enum';
import { Button } from "ant-design-vue";
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
  }
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
}>();

const state = reactive({
  /** 预览框关闭中 */
  isLeaving: false,
});

/** 关闭弹出框 */
const closeDialog = () => {
  state.isLeaving = true;
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

.preview-modal-enter-active,
.preview-modal-leave-active {
  transition: opacity 0.5s ease;
}
.preview-modal-enter-from,
.preview-modal-leave-to {
  opacity: 0;
  visibility: hidden;
}

// 事件日志
.event-history {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px 5px 10px 15px;
  height: 627px;
}

// 预览弹窗
.preview-modal {
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

    > .preview-modal-body {
      transform: translateY(0px);
    }
  }

  &.leave {
    opacity: 0;

    > .preview-modal-body {
      transform: translateY(-30px);
    }
  }

  .preview-modal-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-right: 450px;
    transition: 0.25s;
    transform: translateY(-30px);

    > .preview-modal-header {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 12px 6px 12px;
      border-bottom: 1px solid #ddd;

      > .preview-modal-title {
        flex-shrink: 1;
        flex-grow: 1;
        font-size: 14px;
        font-weight: bold;
      }

      > .preview-modal-tools {
        flex-shrink: 0;
        flex-grow: 0;

        font-size: 14px;

        > span {
          transition: 0.12s;

          &:hover {
            color: @primary-color;
          }
        }
      }
    }

    > .preview-modal-content {
      flex-shrink: 1;
      flex-grow: 1;
      position: relative;
      display: block;
      overflow: hidden;
      will-change: auto;

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

    // 表单属性调试器
    > .canvas-data-editor {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      top: 0px;
      bottom: 0px;
      margin: auto;
      left: calc(100% + 60px);
      width: 400px;
      height: 80vh;
      background-color: white;
      border-radius: 6px;

      > h3 {
        width: 100%;
        padding: 10px 10px 10px 20px;
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 0px;
        font-size: 18px;
      }

      > .canvas-data-editor-body {
        flex-grow: 1;
        flex-shrink: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        padding-top: 0px;
        height: 100%;

        > .ant-tabs {
          flex-grow: 1;
          flex-shrink: 1;
        }
      }

      li {
        line-height: 30px;

        &.canvas-data-editor-obj-name {
          > span {
            cursor: default;
            display: inline-block;
            width: 100%;
            background-color: @primary-color;
            color: white;
            margin-bottom: 4px;
            padding-left: 10px;
          }
        }

        &.canvas-data-editor-name {
          display: flex;
          padding-left: 10px;
          white-space: nowrap;
          border-bottom: 1px solid #f5f5f5;
          padding-bottom: 3px;
          margin-bottom: 3px;

          &:hover {
            > span {
              color: #333;
            }

            > input {
              background-color: #f5f5f5;
            }
          }

          > span {
            flex-shrink: 0;
            display: inline-block;
            max-width: 100px;
            overflow-x: hidden;
            text-overflow: ellipsis;
            color: #aaa;
            transition: 0.2s;
          }

          > div {
            width: 100%;

            > input {
              width: 100%;
              border: none !important;
              margin-left: 5px;
              padding-left: 5px;
              border-bottom: 1px solid #f5f5f5;
              height: 30px;
              transition: 0.2s;

              &[type='checkbox'] {
                width: 30px;
              }

              &:focus {
                background-color: #eee;
              }
            }
          }
        }

        .canvas-data-editor-key {
          display: inline-block;
          width: 100%;
          margin-bottom: 4px;
          padding-left: 10px;
        }
      }
    }
  }
}
</style>