<template>
  <div>
    <!-- [画布]场景1：将物体拖拽到某容器 -->
    <DragContext
      class="scene-1"
      edgeClass="drag-edge"
      successDragDraggableClass="check-area-success"
      successDragDroppableClass="check-area-success"
    >
      <!-- 容器 -->
      <DragDroppable
        class="target-container target-container-1"
      ></DragDroppable>

      <!-- 拖拽物体1 -->
      <DragDraggable
        v-model:x="state.scene1.obj1.x"
        v-model:y="state.scene1.obj1.y"
        :use-transform-position="true"
        :use-duplicate="true"
        :free-drag="false"
        duplicate-class="duplicate"
        handle-selector=".handle"
        class="drag-obj drag-1 has-handle"
      >
        <div class="handle">✲</div>
        拖拽小块
        <!-- {{ toDecimal(state.scene1.obj1.x) }} : {{ toDecimal(state.scene1.obj1.y) }} -->
      </DragDraggable>
      <!-- 拖拽物体2 -->
      <DragDraggable
        v-model:x="state.scene1.obj2.x"
        v-model:y="state.scene1.obj2.y"
        :use-transform-position="true"
        :use-duplicate="false"
        class="drag-obj drag-1"
        :style="{
          // left: `${state.scene1.obj2.x}px`,
          // top: `${state.scene1.obj2.y}px`,
          transform: `translate(${state.scene1.obj2.x}px, ${state.scene1.obj2.y}px)`
        }"
      >
        拖拽小块
        <!-- {{ toDecimal(state.scene1.obj2.x) }} : {{ toDecimal(state.scene1.obj2.y) }} -->
      </DragDraggable>
      <!-- 拖拽物体3 -->
      <DragDraggable
        v-model:x="state.scene1.obj3.x"
        v-model:y="state.scene1.obj3.y"
        :use-transform-position="true"
        :use-duplicate="true"
        duplicate-class="duplicate"
        class="drag-2"
      >
        拖拽小块
        <!-- {{ toDecimal(state.scene1.obj3.x) }} : {{ toDecimal(state.scene1.obj3.y) }} -->
      </DragDraggable>
    </DragContext>
  </div>
</template>

<script lang="ts" setup>
import DragContext from '@/modules/drag-module/component/DragContext.vue';
import { DragDraggable, DragDroppable } from '@/modules/drag-module';
import { reactive } from 'vue';
import { toDecimal } from '@/tools/common';

const state = reactive({
  scene1: {
    obj1: {
      x: 50,
      y: 50,
    },
    obj2: {
      x: 50,
      y: 180,
    },
    obj3: {
      x: 0,
      y: 320,
    }
  }
});
</script>

<style lang="less" scoped>


.drag-2 {
  cursor: grab;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  background-color: #191A22;
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
  width: 150px;
  height: 80px;
  border-radius: 15px;
  background-color: #191A22;
  color: white;
  font-size: 18px;
  font-weight: bold;
  transition: 0.15s background-color;

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
    box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.3);
  }

  &.check-area-success {
    background-color: #f8c347;
  }
}

.target-container {
  display: inline-block;
  width: 150px;
  height: 150px;
  border-radius: 15px;
  background-color: #FEFEFE;
  transition: 0.15s box-shadow;
  box-shadow: inset rgba(201, 211, 219, 0.5) 0 0 0 2px, rgba(255, 255, 255, 0) 0 0 0 1px, rgba(201, 211, 219, 0.25) 20px 14px 24px;

  &.check-area-success {
    box-shadow: inset #1eb99d 0 0 0 3px, rgba(201, 211, 219, 0.5) 20px 14px 24px;
  }
}

.scene-1 {
  position: relative;
  width: calc(50% - 80px);
  height: 400px;
  margin: 20px;
  background-color: #FFFFFF;
  box-shadow: 0px 0px 0px 3px #EEE, 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: box-shadow 0.15s;

  &.drag-edge {
    box-shadow: 0px 0px 0px 3px rgb(224, 96, 22), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  }

  > .drag-1 {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  > .target-container-1 {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 50px;
    left: 300px;
    width: 250px;
    height: 250px;

    &.check-area-success {

      &:before {
        bottom: 20%;
      }
    }

    &:before {
      content: '拖拽到此区域';
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform: translate(-50%, 50%);
      text-align: center;
      white-space: nowrap;
      color: #888;
      font-size: 26px;
      font-weight: bold;
      transition: bottom 0.15s;
    }
  }
}
</style>