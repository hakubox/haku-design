<template>
  <div v-if="props.readonly" class="number-editor-preview editor-preview">
    {{ state.inputValue ?? '——' }}
  </div>
  <InputNumber
    v-else
    class="number-editor"
    v-model:value="state.inputValue"
    v-bind="Object.assign({}, $attrs, { precision: props.precision })"
    :max="props.max"
    :min="props.min"
    :controls="props.controls"
    :style="{ width: props.width }"
    :placeholder="placeholder"
    @change="change"
  >
    <template v-if="props.suffix" #addonAfter>
      <span>{{ props.suffix }}</span>
    </template>
    <!-- <template v-else #addonAfter>
      <slot name="suffix"></slot>
    </template> -->
  </InputNumber>
</template>

<script lang="ts" setup>
import { isNotBlank, throttle, toDecimal } from '@/tools/common';
import { InputNumber } from 'ant-design-vue';
import { onMounted, PropType, reactive, toRefs, watch } from 'vue';

const props = defineProps({
  value: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
  },
  min: {
    type: Number,
  },
  controls: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%'
  },
  suffix: {
    type: String,
    default: ''
  },
  /** 数值精度 */
  precision: {
    type: Number,
  },
  /** 是否开启节流事件 */
  openThrottle: {
    type: Boolean,
    default: true
  },
  /** 格式化函数 */
  formatter: {
    type: Function,
  }
});

const emit = defineEmits<{
  (event: 'update:value', val: number | undefined): void;
  (event: 'change', val: number | undefined): void;
}>();

const state = reactive({
  inputValue: undefined as number | undefined,
});

const _change = () => {
  if (state.inputValue != props.value) {
    const _val = props.formatter ? props.formatter(state.inputValue) : state.inputValue;
    emit('update:value', _val);
    emit('change', _val);
  }
};

/** 改变值 */
const change = props.openThrottle ? throttle(_change) : _change;

const init = (val: number | undefined) => {
  if (val === undefined) {
    state.inputValue = val;
  } else if (typeof val === 'string') {
    if (props.precision === 0) {
      state.inputValue = parseInt(val);
    } else {
      state.inputValue = parseFloat(val);
    }
  } else {
    if (props.precision !== undefined) {
      state.inputValue = toDecimal(val, props.precision);
    } else {
      state.inputValue = val;
    }
  }
}

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    init(val);
  }
});

onMounted(() => {
  init(props.value);
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.number-editor {
  width: 100%;

  &.ant-input-number {
    background-color: #f7f9fc;
    border: 1px solid #f7f9fc;
  
    &:hover {
      &:not(.disabled) {
        border-color: fadeout(@primary-color, 20%) !important;
        border-width: 1px !important;
      }
    }

    &:focus-within {
      box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
    }
  }

  :deep(.ant-input-number) {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    background-color: #f7f9fc;
    border: 1px solid #f7f9fc;
    border-radius: 3px;
    height: 30px;
    width: calc(100%);
    transition: 0.3s;

    .ant-input-number-input-wrap {
      width: 100%;

      > .ant-input-number-input {
        width: 100%;
      }
    }
  
    &:hover {
      &:not(.disabled) {
        border-color: fadeout(@primary-color, 20%) !important;
        border-width: 1px !important;
      }
    }

    &:focus-within {
      box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
    }
  }
}
</style>
