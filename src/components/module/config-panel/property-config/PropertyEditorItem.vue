<template>
  <div>
    <component @focus="onFocus(props.prop)"
      v-bind="Object.assign({}, getEditor.attrs, props.prop.attrs)"
      v-if="getEditor?.component && editorState.currentSelectedComponents.length"
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
import { ComponentProperty } from "@haku-design/core";
import { type Component } from "@haku-design/core";
import { useAppHandle } from '@/common/app-handle';

const {
  setVal,
  getVal
} = useAppHandle();

const props = defineProps({
  /** 属性 */
  prop: {
    type: Object as PropType<ComponentProperty<any>>,
    required: true,
    default: () => ({})
  },
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
    setVal(_components[i].attrs, props.prop, value, getEditor.value);
  }
}

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