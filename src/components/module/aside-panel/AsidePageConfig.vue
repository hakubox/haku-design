<template>
  <div class="aside-page-config" @mousedown.stop="state.rightClickMenuVisible = false">
    <!-- scale {{ state.scale }} :::: height {{ state.height }} -->
    <ul class="page-list" ref="elPageList">
      <li class="page-item" :class="{ 'page-item-active': editorState.currentPageIndex === index }" v-for="(item, index) in editorState.pages" :key="index">
        <span class="page-item-index">{{ index + 1 }}</span>
        <div class="page-item-body"
          :style="{
            height: `${state.height}px`
          }"
          :title="item.pageTitle"
          @click="setPageIndex(index)"
          @contextmenu="(event) => onRightClick(event, index)"
        >
          <div class="page-item-content" :style="{
            zoom: state.scale,
          }">
            <DesignCanvas
              :style="{
                width: `${editorState.appConfig.canvasConfig.width}px`,
                height: `${editorState.appConfig.canvasConfig.height}px`,
              }"
              :pageIndex="index"
              :isPreview="true"
              :isReadonly="true"
              :showEditor="false"
              :showButton="false"
            />
          </div>
        </div>
      </li>
    </ul>
    
    <div class="page-config-create">
      <Button type="primary" @click="createNewPage()">
        <template #icon><PlusOutlined /></template>
        添加新页面
      </Button>
    </div>
    
    <!-- 右键菜单 -->
    <Vue3Menus
      v-model:open="state.rightClickMenuVisible"
      :event="state.menuEvent"
      :menus="state.menus"
      hasIcon
      :zIndex="9999"
    ></Vue3Menus>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import DesignCanvas from "@/components/module/DesignCanvas.vue";
import bus, { GlobalBusType } from '@/tools/bus';
import { Button } from 'ant-design-vue';
import { PageType } from '@/@types/enum';
import { Vue3Menus } from 'vue3-menus';
import { cloneLoop } from '@/lib/clone';
import { AppPage, Component, ComponentGroup } from '@/@types';
import { createModelId } from '@/tools/common';
import message from '@/common/message';

const elPageList = ref<HTMLElement>();

const state = reactive({
  /** 缩放倍数 */
  scale: 1,
  /** 高度 */
  height: 0,
  /** 菜单对应的当前页面索引 */
  menuCurrentIndex: 0,
  menus: [
    {
      label: '复制',
      click: () => {
        const _pageConfig = cloneLoop(editorState.pages[state.menuCurrentIndex]) as AppPage;
        const _fn = (component: (Component | ComponentGroup)) => {
          component.id = createModelId(10);
          if (component.children?.length) {
            for (let i = 0; i < component.children.length; i++) {
              _fn(component.children[i]);
            }
          }
        }
        _pageConfig.children.forEach(i => _fn(i));
        const _count = editorState.pages.filter(i => new RegExp(`^${_pageConfig.pageTitle}_副本(\\d+)?$`, 'g').test(i.pageTitle));
        _pageConfig.pageTitle = `${_pageConfig.pageTitle}_副本${_count.length > 0 ? _count.length + 1 : ''}`;
        editorState.pages.splice(state.menuCurrentIndex + 1, 0, _pageConfig);
        editorState.currentPageIndex = state.menuCurrentIndex + 1;
      },
    },
    {
      label: '删除',
      style: {
        color: '#FF7775',
      },
      click: () => {
        if (editorState.pages.length > 1) {
          if (editorState.currentPageIndex === state.menuCurrentIndex) {
            editorState.currentPageIndex = state.menuCurrentIndex - 1;
          }
          editorState.pages.splice(state.menuCurrentIndex, 1);
        } else {
          message.toast('应用至少需要1页');
        }
      },
    },
  ],
  /** 菜单Event */
  menuEvent: {} as MouseEvent,
  /** 右键菜单是否显示 */
  rightClickMenuVisible: false,
});

bus.$on(GlobalBusType.onRefresh, () => {
  editorService.refresh();
  getScale();
});

/** 获取缩放比 */
const getScale = () => {
  const _elWidth = (elPageList.value?.querySelector('.page-item-body') as HTMLElement)?.offsetWidth || 240;
  const _scaleX = _elWidth / editorState.appConfig.canvasConfig.width;
  const _height = editorState.appConfig.canvasConfig.height * _scaleX;
  const _scaleY = _height / editorState.appConfig.canvasConfig.height;

  state.height = _height;
  state.scale = _scaleX < _scaleY ? _scaleX : _scaleY;
};

/** 创建新页面 */
const createNewPage = () => {
  editorState.pages.push({ pageTitle: `新页面${editorState.pages.length + 1}`, pageType: PageType.normalPage, children: [] });
};

const onRightClick = (event, index: number) => {
  state.menuCurrentIndex = index;
  nextTick(() => {
    state.menuEvent = event;
    state.rightClickMenuVisible = true;
  });
  event.preventDefault();
};

const setPageIndex = (index: number) => {
  editorState.currentPageIndex = index;
}

onMounted(() => {
  nextTick(getScale);
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.aside-page-config {
  position: relative;
  background-color: #ECEEF4;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
  height: calc(100% - 0px);

  > .page-config-create {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 20px 8px;
    width: 100%;
    background-color: #ECEEF4;
  }

  > .page-list {
    flex-shrink: 1;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0px;
    background-color: #ECEEF4;
    height: 100%;
    width: calc(100% - 0px);
    overflow-x: hidden;
    overflow-y: auto;

    > .page-item {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 5px 0px 0px 0px;
      margin: 10px 10px 0px 10px;
      width: calc(100% - 20px);

      &:last-child {
        margin-bottom: 10px;
      }

      &.page-item-active {

        > .page-item-body {
          box-shadow: 0px 0px 0px 2px @primary-color;
        }
      }

      > .page-item-index {
        flex-shrink: 0;
        flex-grow: 0;
        display: inline-block;
        width: 30px;
        text-align: right;
        padding-right: 10px;
      }

      > .page-item-body {
        position: relative;
        flex-shrink: 1;
        flex-grow: 1;
        display: block;
        width: calc(100% - 40px);
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid #F5F5F5;
        background-color: white;

        &:before {
          content: '';
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        > .page-item-content {
          position: relative;
          flex-shrink: 1;
          flex-grow: 1;
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>
