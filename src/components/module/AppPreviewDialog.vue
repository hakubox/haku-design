<template>
  <!-- 预览界面 -->
  <div class="preview-modal"
    :class="{
      show: isShow,
      leave: state.isLeaving
    }"
    @click.self.stop="closePreview"
  >
    <div class="preview-modal-body">
      <div class="preview-modal-content device-info"
        ref="deviceInfo"
        :class="[ state.previewUIConfig.useOriginScale ? 'origin-scale' : '', {
          'pc': 'device-info-pc',
          'tablet': 'device-info-tablet',
          'mobile': 'device-info-mobile',
        }[state.previewUIConfig.deviceType], 
        `app-type-${editorState.appConfig.appType}`]"
        :style="{
          '--tablet-scale': state.tabletScale,
          '--tablet-content-scale': state.tabletContentScale,
          '--mobile-scale': state.mobileScale,
          '--mobile-content-scale': state.mobileContentScale,
          '--pc-scale': state.pcScale,
          '--pc-content-scale': state.pcContentScale,
        }"
      >
        <DesignCanvas
          v-if="isShow"
          :style="{
            width: editorState.appConfig.appType === AppType.canvas ? `${editorState.appConfig.canvasConfig.width}px` : '',
            height: editorState.appConfig.appType === AppType.canvas ? `${editorState.appConfig.canvasConfig.height}px` : '',
          }"
          class="device-info-content"
          :isPreview="true"
          @refresh="editorService.refresh"
        />
      </div>

      <!-- 调试器 -->
      <div class="canvas-data-editor" v-if="isShow && editorState.currentPage.pageType === PageType.normalPage">
        <div class="canvas-data-editor-body">
          <Tabs v-model:activeKey="state.activeKey" type="card">
            <template #rightExtra>
              <Popconfirm v-if="state.activeKey === 'event'" placement="bottomRight" @confirm="eventService.clearLog()">
                <template #title>是否确认清空事件日志列表？</template>
                <Button danger size="small" style="margin-right: 10px;">清除日志</Button>
              </Popconfirm>
              <Button v-if="state.activeKey === 'preview'" type="primary" ghost size="small" style="margin-right: 10px;">新页面打开</Button>
            </template>
            <TabPane key="preview" tab="预览配置" force-render>
              <GeneralEditor
                :model="state.previewUIConfig"
                :propertys="state.previewUIConfigProps"
                :groups="[{ title: '界面', name: 'ui', icon: '' }]"
              ></GeneralEditor>
            </TabPane>
            <TabPane key="data" tab="表单数据" force-render>
              <Empty
                v-if="!formFillState.formFillList.length"
                description="暂无填充数据"
                :style="{ marginTop: '20vh' }"
              ></Empty>
              <GeneralEditor v-else
                :model="formFillState.formInfo"
                :propertys="formFillProps"
                :groups="[{ title: '基础数据', name: 'data', icon: '' }]"
              ></GeneralEditor>
            </TabPane>
            <TabPane key="event" tab="事件日志" force-render>
              <List
                class="event-history"
                item-layout="horizontal"
                :data-source="eventState.eventLogs"
              >
                <template #renderItem="{ item }">
                  <ListItem style="padding: 8px 0px;">
                    <template #actions>
                      <a
                        key="list-loadmore-edit"
                        style="display: inline-block;margin-top: 8px;"
                        @click="executeEvent(item)"
                      >重新触发</a>
                      <Popover placement="topRight" trigger="click" arrowPointAtCenter>
                        <template #content>
                          <EventItem style="width: 460px;" :event="item.event" :readonly="true" :highlight="getHighlight(item)"></EventItem>
                        </template>
                        <a key="list-loadmore-more">详情</a>
                      </Popover>
                    </template>
                    <Skeleton avatar :title="false" :loading="false" active>
                      <ListItemMeta :description="dateFormat(item.createTime, 'MM-dd HH:mm:ss')">
                        <template #title>
                          <Tag v-if="item.isElseAction" color="purple">反向</Tag>
                          {{ item.title }}
                        </template>
                        <template #avatar>
                          <Avatar :style="{
                            backgroundColor: '#f9b643',
                            marginTop: '8px',
                            marginRight: '-4px',
                            borderRadius: '6px'
                          }" shape="square">
                            <template #icon><i class="iconfont icon-rule"></i></template>
                          </Avatar>
                        </template>
                      </ListItemMeta>
                    </Skeleton>
                  </ListItem>
                </template>
              </List>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, computed, PropType, Ref, onMounted, onUnmounted, ref } from "vue";
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as formFillState, service as formFillService, type FormInfoItem } from '@/modules/form-fill-module';
import { state as eventState, service as eventService, type AppEventLog } from '@/modules/event-module';
import { AppType, ComponentPropertyEditor, PageType } from '@/@types/enum';
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';
import DesignCanvas from "./DesignCanvas.vue";
import { cloneLoop } from "@/lib/clone";
import { AppPage } from "@/@types/app-page";
import { GeneralProperty } from "@/@types";
import EventItem from "@/modules/event-module/component/EventItem.vue";
import { Avatar, Button, Empty, List, ListItem, ListItemMeta, Popconfirm, Popover, Skeleton, TabPane, Tabs, Tag, message } from "ant-design-vue";
import { dateFormat } from "@/tools/common";

const deviceInfo = ref<HTMLElement>();

const props = defineProps({
  /** 是否显示预览框 */
  visible: {
    type: [Boolean, Object] as PropType<boolean | Ref<boolean>>,
    default: false,
  }
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
}>();

const state = reactive({
  activeKey: 'preview',
  /** 预览框关闭中 */
  isLeaving: false,
  /** 各个设备缩放比 */
  tabletScale: 1,
  tabletContentScale: 1,
  mobileScale: 1,
  mobileContentScale: 1,
  pcScale: 1,
  pcContentScale: 1,
  /** 预览配置 */
  previewUIConfig: {
    deviceType: 'pc',
    /** 使用原始缩放比 */
    useOriginScale: false,
    /** 设备方向（landscape横向/vertical纵向） */
    direction: 'vertical' as 'landscape' | 'vertical',
  },
  /** 设备屏幕信息（默认竖屏） */
  deviceScreenInfos: {
    /** 默认平板屏幕 */
    tablet: {
      width: 820,
      height: 1180,
      padding: [30, 26, 30, 26],
    },
    /** 默认手机屏幕 */
    mobile: {
      width: 390,
      height: 750,
      padding: [50, 15, 50, 15],
    }
  },
  /** 预览配置属性栏 */
  previewUIConfigProps: [
    {
      name: 'deviceType',
      title: '展现方式',
      require: false,
      visible: true,
      group: 'ui',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: 'PC', value: 'pc' },
          { label: '平板', value: 'tablet' },
          { label: '手机', value: 'mobile' }
        ]
      }
    }, {
      name: 'direction',
      title: '切换方向',
      require: false,
      visible: true,
      group: 'ui',
      editor: ComponentPropertyEditor.radioGroup,
      attrs: {
        options: [
          { label: '纵向', value: 'vertical' },
          { label: '横向', value: 'landscape' }
        ]
      },
    }, {
      name: 'useOriginScale',
      title: '原始缩放比',
      require: false,
      visible: true,
      group: 'ui',
      editor: ComponentPropertyEditor.boolean
    }
  ],
});

/** 临时formFill数据模块 */
let tempFormFillState = cloneLoop(formFillState.formInfo) as Record<string, FormInfoItem>;

/** 临时appPages数据 */
let tempAppPagesState = cloneLoop(editorState.pages) as AppPage[];

const isShow = computed(() => {
  return typeof props.visible === 'boolean' ? props.visible : props.visible.value
});

const components = computed(() => {
  return editorService.getAllFormItem();
});

/** 表单属性列表 */
const formFillProps = computed<GeneralProperty[]>(() => {
  const _formInfo = Object.values(formFillState.formInfo);
  _formInfo.sort((a, b) => components.value.findIndex(i => i.id === a.id) - components.value.findIndex(i => i.id === b.id));
  return _formInfo.map(item => {
    let _editor: GeneralProperty['editor'] = ComponentPropertyEditor.singerLine;
    if (item?.value?.dataOrigin === 'data-editor') {
      _editor = ComponentPropertyEditor.data;
    } else {
      switch (item.type) {
        case 'text':
          _editor = ComponentPropertyEditor.singerLine;
          break;
        case 'text-list':
          _editor = ComponentPropertyEditor.textList;
          break;
        case 'option':
          _editor = ComponentPropertyEditor.singerLine;
          break;
        case 'number':
          _editor = ComponentPropertyEditor.int;
          break;
        case 'number-list':
          _editor = ComponentPropertyEditor.textList;
          break;
        case 'option-list':
          _editor = ComponentPropertyEditor.textList;
          break;
        case 'boolean':
          _editor = ComponentPropertyEditor.boolean;
          break;
        case 'variable':
          _editor = ComponentPropertyEditor.variable;
          break;
        default:
          break;
      }
    }

    return {
      name: item.id,
      title: components.value.find(i => i.id === item.id)?.attrs?.label ?? '——',
      require: false,
      visible: true,
      group: 'data',
      editor: _editor
    };
  });
});

/** 开启预览 */
const openPreview = () => {
  if (editorState.appConfig.appType === AppType.questionnaire) {
    state.previewUIConfig.direction = 'vertical';
  } else if (editorState.appConfig.appType === AppType.canvas) {
    state.previewUIConfig.direction = 'landscape';
  }
};

/** 关闭预览 */
const closePreview = () => {
  state.isLeaving = true;
  setTimeout(() => {
    editorState.pages = tempAppPagesState;
    formFillState.formInfo = tempFormFillState;
    eventService.clearLog();
  }, 10);
  setTimeout(() => {
    emit('update:visible', false);
    setTimeout(() => {
      formFillService.$reset();
      state.isLeaving = false;
    }, 200);
  }, 500);
};

/** 直接触发事件 */
const executeEvent = (item: AppEventLog) => {
  message.success(`${item.title}已${item.isElseAction ? '反向' : ''}触发`);
  eventService.executeEvent(item.event, item.triggerType, item.triggerTarget, [], item.isElseAction, item.extraData, false);
}

/** 获取高亮配置 */
const getHighlight = (item: AppEventLog) => {
  const _ids = (item.isElseAction ? item.event.actions : item.event.elseActions).map(i => i.id);
  _ids.push(...item.event.triggers.filter(i => !item.triggerIds.includes(i.id)).map(i => i.id));
  return _ids.map(id => ({ id, type: 'ignore' })) as { id: string; type: "ignore" | "default" | "primary" | "success" | "error"; }[];
};

watch(() => props.visible, (val) => {
  if (val) {
    openPreview();
    state.previewUIConfig.deviceType = editorState.appConfig.designConfig.deviceType;
    tempFormFillState = cloneLoop(formFillState.formInfo) as Record<string, FormInfoItem>;
    tempAppPagesState = cloneLoop(editorState.pages) as AppPage[];
    resetScale();
  }
});

const resetScale = () => {
  const _windowHeight = window.innerHeight - 60;
  if (editorState.appConfig.appType === AppType.questionnaire) {
    state.tabletScale = _windowHeight / 1180 > 1 ? 1 : _windowHeight / 1180;
    state.mobileScale = _windowHeight / 750 > 1 ? 1 : _windowHeight / 750;
  } else if (editorState.appConfig.appType === AppType.canvas) {
    const _width = window.innerWidth - 500 - 40;
    const _height = window.innerHeight - 60 - 48;
    const _scale = Math.min(_width / editorState.appConfig.canvasConfig.width, _height / editorState.appConfig.canvasConfig.height);
    state.pcContentScale = _scale;

    state.tabletScale = _windowHeight / 1180 > 1 ? 1 : _windowHeight / 1180;
    state.tabletContentScale = Math.min((1180 - 60) / editorState.appConfig.canvasConfig.height, (820 - 54) / editorState.appConfig.canvasConfig.width);
    state.mobileScale = _windowHeight / 750 > 1 ? 1 : _windowHeight / 750;
    state.mobileContentScale = Math.min((750 - 100) / editorState.appConfig.canvasConfig.height, (390 - 30) / editorState.appConfig.canvasConfig.width);
  }
};

onMounted(() => {
  state.previewUIConfig.deviceType = editorState.appConfig.designConfig.deviceType;
  window.addEventListener('resize', resetScale);
});

onUnmounted(() => {
})

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.preview-modal-enter-active,
.preview-modal-leave-active {
  transition: opacity 0.5s ease;
}
.preview-modal-enter-from,
.preview-modal-leave-to {
  opacity: 0;
  visibility: hidden;
}

// 事件日志
.event-history {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px 5px 10px 15px;
  height: 627px;
}

// 预览弹窗
.preview-modal {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.25s;

  &.show {
    visibility: visible;
    opacity: 1;

    > .preview-modal-body {
      transform: translateY(0px);
    }
  }

  &.leave {
    opacity: 0;

    > .preview-modal-body {
      transform: translateY(-30px);
    }
  }

  .preview-modal-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-right: 450px;
    transition: 0.25s;
    transform: translateY(-30px);

    > .preview-modal-header {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 12px 6px 12px;
      border-bottom: 1px solid #ddd;

      > .preview-modal-title {
        flex-shrink: 1;
        flex-grow: 1;
        font-size: 14px;
        font-weight: bold;
      }

      > .preview-modal-tools {
        flex-shrink: 0;
        flex-grow: 0;

        font-size: 14px;

        > span {
          transition: 0.12s;

          &:hover {
            color: @primary-color;
          }
        }
      }
    }

    > .preview-modal-content {
      flex-shrink: 1;
      flex-grow: 1;
      position: relative;
      display: block;
      overflow: hidden;
      will-change: auto;

      > .form-canvas {
        min-height: initial;
        margin: auto;
        
        > .form-canvas-body {
          position: relative;
          // display: block;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          transform: translateY(0px);
        }
      }
    }

    // 表单属性调试器
    > .canvas-data-editor {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      top: 0px;
      bottom: 0px;
      margin: auto;
      left: calc(100% + 60px);
      width: 400px;
      height: 80vh;
      background-color: white;
      border-radius: 6px;

      > h3 {
        width: 100%;
        padding: 10px 10px 10px 20px;
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 0px;
        font-size: 18px;
      }

      > .canvas-data-editor-body {
        flex-grow: 1;
        flex-shrink: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        padding-top: 0px;
        height: 100%;

        > .ant-tabs {
          flex-grow: 1;
          flex-shrink: 1;
        }
      }

      li {
        line-height: 30px;

        &.canvas-data-editor-obj-name {
          > span {
            cursor: default;
            display: inline-block;
            width: 100%;
            background-color: @primary-color;
            color: white;
            margin-bottom: 4px;
            padding-left: 10px;
          }
        }

        &.canvas-data-editor-name {
          display: flex;
          padding-left: 10px;
          white-space: nowrap;
          border-bottom: 1px solid #f5f5f5;
          padding-bottom: 3px;
          margin-bottom: 3px;

          &:hover {
            > span {
              color: #333;
            }

            > input {
              background-color: #f5f5f5;
            }
          }

          > span {
            flex-shrink: 0;
            display: inline-block;
            max-width: 100px;
            overflow-x: hidden;
            text-overflow: ellipsis;
            color: #aaa;
            transition: 0.2s;
          }

          > div {
            width: 100%;

            > input {
              width: 100%;
              border: none !important;
              margin-left: 5px;
              padding-left: 5px;
              border-bottom: 1px solid #f5f5f5;
              height: 30px;
              transition: 0.2s;

              &[type='checkbox'] {
                width: 30px;
              }

              &:focus {
                background-color: #eee;
              }
            }
          }
        }

        .canvas-data-editor-key {
          display: inline-block;
          width: 100%;
          margin-bottom: 4px;
          padding-left: 10px;
        }
      }
    }
  }
}
</style>