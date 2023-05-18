<template>
  <div>
    <component @focus="onFocus(props.prop)"
      v-bind="Object.assign({}, getEditor.attrs, props.prop.attrs, isFullScreen ? { style: { height: '500px' } } : {})"
      v-if="getEditor.component && editorState.currentSelectedComponents.length"
      :component="editorState.currentSelectedComponents?.[0]"
      :components="editorState.currentSelectedComponents"
      :value="getValue"
      :attrs="Object.assign({}, getEditor.attrs, props.prop.attrs)"
      :disabled="disabledCondition"
      @change="propChangeListener"
      :is="getEditor.component"
    >
      {{getEditor.html}}
      <template v-for="slot in Object.keys(getEditor.slot)" #[slot]>
        <component v-for="(detailComponent, index3) in getEditor.slot[slot]" 
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
</template>

<script lang="ts" setup>
import { PropType, computed, watch } from "vue";
import { state as editorState } from "@/modules/editor-module";
import { service as historyService } from "@/modules/history-module";
import { ComponentProperty } from "@/@types/component-property";
import { type Component } from "@/@types";

const props = defineProps({
  /** 属性 */
  prop: {
    type: Object as PropType<ComponentProperty>,
    required: true,
    default: () => ({})
  },
  /** 是否全屏状态 */
  isFullScreen: {
    type: Boolean,
    default: false
  }
});

const onFocus = (prop) => {
  editorState.currentProp = prop;
}

/** 禁用编辑功能条件 */
const disabledCondition = computed(() => {
  return editorState.currentSelectedComponents.length > 1 && props.prop.names?.includes('x');
});

/** 属性修改触发的事件 */
const propChangeListener = (value) => {
  if (value?.target) {
    console.warn('属性值包含val.target', value);
    return;
  }
  const _propMap = editorState.currentSelectedComponentPropertyMap;
  const _components = editorState.currentSelectedComponents as Component[];
  if (disabledCondition.value) {
    return;
  }
  for (let i = 0; i < _components.length; i++) {
    const _component = _components[i];
    if (props.prop.names) {
      props.prop.names.forEach((name, index) => {
        if (_component && _component.attrs[name] !== value[index]) {
          historyService.exec('set-property', {
            objectId: _component.id,
            attrs: {
              property: props.prop,
              propertyName: name,
              propertyTitle: props.prop.title,
              componentTitle: _component.title,
            },
            value: value[index]
          });
          _component.attrs['__' + name] = value[index];
          if (props.prop?.change) {
            return props.prop.change.call(this, props.prop, _propMap, _component, value[index], (editorState.componentCanvas as any).$refs);
          }
        }
      });
    } else {
      if (_component && _component.attrs[props.prop.name] !== value) {
        historyService.exec('set-property', {
          objectId: _component.id,
          attrs: {
            property: props.prop,
            propertyName: props.prop.name,
            propertyTitle: props.prop.title,
            componentTitle: _component.title,
          },
          value
        });
        _component.attrs['__' + props.prop.name] = value;
        if (props.prop?.change) {
          return props.prop.change.call(this, props.prop, _propMap, _component, value, (editorState.componentCanvas as any).$refs);
        }
      }
    }
  }
}

const getValue = computed(() => {
  if (editorState.currentSelectedComponents.length) {
    if (props.prop.names) {
      return props.prop.names.map(name => editorState.currentSelectedComponents[0].attrs[name]) ?? props.prop.default;
    } else {
      return editorState.currentSelectedComponents[0].attrs[props.prop.name] ?? props.prop.default;
    }
  } else {
    return undefined;
  }
});

const getEditor = computed(() => {
  return editorState.propertyEditors[props.prop.editor];
});

watch(() => getValue.value, (val, oldVal) => {
  const _isObj = typeof val === 'object';
  if (!_isObj && val !== oldVal) {
    propChangeListener(val);
  } else if (_isObj && JSON.stringify(val) !== JSON.stringify(oldVal)) {
    propChangeListener(val);
  }
});
</script>