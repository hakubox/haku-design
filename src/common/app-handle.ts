import { reactive, h, toRefs, ConcreteComponent, ref } from 'vue';
import { destoryComponent, loadComponent } from '@/lib/component-loader';
import { AppConfig, AppPage, ComponentProperty, ExportAppBody, GeneralProperty, PropertyEditor } from '@haku-design/core';
import { cloneLoop } from '@/lib/clone';
import { AppEvent } from '@/modules/event-module';
import { ComponentPropertyEditor } from '@haku-design/core';
import { service as variableService } from '@/modules/variable-module';
import { service as formulaService } from "@/modules/formula-module";
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';

/** 获取单个属性 */
export function getAttr(value: any) {
  if (!value) return value;
  if (value?.value?.dataOrigin === 'data-editor') {
    return formFillService.getOriginDataValue(value.value);
  } else if (value.type && value.value !== undefined) {
    switch (value.type) {
      case 'data-variable':
        return variableService.getVar(value.value);
      case 'variable':
        return variableService.getVar(value);
      case 'formula':
        return formulaService.getValue(value.value);
      default:
        return value.value;
    }
  } else {
    return value;
  }
}

/** 映射通用属性类型 */
export function getComponentPropType<T extends ComponentPropertyEditor>(item: ComponentProperty<T>): ComponentProperty<T> {
  return item;
}

/** 映射通用属性类型 */
export function getPropType<
  T extends ComponentPropertyEditor,
  U extends GeneralProperty<T> | ComponentProperty<T>
>(item: U): U extends ComponentProperty<T> ? ComponentProperty<T> : GeneralProperty<T> {
  return item as any;
}

/** 应用操作模块 */
export function useAppHandle() {

  /** 状态 */
  const state = reactive({
  });
  
  /** 获取导出数据 */
  function getExportData(appInfo: {
    /** 是否已发布 */
    isPublished: boolean,
    /** 应用页面列表 */
    pages: AppPage[],
    /** 事件列表 */
    events: AppEvent[],
    /** 主题配置 */
    theme: {
      id?: string,
      code: string,
      config: Record<string, any>,
      title: string,
    },
    /** 文件列表 */
    files: string[],
    /** 预览图Url */
    previewUrl: string,
    /** 应用配置 */
    appConfig: AppConfig
  }): ExportAppBody {
    const _pages = cloneLoop(appInfo.pages);

    // 递归组件树，移除propertys属性
    const _cb = (component) => {
      if (component.children) {
        component.children.forEach(i => {
          delete i.propertys;
          _cb(i);
        });
      }
    };

    // 移除根组件列表propertys属性
    _pages.forEach(page => {
      page.children.forEach(component => {
        delete component.propertys;
        _cb(component);
      });
    });

    const _appConfig = appInfo.appConfig;
    return {
      id: _appConfig.id,
      isPublished: appInfo.isPublished,
      appType: _appConfig.appType,
      title: _appConfig.appTitle,
      description: _appConfig.description,
      headerTags: _appConfig.headerTags,
      headerContent: _appConfig.headerContent,
      remark: _appConfig.remark,

      appConfig: _appConfig,
      pages: _pages,
      events: appInfo.events,
      files: appInfo.files,
      themeId: appInfo.theme.id,
      themeConfig: appInfo.theme as ExportAppBody['themeConfig'],
      previewUrl: appInfo.previewUrl,
    };
  }

  /** 获取默认属性 */
  function getDefaultProp<T extends ComponentPropertyEditor>(props: ComponentProperty<T>[], attrs?: Record<string, any>) {
    const model = attrs ?? {};
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (prop.default !== undefined && prop.default !== null) {
        if (prop.names) {
          if (prop.children) {
            console.warn('属性定义不能同时包含names及children属性，会自动忽略children属性。', prop);
          }
          /** 如果也同时包含name的情况 */
          let _objf = model;
          if (prop.name) {
            if (typeof prop.name === 'string') {
              _objf = model[prop.name];
            } else {
              for (let i = 0; i < prop.name.length; i++) {
                const _name = prop.name[i];
                if (!_objf[_name]) _objf[_name] = {};
                _objf = _objf[_name];
              }
            }
          }
          for (let nameIndex = 0; nameIndex < prop.names.length; nameIndex++) {
            const name = prop.names[nameIndex];
            const _default = typeof prop.default[nameIndex] === 'function' ? (prop.default as any)[nameIndex]() : prop.default[nameIndex];
            if (Array.isArray(name)) {
              let _obj = _objf;
              const _names = name as string[];
              for (let i = 0; i < _names.length - 1; i++) {
                _obj = _obj[_names[i]];
              }
              _obj[_names.at(-1)!] = _default;
            } else {
              _objf[name] = _default;
            }
          }

          if (prop.names.includes('dd')) {
            console.log('dd', model);
          }
        } else {
          let _name = '';
          if (Array.isArray(prop.name)) {
            // if (Array.isArray(prop.name) && prop.name.includes('xAxis') && prop.name.includes('position')) {
            //   debugger;
            // }
            const objArr = [model];
            for (let i = 0; i < prop.name.length - 1; i++) {
              _name = prop.name[i];
              const _obj = objArr[i];
              if (!_obj[_name]) _obj[_name] = {};
              objArr[i + 1] = _obj[_name];
            }
            objArr.at(-1)![prop.name.at(-1)!] = typeof prop.default === 'function' ? (prop.default as any)() : prop.default;
          } else if (!model[prop.name]) {
            _name = prop.name;
            if (_name) model[_name] = typeof prop.default === 'function' ? (prop.default as any)() : prop.default;
          }
        }
      }
      if (prop.children) getDefaultProp(prop.children, model);
    }
    return model;
  }

  /** 设置默认属性 */
  function setDefaultProp<T extends ComponentPropertyEditor>(model: Record<string, any>, props: ComponentProperty<T>[]) {
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (prop.default !== undefined && prop.default !== null && prop.names?.length) {
        if (prop.names) {
          for (let nameIndex = 0; nameIndex < prop.names.length; nameIndex++) {
            const name = prop.names[nameIndex];
            const _default = typeof prop.default[nameIndex] === 'function' ? (prop.default as any)[nameIndex]() : prop.default[nameIndex];
            let _obj = model;
            if (Array.isArray(name)) {
              const _names = name as string[];
              for (let i = 0; i < _names.length - 1; i++) {
                _obj = _obj[_names[i]];
              }
              _obj[_names.at(-1)!] = _default;
            } else {
              _obj[name] = _default;
            }
          }
        } else {
          let _name = '';
          if (Array.isArray(prop.name)) {
            for (let i = 0; i < prop.name.length - 1; i++) {
              _name = prop.name[i];
              if (!model[_name]) model[_name] = {};
            }
            _name = prop.name.at(-1)!;
          } else if (!model[prop.name]) {
            _name = prop.name;
          }
          if (_name) model[_name] = typeof prop.default === 'function' ? (prop.default as any)() : prop.default;
        }
      }
    }
  }

  /** 获取值 */
  function getVal<T extends ComponentPropertyEditor>(model: Record<string, any>, prop: ComponentProperty<T> | GeneralProperty<T>) {
    let _returnValue;
    if (prop.names) {
      /** 如果也同时包含name的情况 */
      let _objf = model;
      if (prop.name) {
        if (typeof prop.name === 'string') {
          _objf = model[prop.name];
        } else {
          for (let i = 0; i < prop.name.length; i++) {
            const _name = prop.name[i];
            if (!_objf[_name]) _objf[_name] = {};
            _objf = _objf[_name];
          }
        }
      }
      _returnValue = prop.names.map(name => {
        if (Array.isArray(name)) {
          let _obj = _objf;
          const _names = name;
          for (let i = 0; i < _names.length; i++) {
            _obj = _obj[_names[i]];
          }
          if (prop.format && _obj?.value === undefined) _obj = prop.format(_obj as any);
          return _obj;
        } else {
          return _objf[name]
        }
      });
    } else {
      if (typeof prop.name === 'string') {
        if (prop.format && model[prop.name]?.value === undefined) {
          _returnValue = prop.format(model[prop.name]);
        } else {
          _returnValue = model[prop.name];
        }
      } else {
        let _value = model;
        for (let i = 0; i < prop.name.length; i++) {
          const name = prop.name[i];
          if (_value) _value = _value[name];
        }
        if (prop.format && _returnValue?.value === undefined) _value = prop.format(_value as any);
        _returnValue = _value;
      }
    }

    if (_returnValue?.value !== undefined) {
      _returnValue = _returnValue.value;
      if (prop.format) _returnValue = prop.format(_returnValue);
    }
    return _returnValue;
  }

  /**
   * 通用赋值
   * - 传入component则为组件赋值属性
   * - 传入editor与prop.editor不相同时则为附加属性类型，不赋值 __prop 属性
   */
  function setVal<T extends ComponentPropertyEditor>(model: Record<string, any>, prop: ComponentProperty<T> | GeneralProperty<T>, value: any, editor?: PropertyEditor): void {
    if (prop.names) {
      for (let i = 0; i < prop.names.length; i++) {
        const name = prop.names[i];
        /** 如果也同时包含name的情况 */
        let _objf = model;
        if (prop.name) {
          if (typeof prop.name === 'string') {
            _objf = model[prop.name];
          } else {
            for (let i = 0; i < prop.name.length; i++) {
              const _name = prop.name[i];
              if (!_objf[_name]) _objf[_name] = {};
              _objf = _objf[_name];
            }
          }
        }
        let _name;
        if (Array.isArray(name)) {
          const _names = name as string[];
          for (let i = 0; i < _names.length - 1; i++) {
            _objf = _objf[_names[i]];
          }
          _name = _names[_names.length - 1];
        } else {
          _name = name;
        }
        if (_objf[_name]?.type) {
          if (_objf[_name].value !== value[i]) {
            _objf[_name].value = value[i];
            if (editor && editor.name === prop.editor) _objf['__' + _name].value = value[i];
          }
        } else {
          _objf[_name] = value[i];
          if (editor && editor.name === prop.editor) _objf['__' + _name] = value[i];
        }
      }
    } else {
      if (typeof prop.name === 'string') {
        if (model[prop.name]?.type) {
          if (model[prop.name].value !== value) {
            model[prop.name].value = value;
          }
        } else {
          model[prop.name] = value;
          if (editor && editor.name === prop.editor) model['__' + prop.name] = value;
        }
      } else {
        let _value = model;
        for (let i = 0; i < prop.name.length - 1; i++) {
          if (!_value[prop.name[i]]) _value[prop.name[i]] = {};
          if (_value) _value = _value[prop.name[i]];
        }
        if (_value && _value[prop.name[prop.name.length - 1]] !== value) {
          _value[prop.name[prop.name.length - 1]] = value;
          if (editor && editor.name === prop.editor) _value['__' + prop.name[prop.name.length - 1]] = value;
        }
      }
    }
  }

  /** 显示私人问卷库弹出框 */
  async function showPrivateQuestionnaireLibraryDialog() {
    const state = reactive({
      visible: true
    });
    const PrivateQuestionnaireLibraryDialog = ((await Object.values(import.meta['glob']('@/components/module/PrivateQuestionnaireLibraryDialog.vue'))[0] as any)() as any).default;
    const container = loadComponent(PrivateQuestionnaireLibraryDialog as ConcreteComponent, {
      ...toRefs(state),
      'onUpdate:visible'(value) {
        state.visible = value;
      },
      onClose() {
        destoryComponent(container);
      }
    }).dom;
  }

  /** 显示公共问卷库弹出框 */
  async function showPublicQuestionnaireLibraryDialog() {
    const state = reactive({
      visible: true
    });
    const PublicQuestionnaireLibraryDialog = ((await Object.values(import.meta['glob']('@/components/module/PublicQuestionnaireLibraryDialog.vue'))[0] as any)() as any).default;
    const container = loadComponent(PublicQuestionnaireLibraryDialog as ConcreteComponent, {
      ...toRefs(state),
      'onUpdate:visible'(value) {
        state.visible = value;
      },
      onClose() {
        destoryComponent(container);
      }
    }).dom;
  }

  return {
    ...toRefs(state),
    showPrivateQuestionnaireLibraryDialog,
    showPublicQuestionnaireLibraryDialog,
    getVal,
    setVal,
    getDefaultProp,
    setDefaultProp,
    getExportData,
  };
}
