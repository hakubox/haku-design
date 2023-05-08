<template>
  <GeneralEditor
    :model="editorState.appConfig"
    :groups="state.groups"
    :propertys="state.formConfigs"
    :labelWidth="props.labelWidth"
    @beforeChange="beforeChange"
  ></GeneralEditor>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { state as editorState, service as editorService } from '@haku-design/editor';
import { state as historyState, service as historyService } from '@haku-design/history';
import GeneralEditor from '@haku-design/core/src/components/general-config/GeneralEditor.vue';
import { getAppConfigPropertys, type GeneralProperty } from '@haku-design/core';

const props = defineProps({
  /** 标签宽度 */
  labelWidth: {
    type: String,
    default: '110px'
  }
});

const state = reactive({
  groups: [] as { title: string, name: string }[],
  defaultGroups: [
    { title: '应用配置', name: 'basic' },
    { title: '画布配置', name: 'canvas' },
    { title: '问卷配置', name: 'questionnaire' },
    { title: '问卷记时配置', name: 'time' },
    { title: '问卷维度配置', name: 'dimension' },
    { title: '问卷特殊页配置', name: 'page' },
    { title: '问卷底部按钮配置', name: 'bottom' },
  ],
  formConfigs: [] as GeneralProperty[]
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

watch(() => editorState.appConfig.appType, () => {
  state.formConfigs = getAppConfigPropertys(editorState.appConfig.appType);
  state.groups = state.defaultGroups.filter(i => state.formConfigs.some(o => o.group === i.name));
});

onMounted(() => {
  state.formConfigs = getAppConfigPropertys(editorState.appConfig.appType);
  state.groups = state.defaultGroups.filter(i => state.formConfigs.some(o => o.group === i.name));
});

</script>
