<template>
  <q-basic class="component-datetime-picker" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div v-if="isPrint" class="component-datetime-picker-printmode">{{ value }}</div>
    <template v-else-if="globalState.isMobile">
      <div class="component-datetime-picker-input" :disabled="props.disabled" @click="showDialogPicker()">
        <span v-if="state.inputValue">
          {{ isRange ? 
            `${dateFormat(state.inputValue[0] as string, props.format)}${props.rangeSeparator}${dateFormat(state.inputValue[1] as string, props.format)}` : 
            dateFormat(state.inputValue as string, props.format) 
          }}
        </span>
        <span class="placeholder" v-else>{{ props.placeholder }}</span>
      </div>
      <Popup v-model:show="state.showPicker" round position="bottom" teleport=".form-canvas.preview">
        <DatetimePicker
          :value="state.inputValue"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="state.showPicker = false"
          @confirm="onConfirm"
        />
      </Popup>
    </template>
    <VueDatepickerLocal
      v-else
      v-model:value="state.inputValue"
      :placeholder="props.placeholder"
      :format="props.format"
      :range-separator="props.rangeSeparator"
      :show-buttons="props.showButtons"
      :disabled-date="props.disabledDate"
      :is-range="props.isRange"
    ></VueDatepickerLocal>
  </q-basic>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { inject, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { state as globalState } from '@/common/global';
import { dateFormat, getQBasicProps } from '@/tools/common';
import VueDatepickerLocal from '../common/data-picker/VueDatepickerLocal.vue';
import { DatetimePicker, Popup } from 'vant';

const props = defineProps({
  value: {
    type: [Number, Array] as PropType<number | number[] | undefined>,
  },
  /** 最小日期 */
  minDate: {
    type: Date,
  },
  /** 最大日期 */
  maxDate: {
    type: Date,
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledDate: {
    type: Function,
    default: () => false
  },
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
  /** 日期格式化 */
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm'
  },
  /** 是否选择范围 */
  isRange: {
    type: Boolean,
    default: false,
  },
  /** 范围分隔符 */
  rangeSeparator: {
    type: String,
    default: '~'
  },
  /** 显示按钮 */
  showButtons: {
    type: Boolean,
    default: false
  }
});

/** 是否为打印 */
const isPrint = inject<boolean>('isPrint', false);

const emit = defineEmits<{
  (event: 'change', value: any): void;
  (event: 'update:value', value: any): void;
}>();

const min = new Date(2022, 6, 1, 0, 0, 0)
const max = new Date(2022, 11, 30, 0, 0, 0)

const state = reactive({
  /** 是否显示弹出框 */
  showPicker: false,
  /** 值 */
  inputValue: '' as string | Date | (string | Date)[],
});

const onConfirmByPC = (val) => {
  const _val = val ? new Date(`${val} 00:00:00`).getTime() : undefined;
  emit('update:value', _val);
  emit('change', _val);
};

const onConfirm = (val) => {
  state.inputValue = new Date(val * 1);
  const _val = new Date(val).getTime();
  state.showPicker = false;
  emit('update:value', _val);
  emit('change', _val);
};

const showDialogPicker = () => {
  if (!props.disabled) {
    state.showPicker = true;
  }
};

/** 禁用日期 */
const disabledDate = (time) => {
  const day = time.getDay();
  return day === 0 || day === 6;
}

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    if (props.isRange && Array.isArray(val)) {
      state.inputValue = val ? [Date(), Date()] : [];
    } else if (typeof val === 'number') {
      state.inputValue = val ? new Date(val * 1) : '';
    }
  }
});

watch(() => props.isRange, (val) => {
  if (val === true) {
    state.inputValue = [Date(), Date()];
    emit('update:value', [Date(), Date()]);
    emit('change', [Date(), Date()]);
  } else {
    state.inputValue = Date();
    emit('update:value', Date());
    emit('change', Date());
  }
});

onMounted(() => {
  if (!props.isRange && typeof props.value === 'number') {
    state.inputValue = props.value ? new Date(props.value * 1) : '';
  } else if (props.isRange && Array.isArray(props.value)) {
    state.inputValue = props.value ? [new Date(props.value[0]), new Date(props.value[1])] : [new Date(), new Date()];
  }
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';
@import '/src/assets/less/print-variable.less';

.component-datetime-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 200px;

  // 打印模式
  > .component-datetime-picker-printmode {
    display: block;
    width: 300px;
    height: 39px;
    border-bottom: @print-border;
    transform: scaleY(0.5);
  }

  .mobile-style({
    width: 100%;
  });

  .component-datetime-picker-input {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 34px;
    line-height: 32px;
    width: 100%;
    box-sizing: border-box;
    padding: 0px;
    background-color: white;
    border: 1px solid @q-border-color;
    background-color: @q-bg-color;
    border-radius: 6px;
    font-size: 13px;

    > span {
      flex-grow: 1;
      display: block;
      padding-left: 10px;
    }

    > .placeholder {
      color: #969799;
    }

    &:after {
      content: '\e6f2';
      flex-shrink: 0;
      flex-grow: 0;
      display: block;
      width: 30px;
      text-align: center;
      font: normal normal normal 20px/1 'vant-icon';
    }
  }
}

.van-radio-group {
}
</style>
