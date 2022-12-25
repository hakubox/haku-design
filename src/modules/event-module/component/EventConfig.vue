<template>
  <div style="position: relative;">
    <Empty v-if="!eventList.length" :description="`${isGlobal ? '暂无全局逻辑' : '当前组件暂无逻辑'}`" :style="{ marginTop: '20vh' }">
      <Button v-if="!isGlobal" type="primary" style="margin-top: 10px" @click="addNewEvent">
        <template #icon
          ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
        /></template>
        添加{{ isGlobal ? '' : '组件' }}逻辑
      </Button>
    </Empty>
    <div class="event-list" v-else>
      <div v-if="!isGlobal" style="text-align: left; padding: 10px 15px">
        <Button type="primary" @click="addNewEvent">
          <template #icon
            ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
          /></template>
          添加{{ isGlobal ? '' : '组件' }}逻辑
        </Button>
      </div>
      <!-- 逻辑项 -->
      <EventItem
        class="event-item"
        v-for="event in eventList"
        :key="event.id"
        :event="event"
        @edit="editEvent"
        @remove="removeEvent"
      ></EventItem>
    </div>

    <EventEditor ref="eventEditor" v-model:visible="state.showEditEventDialog" :isGlobal="isGlobal"></EventEditor>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, reactive, ref, toRaw } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as eventState, service as eventService } from '@/modules/event-module';
import { Component } from '@/@types/component';
import { AppEvent, AppEventAction, AppEventTrigger } from '@/modules/event-module/@types';
import { createModelId } from '@/tools/common';
import EventFormatPreview from './EventFormatPreview.vue';
import EventEditor from './EventEditor.vue';
import EventItem from './EventItem.vue';
import { Button, Empty } from 'ant-design-vue';

const props = defineProps({
  /** 关联目标（默认为'global'） */
  target: {
    type: String as PropType<string | 'global' | undefined>,
  }
});

const state = reactive({
  /** 是否显示编辑事件弹出框 */
  showEditEventDialog: false,
});

const eventEditor = ref<typeof EventEditor>();

/** 是否为全局 */
const isGlobal = computed(() => props.target === 'global');

/** 事件列表 */
const eventList = computed(() => {
  if (props.target === undefined) {
    return eventState.allEvents.filter(i => i.triggers.some(o => o.target !== 'global'));
  } else if (props.target === 'global') {
    return eventState.allEvents.filter(i => i.triggers.some(o => o.target === 'global'));
  } else {
    return eventState.allEvents.filter(i => i.triggers.some(o => o.target === props.target));
  }
});

const eventShowListener = (event, eventMap, component?: Component) => {
  if (event?.showCondition && component) {
    return event.showCondition.call(
      this,
      event,
      eventMap,
      component,
      component.attrs[event.name],
      (editorState.componentCanvas as any).$refs,
    );
  } else {
    return true;
  }
};

/** 属性修改触发的事件 */
const eventChangeListener = (e, event, eventMap, component?: Component) => {
  if (event) {
    let a = {} as any;
    // let _value = e.target ? e.target.value : e;
    // component.eventAttrs[event.name] = _value;
    // if (event?.change) {
    //   return event.change.call(this, event, eventMap, component, _value, (this.componentCanvas as any).$refs);
    // }
  }
};
/** 创建新事件 */
const addNewEvent = () => {
  eventEditor.value!.initEvent({
    id: createModelId(10),
    title: `逻辑${eventState.allEvents.length + 1}`,
    triggers: [],
    actions: [],
    elseActions: [],
  });
  state.showEditEventDialog = true;
};
/** 编辑事件 */
const editEvent = (event: AppEvent) => {
  eventEditor.value!.initEvent(event);
  state.showEditEventDialog = true;
};
/** 移除事件 */
const removeEvent = (event: AppEvent) => {
  let _index = eventState.allEvents.findIndex((i) => i.id == event.id);
  eventState.allEvents.splice(_index, 1);
};
/** 移除事件触发 */
const removeTrigger = (event: AppEvent, triggerIndex: number) => {
  event.triggers.splice(triggerIndex, 1);
};
/** 移除事件行为 */
const removeAction = (event: AppEvent, actionIndex: number) => {
  event.actions.splice(actionIndex, 1);
};

defineExpose({
  addNewEvent
});
</script>

<style lang="less">
.event-list {
  will-change: auto;
  content-visibility: auto;

  > .event-item {
    margin: 15px;
    margin-top: 5px;

    + .event-item {
      margin-top: 5px;
    }
  }
}
</style>
