<template>
  <li class="component-view-item">
    <div
      class="component-view-item-detail"
      :class="{ active: editorState.currentSelectedComponents.find(i => i.id === props.component?.id) }"
    >
      <div class="component-view-item-detail-title" @click.stop="itemClick(props.component)">
        <i :class="getComponentIcon(props.component.name)" alt="" />
        <span v-if="editorState.appConfig.showNo && component.isFormItem">{{ editorState.appConfig.showNo && component.isFormItem ? serialNumberService.getQuestionNo(props.component?.id) : '' }}</span>
        <span v-html="labelType === 'component' ? props.component.attrs.name : props.component.attrs.label"></span>
      </div>

      <ul class="component-view-item-tools">
        <li
          class="component-view-item-tool"
          title="锁定"
          :class="{ 'error show': component.attrs.lock }"
          @click="component.attrs.lock = !component.attrs.lock"
        >
          <i class="iconfont" :class="component.attrs.lock !== false ? 'icon-lock' : 'icon-unlock'"></i>
        </li>
        <li
          class="component-view-item-tool"
          title="显示"
          :class="{ 'warning show': !component.attrs.visible }"
          @click="component.attrs.visible = !component.attrs.visible"
        >
          <i class="iconfont" :class="component.attrs.visible !== false ? 'icon-eye' : 'icon-eye-close'"></i>
        </li>
      </ul>
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
    flex-grow: 1;
    flex-shrink: 1;
    padding: 3px 5px 3px 15px;
    width: 100%;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;

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

      > .component-view-item-tools {
        > .component-view-item-tool {
          visibility: visible;
        }
      }
    }

    > .component-view-item-detail-title {
      flex-grow: 1;
      flex-shrink: 1;
      width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      max-height: 80px;

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

    > .component-view-item-tools {
      flex-grow: 0;
      flex-shrink: 0;
      align-items: center;
      display: inline-flex;

      > .component-view-item-tool {
        position: relative;
        display: inline-flex;
        width: 22px;
        height: 22px;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        visibility: hidden;

        // &:after {
        //   content: attr(tip);
        //   display: inline-block;
        //   position: absolute;
        //   top: calc(100% + 12px);
        //   right: 0%;
        //   padding: 2px 12px;
        //   white-space: nowrap;
        //   color: white;
        //   font-size: 12px;
        //   background-color: rgba(0,0,0,0.6);
        //   border-radius: 4px;
        //   transform: translate(0%, 6px);
        //   z-index: 999;
        //   opacity: 0.0;
        //   visibility: hidden;
        //   transition: visibility 0.15s, opacity 0.15s, transform 0.15s;
        // }

        &:hover {
          background-color: rgba(51, 122, 183, 0.2);

          // &:after {
          //   visibility: visible;
          //   opacity: 1;
          //   transform: translate(0%, 0px);
          // }

          > .component-view-item-tools {

            > .component-view-item-tool {
              visibility: visible;
            }
          }
        }

        &.show {
          visibility: visible !important;
        }

        &.default {
          color: #BBBBBB;
        }
        &.warning {
          color: #ffc53d;
        }
        &.error {
          color: #ff4d4f;
        }

        + .component-view-item-tool {
          margin-left: 4px;
        }
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
