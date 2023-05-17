<template>
  <ComponentBasic class="component-dropdown" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div class="component-dropdown-input" :disabled="props.disabled" @click="showDialogPicker()">
      <span v-if="props.value">{{ props.value }}</span>
      <span class="placeholder" v-else>{{ props.placeholder }}</span>
    </div>
    <Popup v-model:show="state.showPicker" round position="bottom">
      <Picker
        :columns="props.options.map((i) => i['label'])"
        @cancel="state.showPicker = false"
        @confirm="onConfirm"
      />
    </Popup>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { PropType, reactive, defineOptions } from 'vue';
import { getQBasicProps } from '@/tools/common';
import { Picker, Popup } from 'vant';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  value: {
    type: String,
    default: '',
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
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (event: 'update:value', value: any): void;
}>();

const onConfirm = (val) => {
  state.showPicker = false;
  emit('update:value', val);
};

const showDialogPicker = () => {
  if (!props.disabled) {
    state.showPicker = true;
  }
};

const state = reactive({
  /** 是否显示弹出框 */
  showPicker: false,
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-dropdown {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > .component-dropdown-input {
    position: relative;
    height: 34px;
    line-height: 32px;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 30px 0px 10px;
    background-color: white;
    border: 1px solid @q-border-color;
    background-color: @q-bg-color;
    border-radius: 6px;

    > .placeholder {
      color: #969799;
    }

    &:before {
      position: absolute;
      content: '\e65e';
      font: normal normal normal 14px/1 'vant-icon';
      right: 8px;
      top: 9px;
    }
  }
}

.van-radio-group {
}
</style>
