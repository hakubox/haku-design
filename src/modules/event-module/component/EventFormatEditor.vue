<template>
  <div class="event-format-editor">
    <template v-for="(item, index) in arr">
      <div
        :key="index"
        class="event-format-component"
        v-if="item.startsWith('{{') && item.endsWith('}}')"
        :style="{ width: prop[item.substring(2, item.length - 2)].width }"
        :proplabel="prop[item.substring(2, item.length - 2)]?.title"
      >
        <EventEditorItem
          :propName="item.substring(2, item.length - 2)"
          :prop="editorState.propertyEditors[prop[item.substring(2, item.length - 2)].editor]"
          :config="config"
        ></EventEditorItem>
        <!-- :config="{ ...config, attrs: { ...config.attrs, ...prop[item.substr(2, item.length - 4)]?.attrs ?? {} }}" -->
      </div>
      <div :key="index + '_else'" class="event-format-item" v-else-if="item">
        {{ item }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, PropType, reactive } from 'vue';
import { state as editorState } from '@/modules/editor-module';
import type { AppEventActionInstance, AppEventTriggerInstance } from '../@types';
import EventEditorItem from './EventEditorItem.vue';

const props = defineProps({
  /** 属性 */
  prop: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  /** 触发/行为配置 */
  config: {
    type: Object as PropType<AppEventTriggerInstance | AppEventActionInstance>,
    default: () => ({}),
  },
});

const state = reactive({
  /** 当前题目索引 */
  currentIndex: 0,
});

/** 解析格式化数据 */
const arr: ComputedRef<string[]> = computed(() => {
  const reg = /\{\{.*?\}\}/g;
  let match: RegExpExecArray | null = reg.exec(props.config.format);
  let _index = 0;
  const _re: string[] = [];
  const _indexes: number[] = [];
  while (match) {
    if (!_indexes.includes(match.index)) _indexes.push(match.index);
    _indexes.push(match.index + match.toString().length);
    match = reg.exec(props.config.format);
  }
  _indexes.push(props.config.format.length);
  _index = 0;
  for (let i = 0; i < _indexes.length; i++) {
    const val = props.config.format.substring(_index, _indexes[i]);
    _re.push(val);
    _index = _indexes[i];
  }
  return _re;
});
</script>

<style lang="less">
.event-format-editor {
  flex-grow: 1;
  flex-shrink: 1;
  display: inline-flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;

  > .event-format-component {
    position: relative;
    padding-right: 10px;

    &:after {
      content: attr(proplabel);
      position: absolute;
      display: inline-block;
      top: calc(100% - 2px);
      font-size: 12px;
      left: 0px;
      color: #AAA;
      transform: scale(0.8);
    }

    .text-editor {
      background-color: white;
      border: 1px solid #d9d9d9;
    }
    .number-editor {
      background-color: white;
      border: 1px solid #d9d9d9;
    }
    .data-editor {
      background-color: white;
      border: 1px solid #d9d9d9;
      height: 32px;

      > .data-editor-type {
        font-size: 14px;
      }

      > .data-editor-content {

        > input {
          font-size: 14px;
          line-height: 27px;
          height: 26px;
          background-color: white;
        }

        .ant-select-selector {
          border: none;
          padding-left: 2px;

          > .ant-select-selection-placeholder {
            line-height: 22px !important;
          }
        }
      }
    }
  }

  > .event-format-item {
    padding-right: 10px;
  }

  .ant-select-selection-placeholder {
    font-size: 14px;
  }
}
</style>
