<template>
  <div class="background-editor">
    <div class="background-editor-list">
      <!-- 每项背景 -->
      <div
        class="background-editor-item"
        v-for="(item, index) in value"
        @mousedown="changeCurrentBg(index)"
      >
        <div class="background-editor-item-group">
          <!-- 图片 -->
          <div class="background-editor-item-img" :style="getParentStyle(item)" @mousedown="setBackground($event, index)">
            <div class="background-editor-item-img-content" :style="getStyle(item)"></div>
          </div>
          <!-- 文本 -->
          <div class="background-editor-item-txt">{{ getTxt(item) }}</div>
          <!-- 透明度 -->
          <div class="background-editor-item-opacity">
            <Slider v-if="item.type !== 'color'" v-model:value="item.opacity" :step="0.01" :min="0" :max="1" @change="onChange" />
            <Slider v-else v-model:value="item.color.a" :step="0.01" :min="0" :max="1" @change="onChange" />
            <span>{{ toDecimal((item.type !== 'color' ? item.opacity : item.color.a) * 100, 0) }}%</span>
          </div>
          <!-- 是否显示 -->
          <div class="background-editor-item-isshow btn-tool" tooltip="是否显示" @click.stop="toggleShow(item, index)">
            <i class="iconfont" :class="item.show ? 'icon-eye' : 'icon-eye-close'"></i>
          </div>
        </div>
        <!-- 移除 -->
        <div class="background-editor-item-remove btn-tool" tooltip="移除" @click="removeItem(index)">
          <i class="iconfont icon-minus"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, reactive, computed, type StyleValue } from 'vue';
import {
  state as backgroundEditorState,
  service as backgroundEditorService,
  type AppBackground
} from '@/modules/background-editor-module';
import { distance, throttle, toDecimal } from '@/tools/common';
import { InputNumber, Slider } from 'ant-design-vue';
import { toHex } from '@/lib/color/Color';
import bus from '@/tools/bus';

const props = defineProps({
  /** 当前值 */
  value: {
    type: Array as PropType<AppBackground[]>,
    required: true,
  },
});

const state = reactive({

});

const removeItem = (index: number) => {
  props.value.splice(index, 1);
  if (index >= props.value.length) {
    backgroundEditorState.currentGradientItemIndex = props.value.length - 1;
  }
}

const onChange = throttle(() => {
  bus.$emit('background_editor_change');
}, 30);

const changeCurrentBg = (index: number) => {
  backgroundEditorState.currentGradientItemIndex = index;
  backgroundEditorState.currentBackground = props.value[index];
};

const getParentStyle = (item: AppBackground) => {
  let _css = {} as StyleValue;
  switch (item.type) {
    case 'image': {
      _css = {
        ...backgroundEditorService.getFillMode(item),
        filter: backgroundEditorService.getImageFilter(item),
      };
      break;
    }
    default:
      _css = {};
      break;
  }
  return _css;
}

const getStyle = (item: AppBackground) => {
  let _css = {} as StyleValue;
  switch (item.type) {
    case 'color':
      _css = {
        backgroundColor: `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, ${item.color.a})`,
      };
      break;
    case 'linear-gradient': {
      const _rotate = backgroundEditorService.getRotate(item);
      _css = {
        backgroundImage: `linear-gradient(${_rotate + 90}deg, ${backgroundEditorService.getGradientCSSColors(item, 0, 1)})`,
      };
      break;
    }
    case 'radial-gradient': {
      _css = {
        backgroundImage: `radial-gradient(${12.7279 * item.ovalityRatio}px ${12.7279}px at ${18 * 0.5}px ${18 * 0.5}px, ${
          backgroundEditorService.getGradientCSSColors(item)
        })`
      };
      break;
    }
    case 'conic-gradient': {
      const _rotate = 180 / Math.PI * Math.atan2(item.y2 - item.y1, item.x2 - item.x1);
      _css = {
        backgroundImage: `conic-gradient(from ${_rotate + 90}deg at ${18 / 2}px ${18 / 2}px, ${
          backgroundEditorService.getGradientCSSColors(item)
        })`
      };
      break;
    }
    case 'image': {
      _css = {
        left: `0px`, top: `0px`, width: `100%`, height: `100%`,
        backgroundImage: item.imageUrl,
      };
      break;
    }
    default:
      _css = {};
      break;
  }
  return _css;
};

/** 切换是否显示状态 */
const toggleShow = (item: AppBackground, index: number) => {
  item.show = !item.show;
};

const getTxt = (item: AppBackground) => {
  switch (item.type) {
    case 'color':
      return toHex(item.color);
    case 'linear-gradient':
      return '线性渐变';
    case 'radial-gradient':
      return '径向渐变';
    case 'conic-gradient':
      return '旋转渐变';
    case 'image':
      return '图片';
  }
};

/** 根据索引选择背景色 */
const setBackground = (e: MouseEvent, index: number) => {
  
  if (!backgroundEditorState.isShow || backgroundEditorState.currentGradientItemIndex !== index) {
    // 显示弹出框
    let _top = e.pageY - 100;
    if (_top < 50) _top = 50;
    else if (_top > window.innerHeight - 600) _top = window.innerHeight - 600;
    backgroundEditorState.dialogCss = {
      top: `${_top}px`,
      right: `520px`,
    };

    backgroundEditorState.isShow = true;
    backgroundEditorState.currentGradientItemIndex = index;
    backgroundEditorState.currentBackground = props.value[index];
    bus.$emit('background_editor_change');
  } else {
    backgroundEditorState.currentGradientItemIndex = -1;
    backgroundEditorState.isShow = false;
  }
};
</script>

<style lang="less" scoped>
.background-editor {

  > .background-editor-list {
    display: block;

    > .background-editor-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      + .background-editor-item {
        margin-top: 8px;
      }

      > .background-editor-item-remove {

        > .iconfont {

        }
      }

      > .background-editor-item-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(0,0,0,0.1);
        border-radius: 6px;
        background-color: #F8F9FC;
        border-radius: 6px;
        width: 100%;
        margin-right: 10px;
        padding: 0px 6px;
        font-size: 12px;
        color: #666;

        --image-position: 0% 0%;
        --image-size: 100% 100%;
        --image-repeat: no-repeat;

        > .background-editor-item-img {
          flex-shrink: 0;
          flex-grow: 0;
          position: relative;
          display: block;
          width: 18px;
          height: 18px;
          border-radius: 3px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
          background-size: 50% 50%;
          margin-left: 4px;
          margin-right: 10px;

          > .background-editor-item-img-content {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            border-radius: 3px;
            background-repeat: var(--image-repeat);
            background-position: var(--image-position);
            background-size: var(--image-size);
          }
        }

        > .background-editor-item-txt {
          flex-shrink: 1;
          flex-grow: 1;
          width: 50%;
        }

        > .background-editor-item-opacity {
          flex-shrink: 0;
          flex-grow: 0;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-right: 20px;

          > .ant-slider {
            flex-shrink: 0;
            flex-grow: 0;
            width: 80px;
            margin-right: 15px;
          }

          > span {
            flex-shrink: 0;
            flex-grow: 0;
            display: inline-block;
            width: 32px;
            text-align: right;
          }
        }

        > .background-editor-item-isshow {
        }
      }
    }
  }
}
</style>