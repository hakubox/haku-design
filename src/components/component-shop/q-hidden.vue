<template>
  <ComponentBasic class="component-item-single" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <input type="type" :value="value" />
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { getQBasicProps } from '@/tools/common';

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
});

const state = reactive({
  inputValue: '',
});

const emit = defineEmits<{
  (event: 'update:value', val: string): void;
}>();

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-item-single {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid @q-border-color;
    background-color: @q-bg-color;
    padding: 5px 10px;
    border-radius: 6px;
  }
}
</style>
