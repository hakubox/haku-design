<template>
  <li class="component-view-item">
    <div
      class="component-view-item-detail"
      :class="{ active: editorState.currentSelectedComponents.find(i => i.id === props.component?.id) }"
      @click.stop="itemClick(props.component)"
    >
      <i :class="getComponentIcon(props.component.name)" alt="" />
      <span>{{ editorState.appConfig.showNo && component.isFormItem ? serialNumberService.getQuestionNo(props.component?.id) : '' }}</span>
      <span v-html="labelType === 'component' ? props.component.attrs.name : props.component.attrs.label"></span>
    </div>

    <ul v-if="props.component.children?.length" class="component-view-list">
      <AsideComponentChildView
        v-for="(item, index) in props.component.children"
        @click.stop="itemClick(item)"
        :pageIndex="pageIndex"
        :key="index"
        :component="item"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { nextTick, PropType } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { service as serialNumberService } from '@/modules/serial-number-module';
import { Component } from '@/@types';

const props = defineProps({
  /** 组件 */
  component: {
    type: Object as PropType<Component>,
    required: true,
  },
  /** 页索引 */
  pageIndex: {
    type: Number,
    required: true
  },
  /** 标签类型 */
  labelType: {
    type: String as PropType<'component' | 'title'>,
    default: 'component',
  }
});

/** 查询项图标 */
const getComponentIcon = (componentName: string): string => {
  const component = editorState.menuComponents.find((i) => i.name == componentName);
  return component ? component.icon : '';
}

const itemClick = async (item: Component) => {
  editorService.changeSelectedFormComponent([item]);
  if (editorState.currentPageIndex !== props.pageIndex) {
    await nextTick();
    editorService.gotoAppPage(props.pageIndex);
  }
};
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

// 左侧已配置题目列表
.component-view-item {
  .user-select();
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  justify-content: flex-start;
  vertical-align: middle;
  cursor: pointer;
  width: 100%;
  text-overflow: ellipsis;
  transition: 0.15s;
  color: #919fc7;
  font-size: 12px;
  line-height: 24px;

  + .component-view-item {
    margin-top: 0px;

    // &:before {
    //   content: '';
    //   position: absolute;
    //   display: block;
    //   top: -4px;
    //   left: 4%;
    //   width: 92%;
    //   height: 1px;
    //   background-color: #f5f5f5;
    // }
  }

  > .component-view-item-detail {
    padding: 3px 15px;
    width: 100%;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    max-height: 80px;

    :deep(p) {
      display: inline;
      white-space: pre-wrap;
      margin-bottom: 0px;
    }

    &.active {
      background-color: rgba(51, 122, 183, 0.2);
    }

    &:hover {
      background-color: rgba(51, 122, 183, 0.2);
    }

    > .iconfont {
      margin-right: 8px;
      font-size: 18px;
      line-height: 22px;
      vertical-align: middle;
      flex-grow: 0;
      flex-shrink: 0;
      color: #6e8697;
    }

    > span {
      vertical-align: middle;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;

      > * {
        display: inline;
        margin-bottom: 0px;
      }
    }
  }

  > .component-view-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 25px;

    &:last-child {
      border-bottom: none;
    }

    > .component-view-item {
      > .component-view-item-detail {
        padding-left: 10px;
      }
    }
  }
}
</style>
