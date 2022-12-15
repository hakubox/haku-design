<template>
  <div class="design-form-aside" :class="{ fold: state.asideFold }" style="width: 340px">
    <div class="expand-handle-left" :class="{ fold: state.asideFold }" @click="state.asideFold = !state.asideFold"></div>
    <div class="design-form-aside-group">
      <div
        class="design-form-aside-group-item"
        :class="{ active: state.activeKey == item.key }"
        @click="state.activeKey = item.key"
        v-for="item in state.category"
        :key="item.key"
      >
        <i :class="item.icon"></i>
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="design-form-aside-content">
      <!-- 控件列表菜单 -->
      <div v-show="state.activeKey === 1 && state.groups.length" class="design-form-aside-toolbox">
        <div class="design-form-aside-toolbox-group" v-for="groupItem in state.groups" :key="groupItem.category">
          <template
            v-if="
              editorState.menuComponents.filter(
                (item) =>
                  item.category == groupItem.category &&
                  (!item.pageType || item.pageType.includes(editorState.currentPage.pageType)),
              ).length
            "
          >
            <span class="design-form-aside-toolbox-group-title">{{ groupItem.title }}</span>
            <ul class="design-form-aside-components">
              <li
                class="component-item"
                :class="{ new: item.isNew }"
                v-for="(item, index) in editorState.menuComponents.filter(
                  (item) =>
                    item.category == groupItem.category &&
                    (!item.pageType || item.pageType.includes(editorState.currentPage.pageType)),
                )"
                :key="index"
                @mousedown="draggableService.startDrag($event, getComponent(item))"
              >
                <i class="component-item-icon" :class="item.icon" alt="" />
                <span class="component-item-title">{{ item.title }}</span>
              </li>
            </ul>
          </template>
        </div>
        <!-- <div class="design-form-aside-toolbox-footer">
          <a-button type="primary" block>创建复合题型</a-button>
        </div> -->
      </div>

      <!-- 题库菜单 -->
      <div v-show="state.activeKey === 2 && state.groups.length" class="design-form-aside-toolbox">
        <div class="design-form-aside-toolbox-group">
          <ul class="design-form-aside-components">
            <li
              class="component-item"
              :class="{ new: item.isNew }"
              v-for="(item, index) in editorState.menuComponents"
              :key="index"
              @mousedown="draggableService.startDrag($event, getComponent(item))"
            >
              <i class="component-item-icon" :class="item.icon" alt="" />
              <span class="component-item-title">{{ item.title }}</span>
            </li>
          </ul>
        </div>
        <div class="design-form-aside-toolbox-footer">
          <a-button type="primary" block v-if="editorState.appConfig.appType === 'complex-component'"
            >上传到题库</a-button
          >
        </div>
      </div>

      <!-- 画布已有控件菜单（大纲） -->
      <AsideComponentView v-show="state.activeKey === 3"></AsideComponentView>

      <!-- 数据源配置菜单 -->
      <DataSourceConfig v-show="state.activeKey === 4"></DataSourceConfig>

      <!-- 存储服务配置菜单 -->
      <FileStorageConfig v-show="state.activeKey === 5"></FileStorageConfig>

      <!-- 历史记录菜单 -->
      <HistoryLog v-show="state.activeKey === 6"></HistoryLog>

      <!-- 历史记录菜单 -->
      <HistoryVersionConfig v-show="state.activeKey === 7"></HistoryVersionConfig>

      <!-- 主题模板菜单 -->
      <ThemeTemplateConfig v-show="state.activeKey === 8"></ThemeTemplateConfig>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component } from '@/@types';
import { ComponentCategory } from '@/@types/enum';
import { ToolComponentItem } from '@/@types/tool-component-item';
import { state as editorState } from '@/modules/editor-module';
import { service as draggableService } from '@/modules/draggable-module';
import { reactive } from 'vue';
import DataSourceConfig from '@/modules/data-source-module/component/DataSourceConfig.vue';
import FileStorageConfig from '@/modules/storage-module/component/FileStorageConfig.vue';
import AsideComponentView from '@/components/module/aside-panel/AsideComponentView.vue';
import HistoryLog from '@/components/module/aside-panel/HistoryLog.vue';
import HistoryVersionConfig from '@/components/module/aside-panel/HistoryVersionConfig.vue';
import ThemeTemplateConfig from '@/modules/theme-module/component/ThemeTemplateConfig.vue';

const state = reactive({
  /** 左侧默认展开内容 */
  activeKey: 1,
  /** 题型分组 */
  groups: [
    { title: '普通组件', category: ComponentCategory.normal },
    { title: '布局组件', category: ComponentCategory.layout },
    { title: '复合组件', category: ComponentCategory.complex },
    { title: '附加内容', category: ComponentCategory.attachment },
    { title: '定制组件', category: ComponentCategory.special },
  ],
  /** 题库标签列表 */
  questionPoolTags: [{ title: '常规' }, { title: '恐高症' }, { title: '焦虑症' }],
  /** 左侧分类 */
  category: [
    { key: 1, title: '设计', icon: 'iconfont icon-zidingyi' },
    // { key: 2, title: '题库', icon: 'iconfont icon-flow-layout' },
    { key: 3, title: '大纲', icon: 'iconfont icon-check-list' },
    { key: 4, title: '数据', icon: 'iconfont icon-chucun' },
    // { key: 5, title: '存储', icon: 'iconfont icon-box3' },
    { key: 6, title: '记录', icon: 'iconfont icon-history-list' },
    { key: 7, title: '版本', icon: 'iconfont icon-guizeyinqing' },
    { key: 8, title: '主题', icon: 'iconfont icon-theme' },
  ],
  /** 左侧栏是否展开 */
  asideFold: false,
});

/** 根据分类获取组件列表 */
const getComponentListByCategory = (category: string) => {
  return editorState.menuComponents.filter((item) => item.category == category);
};
/** 查询项图标 */
const getComponent = (toolitem: ToolComponentItem): Component => {
  const component = editorState.componentList.find((i) => i.name == toolitem.name);
  if (!component) throw new Error('未查询到对应组件');
  if (toolitem.attrs) {
    Object.entries(toolitem.attrs).forEach(([key, value]) => {
      component.attrs[key] = value;
    });
  }
  if (toolitem.answerType) {
    component.answerType = toolitem.answerType;
  }
  return component as Component;
};
/** 查询项图标 */
const getComponentIcon = (componentName: string): string => {
  const component = editorState.menuComponents.find((i) => i.name == componentName);
  return component ? component.icon : '';
};
</script>
