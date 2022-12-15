<template>
  <div class="text-label" :class="{ disabled: $attrs.disabled }">
    <label class="text-label-content">{{ props.value }}</label>
    <div class="text-label-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.text-label {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  border-radius: 3px;
  height: 30px;
  width: calc(100%);
  transition: 0.3s;
  padding-left: 8px;

  > .text-label-content {
    color: #666;
    font-size: 13px;
  }

  > .text-label-suffix {
    flex-shrink: 0;
    flex-grow: 0;
    position: block;
    top: 0px;
    right: 12px;
    color: #bbb;
    font-size: 12px;
    display: inline-block;
    vertical-align: top;
    line-height: 24px;
    margin-left: 5px;
  }
}
</style>
