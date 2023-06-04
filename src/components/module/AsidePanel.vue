<template>
  <div class="design-form-aside" :class="{ fold: editorState.asideFold }" style="width: 340px">
    <div class="expand-handle-left" :class="{ fold: editorState.asideFold }" @click="editorService.toggleAsidePanel()"></div>
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
      <div v-if="state.activeKey === 'components' && state.groups.length" class="design-form-aside-toolbox">
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
          <Button type="primary" block>创建复合题型</Button>
        </div> -->
      </div>

      <!-- 题库菜单 -->
      <div v-if="state.activeKey === 'component-shop' && state.groups.length" class="design-form-aside-toolbox">
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
          <Button type="primary" block v-if="editorState.appConfig.appType === 'complex-component'">上传到题库</Button>
        </div>
      </div>

      <!-- 页面配置菜单 -->
      <AsidePageConfig v-if="state.activeKey === 'page'"></AsidePageConfig>

      <!-- 当前页面控件菜单 -->
      <AsideComponentView v-if="state.activeKey === 'outline'"></AsideComponentView>

      <!-- 数据源配置菜单 -->
      <DataSourceConfig v-if="state.activeKey === 'data'"></DataSourceConfig>

      <!-- 存储服务配置菜单 -->
      <FileStorageConfig v-if="state.activeKey === 'storage'"></FileStorageConfig>

      <!-- 历史记录菜单 -->
      <HistoryLog v-if="state.activeKey === 'log'"></HistoryLog>

      <!-- 版本记录菜单 -->
      <HistoryVersionConfig v-if="state.activeKey === 'version'"></HistoryVersionConfig>

      <!-- 主题模板菜单 -->
      <ThemeTemplateConfig v-if="state.activeKey === 'theme'"></ThemeTemplateConfig>

      <!-- 插件菜单 -->
      <PluginConfig v-if="state.activeKey === 'plugin'"></PluginConfig>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component } from '@haku-design/core';
import { ComponentCategory } from '@haku-design/core';
import { ToolComponentItem } from '@haku-design/core/tool-component-item';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { service as draggableService } from '@/modules/draggable-module';
import { reactive } from 'vue';
import DataSourceConfig from '@/modules/data-source-module/component/DataSourceConfig.vue';
import FileStorageConfig from '@/modules/storage-module/component/FileStorageConfig.vue';
import AsideComponentView from '@/components/module/aside-panel/AsideComponentView.vue';
import HistoryLog from '@/components/module/aside-panel/HistoryLog.vue';
import HistoryVersionConfig from '@/components/module/aside-panel/HistoryVersionConfig.vue';
import ThemeTemplateConfig from '@/modules/theme-module/component/ThemeTemplateConfig.vue';
import PluginConfig from '@/modules/plugin-module/component/PluginConfig.vue';
import AsidePageConfig from '@/components/module/aside-panel/AsidePageConfig.vue';
import { Button } from 'ant-design-vue';

const state = reactive({
  /** 左侧默认展开内容 */
  activeKey: 'components',
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
    { key: 'components', title: '设计', icon: 'iconfont icon-zidingyi' },
    { key: 'page', title: '页面', icon: 'iconfont icon-file' },
    // { key: 'component-shop', title: '题库', icon: 'iconfont icon-flow-layout' },
    { key: 'outline', title: '大纲', icon: 'iconfont icon-check-list' },
    { key: 'data', title: '数据', icon: 'iconfont icon-chucun' },
    // { key: 'storage', title: '存储', icon: 'iconfont icon-box3' },
    { key: 'log', title: '记录', icon: 'iconfont icon-history-list' },
    { key: 'version', title: '版本', icon: 'iconfont icon-guizeyinqing' },
    { key: 'theme', title: '主题', icon: 'iconfont icon-theme' },
    { key: 'plugin', title: '插件', icon: 'iconfont icon-plugin' },
  ],
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
      if (component.attrs) component.attrs[key] = value;
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
