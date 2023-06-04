<template>
  <div>
    <RadioGroup
      class="radio-group-picker"
      v-model:value="state.inputValue"
      :size="props.size"
      :buttonStyle="props.buttonStyle"
      @change="onChange"
    >
      <RadioButton v-for="item in props.options" :key="item.value" :value="item.value">{{
        item.label
      }}</RadioButton>
    </RadioGroup>
  </div>
</template>

<script lang="ts" setup>
import { RadioButton, RadioGroup } from 'ant-design-vue';
import { PropType, onMounted, reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small'
  },
  buttonStyle: {
    type: String,
    default: 'solid'
  },
  options: {
    type: Array as PropType<{ label: string, value: string }[]>,
    default: () => []
  }
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
.radio-group-picker {
  vertical-align: middle;
  margin-top: -3px;

  > .ant-radio-group-solid {
    > .ant-radio-button-wrapper-checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
}
</style>
