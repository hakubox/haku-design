<template>
  <div>
    <component @focus="onFocus(prop)"
      v-bind="Object.assign({}, getEditor.attrs, prop.attrs, isFullScreen ? { style: { height: '500px' } } : {})"
      :component="model"
      :value="getValue"
      :disabled="prop.disabled"
      :attrs="Object.assign({}, getEditor.attrs, prop.attrs, isFullScreen ? { style: { height: '500px' } } : {})"
      @change="(val) => onChange(val, prop, propertys, model)"
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

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { state as editorState, service as editorService } from "@/modules/editor-module";
import { state as historyState, service as historyService } from "@/common/history-module";
import { Component, GeneralProperty } from "@/@types";

export default defineComponent({
  name: "GeneralEditorItem",
  components: {},
  props: {
    /** 属性 */
    prop: {
      type: Object as PropType<GeneralProperty>,
      required: true,
      default: () => ({})
    },
    /** 属性列表 */
    propertys: {
      type: Array as PropType<GeneralProperty[]>,
      default: () => []
    },
    /** 绑定主数据 */
    model: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    /** 是否全屏状态 */
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onFocus(prop) {
      editorState.currentProp = prop;
    },
    /** 属性修改触发的事件 */
    propChangeListener(e, prop, propMap, target?: Record<string, any>) {
      if (e.target) {
        console.warn('属性值包含val.target', e);
        return;
      }
    },
  },
  created() {
  },
  mounted() {
  },
  setup(props, { emit }) {

    const getEditor = computed(() => {
      return editorState.propertyEditors[props.prop.editor];
    });
    
    /** 值改变 */
    const onChange = (value, prop, propertys, model) => {
      if (value?.target) return;
      emit('change', value, prop, propertys, model);
    };

    /** 获取值 */
    const getValue = computed(() => {
      let _returnValue;
      if (typeof props.prop.name === 'string') {
        _returnValue = props.model[props.prop.name];
      } else {
        let _value = props.model;
        props.prop.name.forEach(name => {
          if (_value) _value = _value[name];
        });
        _returnValue = _value;
      }

      if (_returnValue?.value !== undefined) {
        _returnValue = _returnValue.value;
      }

      return _returnValue;
    });

    return {
      editorState,
      getEditor,
      historyService,
      getValue,
      onChange
    };
  }
});
</script>