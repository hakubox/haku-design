<template>
  <Switch
    v-if="!attrs.confirm"
    class="switch-editor"
    :checked="value"
    :checkedChildren="checkedChildren"
    :unCheckedChildren="unCheckedChildren"
    @change="change"
  />
  <Popconfirm v-else placement="topRight" @confirm="change(!value)">
    <template #title>
      <p>{{ typeof attrs.confirm === 'function' ? (attrs.confirm as Function)(value) : attrs.confirm }}</p>
    </template>
    <Switch
      class="switch-editor"
      :checked="value"
      :checkedChildren="checkedChildren"
      :unCheckedChildren="unCheckedChildren"
      @change="change"
    />
  </Popconfirm>
</template>

<script lang="ts" setup>
import { Popconfirm, Switch } from 'ant-design-vue';
import { PropType } from 'vue';

const props = defineProps({
  attrs: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  value: {
    type: Boolean,
    default: false,
    required: true,
  },
  checkedChildren: {
    type: String,
    default: '是',
  },
  unCheckedChildren: {
    type: String,
    default: '否',
  },
});

const emit = defineEmits<{
  (event: 'update:value', val: boolean): void;
  (event: 'change', val: boolean): void;
}>();

/** 改变值 */
const change = (val) => {
  emit('update:value', val);
  emit('change', val);
};
</script>

<style lang="less" scoped>
.switch-editor {

  &.ant-switch-checked {
    background-color: var(--primary-color);
  }
}
</style>
