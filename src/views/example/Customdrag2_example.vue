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
      <TransitionGroup tag="div" name="fade" class="basic-list">
        <DragDraggable duplicate-class="duplicate" class="drag-obj drag-1 has-handle" v-for="item in items" :key="item">
          列表项{{ item }}
        </DragDraggable>
      </TransitionGroup>

      <!-- 容器 -->
      <DragSortable class="target-container target-container-1"> </DragSortable>

      <!-- 容器2 -->
      <DragSortable v-model:data="state.data2" class="target-container target-container-1">
        <template #item="item">
          <DragDraggable duplicate-class="duplicate" class="drag-obj drag-1 has-handle">
            列表项{{ item }}
          </DragDraggable>
        </template>
      </DragSortable>

      <!-- 容器3 -->
      <DragSortable v-model:data="state.data3" :visual="true">
        <div class="target-container target-container-1">
          <DragDraggable duplicate-class="duplicate" class="drag-obj drag-1 has-handle" v-for="item in state.data3" :key="item">
            列表项{{ item }}
          </DragDraggable>
        </div>
      </DragSortable>
    </DragContext>

    <!-- 测试Rects -->
    <div>
      <div
        style="position: fixed; border: 1px solid red"
        :style="{
          left: `${item.left}px`,
          top: `${item.top}px`,
          width: `${item.width}px`,
          height: `${item.height}px`,
        }"
        v-for="item in state.tempRects"
      ></div>
    </div>

    <button @click="insert">+1</button>
  </div>
</template>

<script lang="ts" setup>
import DragContext from '@/modules/drag-module/component/DragContext.vue';
import { DragDraggable, DragDroppable } from '@/modules/drag-module';
import { reactive, ref } from 'vue';
import DragSortable from '@/modules/drag-module/component/DragSortable.vue';
import type { DragNode } from '@/modules/drag-module/index.d';

const state = reactive({
  data2: [] as any[],
  data3: [] as any[],
  tempRects: [] as { top: number; left: number; width: number; height: number }[],
});

const getInitialItems = () => [1, 2, 3, 4, 5]

const items = ref(getInitialItems())

let id = items.value.length + 1

function insert() {
  const i = Math.round(Math.random() * items.value.length)
  items.value.splice(i, 0, id++)
}
</script>

<style lang="less">
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
  display: inline-block;
  width: 250px;
  padding: 10px;
  border-radius: 15px;
  background-color: #fefefe;
  transition: 0.15s box-shadow;
  box-shadow: inset rgba(201, 211, 219, 0.5) 0 0 0 2px, rgba(255, 255, 255, 0) 0 0 0 1px,
    rgba(201, 211, 219, 0.25) 20px 14px 24px;

  &.check-area-success {
    box-shadow: inset #1eb99d 0 0 0 3px, rgba(201, 211, 219, 0.5) 20px 14px 24px;
  }

  > .drag-obj {
    + .drag-obj {
      margin-top: 10px;
    }
  }
}

.scene-1 {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: 1400px;
  padding: 20px;
  height: 400px;
  margin: 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 0px 3px #eee, 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: box-shadow 0.15s;

  &.drag-edge {
    border-color: rgb(224, 96, 22);
  }
}
</style>
