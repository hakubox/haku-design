<template>
  <div class="numbers-editor" :class="{ disabled: props.disabled }">
    <div class="numbers-editor-item" v-for="(item, index) in options">
      <span class="numbers-editor-label">{{ item.label ?? item.prop }}</span>
      <input :disabled="props.disabled" v-model.number="state.vals[index]" @input="change" type="number" />
      <span v-if="item.unit !== ''" class="numbers-editor-unit">{{ item.unit ?? 'px' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throttle, toDecimal } from '@/tools/common';
import { computed, onMounted, PropType, reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: Object as PropType<number[]>,
    default: () => [] as number[],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as PropType<{ label?: string, prop?: string, min?: number, unit?: string }[]>,
    default: () => []
  },
  /** 是否使用input事件，false则使用change事件 */
  useInput: {
    type: Boolean,
    default: true
  },
  /** 格式化函数 */
  formatter: {
    type: Function,
  }
});

const emit = defineEmits<{
  (event: 'change', val: number[]): void;
}>();

const state = reactive({
  vals: [] as number[],
});

const valueToArray = computed<(number | string)[]>(() => {
  return state.vals.map(i => toDecimal(i));
});

/** 初始化 */
const init = () => {
  state.vals = props.value.map(i => toDecimal(i));
};

/** 改变值 */
const change = throttle(() => {
  if (valueToArray.value.join(',') != props.value.join(',')) {
    const isError = (state.vals as (number | string)[]).some((i, index) => {
      return i === '' || 
        isNaN(i as number);
    });
    if (!isError) {
      state.vals = state.vals.map((i, index) => {
        const _min = props.options[index].min;
        if (_min !== undefined && i < _min) return _min;
        else return props.formatter ? props.formatter(toDecimal(i)) : toDecimal(i);
      });
      emit('change', state.vals);
    } else {
      state.vals = props.value;
    }
  }
}, 500, {
  leading: false,
  continued: false
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

.numbers-editor {
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

  > .numbers-editor-item {
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

    + .numbers-editor-item {
      margin-left: 10px;

      &:nth-child(2n - 1) {
        margin-left: 0px;
      }

      &:nth-child(n + 3) {
        margin-top: 10px;
      }
    }

    > .numbers-editor-label {
      display: inline-block;
      vertical-align: top;
      line-height: 24px;
      margin-right: 8px;
      font-size: 12px;
      white-space: nowrap;
    }

    > .numbers-editor-unit {
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

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
          -webkit-appearance: none;
      }

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
