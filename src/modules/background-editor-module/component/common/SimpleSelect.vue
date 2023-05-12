<template>
  <div class="select-dropdown" :class="{
    open: state.visible
  }">
    <div
      class="select-option"
      :class="[props.optionClass, {
        active: item.value === props.value
      }]"
      :value="item.value"
      :title="item.label"
      v-for="item in props.options"
    >
      <span class="select-option-icon"><i class="iconfont icon-duigou"></i></span>
      <span class="select-option-text">{{ item.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, type PropType } from 'vue';

const props = defineProps({
  /** 选项列表 */
  options: {
    type: Array as PropType<{ label: string, value: string }[]>,
  },
  optionClass: {
    type: String,
  },
  /** 值 */
  value: {
    type: String,
    required: true
  }
});

const value = () => {

};

const state = reactive({
  visible: false,
});

/** 打开下拉框 */
const open = () => {
  state.visible = true;
}

defineExpose({
  open,
})

</script>

<style lang="less" scoped>
// 下拉框
.select-dropdown {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  top: 0px;
  left: 0px;

  > .select-option {
    position: relative;
    display: block;
    white-space: nowrap;
    padding: 4px 12px;

    &.active {

      > .select-option-icon {
        visibility: visible;
      }
    }

    > .select-option-icon {
      visibility: hidden;
    }

    > .select-option-text {
      color: #666;
    }
  }
}
</style>