<template>
  <div class="select-dropdown" :class="[props.location, {
    open: props.visible
  }]">
    <template v-for="item in props.options">
      <div class="select-option-split" v-if="item.type === 'split'"></div>
      <div
        class="select-option"
        :class="[props.optionClass, {
          active: item.value === props.value
        }]"
        :value="item.value"
        :title="item.label"
        @click="clickItem(item)"
        v-else
      >
        <span class="select-option-icon"><i class="iconfont icon-duigou"></i></span>
        <span class="select-option-text">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive, type PropType, nextTick } from 'vue';

const props = defineProps({
  /** 选项列表 */
  options: {
    type: Array as PropType<{ type: string, label: string, value: string }[]>,
  },
  optionClass: {
    type: String,
  },
  /** 值 */
  value: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    required: true,
  },
  /** 位置 */
  location: {
    type: String as PropType<'top-right'>,
    default: 'top-right'
  }
});

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'update:value', value: string): void;
  (event: 'change', value: string): void;
}>();

const value = () => {

};

const state = reactive({
});

/** 打开下拉框 */
const open = () => {
  emit('update:visible', true);
}

/** 关闭下拉框 */
const close = () => {
  emit('update:visible', false);
}

const clickItem = (item: { label: string, value: string }) => {
  emit('update:value', item.value);
  emit('change', item.value);
  setTimeout(() => {
    emit('update:visible', false);
  }, 10);
};

defineExpose({
  open,
  close
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
  background-color: white;
  box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.2);
  padding: 3px;
  border-radius: 4px;
  z-index: 9;

  visibility: hidden;
  transform: translateY(-10px);
  opacity: 0.0;
  transition: 0.15s;

  &.open {
    visibility: visible;
    opacity: 1.0;
    transform: translateY(0px);
  }
  
  &.top-right {
    top: 100%;
    right: 0px;
  }

  > .select-option-split {
    cursor: default;
    position: relative;
    display: block;
    margin-top: 6px;
    border-top: 1px solid #F5F5F5;
    padding-top: 6px;
    width: 100%;
  }

  > .select-option {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    padding: 4px 12px;
    border-radius: 4px;
    height: 28px;
    width: 100%;
    font-size: 12px;

    &.active {
      background-color: #d7dffe;

      > .select-option-icon {
        visibility: visible;
      }
    }

    &:hover {
      background-color: #4667E6;

      > .select-option-icon {
        color: white;
      }
      > .select-option-text {
        color: white;
      }
    }

    > .select-option-icon {
      visibility: hidden;
      margin-right: 8px;

      > .iconfont {
        font-size: 14px;
        transform: scale(0.8);
      }
    }

    > .select-option-text {
      color: #666;
    }
  }
}
</style>