<template>
  <div>
    <a-switch
      v-if="!attrs.confirm"
      :checked="value"
      :checkedChildren="checkedChildren"
      :unCheckedChildren="unCheckedChildren"
      @change="change"
    />
    <a-popconfirm v-else placement="topRight" @confirm="change(!value)">
      <template #title>
        <p>{{ typeof attrs.confirm === 'function' ? (attrs.confirm as Function)(value) : attrs.confirm }}</p>
      </template>
      <a-switch checkedChildren="开" unCheckedChildren="关" :checked="value" />
    </a-popconfirm>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'SwitchEditor',
  props: {
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
  },
  computed: {},
  methods: {
    /** 改变值 */
    change(val) {
      this.$emit('update:value', val);
      this.$emit('change', val);
    },
  },
  setup() {},
});
</script>

<style lang="less" scoped></style>
