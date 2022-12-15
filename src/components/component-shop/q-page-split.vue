<template>
  <q-basic
    class="component-page-split"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    label="分页器"
  ></q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import { getQBasicProps } from '@/tools/common';

const props = defineProps({
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  }
});
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

.component-page-split {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;

  &:before {
    content: '';
    position: absolute;
    top: 22px;
    left: 10px;
    width: calc(50% - 40px);
    border-top: 1px solid #ddd;
  }

  &:after {
    content: '';
    position: absolute;
    top: 22px;
    right: 10px;
    width: calc(50% - 40px);
    border-top: 1px solid #ddd;
  }

  > .component-item-label {
    display: block;
    width: 100%;
    text-align: center;
    line-height: 15px;
    margin-bottom: 0px !important;
    color: #aaa;
  }
}
</style>
