<template>
  <div class="logo-component">
    <img :src="props.image" />
    <label>{{ props.text }}</label>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'LOGO'
  },
  image: {
    type: String,
    default: ''
  }
});
</script>
<style lang="less">
.logo-component {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: red;
}
</style>