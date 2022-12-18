<template>
  <div class="property-collapse">
    <div
      class="property-collapse-item"
      v-for="(propGroup, index) in groups"
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
          v-for="prop in propertys.filter(i => i.group === propGroup.name && i.visible !== false)"
          :key="Array.isArray(prop.name) ? prop.name.join('.') : prop.name"
          v-show="propShowListener(prop, editorState.currentSelectedComponentPropertyMap, model)"
        >
          <span class="form-design-body-property-item-label" :style="{ minWidth: props.labelWidth }" :class="{ require: prop.require, leaf: prop.leaf }">
            <span class="fullscreen-wrap">
              <span v-html="prop.title + ' '"></span>
              <a-popover v-if="prop.remark" placement="topRight" arrow-point-at-center>
                <template #content>
                  {{prop.remark}}
                </template>
                <template #title>
                  <span>{{prop.title}} {{prop.name}}</span>
                </template>
                <QuestionCircleOutlined style="font-size:12px;color: #AAA;" />
              </a-popover>
            </span>
            <template v-if="prop.layout == 'block' || (prop.attach && prop.attach.length)">
              <a-tooltip
                placement="topRight"
                class="prop-tool-btn"
                arrow-point-at-center
                v-if="prop?.canFullScreen"
              >
                <template #title>最大化</template>
                <a-button size="small" @click="fullScreen(prop, prop)">
                  <fullscreen-outlined size="small" />
                </a-button>
              </a-tooltip>
            </template>
            <!-- <div style="float: right;" v-show="prop.attach">
              <a-button-group size="small">
                <a-button :type="editorState.currentPropertyEditors[prop.name] == prop.editor ? 'primary' : 'default'" value="default" @click="changePropAttach(prop, prop.editor)">常规</a-button>
                <a-button :type="editorState.currentPropertyEditors[prop.name] == attach ? 'primary' : 'default'" v-for="attach in prop.attach" :key="attach" :value="attach" @click="changePropAttach(prop, attach);">{{ editorState.propertyEditors[attach].description }}</a-button>
              </a-button-group>
            </div> -->
          </span>
          <div class="form-design-body-property-item-value">
            <!-- v-show="!prop.attach || !prop.attach.length || (prop.attach && editorState.currentPropertyEditors[prop.name] == prop.editor)" -->
            <GeneralEditorItem
              :model="model"
              :prop="prop"
              :propertys="propertys"
              @change="propChangeListener"
            ></GeneralEditorItem>
            <!-- <component 
              v-if="prop.attach && prop.attach.length && editorState.currentPropertyEditors[prop.name] != prop.editor"
              :is="editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]].component"
              :component="model"
              @focus="editorState.currentProp = prop"
              @change="propChangeListener($event, prop, editorState.currentSelectedComponentPropertyMap, model)"
              v-bind="Object.assign({}, editorState.propertyEditors[editorState.currentPropertyEditors[prop.name]]?.attrs ?? {}, prop.attrs)" 
              v-model:value.lazy="model!.attrs['__' + prop.name]" 
            >
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
            </component> -->
          </div>
          <template v-if="!(prop.layout == 'block' || (prop.attach && prop.attach.length))">
            <a-tooltip placement="topLeft" class="prop-tool-btn" v-if="prop?.canFullScreen">
              <template #title>最大化</template>
              <a-button size="small" @click="fullScreen(prop, prop)">
                <fullscreen-outlined size="small" />
              </a-button>
            </a-tooltip>
          </template>
        </div>
      </div>
    </div>
    <a-modal
      :centered="true" 
      :footer="false"
      :width="'80vw'" 
      :height="'80vh'" 
      :title="state.fullScreenConfig.prop.title" 
      :visible="state.fullScreenConfig.isFullScreen" 
      :destroyOnClose="true"
      @cancel="closeFullScreen"
    >
      <GeneralEditorItem
        :isFullScreen="true"
        :model="model"
        :prop="state.fullScreenConfig.prop"
        :propertys="propertys"
        @change="propChangeListener"
      ></GeneralEditorItem>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, PropType, reactive } from "vue";
import { state as editorState, service as editorService } from "@/modules/editor-module";
import { state as historyState, service as historyService } from "@/common/history-module";
import { Component } from "@/@types/component";
import type { ComponentProperty } from "@/@types/component-property";
import { ComponentPropertyEditor } from "@/@types/enum";
import GeneralEditorItem from './GeneralEditorItem.vue';
import { GeneralProperty } from "@/@types";
import { isBlank, isNotBlank } from "@/tools/common";

const props = defineProps({
  /** 绑定数据 */
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  /** 属性分组 */
  groups: {
    type: Array as PropType<{ title: string, name: string, icon?: string }[]>,
    default: () => []
  },
  /** 属性列表 */
  propertys: {
    type: Array as PropType<GeneralProperty[]>,
    default: () => []
  },
  /** 标签宽度 */
  labelWidth: {
    type: String,
    default: '110px'
  }
});

const state = reactive({
  propertyEditors: null,
  /** 全屏配置 */
  fullScreenConfig: {
    prop: { title: '' } as any,
    value: undefined as any,
    isFullScreen: false,
  },
});

const emit = defineEmits<{
  (event: 'change', val: string): void;
  (event: 'update:model', val: Record<string, any>): void;
  (event: 'beforeChange', val: Record<string, any>, prop: GeneralProperty, propMap, model?: Record<string, any>): void;
  (event: 'change', val: Record<string, any>, prop: GeneralProperty, propMap, model?: Record<string, any>): void;
}>();

const fullScreen = (eidtor: any, prop: any) => {
  state.fullScreenConfig.isFullScreen = true;
  state.fullScreenConfig.prop = prop;
};

const closeFullScreen = ($event) => {
  propAttaChangeListener(props.model[state.fullScreenConfig.prop.name], state.fullScreenConfig.prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponent)
  state.fullScreenConfig.isFullScreen = false;
} 
/** 属性修改触发的事件 */
const propAttaChangeListener = (value, prop, propMap, component?: Component) => {
  if (prop) {
    if (value?.target) {
      console.warn('属性值包含val.target', value);
      return;
    }
    if (component) {
      component.attrs['__' + prop.name] = value;
    }
    if (prop?.change) {
      return prop.change.call(this, prop, propMap, component, value, (editorState.componentCanvas as any).$refs);
    }
  }
};
/** 获取值 */
const getValue = (prop) => {
  if (typeof prop.name === 'string') {
    return props.model[prop.name];
  } else {
    let _value = props.model;
    prop.name.forEach(name => {
      if (_value) _value = _value[name];
    });
    return _value;
  }
};

/** 设置值 */
const setValue = (prop, model, value) => {
  if (typeof prop.name === 'string') {
    if (model[prop.name].type) {
      model[prop.name].value = value;
    } else {
      model[prop.name] = value;
    }
  } else {
    let _value = model;
    for (let i = 0; i < prop.name.length - 1; i++) {
      if (!_value[prop.name[i]]) _value[prop.name[i]] = {};
      if (_value) _value = _value[prop.name[i]];
    }
    if (_value) _value[prop.name[prop.name.length - 1]] = value;
  }
  return model;
};

const init = () => {
  const _model = props.model;
  props.propertys.forEach(prop => {
    const _default = prop.default;
    if (isNotBlank(_default) && isBlank(getValue(prop))) {
      setValue(prop, _model, _default);
    }
  });
};

onMounted(() => {
  init();
});

const propShowListener = (prop, propMap, model?: Record<string, any>) => {
  if (prop?.showCondition && model) {
    return prop.showCondition.call(this, prop, propMap, model, model[prop.name]);
  } else {
    return true;
  }
};

/** 属性修改触发的事件 */
const propChangeListener = (value, prop: GeneralProperty, propMap, model?: Record<string, any>) => {
  if (prop && model) {
    if (value?.target) {
      console.warn('属性值包含val.target', value);
      return;
    }
    let _value = value;
    if (_value.value) _value = _value.value;
    if (_value !== getValue(prop)) {
      // TODO: 需处理propAttrs
      // component.propAttrs[prop.name] = _value;
      const _model = props.model;
      emit('beforeChange', _value, prop, propMap, model);
      setValue(prop, _model, _value);
      emit('update:model', _model);
      // if (prop?.change) {
      //   return prop.change.call(this, prop, propMap, model, _value);
      // }
      emit('change', _value, prop, propMap, model);

      if (prop?.change) {
        return prop.change.call(this, _value, prop, propMap, model);
      }
    }
  }
};

/** 切换附加属性类型 */
const changePropAttach = (prop: GeneralProperty, editor: ComponentPropertyEditor) => {
  // if (this.editorState.currentSelectedComponent) {
  //   this.historyService.redo();
  //   this.editorService.setComponentAttrType(this.editorState.currentSelectedComponent as Component, prop, editor);
  // }
};
</script>

<style lang="less" scoped>
.fullscreen-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
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