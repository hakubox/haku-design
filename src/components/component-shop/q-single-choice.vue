<template>
  <ComponentBasic
    class="component-single-choice"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :layout="globalState.isMobile ? 'layout-span-1' : props.layout"
  >
  <div v-if="isPrint" class="component-item-single-choice-printmode">
    <div class="single-choice-option" v-for="item in props.options" :key="item.value">
      <i class="single-choice-option-checkbox"></i> {{ item.label }}
    </div>
  </div>
  <RadioGroup v-else :modelValue="state.radioValue" :disabled="props.disabled" direction="horizontal">
    <Radio
      v-for="item in props.options"
      :class="{
        active: item.image && item.value === value,
        imgradio: item.image,
      }"
      :disabled="disabled || item.disabled"
      :key="item.value"
      :name="item.value"
      @click="changeValue(item.value)"
    >
      {{item.label}}
      <img v-if="item.image" class="component-single-choice-item-image"
        :src="storageService.getFileInfo(item.image)?.src"
        :style="{
          'border-radius': $attrs.borderRadius + 'px',
          'object-fit': $attrs.fillType as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down',
          'filter': `blur(${$attrs.blur}px)`
        }"
      />
    </Radio>
    <Radio v-if="$attrs.hasElse" name="[ELSE]" :checked="state.isElse || (!state.radioValue && !!state.realElseTxt)" @click="checkElseOption">
      <div class="component-single-choice-else">
        <span>其他</span>
        <input
          v-if="state.isElse || (!state.radioValue && !!state.realElseTxt)"
          class="component-single-choice-else-textbox"
          type="text"
          v-model="elseTxt"
          @click.stop
          @blur="changeElseValue"
        />
      </div>
    </Radio>
  </RadioGroup>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive, nextTick, watch, inject, defineOptions } from "vue";
import { service as storageService } from '@/modules/storage-module';
import { state as globalState } from '@/common/global';
import { getQBasicProps } from '@/tools/common';
import { computed } from 'vue';
import { Radio, RadioGroup } from 'vant';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  component: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array as PropType<any[]>
  },
  layout: {
    type: String
  }
});

/** 是否为打印 */
const isPrint = inject<boolean>('isPrint', false);

const emit = defineEmits<{
  (event: 'update:value', val: string): void;
}>();

const state = reactive({
  /** 是否选择其他 */
  isElse: false,
  /** 其他文本 */
  realElseTxt: '',
  /** radio值 */
  radioValue: props.value,
});

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.radioValue = val || '';
    init();
  }
});

/** 其他值 */
const elseTxt = computed({
  get() {
    if (!props.value) return '';
    const _option = props.options?.find(i => i.value === props.value);
    if (_option) {
      return '';
    } else {
      return state.realElseTxt;
    }
  },
  set(val) {
    state.realElseTxt = val;
  }
});

const init = () => {
  const _option = props.options?.find(i => i.value === props.value);
  if (!_option) {
    elseTxt.value = props.value;
    if (props.value) state.isElse = true;
  }
};
const changeValue = (val) => {
  state.radioValue = val;
  state.isElse = false;
  emit('update:value', val);
  elseTxt.value = '';
};
const changeElseValue = () => {
  emit('update:value', state.realElseTxt);
};
const checkElseOption = () => {
  if (state.isElse) {
    state.isElse = false;
  } else {
    emit('update:value', '');
    nextTick(() => {
      state.isElse = true;
    });
  }
}

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';
@import '/src/assets/less/print-variable.less';

.van-radio {
  padding: 4px;

  &.imgradio {
    display: inline-block;
    margin-left: 4px;
    margin-top: 4px;
    vertical-align: bottom;

    &.active {
      background-color: rgba(51, 122, 183, 0.2);
      border-radius: 6px;
    }

    > :deep(.van-radio__icon) {
      display: inline-block;
      width: auto;
      vertical-align: bottom;
    }

    .component-single-choice-item-image {
      object-fit: cover;
      width: 100%;
      max-height: 200px;
      margin-top: 8px;
      // border: 1px solid #DDD;
      border-radius: 4px;
      // padding: 6px;
    }
  }

}

.component-single-choice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  // 打印模式
  > .component-item-single-choice-printmode {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 40px;
    margin-top: 10px;

    > .single-choice-option {
      display: inline-flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      > .single-choice-option-checkbox {
        display: inline-block;
        width: 32px;
        height: 32px;
        border: @print-border;
        margin-right: 2mm;
        transform: scale(0.5);
      }
    }
  }

  > :deep(.component-item-label) {
    width: 100%;
    margin-bottom: 0px !important;
  }

  :deep(.van-radio-group) {

    > .van-radio {
      align-items: flex-start;
    
      > .van-radio__label {

        .mobile-style({
          width: 100%;
        });
      }
    }
  }

  :deep(.component-single-choice-else) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;

    > span {
      flex-shrink: 0;
      flex-grow: 0;
      line-height: 20px;
    }

    > .component-single-choice-else-textbox {
      flex-shrink: 1;
      flex-grow: 1;
      display: block;
      width: 100%;
      padding-left: 4px;
      margin-top: 4px;
      // margin-left: 12px;
      border: 1px solid #CCC;
      border-radius: 3px;
      height: 24px;
      line-height: 24px;
    }
  }
}

.van-radio-group {

  > .van-radio {
    margin-top: 10px;
  }
}
</style>