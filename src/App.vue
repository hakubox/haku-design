<template>
  <a-config-provider v-bind="globalState.antdConfigProvider">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { state as globalState } from '@/common/global';
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
