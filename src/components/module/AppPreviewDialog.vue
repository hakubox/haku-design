<template>
  <!-- 预览界面 -->
  <div class="preview-modal"
    :class="{
      show: typeof props.visible === 'boolean' ? props.visible : props.visible.value,
      leave: state.isLeaving
    }"
    @click.self.stop="closePreview"
  >

    <div
      class="preview-modal-body"
      :style="{
        width: editorState.appConfig.deviceType == 'pc' ? '950px' : '400px',
        height: editorState.appConfig.deviceType == 'pc' ? '700px' : '687px',
      }"
    >
      <div class="preview-modal-header">
        <div class="preview-modal-title">预览界面</div>
        <div class="preview-modal-tools">
          <CloseOutlined @click="closePreview" />
        </div>
      </div>
      <div class="preview-modal-content">
        <DesignCanvas
          ref="componentCanvas"
          :isPreview="true"
          @refresh="editorService.refresh"
        />
      </div>

      <!-- 调试器 -->
      <div class="canvas-data-editor" :style="{ height: '667px' }" v-if="editorState.currentPage.pageType === PageType.normalPage">
        <div class="canvas-data-editor-body">
          <a-tabs v-model:activeKey="state.activeKey" type="card">
            <template #rightExtra>
              <a-popconfirm placement="bottomRight" @confirm="eventService.clearLog()">
                <template #title>是否确认清空事件日志列表？</template>
                <a-button v-if="state.activeKey === 'event'" danger size="small" style="margin-right: 10px;">清除日志</a-button>
              </a-popconfirm>
            </template>
            <a-tab-pane key="data" tab="表单数据" force-render>
              <a-empty
                v-if="!formFillState.formFillList.length"
                description="暂无填充数据"
                :style="{ marginTop: '20vh' }"
              ></a-empty>
              <GeneralEditor v-else
                :model="formFillState.formInfo"
                :propertys="formFillProps"
                :groups="[{ title: '基础数据', name: 'data', icon: '' }]"
              ></GeneralEditor>
            </a-tab-pane>
            <a-tab-pane key="event" tab="事件日志" force-render>
              <a-list
                class="event-history"
                item-layout="horizontal"
                :data-source="eventState.eventLogs"
              >
                <template #renderItem="{ item }">
                  <a-list-item style="padding: 8px 0px;">
                    <template #actions>
                      <a
                        key="list-loadmore-edit"
                        style="display: inline-block;margin-top: 8px;"
                        @click="executeEvent(item)"
                      >重新触发</a>
                      <a-popover placement="topRight" trigger="click" arrowPointAtCenter>
                        <template #content>
                          <EventItem style="width: 460px;" :event="item.event" :readonly="true" :highlight="getHighlight(item)"></EventItem>
                        </template>
                        <a key="list-loadmore-more">详情</a>
                      </a-popover>
                    </template>
                    <a-skeleton avatar :title="false" :loading="false" active>
                      <a-list-item-meta :description="dateFormat(item.createTime, 'MM-dd HH:mm:ss')">
                        <template #title>
                          <a-tag v-if="item.isElseAction" color="purple">反向</a-tag>
                          {{ item.title }}
                        </template>
                        <template #avatar>
                          <a-avatar :style="{
                            backgroundColor: '#f9b643',
                            marginTop: '8px',
                            marginRight: '-4px',
                            borderRadius: '6px'
                          }" shape="square">
                            <template #icon><i class="iconfont icon-rule"></i></template>
                          </a-avatar>
                        </template>
                      </a-list-item-meta>
                    </a-skeleton>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, watch, computed, PropType, Ref, nextTick } from "vue";
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { state as eventState, service as eventService } from '@/modules/event-module';
import { ComponentPropertyEditor, PageType } from '@/@types/enum';
import CloseOutlined from "@ant-design/icons-vue/CloseOutlined";
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';
import DesignCanvas from "./DesignCanvas.vue";
import { cloneLoop } from "@/lib/clone";
import { AppPage } from "@/@types/app-page";
import { FormInfoItem } from "@/modules/form-fill-module/@types";
import { GeneralProperty } from "@/@types";
import { AppEventLog } from "@/modules/event-module/@types";
import EventItem from "@/modules/event-module/component/EventItem.vue";
import { message } from "ant-design-vue";
import { dateFormat } from "@/tools/common";

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
  activeKey: 'data',
  /** 预览框关闭中 */
  isLeaving: false,
});

/** 临时formFill数据模块 */
let tempFormFillState = cloneLoop(formFillState.formInfo) as Record<string, FormInfoItem>;

/** 临时appPages数据 */
let tempAppPagesState = cloneLoop(editorState.pages) as AppPage[];

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
    tempFormFillState = cloneLoop(formFillState.formInfo) as Record<string, FormInfoItem>;
    tempAppPagesState = cloneLoop(editorState.pages) as AppPage[];
    openPreview();
  }
});

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
  width: 100vw;
  height: 100vh;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  opacity: 0;
  transition: 0.25s;

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
    background-color: white;
    border-radius: 6px;
    margin-right: 200px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    max-height: 100vh;
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
      height: 100%;
      overflow: hidden;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      transform: translateY(0px);

      > .form-canvas {
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