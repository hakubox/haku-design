<template>
  <div class="radio-group-picker">
    <a-radio-group v-model:value="inputValue" :size="$attrs.size" :buttonStyle="$attrs.buttonStyle" @change="onChange">
      <a-radio-button v-for="item in ($attrs.options as any[])" :key="item.value" :value="item.value">{{
        item.label
      }}</a-radio-button>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';

export default defineComponent({
  name: 'RadioGroupPicker',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  unmounted() {
    // if (this.inputValue != this.value) {
    //   this.$emit('change', this.inputValue);
    // }
  },
  setup(props, { emit }) {
    let state = reactive({
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

    watch(
      () => props.value,
      (val, oldVal) => {
        if (val !== oldVal && val !== state.inputValue) {
          state.inputValue = props.value;
        }
      },
    );

    return {
      ...toRefs(state),
      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.radio-group-picker {
}
</style>
