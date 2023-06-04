<template>
  <div
    class="attr-editor-item"
    :class="{
      block: prop.layout == 'block' || prop.attach?.length,
      parent: prop.children?.length,
      expand: prop.editor === 'none' ? true : prop.children?.length && getValue
    }"
    v-show="propShowListener(prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponents)"
  >
    <div class="attr-editor-item-panel" @click="prop.editor !== 'none' ? parentExpand(prop) : undefined">
      <template v-if="prop.children?.length">
        <Switch v-if="prop.editor !== 'none'" :checked="getValue" size="small" />
        <i v-else class="iconfont icon-config3" style="color: #648DDF;" />
      </template>
        <span class="attr-editor-item-label" :class="{ require: prop.require, leaf: prop.leaf }">
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
        <div class="attr-editor-item-label-tools">
          <template v-if="prop.layout == 'block' && (prop.attach?.length || props.propertyEditors[prop.editor].tools?.length)">
            
            <div
              class="btn-tool"
              :tooltip="tool.tooltip"
              v-for="tool in props.propertyEditors[prop.editor].tools"
              @click="tool.click($event, editorState.currentSelectedComponents, prop)"
            ><i :class="tool.icon"></i></div>

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
              v-if="props.propertyEditors[prop.editor]?.canFullScreen"
            >
              <template #title>最大化</template>
              <Button size="small" @click="emit('fullscreen', props.propertyEditors[prop.editor], prop)">
                <FullscreenOutlined :style="{ fontSize: '12px' }" />
              </Button>
            </Tooltip>
          </template>
          <ButtonGroup v-if="prop.attach" size="small">
            <Button :type="!getCurrentEditors(prop.name) || getCurrentEditors(prop.name) == prop.editor ? 'primary' : 'default'" value="default" @click="changePropAttach(prop, prop.editor as ComponentPropertyEditor)">常规</Button>
            <Button :type="getCurrentEditors(prop.name) == attach ? 'primary' : 'default'" v-for="attach in prop.attach" :key="attach" :value="attach" @click="changePropAttach(prop, attach);">{{ editorState.propertyEditors[attach].description }}</Button>
          </ButtonGroup>
        </div>
      </span>
      <div class="attr-editor-item-value">
        <PropertyEditorItem
          v-if="!prop.attach?.length || !getCurrentEditors(prop.name) || (prop.attach && getCurrentEditors(prop.name) === prop.editor)"
          :prop="prop"
        ></PropertyEditorItem>
        <component 
          v-else-if="prop.attach && prop.attach.length && getCurrentEditors(prop.name) && getCurrentEditors(prop.name) !== prop.editor"
          :is="editorState.propertyEditors[getCurrentEditors(prop.name)].component"
          :component="editorState.currentSelectedComponents?.[0]"
          :components="editorState.currentSelectedComponents"
          @focus="editorState.currentProp = prop"
          @change="change($event, )"
          v-bind="Object.assign({}, editorState.propertyEditors[getCurrentEditors(prop.name)]?.attrs ?? {}, prop.attrs)" 
          v-model:value.lazy="editorState.currentSelectedComponents[0].attrs['__' + prop.name]"
        >
          <!-- TODO: 需要处理值改变问题 v-model:value.lazy 怎样处理 -->
          {{editorState.propertyEditors[getCurrentEditors(prop.name)].html}}
          <template v-for="slot in Object.keys(editorState.propertyEditors[getCurrentEditors(prop.name)].slot)" #[slot]>
            <component 
                v-for="(detailComponent, index3) in editorState.propertyEditors[getCurrentEditors(prop.name)].slot[slot]" 
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
      <template v-if="prop.layout == 'block' && prop.attach?.length">
        <Tooltip placement="topLeft" class="fullscreen" v-if="props.propertyEditors[prop.editor]?.canFullScreen">
          <template #title>最大化</template>
          <Button size="small" @click="emit('fullscreen', props.propertyEditors[prop.editor], prop)">
            <FullscreenOutlined :style="{ fontSize: '12px' }" />
          </Button>
        </Tooltip>
      </template>
    </div>

    <!-- 子属性列表 -->
    <div class="attr-editor-children" v-if="prop.editor === 'none' ? true : prop.children?.length && getValue">
      <PropertyEditorDetail
        :prop="detailProp"
        :propertyEditors="props.propertyEditors"
        @fullscreen="fullscreen"
        @change="change"
        v-for="detailProp in prop.children?.filter(i => i.visible !== false)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { state as editorState, service as editorService } from "@/modules/editor-module";
import { service as historyService } from "@/modules/history-module";
import { Button, Switch, ButtonGroup, Popover, Tooltip } from "ant-design-vue";
import { FullscreenOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { ComponentPropertyEditor } from "@haku-design/core";
import type { Component, ComponentGroup, ComponentProperty, PropertyEditor } from "@haku-design/core";
import { PropType } from 'vue';
import { useAppHandle } from '@/common/app-handle';

const {
  getVal
} = useAppHandle();

const getValue = computed(() => {
  if (editorState.currentSelectedComponents.length) {
    if (editorState.currentSelectedComponents.length > 1) {
      console.warn('多个组件的情况下只取第一个选中组件的属性');
    }
    return getVal(editorState.currentSelectedComponents[0].attrs, props.prop);
  } else {
    return undefined;
  }
});

const props = defineProps({
  /** 属性 */
  prop: {
    type: Object as PropType<ComponentProperty<any>>,
    required: true,
  },
  /** 属性编辑器Map */
  propertyEditors: {
    type: Object as PropType<Record<string, PropertyEditor>>,
    required: true,
  }
});

const emit = defineEmits<{
  (event: 'change', editor: PropertyEditor, prop: ComponentProperty<any>, propMap: Record<string, ComponentProperty<any>>, components: (Component | ComponentGroup)[]): void;
  (event: 'fullscreen', editor: PropertyEditor, prop: ComponentProperty<any>): void;
}>();

const parentExpand = <T extends ComponentPropertyEditor>(prop: ComponentProperty<T>) => {
  const _val = getValue.value;
  if (prop.children?.length && editorState.currentSelectedComponents.length && !editorState.currentSelectedComponents[0].isGroup) {
    historyService.exec('set-property', {
      objectId: editorState.currentSelectedComponents[0].id,
      attrs: {
        property: prop,
        editor: getCurrentEditors(props.prop.name)
      },
      value: !_val
    });
  }
}

const change = (e) => {
  emit('change', e, props.prop, editorState.currentSelectedComponentPropertyMap, editorState.currentSelectedComponents);
};

const fullscreen = <T extends ComponentPropertyEditor>(editor: PropertyEditor, prop: ComponentProperty<T>) => {
  emit('fullscreen', editor, prop)
}

/** 获取当前编辑器 */
const getCurrentEditors = (name: string | string[]) => {
  return editorState.currentPropertyEditors[Array.isArray(name) ? name.join('_') : name];
}

const propShowListener = (prop, propMap, components: (Component | ComponentGroup)[]) => {
  if (prop?.showCondition && components.length) {
    // TODO: 待处理，第五个参数需要确认怎样处理
    if (components.length === 1) {
      return prop.showCondition.call(this, {
        prop, propMap, 
        component: components[0],
        value: components[0].attrs[prop.name],
        ref: (editorState.componentCanvas as any).$refs
      });
    } else {
      return prop.showCondition.call(this, {
        prop, propMap, 
        component: components[0],
        value: undefined,
        ref: (editorState.componentCanvas as any).$refs
      });
    }
  } else {
    return true;
  }
};

/** 切换附加属性类型 */
const changePropAttach = <T extends ComponentPropertyEditor>(prop: ComponentProperty<T>, editor: T) => {
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

const state = reactive({

});
</script>

<style lang="less" scoped>

</style>