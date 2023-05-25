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
        <GeneralEditor
          :model="editorState.appConfig"
          :propertys="state.pageConfigProps"
          :groups="state.pageGroups"
          @change="changePageProps"
          v-if="!editorState.currentSelectedComponentPropertyGroups.length"
        />
        <PropertyEditor v-else />
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
import { onMounted, reactive, ref, watch } from 'vue';
import { state as editorState } from '@/modules/editor-module';
import PropertyEditor from '@/components/module/config-panel/property-config/PropertyEditor.vue';
import EventConfig from '@/modules/event-module/component/EventConfig.vue';
import { Drawer, TabPane, Tabs, Button } from 'ant-design-vue';
import { GeneralProperty } from '@/@types';
import { getAppConfigPropertys } from "@/data/app-config";
import bus from '@/tools/bus';
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';

const state = reactive({
  /** 选择项 */
  activeKey: 'prop',
  /** 是否显示全局事件弹出框 */
  showGlobalEventDialog: false,
  /** 页面分组 */
  pageGroups: [] as { title: string, name: string }[],
  /** 页面配置属性列表 */
  pageConfigProps: [] as GeneralProperty[]
});

const eventConfig = ref<typeof EventConfig>();

/** 预览配置属性栏 */
const setPageConfigProps = () => {
  state.pageConfigProps = getAppConfigPropertys(editorState.appConfig.appType);
  state.pageGroups = [
    { title: '应用配置', name: 'basic' },
    { title: '画布配置', name: 'canvas' },
    { title: '问卷配置', name: 'questionnaire' },
    { title: '问卷记时配置', name: 'time' },
    { title: '问卷维度配置', name: 'dimension' },
    { title: '问卷特殊页配置', name: 'page' },
    { title: '问卷底部按钮配置', name: 'bottom' },
  ].filter(i => state.pageConfigProps.some(o => o.group === i.name));
};

const changePageProps = (val: Record<string, any>, prop: GeneralProperty, propMap: any, model?: Record<string, any> | undefined) => {
  if (prop.names && Array.isArray(prop.names[0]) && prop.names[0]?.includes('width')) {
    bus.$emit('onRefresh');
  }
}

/** 切换右侧主Tabs */
const changeMainPropertyPanel = (e) => {
  editorState.bus.$emit('prop_change');
};

watch(() => editorState.appConfig.appType, () => {
  setPageConfigProps();
});

onMounted(() => {
  setPageConfigProps();
});
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
