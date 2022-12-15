<template>
  <GeneralEditor
    :model="editorState.appConfig"
    :groups="state.groups"
    :propertys="formConfigs"
    :labelWidth="props.labelWidth"
    @beforeChange="beforeChange"
  ></GeneralEditor>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as historyState, service as historyService } from '@/common/history-module';
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';
import { formConfigs } from '@/data/app-config';

const props = defineProps({
  /** 标签宽度 */
  labelWidth: {
    type: String,
    default: '110px'
  }
});

const state = reactive({
  groups: [
    { title: '基础配置', name: 'basic', icon: '' },
    { title: '记时配置', name: 'time', icon: '' },
    { title: '维度配置', name: 'dimension', icon: '' },
    { title: '特殊页配置', name: 'page', icon: '' },
    { title: '底部按钮配置', name: 'bottom', icon: '' },
  ],
});

const beforeChange = (value, prop, propertys, model) => {
  if (value?.target) return;
  historyService.exec('set-global-config', {
    objectId: 'global',
    attrs: {
      model: editorState.appConfig,
      property: prop,
      propertyName: prop.name,
      propertyTitle: prop.title,
    },
    value,
    oldValue: editorState.appConfig[prop.name]
  });
}
</script>
