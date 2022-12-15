<template>
  <component
    @focus="editorState.currentEvent = props.config"
    @change="propChangeListener"
    v-bind="Object.assign({}, props.config.attrs, getComponent.attrs, props.config.config[props.propName].attrs)"
    :value="props.config.attrs[props.propName]"
    :is="getComponent.component"
    :readonly="readonly"
    size="default"
  >
    {{ getComponent.html }}
    <template v-for="slot in Object.keys(getComponent.slot)" #[slot]>
      <component
        v-for="(detailComponent, index3) in getComponent.slot[slot]"
        :key="slot + detailComponent.component + index3"
        v-bind="detailComponent.attrs"
        :is="detailComponent.component"
      >
        {{ detailComponent.html }}
        <template v-for="detailSlot in Object.keys(detailComponent.slot)" #[detailSlot]>
          <component
            v-for="(detail2Component, index4) in detailComponent.slot[detailSlot]"
            :key="detailSlot + detail2Component.component + index4"
            v-bind="detail2Component.attrs"
            :is="detail2Component.component"
          >
            {{ detail2Component.html }}
          </component>
        </template>
      </component>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import type { AppEventActionInstance, AppEventTriggerInstance } from '../@types';
import { PropertyEditor } from '@/@types/property-editor';

const props = defineProps({
  /** 属性名称 */
  propName: {
    type: String,
    required: true,
  },
  /** 属性 */
  prop: {
    type: Object as PropType<PropertyEditor>,
    required: true,
  },
  /** 触发/行为配置 */
  config: {
    type: Object as PropType<AppEventTriggerInstance | AppEventActionInstance>,
    default: () => ({}),
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  }
});

/** 获取组件 */
const getComponent = computed(() => {
  return editorState.propertyEditors[props.prop.editor];
});

/** 属性修改触发的事件 */
const propChangeListener = (val) => {
  if (val?.target) {
    console.warn('属性值包含val.target', val);
    return;
  }
  const _config = props.config;
  _config.attrs[props.propName] = val;
  if (props.propName == 'component') {
    _config.target = val;
    // let _value = e.target ? e.target.value : e;
    // component.propAttrs[prop.name] = _value;
    // if (prop?.change) {
    //   return prop.change.call(this, prop, propMap, component, _value, (this.componentCanvas as any).$refs);
    // }
  }
}
</script>
