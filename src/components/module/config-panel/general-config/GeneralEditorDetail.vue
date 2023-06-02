<template>
  <div
    class="attr-editor-item"
    :class="{
      block: prop.layout == 'block' || prop.attach?.length,
      parent: prop.children?.length,
      expand: prop.children?.length && getVal(props.model, prop)
    }"
    v-show="propShowListener(prop, editorState.currentSelectedComponentPropertyMap, model)"
  >
    <div class="attr-editor-item-panel" @click="parentExpand(prop)">
      <Switch v-if="prop.children?.length" :checked="getVal(props.model, prop)" size="small" />
      <span
        class="attr-editor-item-label"
        :style="{ minWidth: props.labelWidth }"
        :class="{
          require: prop.require,
          leaf: prop.leaf
        }"
      >
        <span>{{ prop.title }}</span>
        <Popover v-if="prop.remark" placement="topRight" arrow-point-at-center>
          <template #content>
            {{prop.remark}}
          </template>
          <template #title>
            <span>{{prop.title}} {{prop.name}}</span>
          </template>
          <QuestionCircleOutlined style="font-size:12px;color: #AAA;" />
        </Popover>
        <template v-if="prop.layout == 'block' && (prop.attach?.length || getTools(prop.editor).length)">
            
          <div
            class="btn-tool"
            :tooltip="tool.tooltip"
            v-for="tool in getTools(prop.editor)"
            @click="tool.click($event, editorState.currentSelectedComponents, prop)"
          ><i :class="tool.icon"></i></div>

          <Tooltip
            placement="topRight"
            class="prop-tool-btn"
            arrow-point-at-center
            v-if="prop?.canFullScreen"
          >
            <template #title>最大化</template>
            <Button size="small" @click="fullScreen(prop, prop)">
              <FullscreenOutlined :style="{ fontSize: '12px' }" />
            </Button>
          </Tooltip>
        </template>
        <!-- <div style="float: right;" v-show="prop.attach">
          <ButtonGroup size="small">
            <Button :type="editorState.currentPropertyEditors[prop.name] == prop.editor ? 'primary' : 'default'" value="default" @click="changePropAttach(prop, prop.editor)">常规</Button>
            <Button :type="editorState.currentPropertyEditors[prop.name] == attach ? 'primary' : 'default'" v-for="attach in prop.attach" :key="attach" :value="attach" @click="changePropAttach(prop, attach);">{{ editorState.propertyEditors[attach].description }}</Button>
          </ButtonGroup>
        </div> -->
      </span>
      <div class="attr-editor-item-value">
        <!-- v-show="!prop.attach || !prop.attach.length || (prop.attach && editorState.currentPropertyEditors[prop.name] == prop.editor)" -->
        <GeneralEditorItem
          v-if="!prop.children?.length"
          :model="model"
          :prop="prop"
          :propertys="props.propertys"
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
      <template v-if="!(prop.layout === 'block' && prop.attach?.length)">
        <Tooltip placement="topLeft" class="prop-tool-btn" v-if="prop?.canFullScreen">
          <template #title>最大化</template>
          <Button size="small" @click="fullScreen(prop, prop)">
            <FullscreenOutlined :style="{ fontSize: '12px' }" />
          </Button>
        </Tooltip>
      </template>
    </div>

    <!-- 子属性列表 -->
    <div class="attr-editor-children" v-if="prop.children?.length">
      <GeneralEditorDetail
        :model="model"
        :prop="detailProp"
        :propertys="propertys"
        @change="propChangeListener"
        v-for="detailProp in prop.children"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, reactive } from "vue";
import { state as editorState } from "@/modules/editor-module";
import { Component } from "@/@types/component";
import { ComponentPropertyEditor } from "@/@types/enum";
import GeneralEditorItem from './GeneralEditorItem.vue';
import { initPropertyEditors } from '@/data/property-editor';
import { ComponentGroup, GeneralProperty } from "@/@types";
import { isBlank, isNotBlank } from "@/tools/common";
import { Button, Switch, Popover, Tooltip } from "ant-design-vue";
import { FullscreenOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { useAppHandle } from '@/common/app-handle';

const {
  setVal,
  getVal
} = useAppHandle();

type EditorGeneralProperty = GeneralProperty & { isChild?: boolean };

/** 属性编辑器Map */
const propertyEditors = initPropertyEditors();

const props = defineProps({
  /** 绑定数据 */
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  /** 显示标题 */
  showTitle: {
    type: Boolean,
    default: true,
  },
  /** 属性列表 */
  prop: {
    type: Object as PropType<GeneralProperty>,
    required: true,
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
  (event: 'update:model', val: Record<string, any>): void;
  (event: 'beforeChange', val: Record<string, any>, prop: GeneralProperty, propMap, model?: Record<string, any>): void;
  (event: 'change', val: Record<string, any>, prop: GeneralProperty, propMap, model?: Record<string, any>): void;
}>();

const parentExpand = (prop: GeneralProperty) => {
  const _val = getVal(props.model, prop);
  if (prop.children?.length) {
    setVal(props.model, prop, !_val);
  }
}

/** 获取工具项 */
const getTools = (editor: ComponentPropertyEditor) => {
  return propertyEditors[editor]?.tools ?? [];
};

/** 判断属性是否显示 */
const checkVisible = (i: GeneralProperty) => {
  if (i.visible === undefined) return true;
  if (typeof i.visible === 'function') {
    return i.visible(props.model ?? {});
  } else {
    return i.visible !== false;
  }
};

/** 最大化 */
const fullScreen = (eidtor: any, prop: any) => {
  state.fullScreenConfig.isFullScreen = true;
  state.fullScreenConfig.prop = prop;
};

/** 关闭最大化 */
const closeFullScreen = ($event) => {
  propAttaChangeListener(
    props.model[state.fullScreenConfig.prop.name],
    state.fullScreenConfig.prop,
    editorState.currentSelectedComponentPropertyMap,
    editorState.currentSelectedComponents
  );
  state.fullScreenConfig.isFullScreen = false;
}

/** 属性修改触发的事件 */
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

const init = () => {
  const _model = props.model;
  const _default = props.prop.default;
  if (isNotBlank(_default) && isBlank(getVal(_model, props.prop))) {
    setVal(_model, props.prop, _default);
  }
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
  emit('change', value, prop, propMap, model);
};

/** 切换附加属性类型 */
const changePropAttach = (prop: GeneralProperty, editor: ComponentPropertyEditor) => {
  // if (this.editorState.currentSelectedComponents.length) {
  //   this.historyService.redo();
  //   this.editorService.setComponentAttrType(this.editorState.currentSelectedComponents as Component[], prop, editor);
  // }
};
</script>