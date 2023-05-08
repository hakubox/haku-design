<template>
  <!-- <Empty v-if="!editorState.currentSelectedComponentPropertyGroups.length" description="暂未选择组件" :style="{ marginTop: '20vh' }"></Empty> -->
  <div class="property-collapse" v-if="!editorState.currentSelectedComponentPropertyGroups.length">
    <GeneralEditor
      :model="editorState.appConfig"
      :propertys="state.pageConfigProps"
      :groups="state.pageGroups"
      @change="changePageProps"
    ></GeneralEditor>
  </div>
  <div class="property-collapse" v-else>
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
        <div
          class="form-design-body-property-item"
          :class="{ 'form-design-body-property-item-block': prop.layout == 'block' || (prop.attach && prop.attach.length) }"
          v-for="prop in propGroup.propertys.filter(i => i.visible !== false)"
          :key="prop.name"
          v-show="propShowListener(prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponents)"
        >
          <span class="form-design-body-property-item-label" :class="{ require: prop.require, leaf: prop.leaf }">
            <div>
              <span>{{prop.title}}&nbsp;</span>
              <Popover v-if="prop.remark" placement="topRight" arrow-point-at-center>
                <template #content>
                  {{prop.remark}}
                </template>
                <template #title>
                  <span>{{prop.title}} {{prop.name}}</span>
                </template>
                <QuestionCircleOutlined style="font-size:12px;color: #AAA;" />
              </Popover>
            </div>
            <div class="form-design-body-property-item-label-tools">
              <template v-if="prop.layout == 'block' || (prop.attach && prop.attach.length)">
                <Tooltip
                  placement="topRight"
                  class="prop-tool-btn"
                  arrow-point-at-center
                  v-if="prop.name === 'label'"
                >
                  <template #title>复制为组件名称</template>
                  <Button size="small" @click="resetComponentName()">
                    <clear-outlined size="small" />
                  </Button>
                </Tooltip>
                <Tooltip
                  placement="topRight"
                  class="prop-tool-btn"
                  arrow-point-at-center
                  v-if="state.propertyEditors[prop.editor]?.canFullScreen"
                >
                  <template #title>最大化</template>
                  <Button size="small" @click="fullScreen(state.propertyEditors[prop.editor], prop)">
                    <FullscreenOutlined :style="{ fontSize: '12px' }" />
                  </Button>
                </Tooltip>
              </template>
              <ButtonGroup v-if="prop.attach" size="small">
                <Button :type="!editorState.currentPropertyEditors[prop.name] || editorState.currentPropertyEditors[prop.name] == prop.editor ? 'primary' : 'default'" value="default" @click="changePropAttach(prop, prop.editor as ComponentPropertyEditor)">常规</Button>
                <Button :type="editorState.currentPropertyEditors[prop.name] == attach ? 'primary' : 'default'" v-for="attach in prop.attach" :key="attach" :value="attach" @click="changePropAttach(prop, attach);">{{ editorState.propertyEditors[attach].description }}</Button>
              </ButtonGroup>
            </div>
          </span>
          <div class="form-design-body-property-item-value">
            <PropertyEditorItem
              v-if="!prop.attach?.length || !editorState.currentPropertyEditors[prop.name] || (prop.attach && editorState.currentPropertyEditors[prop.name] === prop.editor)"
              :prop="prop"
            ></PropertyEditorItem>
            <component 
              v-else-if="prop.attach && prop.attach.length && editorState.currentPropertyEditors[prop.name] && editorState.currentPropertyEditors[prop.name] !== prop.editor"
              :is="editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]].component"
              :component="editorState.currentSelectedComponents?.[0]"
              :components="editorState.currentSelectedComponents"
              @focus="editorState.currentProp = prop"
              @change="propAttaChangeListener($event, prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponents)"
              v-bind="Object.assign({}, editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]]?.attrs ?? {}, prop.attrs)" 
              v-model:value.lazy="editorState.currentSelectedComponents[0].attrs['__' + prop.name]"
            >
              <!-- TODO: 需要处理值改变问题 v-model:value.lazy 怎样处理 -->
              {{editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]].html}}
              <template v-for="slot in Object.keys(editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]].slot)" #[slot]>
                <component 
                    v-for="(detailComponent, index3) in editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]].slot[slot]" 
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
          </div>
          <template v-if="!(prop.layout == 'block' || (prop.attach && prop.attach.length))">
            <Tooltip placement="topLeft" class="fullscreen" v-if="state.propertyEditors[prop.editor]?.canFullScreen">
              <template #title>最大化</template>
              <Button size="small" @click="fullScreen(state.propertyEditors[prop.editor], prop)">
                <FullscreenOutlined :style="{ fontSize: '12px' }" />
              </Button>
            </Tooltip>
          </template>
        </div>
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
import { computed, onMounted, reactive, watch } from "vue";
import { state as editorState, service as editorService } from "@haku-design/editor";
import { service as historyService } from "@haku-design/history";
import { type ComponentProperty, initPropertyEditors, ComponentPropertyEditor, getAppConfigPropertys } from "@haku-design/core";
import PropertyEditorItem from './PropertyEditorItem.vue';
import type { Component, ComponentGroup, GeneralProperty } from "@haku-design/core";
import { Button, ButtonGroup, Empty, Modal, Popover, Tooltip } from "ant-design-vue";
import { FullscreenOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import bus from '@haku-design/common/src/tools/bus';
import GeneralEditor from '@haku-design/core/src/components/general-config/GeneralEditor.vue';

const state = reactive({
  /** 默认属性编辑器哈希表 */
  propertyEditors: initPropertyEditors(),
  /** 全屏配置 */
  fullScreenConfig: {
    prop: { title: '' } as any,
    value: undefined as any,
    isFullScreen: false,
  },
  /** 页面分组 */
  pageGroups: [] as { title: string, name: string }[],
  /** 页面配置属性列表 */
  pageConfigProps: [] as GeneralProperty[]
});

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

const propShowListener = (prop, propMap, components: (Component | ComponentGroup)[]) => {
  if (prop?.showCondition && components.length) {
    // TODO: 待处理，第五个参数需要确认怎样处理
    if (components.length === 1) {
      return prop.showCondition.call(this, prop, propMap, components, components[0].attrs[prop.name], (editorState.componentCanvas as any).$refs);
    } else {
      return prop.showCondition.call(this, prop, propMap, components, undefined, (editorState.componentCanvas as any).$refs);
    }
  } else {
    return true;
  }
};

/** 切换附加属性类型 */
const changePropAttach = (prop: ComponentProperty, editor: ComponentPropertyEditor) => {
  if (editorState.currentSelectedComponents.length) {
    historyService.redo();
    editorState.currentSelectedComponents.forEach(component => {
      if (!component.isGroup) {
        editorService.setComponentAttrType(component, prop, editor);
      }
    });
  }
};

/** 将当前组件标题设为组件名称 */
const resetComponentName = () => {
  if (editorState.currentSelectedComponents.length) {
    const _component = editorState.currentSelectedComponents[0];
    if (_component && _component.attrs.label !== undefined) {
      const _dom = document.createElement('div');
      _dom.innerHTML = _component.attrs.label;
      _component.attrs.name = _dom.innerText;
      _dom.remove();
    }
  }
}

const fullScreen = (eidtor: any, prop: any) => {
  state.fullScreenConfig.isFullScreen = true;
  state.fullScreenConfig.prop = prop;
};

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

watch(() => editorState.appConfig.appType, () => {
  setPageConfigProps();
});

onMounted(() => {
  setPageConfigProps();
});
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
:deep(.ant-btn-sm) {
    padding: 0;
}
</style>