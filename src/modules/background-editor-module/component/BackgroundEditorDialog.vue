<template>
  <div>
    <HakuDialog class="background-dialog" :title="state.currentBackgroundTypeText">
      <!-- 背景类型选择 -->
      <div class="background-dialog-type-panel">
        <ul
          class="background-type-tabs"
          :style="{
            '--background-type-count': state.backgroundTypeList.length,
            '--background-type-index': state.currentBackgroundTypeIndex
          }"
        >
          <li
            class="background-type-tab"
            :class="{ active: state.currentBackgroundType === item.name }"
            v-for="item in state.backgroundTypeList"
            @click="setBackgroundType(item.name)"
          >{{ item.title }}</li>
        </ul>
      </div>
      <!-- 选择器内容区域 -->
      <div class="background-dialog-content">
        <!-- 纯色 -->
        <TypeColorPicker v-if="state.currentBackgroundType === 'color'" />
        <!-- 线性渐变 -->
        <!-- 径向渐变 -->
      </div>
    </HakuDialog>
  </div>
</template>

<script lang="ts" setup>
import message from '@/common/message';
import HakuDialog from '@/components/common/HakuDialog.vue';
import { reactive } from 'vue';
import TypeColorPicker from './type-color/TypeColorPicker.vue';

const state = reactive({
  /** 当前背景类型 */
  currentBackgroundType: 'color',
  /** 当前背景类型索引 */
  currentBackgroundTypeIndex: 0,
  /** 当前背景类型文本 */
  currentBackgroundTypeText: '纯色',
  /** 背景类型列表 */
  backgroundTypeList: [
    { name: 'color', title: '纯色', url: '' },
    { name: 'linear-gradient', title: '线性渐变', url: '' },
    { name: 'radial-gradient', title: '径向渐变', url: '' },
    { name: 'conic-gradient', title: '旋转渐变', url: '' },
    { name: 'image', title: '图片', url: '' },
  ]
});

/** 修改背景类型 */
const setBackgroundType = (name: string) => {
  const _typeIndex = state.backgroundTypeList.findIndex(i => i.name === name);
  if (_typeIndex >= 0) {
    state.currentBackgroundType = name;
    state.currentBackgroundTypeIndex = _typeIndex;
    state.currentBackgroundTypeText = state.backgroundTypeList[_typeIndex].title;
  } else {
    message.toast('背景类型不存在', 'error');
    throw new Error('背景类型不存在');
  }
}
</script>

<style lang="less" scoped>

.background-dialog {
  position: relative;
  width: 300px;
}
.background-type-tabs {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
  background-color: #F5F5F5;
  border-radius: 6px;

  &:before {
    content: '';
    position: absolute;
    display: block;
    left: calc(var(--background-type-index, 0) * 100% / var(--background-type-count, 1) + 1%);
    top: 5%;
    width: calc(100% / var(--background-type-count, 1) - 2%);
    height: calc(90%);
    background-color: #648DDF;
    border-radius: 8px;
    transition: 0.15s left;
  }

  > .background-type-tab {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    text-align: center;
    z-index: 1;
    transition: 0.15s color;

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    &.active {
      cursor: default;
      color: white;
      // background-color: rgba(51, 122, 183, 0.2);
    }
  }
}
</style>