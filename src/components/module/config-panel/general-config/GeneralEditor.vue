<template>
  <div class="property-collapse">
    <div
      class="property-collapse-item"
      v-for="(propGroup, index) in props.groups"
      :key="'p' + index"
    >
      <label v-show="props.showTitle" class="property-collapse-item-title">
        <!-- <DownOutlined /> -->
        {{propGroup.title}}
      </label>
      <div class="property-collapse-item-content">
        <GeneralEditorDetail
          :model="model"
          :prop="prop"
          :propertys="propertys"
          @change="propChangeListener"
          v-for="prop in propertyList(propGroup)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, reactive } from "vue";
import { state as editorState } from "@/modules/editor-module";
import { ComponentPropertyEditor } from "@haku-design/core";
import { initPropertyEditors } from '@/data/property-editor';
import { GeneralProperty } from "@haku-design/core";

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
  /** 属性分组 */
  groups: {
    type: Array as PropType<{ title: string, name: string, icon?: string }[]>,
    default: () => []
  },
  /** 属性列表 */
  propertys: {
    type: Array as PropType<GeneralProperty<any>[]>,
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
});

/** 排序后属性列表 */
const propertyList = (propGroup: { title: string, name: string, icon?: string }) => {
  const _props = props.propertys.filter(i => 
    i.group === propGroup.name && (!i.appType || i.appType?.includes(editorState.appConfig.appType)) && checkVisible(i)
  ).slice();
  _props.sort((a, b) => {
      return (a?.sort ?? 999) - (b?.sort ?? 999);
  });
  return _props;
};

const emit = defineEmits<{
  (event: 'change', val: string): void;
  (event: 'update:model', val: Record<string, any>): void;
  (event: 'beforeChange', val: Record<string, any>, prop: GeneralProperty<any>, propMap, model?: Record<string, any>): void;
  (event: 'change', val: Record<string, any>, prop: GeneralProperty<any>, propMap, model?: Record<string, any>): void;
}>();

const parentExpand = <T extends ComponentPropertyEditor>(prop: GeneralProperty<T>) => {
  const _val = getValue(prop);
  if (prop.children?.length) {
    setValue(prop, props.model, !_val);
  }
}

/** 获取工具项 */
const getTools = (editor: ComponentPropertyEditor) => {
  return propertyEditors[editor]?.tools ?? [];
};

/** 判断属性是否显示 */
const checkVisible = <T extends ComponentPropertyEditor>(i: GeneralProperty<T>) => {
  if (i.visible === undefined) return true;
  if (typeof i.visible === 'function') {
    return i.visible(props.model ?? {});
  } else {
    return i.visible !== false;
  }
};

/** 获取值 */
const getValue = <T extends ComponentPropertyEditor>(prop: GeneralProperty<T>) => {
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
const setValue = <T extends ComponentPropertyEditor>(prop: GeneralProperty<T>, model: Record<string, any>, value) => {
  if (prop.names) {
    prop.names.forEach((name, index) => {
      let _obj = model;
      let _name;
      if (Array.isArray(name)) {
        const _names = name as string[];
        for (let i = 0; i < _names.length - 1; i++) {
          _obj = _obj[_names[i]];
        }
        _name = _names[_names.length - 1];
      } else {
        _name = name;
      }
      if (_obj[_name].type) {
        _obj[_name].value = value[index];
      } else {
        _obj[_name] = value[index];
      }
    });
  } else {
    if (typeof prop.name === 'string') {
      if (model[prop.name]?.type) {
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
  }
  return model;
};

/** 属性修改触发的事件 */
const propChangeListener = <T extends ComponentPropertyEditor>(value, prop: GeneralProperty<T>, propMap, model?: Record<string, any>) => {
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
        return prop.change.call(this, {
          value: _value, prop, propMap, model
        });
      }
    }
  }
};

/** 切换附加属性类型 */
const changePropAttach = <T extends ComponentPropertyEditor>(prop: GeneralProperty<T>, editor: ComponentPropertyEditor) => {
  // if (this.editorState.currentSelectedComponents.length) {
  //   this.historyService.redo();
  //   this.editorService.setComponentAttrType(this.editorState.currentSelectedComponents as Component[], prop, editor);
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