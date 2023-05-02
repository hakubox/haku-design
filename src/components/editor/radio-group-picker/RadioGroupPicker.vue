<template>
  <div class="radio-group-picker">
    <RadioGroup v-model:value="state.inputValue" :size="($attrs.size as any)" :buttonStyle="($attrs.buttonStyle as any)" @change="onChange">
      <RadioButton v-for="item in ($attrs.options as any[])" :key="item.value" :value="item.value">{{
        item.label
      }}</RadioButton>
    </RadioGroup>
  </div>
</template>

<script lang="ts" setup>
import { RadioButton, RadioGroup } from 'ant-design-vue';
import { onMounted, reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (event: 'update:value', val: string): void;
  (event: 'change', val: string): void;
}>();

const state = reactive({
  inputValue: '',
});

/** 改变值 */
const onChange = () => {
  emit('update:value', state.inputValue);
  emit('change', state.inputValue);
};

onMounted(() => {
  state.inputValue = props.value;
});

watch(() => props.value, (val, oldVal) => {
  if (val !== state.inputValue) {
    state.inputValue = props.value;
  }
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.radio-group-picker {

  > .ant-radio-group-solid {
    vertical-align: middle;
    margin-top: -3px;
  }
}
</style>
