<template>
  <q-basic class="component-item-single" v-bind.prop="getQBasicProps({ ...props, ...$attrs })">
    <input type="text" :value="value" @input="changeValue" />
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script lang="ts" setup>
import { useAttrs, onMounted, PropType, reactive, watch } from 'vue';
import { getQBasicProps } from '@/tools/common';

const props = defineProps({
  value: {
      type: String,
      default: '',
    },
    component: {
      type: Object,
      default: () => ({}),
    },
});

const state = reactive({
  inputValue: '',
});

const emit = defineEmits<{
  (event: 'update:value', val: string): void;
}>();

const changeValue = (e) => {
  emit('update:value', e.target.value);
}

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-item-single {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid @q-border-color;
    background-color: @q-bg-color;
    padding: 5px 10px;
    border-radius: 6px;
  }
}
</style>
