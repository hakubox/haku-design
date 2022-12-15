<template>
  <div class="event-format-preview">
    <template v-for="(item, index) in arr">
      <div
        :key="index"
        class="event-format-component"
        v-if="item.startsWith('{{') && item.endsWith('}}')"
      >
        <EventEditorItem
          :propName="item.substring(2, item.length - 2)"
          :prop="editorState.propertyEditors[prop[item.substring(2, item.length - 2)].editor]"
          :config="config"
          :readonly="true"
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
import { computed, ComputedRef, defineComponent, PropType, reactive, toRefs } from 'vue';
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
  let reg = /\{\{.*?\}\}/g;
  let match: RegExpExecArray | null = reg.exec(props.config.format);
  let _index = 0;
  let _re: string[] = [];
  let _indexes: number[] = [];
  while (match) {
    if (!_indexes.includes(match.index)) _indexes.push(match.index);
    _indexes.push(match.index + match.toString().length);
    match = reg.exec(props.config.format);
  }
  _indexes.push(props.config.format.length);
  _index = 0;
  for (let i = 0; i < _indexes.length; i++) {
    let val = props.config.format.substring(_index, _indexes[i]);
    _re.push(val);
    _index = _indexes[i];
  }
  return _re;
});
</script>

<style lang="less">
.event-format-preview {
  flex-grow: 0;
  flex-shrink: 0;
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > .event-format-component {
    padding: 2px 8px;
    background-color: #EEEEEE;
    border-radius: 10px;
    color: #555555;
    margin-right: 8px;
  }

  > .event-format-item {
    padding-right: 6px;
  }

  .ant-select-selection-placeholder {
    font-size: 12px;
  }
}
</style>
