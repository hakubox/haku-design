<template>
  <div class="color-picker">
    <div
      class="color-picker-disk"
      ref="colorPickerDisk"
      :style="{ 'background-color': diskBackGround }"
      @mousedown="handleStartDrag"
    >
      <div class="color-picker-disk-point" :style="{ transform: `translate(${state.cursorLeft}px, ${state.cursorTop}px)` }"></div>
    </div>

    <div class="color-picker-panel">
      <!-- 新旧色对比 -->
      <div class="color-picker-contrast">
        <div class="color-picker-oldcolor" :style="{ background: state.oldValue }"></div>
        <div class="color-picker-newcolor" :style="{ background: state.newValue }"></div>
      </div>
      <div class="color-picker-sliders">
        <!-- 色值 -->
        <TypeColorPickerSlider
          v-model:value="hue"
          :max="360"
          class="color-picker-slider-disk"
          :slider-style="{ background: 'linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)' }"
        />
        <!-- 透明度 -->
        <TypeColorPickerSlider
          v-if="showAlpha"
          v-model:value="alpha"
          :max="100"
          class="color-picker-slider-alpha"
          :slider-style="{ background: `linear-gradient(90deg,${setAlpha(0)} 0%,${setAlpha(1)} 100%)` }"
        />
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #F2F2F2; margin-bottom: 9px" />

    <!-- 输入区 -->
    <div class="color-input-panel">
      <div class="color-input-row">
        <div class="color-input-cell">
          <div class="color-input-text"></div>
          <div class="color-input-text"></div>
        </div>
        <div class="color-input-cell">
          <div class="color-input-select">
            <select v-model="state.formatterType">
              <option :value="item" v-for="item in ['hex', 'css']">{{ item }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="color-input-row">
        <div class="color-input-cell">
          <!-- RGBA -->
          <template v-if="state.colorType === 'rgb'">
            <div class="color-input-text"></div>
            <div class="color-input-text"></div>
            <div class="color-input-text"></div>
            <div class="color-input-select"></div>
          </template>
          <div class="color-input-select-btn"></div>
        </div>
        <!-- HSL -->
        <!-- HSB -->
        <SimpleSelect :visible="true"></SimpleSelect>
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #F2F2F2; margin-bottom: 9px" />

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

    <hr style="border: none; border-top: 1px solid #F2F2F2; margin-top: 4px" v-show="state.history.length" />

    <div class="color-picker-footer">
      <div class="color-picker-footer-text">
        <input type="text" v-model="state.newValue" />
        <div class="color-picker-footer-text-type">{{ state.colorType }}</div>
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
</template>

<script lang="ts" setup>
import Color from '@/lib/color/Color';
import { reactive, ref, watch, PropType, computed, onMounted, onUnmounted } from 'vue';
import TypeColorPickerSlider from './TypeColorPickerSlider.vue';
import SimpleSelect from '../common/SimpleSelect.vue';

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

const colorPickerDisk = ref({} as any);

const state = reactive({
  /** 颜色类型 */
  colorType: 'rgb' as 'rgb' | 'hsl' | 'hsv',
  /** 格式化类型 */
  formatterType: 'hex' as 'hex' | 'css',
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
  color: {} as Color,
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
    return state.color.get('hue');
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
  return `hsl(${state.color.get('hue')}, 100%, 50%)`;
});

watch(() => props.showAlpha, () => {
  state.color.enableAlpha = props.showAlpha;
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
  state.color.format = state.colorType;
  alpha.value = state.color._alpha;
  document.body.addEventListener('mouseup', handleEndDrag);
  document.body.addEventListener('mousemove', handleDrag);
  document.body.addEventListener('mousedown', shrinkPicker);

  let _historyList: any = sessionStorage.getItem('colorPickerHistory');

  if (!_historyList || !_historyList.length) {
    const _color = new Color({
      enableAlpha: props.showAlpha,
      format: state.colorType,
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
  state.color.format = state.colorType;
  setColor(state.color.value);
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
    enableAlpha: props.showAlpha,
    format: state.colorType,
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
    enableAlpha: props.showAlpha,
    format: state.colorType,
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

  > .color-picker-panel {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;

    > .color-picker-contrast {
      display: flex;
      flex-direction: column;
      width: 30px;
      height: 30px;
      margin-right: 15px;
      border-radius: 4px;
      box-shadow: 0px 0px 0px 1px #E5E5E5;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);

      > .color-picker-oldcolor {
        position: relative;
        flex-grow: 1;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      > .color-picker-newcolor {
        position: relative;
        flex-grow: 1;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }

    > .color-picker-sliders {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      width: 100%;
      height: 100%;

      > .color-picker-slider-disk {
        position: relative;
        width: 100%;
        margin-bottom: 8px;
      }

      > .color-picker-slider-alpha {
        position: relative;
        width: 100%;
      }
    }
  }
}



.color-picker-disk {
  user-select: none;
  position: relative;
  width: 220px;
  height: 190px;
  border-radius: 4px;

  > .color-picker-disk-point {
    position: absolute;
    cursor: pointer;
    top: -6px;
    left: -6px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.3), 0px 1px 3px inset rgba(0, 0, 0, 0.3);
    // background-color: rgba(255, 255, 255, 0.1);

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
    border-radius: 4px;
  }
}

// 历史列表
.color-picker-history {
  display: flex;
  flex-wrap: wrap;

  > .color-picker-history-item {
    position: relative;
    cursor: pointer;
    display: inline-block;
    margin: 0px 2px 4px 2px;
    width: 20px;
    height: 20px;
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
.color-picker-footer {
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
</style>
