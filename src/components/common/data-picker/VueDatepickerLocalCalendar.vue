<template>
  <div :class="`${state.pre} ${props.isRange ? (state.pre + '-range') : ''}`">
    <div :class="`${state.pre}-head`">
      <a :class="`${state.pre}-prev-decade-btn`" v-show="state.showYears" @click="state.year -= 10">
        <i class="iconfont icon-arrow-left-double"></i>
      </a>
      <a :class="`${state.pre}-prev-year-btn`" v-show="!state.showYears" @click="state.year--">
        <i class="iconfont icon-arrow-left-double"></i>
      </a>
      <a :class="`${state.pre}-prev-month-btn`" v-show="!state.showYears && !state.showMonths" @click="pm">
        <i class="iconfont icon-arrow-left"></i>
      </a>
      <a :class="`${state.pre}-year-select`" v-show="state.showYears">{{ ys + '-' + ye }}</a>
      <template v-if="props.local?.yearSuffix">
        <a :class="`${state.pre}-year-select`" @click="state.showYears = !state.showYears" v-show="!state.showYears">
          {{ state.year }}{{ props.local?.yearSuffix }}
        </a>
        <a
          :class="`${state.pre}-month-select`"
          @click="state.showMonths = !state.showMonths"
          v-show="!state.showYears && !state.showMonths"
        >{{ props.local?.monthsHead[state.month] }}</a>
      </template>
      <template v-else>
        <a
          :class="`${state.pre}-month-select`"
          @click="state.showMonths = !state.showMonths"
          v-show="!state.showYears && !state.showMonths"
        >{{ props.local?.monthsHead[state.month] }}</a>
        <a :class="`${state.pre}-year-select`" @click="state.showYears = !state.showYears" v-show="!state.showYears">
          {{state.year}}
        </a>
      </template>
      <a :class="`${state.pre}-next-month-btn`" v-show="!state.showYears && !state.showMonths" @click="nm">
        <i class="iconfont icon-arrow-right"></i>
      </a>
      <a :class="`${state.pre}-next-year-btn`" v-show="!state.showYears" @click="state.year++">
        <i class="iconfont icon-arrow-right-double"></i>
      </a>
      <a :class="`${state.pre}-next-decade-btn`" v-show="state.showYears" @click="state.year += 10">
        <i class="iconfont icon-arrow-right-double"></i>
      </a>
    </div>
    <div :class="`${state.pre}-body`">
      <div :class="`${state.pre}-days`">
        <a :class="`${state.pre}-week`" v-for="i in props.local?.weeks" :key="i">{{ i }}</a>
        <a
          v-for="(j, i) in days"
          @click="is($event) && ((state.day = j?.i), ok(j))"
          :class="[
            j.p || j.n ? `${state.pre}-date-out` : '',
            status(j.y, j.m, j.i, state.hour, state.minute, state.second, 'YYYYMMDD'),
          ]"
          :key="i"
        >{{ j.i }}</a>
      </div>
      <div :class="`${state.pre}-months`" v-show="state.showMonths">
        <a
          v-for="(i, j) in props.local?.months"
          @click="is($event) && ((state.showMonths = state.m === 'M'), (state.month = j), state.m === 'M' && ok('m'))"
          :class="[status(state.year, j, state.day, state.hour, state.minute, state.second, 'YYYYMM')]"
          :key="j"
        >{{ i }}</a>
      </div>
      <div :class="`${state.pre}-years`" v-show="state.showYears">
        <a
          v-for="(i, j) in years"
          @click="is($event) && ((state.showYears = state.m === 'Y'), (state.year = i), state.m === 'Y' && ok('y'))"
          :class="[
            j === 0 || j === 11 ? `${state.pre}-date-out` : '',
            status(i, state.month, state.day, state.hour, state.minute, state.second, 'YYYY'),
          ]"
          :key="j"
        >{{ i }}</a>
      </div>
      <div :class="`${state.pre}-hours`" v-show="state.showHours">
        <div :class="`${state.pre}-title`">{{ props.local?.hourTip }}</div>
        <a
          v-for="(j, i) in 24"
          @click="is($event) && ((state.showHours = false), (state.hour = i), ok('h'))"
          :class="[status(state.year, state.month, state.day, i, state.minute, state.second, 'YYYYMMDDHH')]"
          :key="i"
        >{{ i }}</a>
      </div>
      <div :class="`${state.pre}-minutes`" v-show="state.showMinutes">
        <div :class="`${state.pre}-title`">{{ props.local?.minuteTip }}</div>
        <a
          v-for="(j, i) in 12"
          @click="is($event) && ((state.showMinutes = false), (state.minute = i * 5), ok('h'))"
          :class="[status(state.year, state.month, state.day, state.hour, i * 5, state.second, 'YYYYMMDDHHmm')]"
          :key="(i * 5)"
        >{{ i * 5 }}</a>
      </div>
      <div :class="`${state.pre}-seconds`" v-show="state.showSeconds">
        <div :class="`${state.pre}-title`">{{ props.local?.secondTip }}</div>
        <a
          v-for="(j, i) in 12"
          @click="is($event) && ((state.showSeconds = false), (state.second = i * 5), ok('h'))"
          :class="[status(state.year, state.month, state.day, state.hour, state.minute, i * 5, 'YYYYMMDDHHmmss')]"
          :key="(i * 5)"
        >{{ i * 5 }}</a>
      </div>
    </div>
    <div :class="`${state.pre}-foot`" v-if="state.m === 'H'">
      <div :class="`${state.pre}-hour`">
        <a
          :title="props.local?.hourTip"
          @click="(state.showHours = !state.showHours), (state.showMinutes = state.showSeconds = false)"
          :class="{ on: state.showHours }"
        >
          {{ formatDate(state.hour) }}
        </a>
        <span>:</span>
        <a
          :title="props.local?.minuteTip"
          @click="(state.showMinutes = !state.showMinutes), (state.showHours = state.showSeconds = false)"
          :class="{ on: state.showMinutes }"
        >
          {{ formatDate(state.minute) }}
        </a>
        <span v-if="has('s')">:</span>
        <a v-if="has('s')"
          :title="props.local?.secondTip"
          @click="(state.showSeconds = !state.showSeconds), (state.showHours = state.showMinutes = false)"
          :class="{ on: state.showSeconds }"
        >
          {{ formatDate(state.second) }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, PropType, reactive, watch } from 'vue';

const emit = defineEmits<{
  (event: 'update:value', val: any): void;
  (event: 'changeRangeItem', val: any, index?: number): void;
  (event: 'ok', val: boolean): void;
}>();

const props = defineProps({
  value: {
    type: Object as PropType<Date>,
    required: true,
  },
  dates: {
    type: Object as PropType<Date[]>,
  },
  left: {
    type: Boolean,
    default: false,
  },
  right: {
    type: Boolean,
    default: false,
  },
  local: {
    type: Object,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  disabledDate: {
    type: Function,
    default: () => false
  },
  isRange: {
    type: Boolean,
    default: false,
  },
});

const get = (time: Date | undefined) => {
  if (!time) time = new Date();
  return {
    year: time.getFullYear(),
    month: time.getMonth(),
    day: time.getDate(),
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds(),
  };
};
const time = get(props.value);
const state = reactive({
  pre: 'calendar',
  m: 'D',
  showYears: false,
  showMonths: false,
  showHours: false,
  showMinutes: false,
  showSeconds: false,
  year: time.year,
  month: time.month,
  day: time.day,
  hour: time.hour,
  minute: time.minute,
  second: time.second,
});

const start = computed(() => parse(props.dates?.[0]));
const end = computed(() => parse(props.dates?.[1]));

const ys = computed(() => parseInt((state.year / 10).toString()) * 10);
const ye = computed(() => ys.value + 10);
const years = computed(() => {
  const arr = [] as any[];
  let start = ys.value - 1;
  while (arr.length < 12) {
    start++;
    arr.push(start);
  }
  return arr;
});
const days = computed(() => {
  const days = [] as {
    i: number;
    y: number;
    m: number;
    n?: boolean;
    p?: boolean;
  }[];
  const year = state.year;
  const month = state.month;
  const time = new Date(year, month, 1);
  const dow = props.local?.dow || 7;
  time.setDate(0); // switch to the last day of last month
  let lastDay = time.getDate();
  const week = time.getDay() || 7;
  let count = dow <= week ? week - dow + 1 : week + (7 - dow + 1);
  while (count > 0) {
    days.push({
      i: lastDay - count + 1,
      y: month > 0 ? year : year - 1,
      m: month > 0 ? month - 1 : 11,
      p: true,
    });
    count--;
  }
  time.setMonth(time.getMonth() + 2, 0); // switch to the last day of the current month
  lastDay = time.getDate();
  let i = 1;
  for (i = 1; i <= lastDay; i++) {
    days.push({
      i: i,
      y: year,
      m: month,
    });
  }
  for (i = 1; days.length < 42; i++) {
    days.push({
      i: i,
      y: month < 11 ? year : year + 1,
      m: month < 11 ? month + 1 : 0,
      n: true,
    });
  }
  return days;
});
const parse = (num) => {
  // console.log('parse', parseInt((Number(num) / 1000).toString()));
  return parseInt((Number(num) / 1000).toString());
};
const formatDate = (val) => {
  return ('0' + val).slice(-2);
};

const tf = (time, format?) => {
  if (!time) time = new Date();
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
    MMM: props.local?.months[month],
    MMMM: props.local?.monthsHead[month],
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
};

const status = (year, month, day, hour, minute, second, format: string) => {
  const maxDay = new Date(year, month + 1, 0).getDate();
  const time = new Date(year, month, day > maxDay ? maxDay : day, hour, minute, second);
  const t = parse(time);
  const f = tf;
  const classObj = {};
  let flag = false;
  if (format === 'YYYY') {
    flag = year === state.year;
  } else if (format === 'YYYYMM') {
    flag = month === state.month;
  } else {
    flag = f(props.value, format) === f(time, format);
  }
  classObj[`${state.pre}-date`] = true;
  classObj[`${state.pre}-date-disabled`] = props.right && t < Number(start.value) || props.disabledDate(time, format);
  classObj[`${state.pre}-date-on`] = (props.left && t > Number(start.value) && t < Number(end.value)) || (props.right && t > Number(start.value) && t < Number(end.value));
  classObj[`${state.pre}-date-selected`] = flag;
  classObj[`${state.pre}-date-selected-left`] = props.left && flag;
  classObj[`${state.pre}-date-selected-right`] = props.right && flag;
  return classObj;
};
const nm = () => {
  if (state.month < 11) {
    state.month++;
  } else {
    state.month = 0;
    state.year++;
  }
};
const pm = () => {
  if (state.month > 0) {
    state.month--;
  } else {
    state.month = 11;
    state.year--;
  }
};
const is = (e) => {
  return e.target.className.indexOf(`${state.pre}-date-disabled`) === -1;
};
const ok = (info) => {
  let year;
  let month;
  let day;
  info && info.n && nm();
  info && info.p && pm();
  if (info === 'h') {
    const time = get(props.value);
    year = time.year;
    month = time.month;
  } else if (info === 'm' || info === 'y') {
    day = 1;
  }
  const _time = new Date(
    year || state.year,
    month || state.month,
    day || state.day,
    state.hour,
    state.minute,
    state.second,
  );
  if (props.left && parseInt(_time.getTime() / 1000 + '') > Number(end.value)) {
    emit('changeRangeItem', _time, 1);
  }
  emit('update:value', _time);
  nextTick(() => emit('ok', info === 'h'));
};
const has = (c) => {
  return props.format.indexOf(c) !== -1;
}
onMounted(() => {
  const is = (c) => props.format.indexOf(c) !== -1;
  if (is('s') || is('m') || (is('h') || is('H'))) {
    state.m = 'H';
  } else if (is('D')) {
    state.m = 'D';
  } else if (is('M')) {
    state.m = 'M';
    state.showMonths = true;
  } else if (is('Y')) {
    state.m = 'Y';
    state.showYears = true;
  }
});

watch(() => props.value, (val) => {
  const time = get(val);
  state.year = time.year;
  state.month = time.month;
  state.day = time.day;
  state.hour = time.hour;
  state.minute = time.minute;
  state.second = time.second;
});
</script>

<style lang="less">

@color-datepicker-default-light: #f3f4f6;
@color-datepicker-primary-light: rgb(234, 248, 254);

.calendar {
  float: left;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;

  + .calendar {
    border-left: solid 1px #eaeaea;
    margin-left: 5px;
    padding-left: 5px;
  }
}

.datepicker {
  
  
  &.datepicker-range {

    .calendar-days {

      > .calendar-date {

        &.calendar-date-on {
          box-shadow: -6px 0px 0px 0px @color-datepicker-primary-light;
          border-radius: 0px;

          &:nth-child(7n + 1) {
            box-shadow: none;
          } 
        }
      }
    }
  }
}

.calendar-head {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  border: 1px solid #0000001a;
  border-radius: 6px;
  padding: 6px 8px;

  a {
    color: #666;
    cursor: pointer;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    height: 30px;
    min-width: 30px;

    &:hover {
      color: #1284e7;
    }
  }

  > .calendar-year-select,
  > .calendar-month-select {
    font-size: 14px;
    padding: 0 2px;
    position: relative;
    min-width: 80px;
  }
}

.calendar-prev-decade-btn,
.calendar-prev-year-btn {
  left: 6px;
}

.calendar-prev-month-btn {
  left: 24px;
}

.calendar-next-decade-btn,
.calendar-next-year-btn {
  right: 6px;
}

.calendar-next-month-btn {
  right: 24px;
}

.calendar-body {
  position: relative;
  width: 316px;
  height: 300px;
  font-size: 14px;
  font-weight: 500;
  padding: 0px 8px;
}

.calendar-days {
  width: 100%;
  height: 100%;

  > .calendar-week {
    font-weight: normal;
    width: 14.2%;
    height: 12.28%;
    line-height: 32px;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    margin-bottom: 8px;
  }

  > .calendar-date {
    font-weight: normal;
    width: 12.5%;
    height: 12.5%;
    line-height: 38px;
    margin-left: 2%;
    margin-bottom: 2%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    border-radius: 6px;

    &:nth-child(7n + 1) {
      margin-left: 0px;
    }

    &:hover {
      color: #4b5563;
      background: @color-datepicker-default-light;
      border-radius: 50%;
    }

    &.calendar-date-selected {
      color: #fff;
      background: #1284e7;
      border-radius: 50%;

      &.calendar-date-selected-left {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }

      &.calendar-date-selected-right {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        box-shadow: -6px 0px 0px 0px @color-datepicker-primary-light;
      }
    }

    &.calendar-date-disabled {
      cursor: not-allowed !important;
      color: #bcbcbc !important;
      background-color: transparent;
    }

    &.calendar-date-out {
      color: #9ca3af;
    }

    &.calendar-date-on {
      background: @color-datepicker-primary-light;

      &:hover {
        border-radius: 6px;
      }
    }
  }
}

.calendar-week:before,
.calendar-date:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.calendar-week {
  cursor: default;
  width: 14.28%;
  height: 14%;
  padding-top: 4px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  border-radius: 0px;
  margin-left: 0%;

  &:hover {
    color: #4b5563;
  }
}

.calendar-date {
  cursor: pointer;
}

.calendar-date-on {
  background: @color-datepicker-primary-light;
}

.calendar-foot {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 5px;

  > .calendar-hour {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: 1px solid #e6e5e5;
    color: #9e9e9e;
    border-radius: 4px;
    padding: 4px 4px;

    a {
      cursor: pointer;
      display: inline-block;
      padding: 2px 6px;
      margin: 0px 2px;
      text-align: center;
      border-radius: 3px;

      &:hover {
        background: @color-datepicker-default-light;
      }

      &.on {
        color: #1284e7;
      }
    }
  }
}

.calendar-years,
.calendar-months,
.calendar-hours,
.calendar-minutes,
.calendar-seconds {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  left: 0;
  top: 0;
}

.calendar-months {
  
  > .calendar-date {
    font-weight: normal;
    width: 31.33%;
    height: 22%;
    line-height: 38px;
    margin-left: 2%;
    margin-top: 2%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    border-radius: 6px;

    &:nth-child(3n + 1) {
      margin-left: 0px;
    }

    &:hover {
      color: #4b5563;
      background: @color-datepicker-default-light;
    }

    &.calendar-date-selected {
      color: #fff;
      background: #1284e7;
    }

    &.calendar-date-disabled {
      cursor: not-allowed !important;
      color: #bcbcbc !important;
      background-color: transparent;
    }
  }
}

.calendar-years {

  
  > .calendar-date {
    font-weight: normal;
    width: 31.33%;
    height: 23%;
    line-height: 38px;
    margin-left: 2%;
    margin-top: 2%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    border-radius: 6px;

    &:hover {
      color: #4b5563;
      background: @color-datepicker-default-light;
    }

    &.calendar-date-selected {
      color: #fff;
      background: #1284e7;
    }

    &.calendar-date-disabled {
      cursor: not-allowed !important;
      color: #bcbcbc !important;
      background-color: transparent;
    }
  }
}

.calendar-hours {
  
  > .calendar-date {
    font-weight: normal;
    width: 18.4%;
    height: 17%;
    line-height: 38px;
    margin-left: 2%;
    margin-top: 2%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    border-radius: 6px;

    &:nth-child(5n + 2) {
      margin-left: 0px;
    }

    &:hover {
      color: #4b5563;
      background: @color-datepicker-default-light;
    }

    &.calendar-date-selected {
      color: #fff;
      background: #1284e7;
    }

    &.calendar-date-disabled {
      cursor: not-allowed !important;
      color: #bcbcbc !important;
      background-color: transparent;
    }
  }
}

.calendar-minutes {
  
  > .calendar-date {
    font-weight: normal;
    width: 23.5%;
    height: 25%;
    line-height: 24px;
    margin-left: 2%;
    margin-top: 2%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    border-radius: 6px;

    &:nth-child(4n + 2) {
      margin-left: 0px;
    }

    &:hover {
      color: #4b5563;
      background: @color-datepicker-default-light;
    }

    &.calendar-date-selected {
      color: #fff;
      background: #1284e7;
    }

    &.calendar-date-disabled {
      cursor: not-allowed !important;
      color: #bcbcbc !important;
      background-color: transparent;
    }
  }
}

.calendar-seconds {
  
  > .calendar-date {
    font-weight: normal;
    width: 23.5%;
    height: 25%;
    line-height: 24px;
    margin-left: 2%;
    margin-top: 2%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    color: #4b5563;
    border-radius: 6px;

    &:nth-child(4n + 2) {
      margin-left: 0px;
    }

    &:hover {
      color: #4b5563;
      background: @color-datepicker-default-light;
    }

    &.calendar-date-selected {
      color: #fff;
      background: #1284e7;
    }

    &.calendar-date-disabled {
      cursor: not-allowed !important;
      color: #bcbcbc !important;
      background-color: transparent;
    }
  }
}

.calendar-title {
  margin-top: -37px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
  background: #fff;
  text-align: center;
  font-weight: bold;
}
</style>
