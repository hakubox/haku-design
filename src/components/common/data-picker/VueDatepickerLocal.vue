<template>
  <div
    ref="root"
    class="datepicker"
    :class="{ 'datepicker-range': props.isRange, datepicker__clearable: clearable && text && !disabled }"
    style="{ width: props.width }"  
  >
    <input
      readonly
      :value="text"
      :class="[state.show ? 'focus' : '', inputClass]"
      :disabled="disabled"
      :placeholder="props.placeholder"
      :name="name"
      v-if="type !== 'inline'"
      @click="state.show=true"
    />
    <a class="datepicker-close" @click.stop="cls"></a>
    <transition name="datepicker-anim">
      <div
        class="datepicker-popup"
        :class="[popupClass, { 'datepicker-inline': type === 'inline' }]"
        tabindex="-1"
        v-if="state.show || type === 'inline'"
      >
        <template v-if="props.isRange">
          <VueDatepickerLocalCalendar
            v-model:value="state.dates[0]" 
            :dates="state.dates"
            :left="true" 
            :local="props.local" 
            :format="props.format"
            :disabled-date="props.disabledDate"
            @changeRangeItem="changeRangeItem"
            @ok="ok"
          ></VueDatepickerLocalCalendar>
          <VueDatepickerLocalCalendar
            v-model:value="state.dates[1]" 
            :dates="state.dates"
            :right="true" 
            :local="props.local" 
            :format="props.format"
            :disabled-date="props.disabledDate"
            @changeRangeItem="changeRangeItem"
            @ok="ok"
          ></VueDatepickerLocalCalendar>
        </template>
        <VueDatepickerLocalCalendar
          v-else
          v-model:value="state.dates[0]" 
          :local="props.local" 
          :format="props.format"
          :disabled-date="props.disabledDate"
          @ok="ok"
        ></VueDatepickerLocalCalendar>
        <div v-if="showButtons" class="datepicker__buttons">
          <button @click.prevent.stop="cancel" class="datepicker__button-cancel">{{ props.local.cancelTip }}</button>
          <button @click.prevent.stop="submit" class="datepicker__button-select">{{ props.local.submitTip }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, PropType, reactive, ref, watch } from 'vue';
import VueDatepickerLocalCalendar from './VueDatepickerLocalCalendar.vue';

const root = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'update:value', val?: any): void;
  (event: 'clear', val?: any): void;
  (event: 'confirm', val?: any): void;
  (event: 'cancel', val?: any): void;
}>();

const props = defineProps({
  name: [String],
  inputClass: [String],
  popupClass: [String],
  value: {
    type: [Object, Array, String] as PropType<Date | any[] | string>,
    required: true
  },
  isRange: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disabledDate: {
    type: Function,
    default: () => false
  },
  type: {
    type: String as PropType<'normal' | 'inline'>,
    default: 'normal',
  },
  rangeSeparator: {
    type: String,
    default: '~',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  placeholder: [String],
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  local: {
    type: Object,
    default: () => ({
      dow: 1, // Monday is the first day of the week
      hourTip: '选择小时', // tip of select hour
      minuteTip: '选择分钟', // tip of select minute
      secondTip: '选择秒数', // tip of select second
      yearSuffix: '年', // format of head
      monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // months of head
      months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'), // months of panel
      weeks: '一_二_三_四_五_六_日'.split('_'), // weeks
      cancelTip: '取消', // default text for cancel button
      submitTip: '确定', // default text for submit button
    }),
  },
  showButtons: {
    type: Boolean,
    default: false,
  },
  dateRangeSelect: [Function],
  /** 宽度 */
  width: {
    type: String,
    default: '200px'
  }
});

const vi = (val): Date[] => {
  if (Array.isArray(val)) {
    return val.length > 1 ? val.map((item) => new Date(item)) : [new Date(), new Date()];
  } else {
    return [val ? new Date(val) : new Date()];
  }
}

const state = reactive({
  show: false,
  dates: vi(props.value),
});
const text = computed(() => {
  const val = props.value;
  const txt = state.dates.map((date) => tf(date)).join(` ${props.rangeSeparator} `);
  if (Array.isArray(val)) {
    return val.length > 0 ? txt : '';
  } else {
    return val ? txt : '';
  }
});

const get = () => {
  return Array.isArray(props.value) ? state.dates : state.dates[0];
}

const cls = () => {
 emit('clear');
 emit('update:value', props.isRange ? [] : '');
}

const changeRangeItem = (val, index: number | undefined) => {
  if (index !== undefined) {
    emit('update:value', index === 0 ? [val, props.value[1]] : index === 1 ? [props.value[0], val] : props.value);
  } else {
    emit('update:value', props.value);
  }
}

const ok = (leaveOpened) => {
  !leaveOpened && !props.showButtons && setTimeout(() => {
    state.show = props.isRange;
  })
  nextTick(() => emit('update:value', get()));
};

const tf = (time, format?) => {
  const year = time.getFullYear();
  const month = time.getMonth();
  const day = time.getDate();
  const hours24 = time.getHours();
  const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  const dd = (t) => ('0' + t).slice(-2);
  const map = {
    YYYY: year,
    MM: dd(month + 1),
    MMM: props.local.months[month],
    MMMM: props.local.monthsHead[month],
    M: month + 1,
    DD: dd(day),
    D: day,
    HH: dd(hours24),
    H: hours24,
    hh: dd(hours),
    h: hours,
    mm: dd(minutes),
    m: minutes,
    ss: dd(seconds),
    s: seconds,
    S: milliseconds,
  };
  return (format || props.format).replace(/Y+|M+|D+|H+|h+|m+|s+|S+/g, (str) => map[str]);
}
const dc = (e) => {
  state.show = (root?.value && root?.value.contains(e.target) && !props.disabled) ?? false;
}
const submit = () => {
  emit('confirm', get());
  state.show = false;
}
const cancel = () => {
  emit('cancel');
  state.show = false;
}

onMounted(() => {
  state.dates = vi(props.value);
  document.addEventListener('click', dc, true);
})

onUnmounted(() => {
  document.removeEventListener('click', dc, true);
})

// watch(() => props.value, (val) => {
//   state.dates = vi(val);
// });
</script>

<style lang="less">
.datepicker {
  cursor: default;
  display: inline-block;
  position: relative;
  border-radius: 6px;
  
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 34px;
    height: 100%;
    top: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik01NjQgMTgwLjJINDQ4Yy04LjMgMC0xNS02LjctMTUtMTVzNi43LTE1IDE1LTE1aDExNmM4LjIgMCAxNSA2LjcgMTUgMTVzLTYuOCAxNS0xNSAxNXoiIGZpbGw9IiM5ODk4OTgiLz48cGF0aCBkPSJNOTQ1IDk1Mi4ySDgxLjJjLTguMiAwLTE1LTYuNy0xNS0xNVYxNjIuOGMwLTguMyA2LjgtMTUgMTUtMTVIMjk0YzguMiAwIDE1IDYuNyAxNSAxNXMtNi44IDE1LTE1IDE1SDk2LjJ2NzQ0LjRIOTMwVjE3Ny44SDcxMy42Yy04LjMgMC0xNS02LjctMTUtMTVzNi43LTE1IDE1LTE1SDk0NWM4LjIgMCAxNSA2LjcgMTUgMTV2Nzc0LjRjMCA4LjMtNi44IDE1LTE1IDE1eiIgZmlsbD0iIzk4OTg5OCIvPjxwYXRoIGQ9Ik0zMzMuMyA1NTFIMjE2Yy04LjIgMC0xNS02LjgtMTUtMTVzNi44LTE1IDE1LTE1aDExNy4zYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1em0yMzAuMyAwSDQ0Ni4zYy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4zYzguMiAwIDE1IDYuNiAxNSAxNXMtNi44IDE1LTE1IDE1em0yMzAuMiAwSDY3Ni42Yy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4yYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1ek0zMzMuMyA3NDBIMjE2Yy04LjIgMC0xNS02LjgtMTUtMTVzNi44LTE1IDE1LTE1aDExNy4zYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1em0yMzAuMyAwSDQ0Ni4zYy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4zYzguMiAwIDE1IDYuNiAxNSAxNXMtNi44IDE1LTE1IDE1em0yMzAuMiAwSDY3Ni42Yy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4yYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1ek0zNzAuOCAyNTguNmMtOC4zIDAtMTUtNi43LTE1LTE1Vjg2LjhjMC04LjIgNi43LTE1IDE1LTE1czE1IDYuOCAxNSAxNXYxNTYuOGMwIDguMy02LjcgMTUtMTUgMTV6bTI3MC4yIDBjLTguMyAwLTE1LTYuNy0xNS0xNVY4Ni44YzAtOC4yIDYuNy0xNSAxNS0xNXMxNSA2LjggMTUgMTV2MTU2LjhjMCA4LjMtNi43IDE1LTE1IDE1ek05NDUgMzcyLjJIODEuMmMtOC4yIDAtMTUtNi43LTE1LTE1czYuOC0xNSAxNS0xNUg5NDVjOC4yIDAgMTUgNi43IDE1IDE1cy02LjggMTUtMTUgMTV6IiBmaWxsPSIjOTg5ODk4Ii8+PC9zdmc+')
      no-repeat 50% 50%;
  }

  &.datepicker-close {
    display: none;
    position: absolute;
    width: 34px;
    height: 100%;
    top: 0;
    right: 0;
    cursor: pointer;

    &:before {
      display: block;
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      left: 50%;
      top: 50%;
      margin-left: -10px;
      margin-top: -8px;
      text-align: center;
      background: #ccc;
      color: #fff;
      border-radius: 50%;
      background: #ccc
        url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3IDciIHdpZHRoPSI3IiBoZWlnaHQ9IjciPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01LjU4LDVsMi44LTIuODFBLjQxLjQxLDAsMSwwLDcuOCwxLjZMNSw0LjQxLDIuMiwxLjZhLjQxLjQxLDAsMCwwLS41OC41OGgwTDQuNDIsNSwxLjYyLDcuOGEuNDEuNDEsMCwwLDAsLjU4LjU4TDUsNS41OCw3LjgsOC4zOWEuNDEuNDEsMCwwLDAsLjU4LS41OGgwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuNSAtMS40OCkiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4NCg==')
        no-repeat 50% 50%;
    }

    &:hover {
      
      &:before {
        background-color: #afafaf;
      }
    }
  }

  &.datepicker-range {
    min-width: 325px;

    .datepicker-popup {
      display: flex;
      flex-direction: row;
    }
  }

  &.datepicker__clearable {

    &:hover {

      &:before {
        display: none;
      }

      .datepicker-close {
        display: block;
      }
    }
  }

  > input {
    color: #666;
    transition: all 200ms ease;
    border: 1px solid #f3eded;
    background-color: #fbfbfb;
    padding: 5px 10px;
    border-radius: 6px;
    height: 34px;
    box-sizing: border-box;
    outline: none;
    padding: 0 34px 0 12px;
    font-size: 14px;
    width: 100%;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;

    &.focus {
      border-color: #3bb4f2;
      -webkit-box-shadow: 0 0 5px rgba(59, 180, 242, 0.3);
      box-shadow: 0 0 5px rgba(59, 180, 242, 0.3);
    }

    &:disabled {
      cursor: not-allowed;
      background-color: #ebebe4;
      border-color: #e5e5e5;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
}

.datepicker-popup {
  position: absolute;
  transition: all 200ms ease;
  opacity: 1;
  transform: scaleY(1);
  transform-origin: center top;
  font-size: 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  box-shadow: #0000 0px 0px 0px 0px, #0000 0px 0px 0px 0px, rgba(0,0,0,0.05) 0px 1px 2px 0px;
  margin-top: 2px;
  outline: 0;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 999;

  &.datepicker-inline {
    position: relative;
    margin-top: 0;
  }
}

// .datepicker-bottom {
//   float: left;
//   width: 100%;
//   text-align: right;
// }
// .datepicker-btn {
//   padding: 5px 10px;
//   background: #1284e7;
//   color: #fff;
//   border-radius: 2px;
//   display: inline-block;
//   cursor: pointer;
// }
.datepicker-anim-enter-active {
  transform-origin: 0 0;
  animation: datepicker-anim-in 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.datepicker-anim-leave-active {
  transform-origin: 0 0;
  animation: datepicker-anim-out 0.2s cubic-bezier(0.755, 0.05, 0.855, 0.06);
}

.datepicker__buttons {
  display: block;
  text-align: right;

  button {
    display: inline-block;
    font-size: 13px;
    border: none;
    cursor: pointer;
    margin: 10px 0 0 5px;
    padding: 5px 15px;
    color: #ffffff;
  }

  .datepicker__button-select {
    background: #1284e7;
  }

  .datepicker__button-cancel {
    background: #666;
  }
}

@keyframes datepicker-anim-in {
  0% {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes datepicker-anim-out {
  0% {
    opacity: 1;
    transform: scaleY(1);
  }
  to {
    opacity: 0;
    transform: scaleY(0.8);
  }
}
</style>
