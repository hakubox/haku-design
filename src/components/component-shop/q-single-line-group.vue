<template>
  <ComponentBasic class="component-single-group" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <div class="component-single-group-item" v-for="(item, index) in options" :key="index">
      <label>{{ item.label }}</label>
      <input
        type="text"
        :placeholder="placeholder"
        :disabled="disabled || item.disabled"
        :maxlength="maxlength"
        :value="value[index]"
        @input="changeValue($event, index)"
      />
    </div>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { PropType, reactive, defineOptions } from 'vue';
import { getQBasicProps } from '@/tools/common';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
  maxlength: {
    type: Number,
    default: -1,
  },
});

const emit = defineEmits<{
  (event: 'update:value', val: any[]): void;
}>();

const state = reactive({

});

const changeValue = (val, index: number) => {
  const vals = new Array(props.options.length).fill('');
  for (let i = 0; i < props.value.length; i++) {
    vals[i] = props.value[i];
  }
  vals[index] = val.target.value;
  emit('update:value', vals);
}
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-single-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > .component-single-group-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 0px 5px 10px;

    > input {
      border: 1px solid @q-border-color;
      background-color: @q-bg-color;
      padding: 5px 10px;
      border-radius: 6px;
    }
  }

  > input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid @primary-color;
  }
}
</style>
