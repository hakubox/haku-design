<template>
  <ConfigProvider v-bind="globalState.antdConfigProvider">
    <router-view />
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { state as globalState } from '@haku-design/global';
import { ConfigProvider } from 'ant-design-vue';
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
