<template>
  <Modal
    :visible="props.visible"
    :width="1200"
    :footer="null"
    :mask-closable="false"
    :closable="false"
    @cancel="cancel"
  >
    <div v-if="state.event" class="event-editor">

      <div class="event-editor-header">
        <div class="event-editor-header-left">
          <div class="event-editor-header-icon" :class="isGlobal ? 'global-event' : 'component-event'">
            <i class="iconfont icon-rule"></i>
          </div>
          <Input class="event-editor-header-title" v-model:value="state.title" placeholder="逻辑标题" />
        </div>
        <div class="event-editor-header-btns">
          <Button type="primary" @click="saveEvent">
            <template #icon>
              <SaveOutlined :style="{ fontSize: '16px', lineHeight: '18px', verticalAlign: 'middle' }" />
            </template>
            保存逻辑
          </Button>
          <Button type="primary" ghost @click="cancel">
            取消
          </Button>
        </div>
      </div>
      <div class="event-editor-state">
        <div
          class="event-editor-state-content"
          :class="{
            invalid: state.event.actions.length && state.event.triggers.length && !eventService.isCompleteEvent(state.event),
            complete: eventService.isCompleteEvent(state.event),
            'trigger-fail': state.event.triggers.length > 1 && state.event.triggers.filter((i) => !i.hasState).length > 1,
          }"
        >
        </div>
      </div>
      <div class="event-editor-content">
        <div class="event-editor-trigger">
          <div>当满足以下条件时</div>
          <div class="event-editor-trigger-content">
            <div class="event-editor-trigger-item" v-for="(item, triggerIndex) in state.event.triggers" :key="item.id">
              <div class="event-editor-trigger-item-prefix" v-if="triggerIndex === 0">当</div>
              <Select class="event-editor-trigger-item-prefix" v-model:value="item.logicGate" v-else>
                <SelectOption value="and">且</SelectOption>
                <SelectOption value="or">或</SelectOption>
              </Select>
              <EventFormatEditor :config="item" :prop="item.config"></EventFormatEditor>
              <Tooltip class="event-editor-trigger-item-remove">
                <template #title>删除当前条件</template>
                <Button danger ghost @click="removeTrigger(state.event, triggerIndex)">
                  <template #icon><DeleteOutlined :style="{ fontSize: '16px', lineHeight: '18px', verticalAlign: 'middle' }" /></template>
                  删除
                </Button>
              </Tooltip>
            </div>
            <Dropdown :trigger="['click']">
              <Button class="btn-add" type="link" size="small" @click.prevent>
                <template #icon><PlusCircleOutlined /></template>
                添加新条件
              </Button>
              <template #overlay>
                <Menu :forceSubMenuRender="true">
                  <SubMenu v-for="group in triggerGroups" :key="group.value" :title="group.label">
                    <MenuItem
                      v-for="trigger in getEventTriggers.filter((i) => i.group == group.value && i.isGlobal === props.isGlobal)"
                      :key="trigger.name"
                      @click="addTrigger(state.event, trigger)"
                    >
                      {{ trigger.title }}
                    </MenuItem>
                  </SubMenu>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>

        <div class="event-editor-action">
          <div>则执行以下行为</div>
          <div class="event-editor-action-content">
            <div class="event-editor-action-item" v-for="(item, actionIndex) in state.event.actions" :key="item.id">
              <div class="event-editor-action-item-prefix" v-if="actionIndex === 0">则</div>
              <div class="event-editor-action-item-prefix" v-else>以及</div>
              <EventFormatEditor :config="item" :prop="item.config"></EventFormatEditor>
              <Tooltip class="event-editor-action-item-remove">
                <template #title>删除当前行为</template>
                <Button danger ghost @click="removeAction(state.event, actionIndex)">
                  <template #icon><DeleteOutlined :style="{ fontSize: '16px', lineHeight: '18px', verticalAlign: 'middle' }" /></template>
                  删除
                </Button>
              </Tooltip>
            </div>
            <Dropdown :trigger="['click']">
              <Button class="btn-add" type="link" size="small" @click.prevent>
                <template #icon><PlusCircleOutlined /></template>
                添加新行为
              </Button>
              <template #overlay>
                <Menu :forceSubMenuRender="true">
                  <SubMenu
                    v-for="group in eventActionGroups.filter(group => getEventActions.some((i) => i.group == group.value))"
                    :key="group.value"
                    :title="group.label"
                  >
                    <MenuItem
                      v-for="action in getEventActions.filter((i) => i.group == group.value)"
                      :key="action.name"
                      @click="addAction(state.event, action)"
                    >
                      {{ action.title }}
                    </MenuItem>
                  </SubMenu>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>

        <div class="event-editor-action" v-if="!props.isGlobal">
          <div>否则执行以下行为</div>
          <div class="event-editor-action-content">
            <div class="event-editor-action-item" v-for="(item, actionIndex) in state.event.elseActions" :key="item.id">
              <div class="event-editor-action-item-prefix" v-if="actionIndex === 0">否则</div>
              <div class="event-editor-action-item-prefix" v-else>以及</div>
              <EventFormatEditor :config="item" :prop="item.config"></EventFormatEditor>
              <Tooltip class="event-editor-action-item-remove">
                <template #title>删除当前行为</template>
                <Button danger ghost @click="removeElseAction(state.event, actionIndex)">
                  <template #icon
                    ><DeleteOutlined :style="{ fontSize: '16px', lineHeight: '18px', verticalAlign: 'middle' }"
                  /></template>
                  删除
                </Button>
              </Tooltip>
            </div>
            <Dropdown :trigger="['click']">
              <Button class="btn-add" type="link" size="small" @click.prevent>
                <template #icon><PlusCircleOutlined /></template>
                添加新反向行为
              </Button>
              <template #overlay>
                <Menu :forceSubMenuRender="true">
                  <SubMenu
                    v-for="group in eventActionGroups.filter(group => getEventActions.some((i) => i.group == group.value))"
                    :key="group.value"
                    :title="group.label"
                  >
                    <MenuItem
                      v-for="action in getEventActions.filter((i) => i.group == group.value)"
                      :key="action.name"
                      @click="addElseAction(state.event, action)"
                    >
                      {{ action.title }}
                    </MenuItem>
                  </SubMenu>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { computed, nextTick, PropType, reactive, toRaw, watch } from 'vue';
import { state as eventState, service as eventService } from '../';
import { AppEvent, AppEventAction, AppEventTrigger } from '../@types';
import { eventTriggerGroups, getEventTriggers } from '../data/event-trigger';
import { createModelId } from '@/tools/common';
import { getEventActions, eventActionGroups } from '../data/event-action';
import EventFormatEditor from './EventFormatEditor.vue';
import { Button, Dropdown, Input, Menu, MenuItem, message, Modal, Select, SelectOption, SubMenu, Tooltip } from 'ant-design-vue';
import { DeleteOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { cloneLoop } from '@/lib/clone';

const props = defineProps({
  /** 是否显示 */
  visible: {
    type: Boolean,
    default: false,
  },
  /** 是否为公共事件 */
  isGlobal: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
  (event: 'update:event', val: Record<string, any>): void;
}>();

const state = reactive({
  /** 标题 */
  title: '',
  /** 事件实例 */
  event: {} as AppEvent,
});

const triggerGroups = computed(() => {
  return eventTriggerGroups.filter(group => {
    return getEventTriggers.value.some((i) => i.group == group.value && i.isGlobal === props.isGlobal);
  });
});

const cancel = () => {
  emit('update:visible', false);
};

/** 保存事件 */
const saveEvent = () => {
  const _event = toRaw(state.event);

  if (_event.actions.length && _event.triggers.length && !eventService.isCompleteEvent(_event)) {
    message.warning('当前逻辑未完成，无法保存');
    return;
  } else if (_event.triggers.length > 1 && _event.triggers.filter((i) => !i.hasState).length > 1) {
    message.warning('当前逻辑有误，无法保存');
    return;
  } else if (!(state.title || '').trim()) {
    message.warning('请填写逻辑标题');
    return;
  }

  _event.title = state.title;
  if (_event?.id) {
    const _index = eventState.allEvents.findIndex(i => i.id === _event.id);
    if (_index >= 0) {
      eventState.allEvents.splice(_index, 1);
      nextTick(() => {
        eventState.allEvents.splice(_index, 0, _event);
      });
      // eventState.allEvents[_index] = _event;
    } else {
      eventState.allEvents.push(_event);
    }
  } else {
    eventState.allEvents.push({
      ..._event,
      id: createModelId(10)
    });
  }
  cancel();
}

/** 新增条件 */
const addTrigger = (event: AppEvent, trigger: AppEventTrigger) => {
  event.triggers.push({
    ...trigger,
    attrs: {},
    target: 'global',
    id: createModelId(10),
    logicGate: 'and'
  });
}
/** 新增行为 */
const addAction = (event: AppEvent, action: AppEventAction) => {
  event.actions.push({
    ...action,
    attrs: {},
    target: 'global',
    id: createModelId(10),
  });
}
/** 新增行为 */
const addElseAction = (event: AppEvent, action: AppEventAction) => {
  if (!event.elseActions) event.elseActions = [];
  event.elseActions.push({
    ...action,
    attrs: {},
    target: 'global',
    id: createModelId(10),
  });
}
/** 移除事件触发 */
const removeTrigger = (event: AppEvent, triggerIndex: number) => {
  event.triggers.splice(triggerIndex, 1);
}
/** 移除事件行为 */
const removeAction = (event: AppEvent, actionIndex: number) => {
  event.actions.splice(actionIndex, 1);
}
/** 移除事件行为 */
const removeElseAction = (event: AppEvent, actionIndex: number) => {
  event.elseActions.splice(actionIndex, 1);
}

/** 初始化事件 */
const initEvent = (event: AppEvent) => {
  state.event = cloneLoop(toRaw(event));
}

watch(() => props.visible, (val) => {
  if (val) {
    state.title = state.event.title;
  }
});

defineExpose({
  initEvent
});

</script>

<style lang="less">
.event-editor {

  > .event-editor-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;
    margin-bottom: 15px;

    > .event-editor-header-btns {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      > button {

        + button {
          margin-left: 10px;
        }
      }
    }

    > .event-editor-header-left {
      flex-grow: 1;
      flex-shrink: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
        
      > .event-editor-header-icon {
        flex-grow: 0;
        flex-shrink: 0;
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #595959;
        width: 32px;
        height: 32px;
        margin-right: 15px;
        color: white;
        border-radius: 6px;

        &.global-event {
          background-color: #87d068;
        }

        &.component-event {
          background-color: #f9b643;
        }

        > i {
          font-size: 20px;
        }
      }

      > .event-editor-header-title {
        flex-grow: 1;
        flex-shrink: 1;
        width: 100%;
        margin-right: 15px;
      }
    }
  }

  > .event-editor-state {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    > .event-editor-state-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      padding: 14px 20px;
      border-radius: 6px;
      margin-bottom: 15px;
      border: 1px solid #CCC;
      background-color: #FFFBE6;
      border-color: #FFE58F;
      color: #FAAD14;

      &:before {
        content: '\eb65';
        display: inline-block;
        font-family: 'iconfont';
        color: #FAAD14;
        padding-right: 10px;
        font-size: 22px;
      }

      &:after {
        content: '请至少填写一项条件及行为';
      }

      &.invalid {
        background-color: #FFFBE6;
        border-color: #FFE58F;
        color: #FAAD14;

        &:before {
          content: '\eb65';
          display: inline-block;
          color: #FAAD14;
        }

        &:after {
          content: '逻辑未完成';
        }
      }

      &.complete {
        display: none;
        // background-color: #E6F7FF;
        // border-color: #91D5FF;
        // color: #1890FF;
      }

      &.trigger-fail {
        margin-bottom: 35px;
        background-color: #FFF2F0;
        border-color: #FFCCC7;
        color: #FF4D4F;

        &:before {
          content: '\eb6b';
          display: inline-block;
          color: #FAAD14;
        }

        &:after {
          content: '逻辑错误';
        }

        // &:after {
        //   content: '※ 不可能同时达成触发条件';
        //   position: absolute;
        //   bottom: -30px;
        //   display: block;
        //   color: #ff4d4f;
        // }
      }
    }
  }

  > .event-editor-content {

    > .event-editor-trigger {

      > .event-editor-trigger-content {
        background-color: #EEF4F9;
        padding: 15px;
        margin-top: 8px;
        border-radius: 6px;

        > .event-editor-trigger-item {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          + .event-editor-trigger-item {
            margin-top: 15px;
          }

          > .event-editor-trigger-item-prefix {
            flex-grow: 0;
            flex-shrink: 0;
            display: inline-block;
            text-align: right;
            width: 60px;
            margin-right: 10px;
          }

          + .btn-add {
            margin-top: 20px;
          }
        }

        > .btn-add {
          margin-left: 65px;

          > .anticon {
            font-size: 18px;
            vertical-align: middle;
          }
        }
      }
    }

    > .event-editor-action {
      margin-top: 20px;

      > .event-editor-action-content {
        background-color: #EEF4F9;
        padding: 15px;
        margin-top: 8px;
        margin-bottom: 0px;
        border-radius: 6px;

        > .event-editor-action-item {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          + .event-editor-action-item {
            margin-top: 15px;
          }

          > .event-editor-action-item-prefix {
            flex-grow: 0;
            flex-shrink: 0;
            display: inline-block;
            text-align: right;
            width: 60px;
            margin-right: 10px;
          }

          + .btn-add {
            margin-top: 20px;
          }
        }

        > .btn-add {
          margin-left: 65px;

          > .anticon {
            font-size: 18px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>
