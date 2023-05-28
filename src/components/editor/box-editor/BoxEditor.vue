<template>
  <div class="box-editor" :style="{ height: props.single ? '90px' : '140px' }">
    <!-- <div class="test-data">value: {{ value }}</div> -->
    <div class="box-item box-margin-left">
      <input v-model.number="state.marginLeft" @input="change" type="number" />
    </div>
    <div class="box-item box-margin-right">
      <input v-model.number="state.marginRight" @input="change" type="number" />
    </div>
    <div class="box-item box-margin-top">
      <input v-model.number="state.marginTop" @input="change" type="number" />
    </div>
    <div class="box-item box-margin-bottom">
      <input v-model.number="state.marginBottom" @input="change" type="number" />
    </div>

    <div v-if="!props.single" class="box-item box-padding-right">
      <input v-model.number="state.paddingRight" @input="change" type="number" />
    </div>
    <div v-if="!props.single" class="box-item box-padding-left">
      <input v-model.number="state.paddingLeft" @input="change" type="number" />
    </div>
    <div v-if="!props.single" class="box-item box-padding-top">
      <input v-model.number="state.paddingTop" @input="change" type="number" />
    </div>
    <div v-if="!props.single" class="box-item box-padding-bottom">
      <input v-model.number="state.paddingBottom" @input="change" type="number" />
    </div>

    <span v-if="!props.single" class="box-tooltip-padding">内边距</span>
    <span v-if="!props.single" class="box-tooltip-margin">外边距</span>
    <span v-else class="box-tooltip-margin">{{ props.styleName ?? '边距' }}</span>
  </div>
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { computed, onMounted, PropType, reactive } from 'vue';

const props = defineProps({
  value: {
    type: Array as PropType<number[][]>,
    default: () => [[0, 0, 0, 0], [0, 0, 0, 0]] as number[][],
  },
  /** 样式名称 */
  styleName: {
    type: String,
  },
  /** 单层 */
  single: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (event: 'change', val: number[][]): void;
}>();

const state = reactive({
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
});

const valueToArray = computed<number[][]>(() => {
  const _arr = [] as number[][];
  _arr[0] = [ state.marginTop, state.marginRight, state.marginBottom, state.marginLeft ];
  _arr[1] = props.single ? [] : [ state.paddingTop, state.paddingRight, state.paddingBottom, state.paddingLeft ];
  return _arr;
});

/** 初始化 */
const init = () => {
  if (!props.value[0] && !props.value[1]) {
    const _defaultData = [] as number[][];
    if (!props.value[0]) {
      _defaultData[0] = [0,0,0,0];
      state.marginTop = 0;
      state.marginRight = 0;
      state.marginBottom = 0;
      state.marginLeft = 0;
    }
    if (!props.value[1] && !props.single) {
      _defaultData[1] = [0,0,0,0];
      state.paddingTop = 0;
      state.paddingRight = 0;
      state.paddingBottom = 0;
      state.paddingLeft = 0;
    }
    emit('change', _defaultData);
  } else {
    state.marginTop = props.value[0][0];
    state.marginRight = props.value[0][1];
    state.marginBottom = props.value[0][2];
    state.marginLeft = props.value[0][3];
    if (!props.single) {
      state.paddingTop = props.value[1][0];
      state.paddingRight = props.value[1][1];
      state.paddingBottom = props.value[1][2];
      state.paddingLeft = props.value[1][3];
    }
  }
};
/** 改变值 */
const change = throttle(() => {
  if (valueToArray.value[0].join(',') != props.value?.[0]?.join(',') || valueToArray.value[1].join(',') != props.value?.[1]?.join(',')) {
    emit('change', valueToArray.value);
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

@color-bg-box-editor: #E5EFFE;
@extra-margin: 3px;
@item-height: 22px;
@side-width: 40px;
// padding和margin的中间间距
@inner-padding-width: 8px;
@inner-padding-height: 5px;

.box-editor {
  position: relative;
  // margin-top: 10px;
  // margin-bottom: 10px;

  // &:before {
  //     content: '';
  //     position: absolute;
  //     top: 24px;
  //     left: 32%;
  //     width: 36%;
  //     height: 12px;
  //     border: 1px solid #CCC;
  // }

  > .test-data {
    position: absolute;
    display: block;
    top: 0px;
    left: 0px;
    font-size: 12px;
    transform: scale(0.8);
    z-index: 9;
  }

  > .box-tooltip-padding {
    pointer-events: none;
    position: absolute;
    display: block;
    height: @item-height;
    line-height: @item-height;
    bottom: calc(@item-height + @inner-padding-height);
    left: calc(@side-width * 2 + @inner-padding-width - 10px);
    color: #888;
    font-size: 12px;
    transform: scale(0.8);
  }

  > .box-tooltip-margin {
    pointer-events: none;
    position: absolute;
    display: block;
    height: @item-height;
    line-height: @item-height;
    bottom: 0px;
    left: calc(@side-width - 10px);
    color: #888;
    font-size: 12px;
    transform: scale(0.8);
  }

  > .box-item {
    position: absolute;
    height: @item-height;
    padding: 0px;
    background-color: @color-bg-box-editor;
    // border-radius: 4px;

    &:hover {
      background-color: #cedef7;

      > input {
        color: #666;
      }
      
      &:before {
        border-color: #cedef7;
      }

      &:after {
        border-color: #cedef7;
      }
    }

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
    }

    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
    }

    > input {
      position: absolute;
      background-color: transparent;
      border: 1px solid transparent;
      outline: none;
      border-radius: 4px;
      height: 100%;
      width: 100%;
      text-align: center;
      vertical-align: top;
      line-height: 16px;
      color: #AAA;
      font-size: 12px;

      &::-webkit-outer-spin-button {
        appearance: none !important;
      }
      &::-webkit-inner-spin-button {
        appearance: none !important;
      }

      // &:hover {
      //   border-color: fadeout(@primary-color, 20%);
      //   border-right-width: 1px !important;
      // }

      // &:focus {
      //   box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
      // }
    }
  }

  // 内边距
  > .box-padding-top {
    top: calc(@item-height + @inner-padding-height);
    left: calc(@side-width * 2 + @inner-padding-width + @extra-margin);
    width: calc(100% - @side-width * 4 - @inner-padding-width * 2 - @extra-margin * 2);

    &:before {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      right: 100%;
      top: 0px;
    }

    &:after {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      left: 100%;
      top: 0px;
    }
  }
  > .box-padding-right {
    top: calc(@item-height * 2 + @inner-padding-height + @extra-margin);
    right: calc(@side-width + @inner-padding-width);
    height: calc(100% - @item-height * 4 - @inner-padding-height * 2 - @extra-margin * 2);
    width: @side-width;

    &:before {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc(@item-height / 2) solid @color-bg-box-editor;
      bottom: 100%;
      right: 0px;
    }

    &:after {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc(@item-height / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      top: 100%;
      right: 0px;
    }
  }
  > .box-padding-bottom {
    bottom: calc(@item-height + @inner-padding-height);
    left: calc(@side-width * 2 + @inner-padding-width + @extra-margin);
    width: calc(100% - @side-width * 4 - @inner-padding-width * 2 - @extra-margin * 2);

    &:before {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      right: 100%;
      bottom: 0px;
    }

    &:after {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      left: 100%;
      bottom: 0px;
    }
  }
  > .box-padding-left {
    top: calc(@item-height * 2 + @inner-padding-height + @extra-margin);
    left: calc(@side-width + @inner-padding-width);
    height: calc(100% - @item-height * 4 - @inner-padding-height * 2 - @extra-margin * 2);
    width: @side-width;

    &:before {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc(@item-height / 2) solid @color-bg-box-editor;
      left: 0px;
      bottom: 100%;
    }

    &:after {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc(@item-height / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      left: 0px;
      top: 100%;
    }
  }
  
  // 外边距
  > .box-margin-top {
    top: 0px;
    left: calc(@side-width + @extra-margin);
    width: calc(100% - @side-width * 2 - @extra-margin * 2);

    &:before {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      right: 100%;
      top: 0px;
    }

    &:after {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      left: 100%;
      top: 0px;
    }
  }
  > .box-margin-right {
    top: calc(@item-height + @extra-margin);
    right: 0%;
    width: @side-width;
    height: calc(100% - @item-height * 2 - @extra-margin * 2);

    &:before {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc(@item-height / 2) solid @color-bg-box-editor;
      bottom: 100%;
      right: 0px;
    }

    &:after {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc(@item-height / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      top: 100%;
      right: 0px;
    }
  }
  > .box-margin-bottom {
    bottom: 0px;
    left: calc(@side-width + @extra-margin - 2px);
    width: calc(100% - @side-width * 2 - @extra-margin * 2);

    &:before {
      border-left: calc(@side-width / 2) solid transparent !important;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid @color-bg-box-editor;
      border-bottom: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      right: 100%;
      bottom: 0px;
    }

    &:after {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc((@item-height + 1px) / 2) solid @color-bg-box-editor;
      left: 100%;
      bottom: 0px;
    }
  }
  > .box-margin-left {
    top: calc(20px + @extra-margin);
    left: 0%;
    width: @side-width;
    height: calc(100% - @item-height * 2 - @extra-margin * 2);

    &:before {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc(@item-height / 2) solid transparent !important;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc(@item-height / 2) solid @color-bg-box-editor;
      left: 0px;
      bottom: 100%;
    }

    &:after {
      border-left: calc(@side-width / 2) solid @color-bg-box-editor;
      border-top: calc(@item-height / 2) solid @color-bg-box-editor;
      border-right: calc(@side-width / 2) solid transparent !important;
      border-bottom: calc(@item-height / 2) solid transparent !important;
      left: 0px;
      top: 100%;
    }
  }
}
</style>
