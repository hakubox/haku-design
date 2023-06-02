<template>
  <ConfigProvider v-bind="globalState.antdConfigProvider">
    <router-view />

    <div v-if="bus.isDebug" class="bus-info">
      <div class="bus-info-detail">
        <span>执行事件数</span>
        <span>{{ execEvent }}件</span>
      </div>
      <div class="bus-info-detail">
        <span>禁用事件</span>
        <span>{{ bus.disabledEventList }}</span>
      </div>
      <div class="bus-info-detail" v-for="[key, value] in Object.entries(busEvents)">
        <span>{{ key }}:</span>
        <span>{{ value?.length ?? 0 }}</span>
      </div>
    </div>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { state as globalState } from '@/common/global';
import { ConfigProvider } from 'ant-design-vue';
import bus, { GlobalBusType, busEvents, execEvent } from './tools/bus';
import { toDecimal } from './tools/common';

onMounted(() => {
  document.body.addEventListener('mousedown', () => {
    bus.$emit(GlobalBusType.onBodyMouseDown);
  }, { passive: true });
  document.body.addEventListener('mousemove', (e) => {
    bus.$emit(GlobalBusType.onBodyMouseMove, e);
  }, { passive: true });
  document.body.addEventListener('mouseup', (e) => {
    bus.$emit(GlobalBusType.onBodyMouseUp, e);
  }, { passive: true });
});
</script>

<style lang="less" scoped>
.bus-info {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  top: 100px;
  left: 300px;
  width: 350px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #CCC;
  z-index: 999;

  > .bus-info-detail { 
    width: calc(100% - 10px);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 4px 8px;
  }
}
</style>
