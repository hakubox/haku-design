<template>
  <div class="event-item"
    :class="{
      highlight: props.highlight !== undefined,
      invalid: event.actions.length && event.triggers.length && !eventService.isCompleteEvent(event),
      complete: eventService.isCompleteEvent(event),
      'trigger-fail': event.triggers.length > 1 && event.triggers.filter((i) => !i.hasState).length > 1,
    }"
  >
    <div class="event-item-header">
      <div class="event-item-header-icon" :class="eventService.isGlobalEvent(props.event) ? 'global-event' : 'component-event'">
        <i class="iconfont icon-rule"></i>
      </div>
      <span class="event-item-header-title">{{ props.event.title }}</span>
      <label class="event-item-state"></label>
      <div class="event-item-header-tools">
        <Button size="small" type="link" style="font-size: 14px" @click="emit('edit', event)">编辑</Button>
        <Button size="small" type="link" style="font-size: 14px" danger @click="emit('remove', event)">删除</Button>
      </div>
    </div>
    <div class="event-item-trigger">
      <div
        v-for="(item, triggerIndex) in props.event.triggers"
        class="event-item-trigger-item"
        :class="highlightIds?.length && highlightIds.includes(item.id) ? `event-item-highlight-${getHighLightType(item.id)}` : ''"
        :key="item.id">
        <span class="event-item-trigger-item-prefix">{{
          triggerIndex === 0 ? '当' : item.logicGate === 'and' ? '且当' : '或当'
        }}</span>
        <EventFormatPreview :config="item" :prop="item.config"></EventFormatPreview>
      </div>
    </div>
    <div class="event-item-action" v-if="props.event.actions?.length">
      <div
        v-for="(item, actionIndex) in props.event.actions"
        class="event-item-action-item"
        :class="highlightIds?.length && highlightIds.includes(item.id) ? `event-item-highlight-${getHighLightType(item.id)}` : ''"
        :key="item.id"
      >
        <span class="event-item-action-item-prefix">{{ actionIndex === 0 ? '则' : '以及' }}</span>
        <EventFormatPreview :config="item" :prop="item.config"></EventFormatPreview>
      </div>
    </div>
    <div class="event-item-action" v-if="props.event.elseActions?.length">
      <div
        v-for="(item, actionIndex) in props.event.elseActions"
        class="event-item-action-item"
        :class="highlightIds?.length && highlightIds.includes(item.id) ? `event-item-highlight-${getHighLightType(item.id)}` : ''"
        :key="item.id"
      >
        <span class="event-item-action-item-prefix">{{ actionIndex === 0 ? '否则' : '以及' }}</span>
        <EventFormatPreview :config="item" :prop="item.config"></EventFormatPreview>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive } from 'vue';
import { AppEvent } from '@/modules/event-module/@types';
import { state as eventState, service as eventService } from '@/modules/event-module';
import EventFormatPreview from './EventFormatPreview.vue';
import { computed } from '@vue/reactivity';
import { Button } from 'ant-design-vue';

const props = defineProps({
  /** 事件 */
  event: {
    type: Object as PropType<AppEvent>,
    required: true
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
  /** 高亮配置 */
  highlight: {
    type: Array as PropType<{ id: string, type: 'default' | 'ignore' | 'primary' | 'success' | 'error' }[]>,
  },
  /** 是否为全局事件 */
  isGlobal: {
    type: Boolean,
    default: false,
  }
});

/** 高亮Ids */
const highlightIds = computed(() => {
  return props.highlight ? props.highlight.map(i => i.id) ?? [] : [];
});

/** 获取高亮类型 */
const getHighLightType = (id: string) => {
  return props.highlight ? props.highlight.find(i => i.id === id)?.type ?? 'default' : '';
};

const emit = defineEmits<{
  (event: 'edit', val: AppEvent): void;
  (event: 'remove', val: AppEvent): void;
}>();

onMounted(() => {
});
</script>

<style lang="less">

// 高亮效果
.event-item-highlight() {
  &.event-item-highlight {
    
    &-default {
      background-color: white;
      color: #666;
    }
    
    &-primary {
      background-color: #e6f7ff;
      color: #096dd9;

      // .event-format-component {
      //   background-color: #108ee9;
      //   color: white;
      // }
    }

    &-success {
      background-color: #f6ffed;
      color: #389e0d;

      // .event-format-component {
      //   background-color: #87d068;
      //   color: white;
      // }
    }

    &-ignore {
      opacity: 0.4;
    }

    &-error {
      background-color: #fff1f0;
      color: #cf1322;
    }
  }
}

/** 事件项 */
.event-item {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #e9e9ec;
  border-left: 3px solid #909399;
  border-radius: 6px;
  padding: 10px;

  &.invalid {
    border-left-color: #e6a23c;

    > .event-item-header {
      > .event-item-state {
        display: inline-block;
        background-color: #e6a23c;

        &:before {
          content: '\eb65';
          display: inline-block;
        }

        &:after {
          content: '未完成';
        }
      }
    }
  }

  &.complete {
    border-left-color: #409eff;

    > .event-item-header {
      > .event-item-state {
        display: none;
      }
    }
  }

  &.trigger-fail {
    margin-bottom: 35px;
    border-left-color: #f56c6c;
    background-color: #ffeded;

    > .event-item-header {
      > .event-item-state {
        display: inline-block;
        background-color: #f56c6c;

        &:before {
          content: '\eb6b';
          display: inline-block;
        }

        &:after {
          content: '错误';
        }
      }
    }

    &:after {
      content: '※ 不可能同时达成触发条件';
      position: absolute;
      bottom: -30px;
      display: block;
      color: #ff4d4f;
    }
  }

  &.highlight {

    > .event-item-trigger {

      > .event-item-trigger-item {
        padding: 4px 0px;
        .event-item-highlight();

        + .event-item-trigger-item {
          margin-top: 0px;
        }
      }
    }

    > .event-item-action {
      margin-top: 0px;

      > .event-item-action-item {
        padding: 4px 0px;
        .event-item-highlight();
      }
    }
  }

  /** 事件标题 */
  > .event-item-header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;

    > .event-item-header-icon {
      flex-grow: 0;
      flex-shrink: 0;
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background-color: #595959;
      width: 28px;
      height: 28px;
      margin-right: 10px;
      color: white;
      border-radius: 6px;

      &.global-event {
        background-color: #87d068;
      }

      &.component-event {
        background-color: #f9b643;
      }

      > i {
        font-size: 16px;
      }
    }

    > .event-item-state {
      display: inline-block;
      background-color: #909399;
      padding: 2px 6px;
      font-size: 12px;
      height: 20px;
      line-height: 18px;
      border-radius: 3px;
      margin-left: 6px;

      &:before {
        content: '';
        display: none;
        font-family: 'iconfont';
        color: white;
        padding-right: 4px;
      }

      &:after {
        content: '需添加条件及行为';
        color: white;
      }
    }

    > .event-item-header-title {
      flex-grow: 1;
      flex-shrink: 1;
      line-height: 20px;
      font-size: 14px;
    }

    > .event-item-header-tools {
    }
  }

  /** 事件触发 */
  > .event-item-trigger {
    padding: 10px 3px 4px 2px;

    &:empty {
      padding: 0px 3px 6px 8px;
    }

    > .event-item-trigger-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      color: #4a4a4a;

      &:before {
        content: '';
        position: relative;
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        margin-right: 8px;
        margin-left: 6px;
        background-color: #ccc;
      }

      + .event-item-trigger-item {
        margin-top: 8px;
      }

      > .event-item-trigger-item-prefix {
        flex-grow: 0;
        flex-shrink: 0;
        width: auto;
        margin-right: 8px;
        line-height: 24px;
      }
    }
  }
  /** 事件行为 */
  > .event-item-action {
    padding: 8px 3px 4px 2px;
    border-top: 1px solid #F5F5F5;
    margin-top: 4px;

    + .event-item-action {
      padding-top: 6px;
    }

    &:empty {
      padding: 0px 3px 0px 8px;
    }

    > .event-item-action-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      color: #4a4a4a;
      .event-item-highlight();

      &:before {
        content: '';
        position: relative;
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        margin-right: 8px;
        margin-left: 6px;
        background-color: #ccc;
      }

      + .event-item-action-item {
        margin-top: 8px;
      }

      > .event-item-action-item-prefix {
        flex-grow: 0;
        flex-shrink: 0;
        width: auto;
        margin-right: 8px;
        line-height: 24px;
      }
    }
  }
}
</style>
