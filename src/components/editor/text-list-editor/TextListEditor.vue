<template>
  <div class="text-list-editor" :class="{ disabled: props.disabled }">
    <div class="text-list-editor-item" v-for="(item, index) in options">
      <span class="text-list-editor-label">{{ item.label ?? item.prop }}</span>
      <input :disabled="props.disabled" v-model="state.vals[index]" @input="change" type="string" />
      <span v-if="item.unit" class="text-list-editor-unit">{{ item.unit }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throttle, toDecimal } from '@/tools/common';
import { computed, onMounted, PropType, reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: Object as PropType<string[]>,
    default: () => [] as string[],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 每行文本框数量 */
  rowCount: {
    type: Number,
    default: 2,
  },
  options: {
    type: Array as PropType<{ label?: string, prop?: string, unit?: string }[]>,
    default: () => []
  }
});

const emit = defineEmits<{
  (event: 'change', val: string[]): void;
}>();

const state = reactive({
  vals: [] as string[],
});

const valueToArray = computed<(string | string)[]>(() => {
  return state.vals;
});

/** 初始化 */
const init = () => {
  state.vals = props.value;
};

/** 改变值 */
const change = throttle(() => {
  if (valueToArray.value.join(',') != props.value.join(',')) {
    const isError = (state.vals as (string | string)[]).some((i, index) => {
      return i === '';
    });
    if (!isError) {
      emit('change', state.vals);
    } else {
      state.vals = props.value;
    }
  }
});

watch(() => props.value, () => {
  init();
}, {
  deep: true
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.text-list-editor {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;

  // &:before {
  //     content: '';
  //     position: absolute;
  //     top: 24px;
  //     left: 32%;
  //     width: 36%;
  //     height: 12px;
  //     border: 1px solid #CCC;
  // }

  &.disabled {

    input {
      color: #AAA;
    }
  }

  > .text-list-editor-item {
    flex-shrink: 1;
    flex-grow: 1;
    width: calc(50% - 5px);
    position: relative;
    height: 24px;
    padding: 0px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    + .text-list-editor-item {
      margin-left: 10px;

      &:nth-child(2n - 1) {
        margin-left: 0px;
      }

      &:nth-child(n + 3) {
        margin-top: 10px;
      }
    }

    > .text-list-editor-label {
      display: inline-block;
      vertical-align: top;
      line-height: 24px;
      margin-right: 8px;
      font-size: 12px;
      white-space: nowrap;
    }

    > .text-list-editor-unit {
      position: absolute;
      top: 0px;
      right: 12px;
      color: #bbb;
      font-size: 12px;
      display: inline-block;
      vertical-align: top;
      line-height: 24px;
      margin-left: 5px;
    }

    > input {
      background-color: #f7f9fc;
      border: 1px solid #f7f9fc;
      border-radius: 4px;
      height: 30px;
      width: calc(100% - 15px);
      vertical-align: top;
      line-height: 18px;
      padding-right: 30px;
      padding-left: 5px;
      color: #666;
      font-size: 12px;
      transition: 0.3s;

      &:hover {
        border-color: fadeout(@primary-color, 20%);
        border-right-width: 1px !important;
      }

      &:focus {
        box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
      }
    }
  }
}
</style>
