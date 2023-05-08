<template>
  <div class="design-form-property" style="width: 500px">
    <Tabs
      v-model:activeKey="state.activeKey"
      type="card"
      defaultActiveKey="prop"
      @change="changeMainPropertyPanel($event)"
    >
      <TabPane key="prop">
        <template #tab><ProfileOutlined />属性</template>
        <PropertyEditor></PropertyEditor>
      </TabPane>
      <TabPane key="event">
        <template #tab><span><ThunderboltOutlined />逻辑</span></template>
        <EventConfig :target="editorState.currentSelectedFirstComponentId"></EventConfig>
      </TabPane>

      <template #rightExtra>
        <div class="global-event-btns">
          <Button v-if="state.activeKey === 'event'" type="primary" @click="state.showGlobalEventDialog = true">全局逻辑</Button>
        </div>
      </template>
    </Tabs>

    <Drawer
      title="全局逻辑配置"
      width="800px"
      :bodyStyle="{ padding: '5px' }"
      v-model:visible="state.showGlobalEventDialog"
    >
      <EventConfig ref="eventConfig" target="global"></EventConfig>
      <template #extra>
        <Button type="primary" @click="eventConfig?.addNewEvent">
          <template #icon><PlusOutlined /></template>
          添加逻辑
        </Button>
      </template>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { state as editorState } from '@haku-design/editor';
import PropertyEditor from '@/components/module/config-panel/property-config/PropertyEditor.vue';
import EventConfig from '@haku-design/event/src/component/EventConfig.vue';
import { Drawer, TabPane, Tabs, Button } from 'ant-design-vue';

const state = reactive({
  /** 选择项 */
  activeKey: 'prop',
  /** 是否显示全局事件弹出框 */
  showGlobalEventDialog: false,
});

const eventConfig = ref<typeof EventConfig>();

/** 切换右侧主Tabs */
const changeMainPropertyPanel = (e) => {
  editorState.bus.$emit('prop_change');
};
</script>
<style lang="less">
.global-event-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f1f1f5;
  padding-right: 10px;
  height: 40px;
}
</style>
