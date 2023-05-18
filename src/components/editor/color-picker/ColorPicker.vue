<template>
  <div
    class="color-picker"
    :class="`color-picker-${props.size}${state.isShowPicker ? ' active' : ''}`"
    @mousedown.stop="extendPicker"
  >
    <input class="color-picker-input" ref="colorInput" type="text" :value="value" @change="changeColor($event)" />
    <div class="color-picker-color-box">
      <div class="color-picker-color-value" :style="{ 'background-color': value }"></div>
    </div>

    <div
      class="color-picker-dropdown"
      ref="colorPicker"
      :class="{ 'color-picker-dropdown-show': state.showPicker, 'color-picker-dropdown-top': state.showPickerTop }"
      @mousedown.stop
    >
      <div
        class="color-picker-disk"
        ref="colorPickerDisk"
        :style="{ 'background-color': diskBackGround }"
        @mousedown="handleStartDrag"
      >
        <div class="color-picker-disk-point" :style="{ transform: `translate(${state.cursorLeft}px, ${state.cursorTop}px)` }"></div>
      </div>

      <div class="color-picker-color">
        <div class="color-picker-oldcolor" :style="{ background: state.oldValue }"></div>
        <div class="color-picker-newcolor" :style="{ background: state.newValue }"></div>
      </div>

      <!-- 色环值 -->
      <color-picker-slider
        v-model:value="hue"
        :max="360"
        class="color-picker-slider-disk"
        :slider-style="{ background: 'linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)' }"
      />
      <!-- 透明度 -->
      <color-picker-slider
        v-if="showAlpha"
        v-model:value="alpha"
        :max="100"
        class="color-picker-slider-alpha"
        :slider-style="{ background: `linear-gradient(90deg,${setAlpha(0)} 0%,${setAlpha(1)} 100%)` }"
      />

      <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 9px" />

      <div class="color-picker-history">
        <div class="color-picker-history-item" v-for="(item, index) in state.history" :key="index">
          <div
            class="color-picker-history-item-color"
            :title="item"
            :style="{ background: item }"
            @click="selectHistoryColor(item)"
          ></div>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin-top: 2px" v-show="state.history.length" />

      <div class="color-picker-footer">
        <div class="color-picker-footer-text">
          <input type="text" v-model="state.newValue" />
          <div class="color-picker-footer-text-type">{{ colorType }}</div>
          <i
            v-if="canChangeColorType"
            title="切换类型"
            class="color-picker-footer-text-changetype fal fa-exchange"
            @click="changeColorType"
          ></i>
        </div>
        <div class="color-picker-footer-tools">
          <button class="color-picker-footer-tools-clear" v-if="canClear">清空</button>
          <button class="color-picker-footer-tools-confirm" @click="comfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Color from '@/lib/color/Color';
import { toRefs, reactive, ref, watch, PropType, defineComponent, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  /** 当前颜色 */
  value: {
    type: String,
    default: '',
  },
  /** 显示透明色 */
  showAlpha: {
    type: Boolean,
    default: true,
  },
  /** 颜色类型 */
  colorType: {
    type: String as PropType<'hex' | 'rgb' | 'hsl' | 'hsv'>,
    default: 'rgb',
  },
  /** 是否可切换颜色类型 */
  canChangeColorType: {
    type: Boolean,
    default: false,
  },
  /** 是否可清空 */
  canClear: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
  },
});

const colorInput = ref({} as any);
const colorPicker = ref({} as any);
const colorPickerDisk = ref({} as any);

const state = reactive({
  /** 是否开始选择 */
  showPicker: false,
  /** 弹框展开方向 */
  showPickerTop: true,
  /** 是否开始在色板拖拽取色 */
  isStartDrag: false,
  /** 色板游标离上部距离 */
  cursorTop: 0,
  /** 色板游标离左部距离 */
  cursorLeft: 0,
  /** 旧色值 */
  oldValue: '#FFFFFF',
  /** 新色值 */
  newValue: '',
  /** 颜色 */
  color: new Color({
    enableAlpha: true,
    format: 'rgb',
  }),
  /** 文本框元素 */
  colorInput,
  /** 弹出框元素 */
  colorPicker,
  /** 画板元素 */
  colorPickerDisk,
  /** 颜色历史记录 */
  history: [] as string[],
  /** 是否显示下拉框 */
  isShowPicker: false,
});

/** 色环值 */
const hue = computed({
  get: () => {
    return state.color.get('hue') ?? 0;
  },
  set: (val) => {
    state.color.set('hue', val);
    state.newValue = state.color.value;
  },
});

const emit = defineEmits<{
  (event: 'change', value: string): void;
  (event: 'update:value', value: string): void;
  (event: 'update:colorType', value: "hex" | "rgb" | "hsl" | "hsv"): void;
}>();

/** 透明度 */
const alpha = computed({
  get: () => {
    return state.color.get('alpha');
  },
  set: (val) => {
    state.color.set('alpha', val);
    state.newValue = state.color.value;
  },
});

/** 调色板的背景色 */
const diskBackGround = computed(() => {
  return `hsl(${state.color.get('hue') ?? 0}, 100%, 50%)`;
});

/** 颜色改变函数 */
const changeColor = (e?) => {
  const value = e ? e.target.value : state.color.value;

  if (props.value != value) {
    const rect = state.colorPickerDisk.getBoundingClientRect();
    state.cursorLeft = (state.color.get('saturation') * rect.width) / 100;
    state.cursorTop = ((100 - state.color.get('value')) * rect.height) / 100;

    state.color.fromString(value.trim().toLowerCase());
  }
};
/** 设置透明度（0 ~ 1） */
const setAlpha = (alpha: number) => {
  const { r, g, b } = state.color.toRgb();
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
/** 初始化 */
const init = () => {
  state.color.fromString(props.value.trim().toLowerCase());
  state.color.format = props.colorType;
  alpha.value = state.color._alpha;
  document.body.addEventListener('mouseup', handleEndDrag);
  document.body.addEventListener('mousemove', handleDrag);
  document.body.addEventListener('mousedown', shrinkPicker);

  let _historyList: any = sessionStorage.getItem('colorPickerHistory');

  if (!_historyList || !_historyList.length) {
    const _color = new Color({
      enableAlpha: props.showAlpha,
      format: props.colorType,
    });
    _historyList = [];
    _color.fromString('rgba(255, 255, 255, 1)');
    _historyList.push(_color.value);
    _color.fromString('rgba(0, 0, 0, 1)');
    _historyList.push(_color.value);
  } else _historyList = JSON.parse(_historyList);
  state.history = _historyList;

  const rect = state.colorPickerDisk.getBoundingClientRect();
  state.cursorLeft = (state.color.get('saturation') * rect.width) / 100;
  state.cursorTop = ((100 - state.color.get('value')) * rect.height) / 100;
};
const handleStartDrag = (e) => {
  state.isStartDrag = true;
  handleDrag(e);
};
/** 在色板取色 */
const handleDrag = (e) => {
  if (state.isStartDrag) {
    const rect = state.colorPickerDisk.getBoundingClientRect();
    let left = e.pageX - rect.left;
    let top = e.pageY - rect.top;
    left = Math.min(Math.max(0, left), rect.width);
    top = Math.min(Math.max(0, top), rect.height);
    state.cursorLeft = left;
    state.cursorTop = top;
    state.color.set({
      saturation: (left / rect.width) * 100,
      value: 100 - (top / rect.height) * 100,
    });
    state.newValue = state.color.value;
  }
};
/** 拖拽完毕 */
const handleEndDrag = () => {
  state.isStartDrag = false;
};
/** 选择历史颜色 */
const selectHistoryColor = (item) => {
  setColor(item);
};
const setColor = (color: string) => {
  console.log('color', color);
  state.newValue = color;
  state.color.fromString(state.newValue);

  const rect = state.colorPickerDisk.getBoundingClientRect();
  state.cursorLeft = (state.color.get('saturation') * rect.width) / 100;
  state.cursorTop = ((100 - state.color.get('value')) * rect.height) / 100;

  comfirm();
};
/** 切换颜色类型 */
const changeColorType = () => {
  let colorType = props.colorType;
  switch (colorType) {
    case 'rgb':
      colorType = 'hsv';
      break;
    case 'hsv':
      colorType = 'hsl';
      break;
    case 'hsl':
      colorType = 'hex';
      break;
    case 'hex':
      colorType = 'rgb';
      break;
    default:
      break;
  }
  emit('update:colorType', colorType);
  state.color.format = props.colorType;
  setColor(state.color.value);
};
/** 展开 */
const extendPicker = () => {
  const { y } = state.colorInput.getBoundingClientRect();
  const { height } = document.body.getBoundingClientRect();
  state.showPickerTop = height - y < 380;
  state.showPicker = true;

  init();
};
/** 收缩 */
const shrinkPicker = () => {
  state.showPicker = false;
};
/** 确定 */
const comfirm = () => {
  state.oldValue = state.newValue;
  emit('update:value', state.newValue);
  emit('change', state.newValue);
  state.showPicker = false;

  const _color = new Color({
    format: props.colorType,
  });
  if (state.history.length > 20) {
    state.history.splice(0, 1);
  }
  _color.fromString(state.newValue);
  if (!state.history.includes(_color.value)) {
    state.history.push(_color.value);
    sessionStorage.setItem('colorPickerHistory', JSON.stringify(state.history));
  }
};

onMounted(() => {
  state.color = new Color({
    format: props.colorType,
  }) as Color;

  init();
});

onUnmounted(() => {
  document.body.addEventListener('mouseup', handleEndDrag);
  document.body.addEventListener('mousemove', handleDrag);
  document.body.addEventListener('mousedown', shrinkPicker);
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

// 颜色选择器
.color-picker {
  position: relative;
  display: inline-block;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 26px;
  transition: 0.3s;

  &:hover {
    border-color: fadeout(@primary-color, 20%);
    border-right-width: 1px !important;
  }

  &:focus-within {
    box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
  }

  &.color-picker-large {
  }
  &.color-picker-default {
  }
  &.color-picker-small {
    line-height: 20px;

    > .color-picker-color-box {
      top: 4px;
    }
  }

  > .color-picker-input {
    border: none;
    width: 100%;
    border-radius: 4px;
    padding-right: 30px;
    padding-left: 10px;
    font-size: 12px;
  }

  > .color-picker-color-box {
    position: absolute;
    top: 6px;
    right: 6px;
    border-radius: 3px;
    width: 16px;
    height: 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);

    > .color-picker-color-value {
      position: absolute;
      top: 0px;
      left: 0px;
      border-radius: 3px;
      width: 100%;
      height: 100%;
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2) inset;
    }
  }

  // 下拉框
  > .color-picker-dropdown {
    position: absolute;
    z-index: 9999;
    background-color: white;
    border: 1px solid #eee;
    top: calc(100% + 2px);
    right: 0px;
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transform: translateY(20px);
    transition: 0.15s;
    visibility: hidden;
    will-change: transform, opacity;

    &.color-picker-dropdown-show {
      visibility: visible;
      transform: translateY(0px);
      opacity: 1;
    }

    &.color-picker-dropdown-top {
      top: initial;
      bottom: calc(100% + 4px);
      transform: translateY(-20px);

      &.color-picker-dropdown-show {
        visibility: visible;
        transform: translateY(0px);
        opacity: 1;
      }
    }

    > hr {
    }

    > .color-picker-color {
      display: flex;
      flex-direction: column;
      width: 50px;
      height: 50px;
      margin: 12px;
      margin-left: 30px;
      border-radius: 4px;
      box-shadow: 0px 0px 0px 1px #e0e0e0;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);

      > .color-picker-oldcolor {
        position: relative;
        flex-grow: 1;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        &:before {
          position: absolute;
          color: #bbb;
          content: '旧';
          line-height: 25px;
          left: -22px;
          font-size: 12px;
        }
      }
      > .color-picker-newcolor {
        position: relative;
        flex-grow: 1;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;

        &:before {
          content: '新';
          position: absolute;
          color: #bbb;
          line-height: 25px;
          left: -22px;
          font-size: 12px;
        }
      }
    }

    > .color-picker-disk {
      user-select: none;
      position: relative;
      width: 290px;
      height: 190px;

      > .color-picker-disk-point {
        position: absolute;
        cursor: pointer;
        top: -6px;
        left: -6px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 1px solid white;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.3);
        background-color: rgba(255, 255, 255, 0.1);

        &:before {
          position: absolute;
          top: -15px;
          left: -15px;
          width: 43px;
          height: 43px;
        }
      }

      &:before {
        content: '';
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
      }
    }

    > .color-picker-slider-disk {
      position: absolute;
      top: 213px;
      left: 100px;
      width: calc(100% - 115px);
    }

    > .color-picker-slider-alpha {
      position: absolute;
      top: 238px;
      left: 100px;
      width: calc(100% - 115px);
    }

    // 历史列表
    > .color-picker-history {
      display: flex;
      flex-wrap: wrap;

      > .color-picker-history-item {
        position: relative;
        cursor: pointer;
        display: inline-block;
        margin: 0px 4px 8px 4px;
        width: 16px;
        height: 16px;
        border-radius: 3px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);

        > .color-picker-history-item-color {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          border-radius: 3px;
          box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2) inset;
        }
      }
    }

    // 选择器底部
    > .color-picker-footer {
      display: flex;
      width: 290px;

      > .color-picker-footer-text {
        flex-grow: 1;
        display: flex;
        width: 100%;
        align-items: center;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        margin-right: 4px;

        > input {
          border: none;
          display: inline-block;
          line-height: 20px;
          flex-shrink: 1;
          padding-left: 5px;
          font-size: 12px;
          width: 100%;
        }

        > .color-picker-footer-text-type {
          display: inline-block;
          cursor: default;
          width: 30px;
          line-height: 24px;
          text-align: center;
          flex-shrink: 0;
          color: #aaa;
        }

        > .color-picker-footer-text-changetype {
          display: inline-block;
          cursor: pointer;
          width: 26px;
          line-height: 22px;
          border-radius: 4px;
          text-align: center;
          flex-shrink: 0;
          color: @primary-color;
          transition: 0.2s;
          margin-right: 2px;

          &:hover {
            color: white;
            background-color: @primary-color;
          }
        }
      }

      > .color-picker-footer-tools {
        text-align: right;
        flex-shrink: 0;

        > .color-picker-footer-tools-confirm {
          border: 1px solid #d9d9d9;
          background-color: white;
          border-radius: 4px;
          font-size: 12px;
          height: 27px;
          line-height: 24px;
          padding-left: 8px;
          padding-right: 8px;
          transition: 0.2s;

          &:hover {
            color: white;
            background-color: @primary-color;
          }
        }

        > .color-picker-footer-tools-clear {
          border: none;
          background-color: white;
          border-radius: 4px;
          color: @primary-color;
          font-size: 12px;
          height: 27px;
          line-height: 24px;
          padding-left: 6px;
          padding-right: 6px;
          margin-right: 4px;
          transition: 0.2s;

          &:hover {
            background-color: #f5f5f5;
          }
        }
      }
    }
  }
}
</style>
