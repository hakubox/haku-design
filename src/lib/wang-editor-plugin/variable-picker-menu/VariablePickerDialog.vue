<template>
  <Modal
    title="选择变量"
    :width="600"
    :visible="state.visible"
    @cancel="onClose"
    @ok="onSubmit"
    ref="variableModal"
    cancelText="取消"
    okText="确认"
  >
    <VariablePicker @change="change"></VariablePicker>
  </Modal>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, onUnmounted } from "vue";
import bus, { GlobalBusType } from '@/tools/bus';
import { Modal } from 'ant-design-vue';
import VariablePicker from '@/components/editor/variable-picker/VariablePicker.vue';

const emit = defineEmits<{
  (eventName: 'update:visible', isShow: boolean): void;
}>();

const variableModal = ref<typeof Modal>();

const state = reactive({
  /** 是否显示 */
  visible: true,
  /** 变量值 */
  value: '',
  /** 是否加载中 */
  isLoading: false,
});

/** 选择值 */
const change = (val) => {
  state.value = val.value;
};

const onClose = () => {
  // emit('update:visible', false);
  state.visible = false;
};

const onSubmit = () => {
  bus.$emit(GlobalBusType.variablePickerSelect, state.value);
  state.visible = false;
  variableModal.value?.unmounted?.();
}

bus.$on(GlobalBusType.variablePickerShow, (val) => {
  state.visible = val ?? true;
});

watch(() => state.visible, (count, prevCount) => {
  if (count) {
  }
})

onUnmounted(() => {
  state.visible = false;
});
</script>

<style lang="less">
</style>