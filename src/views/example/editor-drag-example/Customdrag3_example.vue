<template>
  <div>
    <!-- [画布]场景1：将物体拖拽到某容器 -->
    <DragContext
      class="scene-1"
      edgeClass="drag-edge"
      successDragDraggableClass="check-area-success"
      successDragDroppableClass="check-area-success"
    >
      <!-- 基础列表 -->
      <div class="basic-list">
        <ExampleDragComponent
          :type="item.type"
          duplicate-class="duplicate"
          class="drag-obj drag-1 has-handle"
          v-for="item in state.defaultNodes"
        >
          {{ item.type === 'item' ? `普通${item.id}` : `排序${item.id}` }}
        </ExampleDragComponent>
      </div>

      <!-- 容器3 -->
      <div class="target-container target-container-1">
        <div class="header">
          头部区域
        </div>
        <DragSortable v-model:data="state.editorNodes" :visual="true" transitionName="fade" drag-id="aaaaa">
          <div class="content">
            <DragDraggable
              duplicate-class="duplicate" 
              class="drag-obj drag-1 has-handle"
              :drag-id="item.id"
              :key="item.id"
              v-for="item in state.editorNodes"
            >
              <span>普通节点-{{ item.id }}</span>
            </DragDraggable>
          </div>
        </DragSortable>
        <div class="footer">
          尾部区域
        </div>
      </div>

      <div class="editor-code-panel">
        {{ state.editorNodes }}
      </div>
    </DragContext>
  </div>
</template>

<script lang="ts" setup>
import DragContext from '@/modules/drag-module/component/DragContext.vue';
import { DragDraggable, DragSortable, DragDroppable } from '@/modules/drag-module';
import { reactive, ref } from 'vue';
import type { DragNode } from '@/modules/drag-module/index.d';
import { EditorDragNode } from './type';
import ExampleDragComponent from './ExampleDragComponent.vue';

const state = reactive({
  data2: [] as any[],
  data3: [] as any[],
  tempRects: [] as { top: number; left: number; width: number; height: number }[],

  defaultNodes: [
    { id: 'drag-item-1', type: 'item' },
    { id: 'drag-item-2', type: 'item' },
    { id: 'drag-item-3', type: 'item' },
    { id: 'drag-list-1', type: 'list' },
  ] as EditorDragNode[],
  /** 编辑器节点 */
  editorNodes: [] as EditorDragNode[]
});
</script>

<style lang="less" scoped>
.basic-list {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 300px;

  > .drag-obj {
    + .drag-obj {
      margin-top: 10px;
    }
  }
}

.drag-2 {
  cursor: grab;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  background-color: #191a22;
  color: white;
  font-size: 18px;
  font-weight: bold;
  transition: 0.15s background-color;

  position: relative;
  padding: 10px 20px;
  width: 50%;
}

.drag-obj {
  cursor: grab;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  border-radius: 15px;
  background-color: #191a22;
  color: white;
  font-size: 18px;
  font-weight: bold;
  transition: 0.15s;

  &.has-handle {
    cursor: default;

    &:active {
      cursor: default;
    }
  }

  &:active {
    cursor: grabbing;
  }

  &.duplicate {
    transform: scale(1.1);
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.3);
  }

  &.check-area-success {
    background-color: #f8c347;
  }
}

.target-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 500px;
  padding: 10px;
  border-radius: 15px;
  background-color: #fefefe;
  transition: 0.15s box-shadow;
  box-shadow: inset rgba(201, 211, 219, 0.5) 0 0 0 2px, rgba(255, 255, 255, 0) 0 0 0 1px,
    rgba(201, 211, 219, 0.25) 20px 14px 24px;

  &.check-area-success {
    box-shadow: inset #1eb99d 0 0 0 3px, rgba(201, 211, 219, 0.5) 20px 14px 24px;
  }

  > .header {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 20px;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
  }
  > .footer {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 20px;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
  }
  > .content {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 10px;
  }

}

.drag-obj {
  + .drag-obj {
    margin-top: 10px;
  }
}

.scene-1 {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 1500px;
  padding: 20px;
  height: 800px;
  margin: 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 0px 3px #eee, 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: box-shadow 0.15s;

  &.drag-edge {
    border-color: rgb(224, 96, 22);
  }
}

.editor-code-panel {
  display: block;
  width: 400px;
  line-height: 12px;
  font-size: 12px;
  background-color: #282C34;
  border-radius: 10px;
  padding: 10px;
}
</style>
