<template>
  <div v-if="props.readonly" class="number-editor-preview editor-preview">
    {{ state.inputValue ?? '——' }}
  </div>
  <div class="slider-editor" :style="{ width: props.width }" v-else>
    <Slider
      v-model:value="state.inputValue"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :tip-formatter="formatter"
      @change="change"
    />
    <InputNumber
      size="small"
      v-model:value="state.inputValue"
      v-bind="Object.assign({}, $attrs)"
      :max="props.max"
      :min="props.min"
      :controls="false"
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
  </div>
</template>

<script lang="ts" setup>
import { isNotBlank, throttle, toDecimal } from '@/tools/common';
import { InputNumber, Slider } from 'ant-design-vue';
import { computed } from 'vue';
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
    required: true
  },
  min: {
    type: Number,
  },
  step: {
    type: Number,
    default: 1,
  },
  width: {
    type: String,
    default: '100%'
  },
  suffix: {
    type: String,
  },
  /** 是否开启节流事件 */
  openThrottle: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (event: 'update:value', val: number | undefined): void;
  (event: 'change', val: number | undefined): void;
  (event: 'input', val: number | undefined): void;
}>();

const getPrecision = computed(() => {
  return String(props.step).length - (String(props.step).indexOf('.') + 1);
});

const state = reactive({
  inputValue: undefined as number | undefined,
});

const _change = () => {
  if (state.inputValue != props.value) {
    if (state.inputValue !== undefined) {
      emit('change', toDecimal(state.inputValue, getPrecision.value));
    }
  }
};

const formatter = (value?: number) => {
  if (value === undefined) return null;
  else if (props.suffix === undefined) return `${value}`;
  return `${value}${props.suffix}`;
};

/** 改变值 */
const change = props.openThrottle ? throttle(_change) : _change;

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.inputValue = val;
  }
});

onMounted(() => {
  state.inputValue = isNotBlank(props.value) ? +props.value! : undefined;
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.slider-editor {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  > .ant-slider {
    flex-shrink: 2;
    flex-grow: 2;
    width: 100%;
    margin-right: 12px;
    margin-left: 0px;
  }

  > .ant-input-number-group-wrapper {
    width: 60%;
  }

  > .ant-input-number {
    flex-shrink: 1;
    flex-grow: 1;
    width: 33%;
    background-color: #f7f9fc;
    border: 1px solid #f7f9fc;
    max-width: 100px;
  
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
