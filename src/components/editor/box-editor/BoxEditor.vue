<template>
  <div class="box-editor">
    <div class="box-editor-top">
      <span class="box-editor-label">上</span>
      <input v-model.number="state.valueTop" @input="change" type="number" />
      <span class="box-editor-unit">像素</span>
    </div>
    <div class="box-editor-right">
      <span class="box-editor-label">右</span>
      <input v-model.number="state.valueRight" @input="change" type="number" />
      <span class="box-editor-unit">像素</span>
    </div>
    <div class="box-editor-bottom">
      <span class="box-editor-label">下</span>
      <input v-model.number="state.valueBottom" @input="change" type="number" />
      <span class="box-editor-unit">像素</span>
    </div>
    <div class="box-editor-left">
      <span class="box-editor-label">左</span>
      <input v-model.number="state.valueLeft" @input="change" type="number" />
      <span class="box-editor-unit">像素</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { computed, onMounted, PropType, reactive } from 'vue';

const props = defineProps({
  value: {
    type: Object as PropType<[number, number, number, number]>,
    default: () => [0, 0, 0, 0] as [number, number, number, number],
  },
  styleName: {
    type: String as PropType<'padding' | 'margin'>,
  },
});

const emit = defineEmits<{
  (event: 'change', val: [number, number, number, number]): void;
}>();

const state = reactive({
  valueLeft: 0,
  valueRight: 0,
  valueTop: 0,
  valueBottom: 0,
});

const valueToArray = computed<[number, number, number, number]>(() => {
  return [+state.valueTop, +state.valueRight, +state.valueBottom, +state.valueLeft];
});

/** 初始化 */
const init = () => {
  state.valueTop = props.value[0];
  state.valueRight = props.value[1];
  state.valueBottom = props.value[2];
  state.valueLeft = props.value[3];
};
/** 改变值 */
const change = throttle(() => {
  if (valueToArray.value.join(',') != props.value.join(',')) {
    emit('change', valueToArray.value);
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.box-editor {
  position: relative;
  height: 72px;
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

  > div {
    position: absolute;
    height: 24px;
    padding: 0px;
    border-radius: 4px;

    > .box-editor-label {
      display: inline-block;
      vertical-align: top;
      line-height: 24px;
      margin-right: 5px;
    }

    > .box-editor-unit {
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
      height: 24px;
      width: calc(100% - 25px);
      vertical-align: top;
      line-height: 18px;
      padding-right: 30px;
      padding-left: 5px;
      color: #666;
      font-size: 12px;
      transition: 0.3s;

      &:hover {
        border-color: fadeout(@primary-color, 20%);
        border-right-width: 1px !important;
      }

      &:focus {
        box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
      }
    }
  }

  > .box-editor-top {
    top: 0px;
    left: 33.333%;
    width: 33.333%;
  }

  > .box-editor-right {
    top: 24px;
    right: 0%;
    width: 33.333%;
  }

  > .box-editor-bottom {
    bottom: 0px;
    right: 33.333%;
    width: 33.333%;
  }

  > .box-editor-left {
    top: 24px;
    left: 0%;
    width: 33.333%;
  }
}
</style>
