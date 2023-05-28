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
          @fullscreen="fullScreen"
          @change="propAttaChangeListener"
          v-for="prop in propGroup.propertys.filter(i => i.visible !== false)"
        />

      </div>
    </div>
    
    <Modal
      :centered="true" 
      :footer="false"
      :width="'80vw'" 
      :height="'80vh'" 
      :title="state.fullScreenConfig.prop.title" 
      :visible="state.fullScreenConfig.isFullScreen" 
      :destroyOnClose="true"
      @cancel="closeFullScreen"
    >
      <PropertyEditorItem
        v-if="!state.fullScreenConfig.prop.attach?.length || !editorState.currentPropertyEditors[state.fullScreenConfig.prop.name] || (state.fullScreenConfig.prop.attach && editorState.currentPropertyEditors[state.fullScreenConfig.prop.name] === state.fullScreenConfig.prop.editor)"
        :prop="state.fullScreenConfig.prop"
        :is-full-screen="true"
      ></PropertyEditorItem>
      <component 
        v-else-if="state.fullScreenConfig.prop.attach && state.fullScreenConfig.prop.attach.length && editorState.currentPropertyEditors[state.fullScreenConfig.prop.name] && editorState.currentPropertyEditors[state.fullScreenConfig.prop.name] !== state.fullScreenConfig.prop.editor"
        :is="editorState.propertyEditors[editorState.currentPropertyEditors[state.fullScreenConfig.prop.name]].component"
        :component="editorState.currentSelectedComponents?.[0]"
        :components="editorState.currentSelectedComponents"
        @focus="editorState.currentProp = state.fullScreenConfig.prop"
        @change="propAttaChangeListener($event, state.fullScreenConfig.prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponents)"
        v-bind="Object.assign({ height: '500px' }, editorState.propertyEditors[editorState.currentPropertyEditors[state.fullScreenConfig.prop.name]]?.attrs ?? {}, state.fullScreenConfig.prop.attrs)" 
        v-model:value.lazy="editorState.currentSelectedComponents[0].attrs['__' + state.fullScreenConfig.prop.name]" 
      >
        {{editorState.propertyEditors[editorState.currentPropertyEditors[state.fullScreenConfig.prop.name]].html}}
        <template v-for="slot in Object.keys(editorState.propertyEditors[editorState.currentPropertyEditors[state.fullScreenConfig.prop.name]].slot)" #[slot]>
          <component 
              v-for="(detailComponent, index3) in editorState.propertyEditors[editorState.currentPropertyEditors[state.fullScreenConfig.prop.name]].slot[slot]" 
              :key="slot + detailComponent.component + index3"
              v-bind="detailComponent.attrs" 
              :is="detailComponent.component" 
          >
            {{detailComponent.html}}
            <template v-for="detailSlot in Object.keys(detailComponent.slot)" #[detailSlot]>
              <component 
                v-for="(detail2Component, index4) in detailComponent.slot[detailSlot]" 
                :key="detailSlot + detail2Component.component + index4"
                v-bind="detail2Component.attrs" 
                :is="detail2Component.component" 
              >
              {{detail2Component.html}}
              </component>
            </template>
          </component>
        </template>
      </component>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { state as editorState, service as editorService } from "@/modules/editor-module";
import { initPropertyEditors } from '@/data/property-editor';
import type { Component, ComponentGroup } from "@/@types";
import { Modal } from "ant-design-vue";
import PropertyEditorItem from './PropertyEditorItem.vue';
import PropertyEditorDetail from './PropertyEditorDetail.vue';

const state = reactive({
  /** 默认属性编辑器哈希表 */
  propertyEditors: initPropertyEditors(),
  /** 全屏配置 */
  fullScreenConfig: {
    prop: { title: '' } as any,
    value: undefined as any,
    isFullScreen: false,
  },
});

const closeFullScreen = ($event) => {
  propAttaChangeListener(editorState.currentSelectedComponents.map(i => i.attrs[state.fullScreenConfig.prop.name]), state.fullScreenConfig.prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponents)
  state.fullScreenConfig.isFullScreen = false;
} 

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

const fullScreen = (eidtor: any, prop: any) => {
  state.fullScreenConfig.isFullScreen = true;
  state.fullScreenConfig.prop = prop;
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