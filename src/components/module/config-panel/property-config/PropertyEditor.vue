<template>
  <div class="property-collapse">
    <div
      class="property-collapse-item"
      v-for="(propGroup, index) in editorState.currentSelectedComponentPropertyGroups"
      :key="'p' + index"
    >
      <label class="property-collapse-item-title">
        <!-- <DownOutlined /> -->
        {{propGroup.title}}
      </label>
      <div class="property-collapse-item-content">
        
        <PropertyEditorDetail
          :prop="prop"
          :propertyEditors="state.propertyEditors"
          @change="propAttaChangeListener"
          v-for="prop in propGroup.propertys.filter(i => i.visible !== false)"
        />

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { state as editorState, service as editorService } from "@/modules/editor-module";
import { initPropertyEditors } from '@/data/property-editor';
import type { Component, ComponentGroup } from "@haku-design/core";
import { Modal } from "ant-design-vue";
import PropertyEditorDetail from './PropertyEditorDetail.vue';

const state = reactive({
  /** 默认属性编辑器哈希表 */
  propertyEditors: initPropertyEditors(),
});

/** 附加属性修改触发的事件 */
const propAttaChangeListener = (value, prop, propMap, components: (Component | ComponentGroup)[]) => {
  if (prop) {
    if (value?.target) {
      console.warn('属性值包含val.target', value);
      return;
    }
    if (components.length) {
      for (let i = 0; i < components.length; i++) {
        components[i].attrs['__' + prop.name] = value;
      }
    }
    if (prop?.change) {
      return prop.change.call(this, prop, propMap, components, value, (editorState.componentCanvas as any).$refs);
    }
  }
};
</script>

<style lang="less" scoped>
.fullscreen-wrap {
}
.prop-tool-btn {
  width: 24px;
  height: 24px;
  margin-left: 8px;

  + .ant-btn-group {
    margin-left: 8px;
  }
}
// :deep(.ant-btn-sm) {
//   padding: 0;
// }
</style>