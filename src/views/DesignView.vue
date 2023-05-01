<template>
  <div>
    <div class="design-form">
      <!-- 头部部分 -->
      <div class="design-form-header">

        <div class="design-form-header-logo">
          <img src="@/assets/logo.svg" alt="">
        </div>

        <!-- 中间快捷操作栏 -->
        <CanvasQuickTools />
        
        <!-- 右侧菜单 -->
        <div class="design-form-header-menu">
          <Menu mode="horizontal" :forceSubMenuRender="true" :selectable="false">
            <SubMenu>
              <template #icon><FileOutlined /></template>
              <template #title>文件</template>
              <!-- <SubMenu>
                <template #icon><SelectOutlined /></template>
                <template #title>导入JSON</template>
                <MenuItem key="config" :disabled="true">
                  <i class="iconfont icon-file menu-iconfont"></i>JSON文件
                </MenuItem>
              </SubMenu> -->
              <!-- <MenuItem key="create" @click="showCreateNewDialog">
                <i class="iconfont icon-add menu-iconfont"></i>新建
              </MenuItem> -->
              <MenuItem key="createByLocal" @click="showCreateNewByLocalDialog">
                <i class="iconfont icon-add menu-iconfont"></i>新建本地
              </MenuItem>
              <MenuItem @click="showPrivateQuestionnaireLibraryDialog()">
                <i class="iconfont icon-weizhigeshi menu-iconfont"></i>打开
              </MenuItem>
              <SubMenu>
                <template #title>
                  <i class="iconfont icon-file menu-iconfont"></i>导入
                </template>
                <MenuItem key="importForFile">
                  <i class="iconfont icon-file menu-iconfont"></i>从文件导入
                </MenuItem>
                <MenuItem @click="showPublicQuestionnaireLibraryDialog()">
                  <i class="iconfont icon-weizhigeshi menu-iconfont"></i>从公共模板库导入
                </MenuItem>
              </SubMenu>
              <SubMenu v-if="editorState.appConfig.designConfig.isInit">
                <template #icon>
                  <ExportOutlined />
                </template>
                <template #title>导出</template>
                <MenuItem key="export_json" @click="menu_exportJSON()">导出为JSON</MenuItem>
              </SubMenu>
              <SubMenu>
                <template #icon>
                  <SkinOutlined />
                </template>
                <template #title>主题</template>
                <MenuItem
                  :class="{ 'ant-menu-item-active': editorState.appConfig.formTheme == theme.code }"
                  v-for="(theme, index) in state.formThemes"
                  :key="'sub1-2-' + index"
                  @click="editorService.selectTheme(theme.code, theme.title)"
                >
                  <CheckOutlined v-show="editorState.appConfig.formTheme == theme.code" />
                  {{theme.title}}
                </MenuItem>
              </SubMenu>
              <MenuItem key="config" @click="configService.open()">
                <i class="iconfont icon-config menu-iconfont"></i>设置
              </MenuItem>
            </SubMenu>
            <SubMenu  key="edit" v-if="editorState.appConfig.designConfig.isInit">
              <template #icon><EditOutlined /></template>
              <template #title>编辑</template>
              <MenuItem key="undo" @click="historyService.undo" :disabled="!historyState.canUndo">
                <i class="iconfont icon-undo menu-iconfont"></i>撤销
              </MenuItem>
              <MenuItem key="redo" @click="historyService.redo" :disabled="!historyState.canRedo">
                <i class="iconfont icon-redo menu-iconfont"></i>恢复
              </MenuItem>
            </SubMenu>
            <SubMenu v-if="editorState.appConfig.designConfig.isInit">
              <template #icon><AppstoreOutlined /></template>
              <template #title>应用</template>
              <MenuItem key="redo" @click="editorState.showAppStyleDialog = true">
                <i class="iconfont icon-theme menu-iconfont"></i>样式配置
              </MenuItem>
              <MenuItem key="appconig" @click="editorState.showAppConfigDialog = true">
                <i class="iconfont icon-config menu-iconfont"></i>应用配置
              </MenuItem>
            </SubMenu>
            <MenuItem v-if="editorState.appConfig.designConfig.isInit" @click="editorState.isPreview = true;"><template #icon><EyeOutlined /></template>预览</MenuItem>
            <!-- <MenuItem><template #icon><ScanOutlined /></template>二维码</MenuItem> -->
            <MenuItem v-if="editorState.appConfig.designConfig.isInit" @click="save()"><template #icon><SaveOutlined /></template>保存</MenuItem>
            <MenuItem v-if="editorState.appConfig.designConfig.isInit" @click="showPublishDialog()"><template #icon><SendOutlined /></template>发布</MenuItem>
          </Menu>
        </div>
      </div>

      <!-- 主体部分 -->
      <div class="design-form-body" @wheel="onResize">

        <!-- 主体中部 @mousedown="blankMouseDown" @mouseup="blankMouseUp" -->
        <div class="design-form-center">

          <!-- 全局搜索按钮 -->
          <div class="design-form-center-question">
            <Tooltip placement="top">
              <template #title>
                <span>全局搜索</span>
              </template>
              <Button shape="circle" @click="globalSearchService.open">
                <template #icon><i class="iconfont icon-search2"></i></template>
              </Button>
            </Tooltip>
          </div>

          <!-- 切换页面单选组 -->
          <div v-if="editorState.appConfig.appType === AppType.questionnaire && editorState.pages.length > 1" class="design-form-page-change">
            <RadioGroup button-style="solid" v-model:value="editorState.currentPageIndex">
              <RadioButton v-for="(page, pageIndex) in editorState.pages" :key="pageIndex" :value="pageIndex">{{ page.pageTitle }}</RadioButton>
            </RadioGroup>
          </div>

          <!-- 画布 -->
          <div class="design-form-canvas"
            :class="editorState.appConfig.designConfig.deviceType"
            @mousedown.stop="draggableService.startRangeSelect"
            @scroll="onScroll"
            v-if="editorState.appConfig.designConfig.isInit"
          >
            <!-- 对齐线 -->
            <div class="align-line-panel-vertical">
              <div class="align-line" v-for="line in draggableState.alignLines.filter(i => i.x !== undefined)" :style="{ left: `${line.x! + (editorState.canvasRect?.x ?? 0)}px` }"></div>
            </div>
            <div class="align-line-panel-horizontal">
              <div class="align-line" v-for="line in draggableState.alignLines.filter(i => i.y !== undefined)" :style="{ top: `${line.y! + (editorState.canvasRect?.y ?? 0)}px` }"></div>
            </div>

            <!-- 拖拽出来的定位线 -->

            <!-- 导航图（暂时不启用） -->
            <!-- <div class="svgPriview" style="position: absolute; top: 30px; left: 30px; width: 180px; height: 120px;">
              <div class="app-canvas app-canvas-preview">
                <DesignCanvas
                  :isPreview="true"
                  :isReadonly="true"
                />
              </div>
            </div> -->

            <!-- 问卷画布 -->
            <div class="design-form-canvas-page app-canvas" :style="getCanvasRect()" :class="editorState.currentPage.pageType">
              <!-- 画布页面名称 -->
              <div class="design-form-canvas-page-title">{{ editorState.currentPage.pageTitle }}</div>
              <!-- 问卷标题 -->
              <div class="questionnaire-title form-header" v-show="editorState.currentPage.pageType === 'normal-page' && editorState.appConfig.appType === 'questionnaire'">
                <span class="form-title">{{editorState.appConfig.appTitle}}</span>
              </div>
              <!-- 问卷内容 -->
              <div class="questionnaire-content form-content">
                <DesignCanvas ref="componentCanvas" :isPreview="false" :isReadonly="false" />
              </div>
            </div>
          </div>

          <!-- 欢迎界面 -->
          <WelComePanel
            v-else-if="!editorState.appConfig.designConfig.isInit"
            @create="welcomeCreate"
            @openQuestionnaireLibrary="showPublicQuestionnaireLibraryDialog()"
          ></WelComePanel>
          
          <!-- 空面板提示 -->
          <Empty v-else style="margin-top: calc(50vh - 130px);">
            <template #description>
              <span>当前暂未创建问卷</span>
            </template>
            <Button type="primary" @click="showCreateNewDialog">创建问卷</Button>
          </Empty>

          <!-- 缩略图组件 -->
          <Thumbnail
            :content-width="editorState.appConfig.canvasConfig.width + getWidthPadding"
            :content-height="editorState.appConfig.canvasConfig.height + getHeightPadding"
            v-model:range-left="draggableState.scrollLeft"
            v-model:range-top="draggableState.scrollTop"
            :range-width="draggableState.canvasViewportWidth"
            :range-height="draggableState.canvasViewportHeight"
            :content-list="editorState.currentPage.children"
            :canvas-scale="editorState.appConfig.canvasConfig.scale"
            v-if="editorState.appConfig.designConfig.isInit && editorState.appConfig.appType === AppType.canvas"
            @drag="toThumbnailDrag"
          ></Thumbnail>
        </div>

        <!-- 主体左侧菜单栏 -->
        <AsidePanel v-if="editorState.appConfig.designConfig.isInit"></AsidePanel>

        <!-- 主体右侧菜单栏 -->
        <ConfigPanel v-if="editorState.appConfig.designConfig.isInit"></ConfigPanel>

      </div>
      
      <!-- 底部状态部分 -->
      <div class="design-form-footer" tabindex="-1">
        <div class="design-form-footer-right">
          <Popover v-model:visible="saveHistoryVisible" title="应用保存记录" trigger="click">
            <template #content>
              <Timeline>
                <TimelineItem v-for="item in configState.saveHistory" :key="item.index">{{dayjs(item.time).fromNow()}}</TimelineItem>
              </Timeline>
            </template>
            <label v-if="editorState.appConfig.designConfig.isInit"><i class="iconfont icon-save"></i>{{configState.latestSaveHistory}}</label>
          </Popover>
          <!-- <label v-if="editorState.appConfig.isInit"><i class="iconfont icon-save"></i>30分钟前</label> -->
          <label v-if="editorState.appConfig.designConfig.isInit && editorState.appConfig.appType !== AppType.questionnaire"><i class="iconfont icon-fullscreen"></i>画布尺寸：{{editorState.appConfig.canvasConfig.width}}×{{editorState.appConfig.canvasConfig.height}}</label>
          <label v-if="editorState.appConfig.designConfig.isInit && editorState.appConfig.appType !== AppType.questionnaire"><i class="iconfont icon-print-view"></i>放大倍数：x{{editorState.appConfig.canvasConfig.scale.toFixed(1)}}</label>
          <label v-if="editorState.appConfig.designConfig.isInit"><i class="iconfont icon-layer"></i>组件数：{{editorService.getComponentCount()}}</label>
          <label><i class="iconfont icon-guide"></i>版本号 {{state.version}}</label>
          <label :class="configState.config.proMode ? 'pro-mode' : 'normal-mode'">
            <i class="iconfont" :class="configState.config.proMode === 'normal' ? 'icon-yunyingzhongxin' : 'icon-star'"></i>{{configState.getModeTxt }}
          </label>
        </div>
      </div>
    </div>

    <!-- 新建 -->
    <CreateNewDialog v-model:visible="state.visibleCreateNewDialog" v-model:create-type="state.createNewType" @complete="editorService.createNew"></CreateNewDialog>

    <!-- 新建 -->
    <CreateNewDialog title="创建新本地应用" v-model:visible="state.visibleCreateNewByLocalDialog" v-model:create-type="state.createNewType" @complete="editorService.createNewByLocal"></CreateNewDialog>

    <!-- 发布弹窗 -->
    <PublishDialog v-model:visible="state.visiblePublishDialog" @complete="editorService.publish"></PublishDialog>

    <!-- 应用预览弹出框 -->
    <AppPreviewDialog v-model:visible="editorState.isPreview"></AppPreviewDialog>

    <!-- 应用配置弹出框 -->
    <Drawer
      title="应用配置"
      width="600px"
      :bodyStyle="{ padding: '5px' }"
      :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
      v-model:visible="editorState.showAppConfigDialog"
    >
      <AppTypeConfig labelWidth="130px"
        v-if="['questionnaire', 'courseware', 'canvas'].includes(editorState.appConfig.appType)"
      ></AppTypeConfig>
      <ComplexComponentConfig labelWidth="130px"
        v-else-if="editorState.appConfig.appType === 'complex-component'"
      ></ComplexComponentConfig>
    </Drawer>

    <!-- 应用样式弹出框 -->
    <Drawer
      title="样式配置"
      width="600px"
      :bodyStyle="{ padding: '5px' }"
      :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
      v-model:visible="editorState.showAppStyleDialog"
    >
      <ThemeConfig labelWidth="130px"></ThemeConfig>
    </Drawer>

    <!-- JSON -->
    <Drawer
      :width="800"
      :maskClosable="true"
      title="导出JSON"
      @close="state.jsonEditorVisible = false"
      :visible="state.jsonEditorVisible"
    >
      <code-editor style="height: calc(100vh - 150px);"
        language="json"
        v-model:value="state.editorJson">
      </code-editor>
      <div class="drawer-footer">
        <Button @click="setEditorJson()" type="link">重新生成</Button>
        <Button @click="exportJSONFile()" type="primary">导出JSON文件</Button>
      </div>
    </Drawer>

  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, onUnmounted, onMounted, watch, computed } from 'vue';
import DesignCanvas from '../components/module/DesignCanvas.vue';
import { downLoadFile, dateFormat, throttle } from '@/tools/common';
import { Button, Drawer, Empty, Menu, MenuItem, Popover, RadioButton, RadioGroup, SubMenu, Timeline, TimelineItem, Tooltip } from 'ant-design-vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as historyState, service as historyService } from '@/common/history-module';
import { state as draggableState, service as draggableService } from '@/modules/draggable-module';
import { state as configState, service as configService } from '@/common/config-module';
import { state as versionHistoryState } from '@/modules/version-history-module';
import { service as globalSearchService } from '@/modules/global-search-module';
import { useComponentHandle } from '@/common/component-handle';
import { useAppHandle } from '@/common/app-handle';
import CreateNewDialog from '@/components/module/CreateNewDialog.vue';
import PublishDialog from '@/components/module/PublishDialog.vue';
import WelComePanel from '@/components/module/WelcomePanel.vue';
import AppPreviewDialog from '@/components/module/AppPreviewDialog.vue';
import ThemeConfig from '@/modules/theme-module/component/ThemeConfig.vue';
import ConfigPanel from '@/components/module/config-panel/ConfigPanel.vue';
import { AppType } from '@/@types/enum';
  
import { initCommands } from '@/data/form-commands';
import { getQuestionary } from '@/api/common/questionnaire';
import { useRoute } from 'vue-router';
import { Component } from '@/@types/component';
import dayjs from 'dayjs';
import { toast } from '@/common/message';
import { ExportOutlined, EyeOutlined, FileOutlined } from '@ant-design/icons-vue';
import Thumbnail from '@/components/common/Thumbnail.vue';

const {
  showPrivateQuestionnaireLibraryDialog,
  showPublicQuestionnaireLibraryDialog,
} = useAppHandle();

/** 保存记录pop弹窗 */
const saveHistoryVisible = ref<boolean>(false);

/** 画布滚动条滚动事件 */
const onScroll = throttle((e) => {
  draggableState.scrollTop = e.target.scrollTop;
  draggableState.scrollLeft = e.target.scrollLeft;
  const { y, x } = editorState.canvasPanelEl.getBoundingClientRect();
  editorState.canvasLocation.y = editorState.canvasPanelEl.scrollTop - y;
  editorState.canvasLocation.x = editorState.canvasPanelEl.scrollLeft - x;
}, 150);

/** 画布缩放事件 */
const onResize = (e) => {
  if (editorState.appConfig.appType !== AppType.questionnaire && e.ctrlKey) {
    if (e.deltaY > 0 || e.deltaX > 0) {
      if (editorState.appConfig.canvasConfig.scale >= 0.6) {
        editorState.appConfig.canvasConfig.scale -= 0.1;
      }
    } else {
      if (editorState.appConfig.canvasConfig.scale <= 2) {
        editorState.appConfig.canvasConfig.scale += 0.1;
      }
    }
    e.preventDefault();
    e.stopPropagation()
  }
};

const getWidthPadding = computed<number>(() => {
  switch (editorState.appConfig.appType) {
    case AppType.questionnaire: return 40;
    case AppType.canvas: return 40;
    default: return 0;
  }
});

const getHeightPadding = computed<number>(() => {
  switch (editorState.appConfig.appType) {
    case AppType.questionnaire: return 105;
    case AppType.canvas: return 40;
    default: return 0;
  }
});

/** 获取画布样式 */
const getCanvasRect = () => {
  const _style = {
    width: `${editorState.appConfig.canvasConfig.width}px`,
    minHeight: 'initial',
    zoom: editorState.appConfig.canvasConfig.scale,
  } as Record<string, any>;

  if (!editorState.isPreview) {
    _style.minHeight = `${editorState.appConfig.canvasConfig.height}px`;
  }
  return _style;
}
/** 从欢迎界面创建 */
const welcomeCreate = (type) => {
  state.visibleCreateNewDialog = true;
  state.createNewType = type;
};
/** 打开新建弹出框 */
const showCreateNewDialog = () => {
  state.createNewType = undefined;
  state.visibleCreateNewDialog = true;
};
/** 打开新建弹出框 */
const showCreateNewByLocalDialog = () => {
  state.createNewType = undefined;
  state.visibleCreateNewByLocalDialog = true;
};
/** 显示发布弹窗 */
const showPublishDialog = () => {
  state.visiblePublishDialog = true;
};
/** 保存设置 */
const saveConfig = () => {

};
/** 拖拽缩略图位置 */
const toThumbnailDrag = (x: number, y: number) => {
  editorState.canvasEl.scrollTo(x, y);
}
/** 设置JSON */
const setEditorJson = () => {
  const _layout = JSON.stringify(editorService.getExportData(), undefined, '  ');
  state.editorJson = _layout;
  toast('已生成JSON', 'success');
};
/** 导出为JSON */
const exportJSONFile = () => {
  downLoadFile(`${editorState.appConfig.appTitle}_${dateFormat(new Date(), 'yyyy-MM-dd')}.json`, state.editorJson);
};
/** 导出为Json文件 */
const menu_exportJSON = () => {
  setEditorJson();
  if (configState.config.proMode) {
    state.jsonEditorVisible = true;
  } else {
    exportJSONFile();
  }
};
/** 保存功能 */
const save = () => {
  historyService.exec('save', { value: 'save' });
};
    
const instance = getCurrentInstance();
const { componentHandle } = useComponentHandle();

const route = useRoute();

initCommands();

/** 根据 id 请求数据并加载页面 */
const getDataById = id => {
  const hide = toast('问卷加载中...', 'loading', 0);
  // 获取测试问卷
  getQuestionary(id as string).then(({ questionary, tagList }) => {
    if (!questionary) {
      toast('未查询到对应的应用', 'error');
    } else if (questionary.innerType && !questionary.content) {
      editorService.createNew({
        id: id + '',
        title: questionary.title,
        description: '',
        type: questionary.innerType.toLowerCase() as AppType,
        params: {},
      });
    } else if (questionary.content) {
      editorService.loadAppBody(id + '', questionary.content);
    }
  }).catch(err => {
    console.error(err);
    toast(`应用加载失败，错误原因：${err.message}`, 'error');
  }).finally(() => {
    hide();
  });
}

/** 监听问卷版本切换 */
versionHistoryState.bus.$on('version_change', () => {
  getDataById(route.query.qid);
});

const globalMouseMove = (e: MouseEvent) => {
  draggableService.dragMove(e);
  draggableService.moveRangeSelect(e);
}
const globalMouseUp = (e: MouseEvent) => {
  draggableService.endDrag(e);
  draggableService.endRangeSelect(e);
}

const onKeyDownStopPress = (e) => {
  if (e.code.toLowerCase() === 'space') {
    if (!draggableState.pressSpaceKey) {
      draggableState.pressSpaceKey = true;
    }
    e.preventDefault();
  }
};
const onKeyUpStopPress = (e) => {
  if (e.code.toLowerCase() === 'space') {
    if (draggableState.pressSpaceKey) {
      draggableState.pressSpaceKey = false;
    }
    e.preventDefault();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeyDownStopPress);
  window.addEventListener('keyup', onKeyUpStopPress);
  window.onkeydown = onKeyDownStopPress;
  window.onresize = () => {
    editorService.onPageSize();
  };
  editorState.bus.$on('component_handle', (eventName, params, component: Component) => {
    componentHandle(eventName, params, component);
  });
  document.body.addEventListener('mousemove', globalMouseMove);
  document.body.addEventListener('mouseup', globalMouseUp);
  if (route.query.qid) {
    getDataById(route.query.qid);
  }
});

onUnmounted(() => {
  document.body.removeEventListener('mousemove', globalMouseMove);
  document.body.removeEventListener('mouseup', globalMouseUp);
});

watch(() => route.fullPath, (newPath, oldPath) => {
  if (newPath !== oldPath && route.query.qid) {
    getDataById(route.query.qid);
  }
})

const state = reactive({
  /** 版本号 */
  version: instance ? instance.appContext.config.globalProperties.$packageInfo.version : '',
  /** 是否显示JSON导出框 */
  jsonEditorVisible: false,
  /** 导出的JSON */
  editorJson: '',
  /** 是否显示新建弹出框 */
  visibleCreateNewDialog: false,
  /** 是否显示本地新建弹出框 */
  visibleCreateNewByLocalDialog: false,
  /** 新建类型 */
  createNewType: AppType.questionnaire as AppType | undefined,
  /** 是否显示编辑框 */
  visibleConfigDialog: false,
  /** 是否显示发布弹出框 */
  visiblePublishDialog: false,
  /** 表单主题清单 */
  formThemes: [
    { code: 'default', title: '浅色主题' },
    { code: 'dark', title: '深色主题' },
    { code: 'translucent', title: '半透明主题' }
  ] as { code: string, title: string }[],
});

editorState.componentCanvas = ref(DesignCanvas);
</script>