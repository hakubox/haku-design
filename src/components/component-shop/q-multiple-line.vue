<template>
  <q-basic
    class="component-item-multiple"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
  >
    <textarea type="text" :disabled="disabled" :placeholder="placeholder" :style="{ minHeight: editorHeight }" :value="value" @input="changeValue"></textarea>
    <span v-if="max" class="component-item-multiple-count-suffix">{{ value.length }}/{{ max }}</span>
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import { getQBasicProps } from '@/tools/common';

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  component: {
    type: Object,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  max: {
    type: Number,
  },
  margin: {
    type: Array,
    default: () => ([0,0,0,0])
  },
  /** 编辑框高度 */
  editorHeight: {
    type: String,
    default: '100px',
  }
});

const emit = defineEmits<{
  (event: 'update:value', val: any): void;
}>();

const changeValue = (e) => {
  emit('update:value', e.target.value);
}
</script>

<style lang="less" scoped>
  @import '/src/assets/less/variable.less';

  .component-item-multiple {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > textarea {
      min-width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      border: 1px solid @q-border-color;
      background-color: @q-bg-color;
      padding: 5px 10px;
      border-radius: 6px;
    }

    > .component-item-multiple-count-suffix {
      pointer-events: none;
      user-select: none;
      position: absolute;
      bottom: 15px;
      right: 15px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
</style>