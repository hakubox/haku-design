import { reactive, computed } from 'vue';
import {
  type AppPage,
  type LayoutConfig,
  type PropertyGroup,
  type ComponentProperty,
  type AppConfig,
  type ExportAppBody,
  type FormTimerConfig,
  type Component,
  type ComponentGroup,
  PageType,
  CrossAxisAlignment,
  LayoutType,
  MainAxisAlignment,
  ComponentPropertyEditor,
} from '@haku-design/core';
import bus from '@/tools/bus';
import { state as eventState, service as eventService, EventTriggerType } from '@/modules/event-module';
import { service as themeService } from '@/modules/theme-module';
import { state as storageState } from '@/modules/storage-module';
import { service as formFillService } from '@/modules/form-fill-module';

import { timeout } from '@/tools/common';
import { getFileListByIds } from '@/modules/storage-module/api';
import type { FormInfoItem } from '@/modules/form-fill-module/index.d';
import { toast } from '@/common/message';

/** 问卷编辑模块状态 */
export const state = reactive({
  /** 应用配置 */
  appConfig: {} as AppConfig,
  /** 全局组件索引（新增组件自增） */
  globalComponentIndexMap: {} as Record<string, number>,
  /** 当前分页索引 */
  currentPageIndex: 0,
  /** 上一次分页索引 */
  prevPageIndex: 0,
  /** 【题目页】当前分页索引 */
  currentFormPageIndex: 0,
  /** 【题目页】上一次分页索引 */
  prevFormPageIndex: 0,
  /** 画板 */
  canvasEl: {} as HTMLElement,
  /** 画板主面板元素 */
  canvasPanelEl: {} as HTMLElement,
  /** 页面列表 */
  pages: [{ pageTitle: '主页', pageType: PageType.normalPage, children: [] }] as AppPage[],
  /** 当前焦点属性 */
  currentProp: {} as any,
  /** 当前焦点事件 */
  currentEvent: {} as any,
  /** 当前已选择组件 */
  currentSelectedComponents: [] as Component[],
  /** 当前选中的第一个控件Id */
  currentSelectedFirstComponentId: '' as string | undefined,
  /** 当前选择控件所带来的控件属性组 */
  currentSelectedComponentPropertyGroups: [] as PropertyGroup[],
  /** 当前选择控件所带来的控件属性哈希表 */
  currentSelectedComponentPropertyMap: {} as Record<string, ComponentProperty<any>>,
  /** 画板滚动坐标 */
  canvasLocation: {
    x: 0,
    y: 0,
  },
  /** 事件总线 */
  bus,
  /** 控件画布 */
  componentCanvas: {} as any,
  /** 游标父元素 */
  componentCursorParentEl: undefined as any,
  /** 游标父元素前后位置 */
  componentCursorIsAfter: undefined as boolean | undefined,
  /** 组件放置游标 */
  componentCursorEl: document.createElement('div') as any,
  /** 画布主panel */
  rootPanelEl: undefined as HTMLElement | undefined,
  /** Footer Dom */
  footerDom: undefined as HTMLElement | undefined,

  /** 获取计时配置 */
  getTimerConfig: computed((): FormTimerConfig => {
    return state.appConfig.questionnaireConfig.timerConfig || {};
  }),
  /** 当前页 */
  currentPage: computed((): AppPage => {
    return state.pages[state.currentPageIndex];
  }),
  /** 当前控件对应的属性编辑器字典 */
  currentPropertyEditors: computed((): Record<string, ComponentPropertyEditor> => {
    const _selected = state.currentSelectedComponents;
    if (_selected.length) {
      let _propEditors: Record<string, any> = {};
      if (_selected.length >= 1) {
        _propEditors = _selected[0].propertyEditors ?? {};
      }
      for (let i = 1; i < _selected.length; i++) {
        const component = _selected[i];
        if (component.propertyEditors) {
          Object.entries(component.propertyEditors).forEach(([key, value]) => {
            if (!_propEditors[key] || _propEditors[key] !== value) {
              delete _propEditors[key];
            }
          });
        }
      }
      return _propEditors;
    }
    return {};
  }),
  /** 用户设备是否处于暗模式 */
  isDarkMode: computed((): boolean => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }),
  /** 总页数 */
  maxFormPageCount: computed((): number => {
    if (state.appConfig.questionnaireConfig.turnPageMode === 'no-page') return 1;
    else if (state.appConfig.questionnaireConfig.turnPageMode === 'page') return state.currentPage.children.length;
    else return state.currentPage.children.filter((i) => i.name === 'q-page-split').length + 1;
  }),
});

export const service = {
  /** 显示组件 */
  showComponentInFormPage(componentId: string): boolean {
    let componentIndex: number | undefined = undefined;
    let component: Component | ComponentGroup | undefined = undefined;
    let _index = 0;
    for (let i = 0; i < state.currentPage.children.length; i++) {
      const _componet = state.currentPage.children[i];
      if (componentId === _componet.id) {
        componentIndex = _index;
        component = _componet;
        break;
      }
      _index++;
    }
    if (componentIndex !== undefined) {
      if (state.currentPage.pageType === PageType.normalPage && component) {
        if (state.appConfig.questionnaireConfig.turnPageMode === 'no-page') {
          return true;
        } else {
          // 每题一页
          if (state.appConfig.questionnaireConfig.turnPageMode === 'page') {
            return componentIndex === state.currentFormPageIndex;
          } else if (state.appConfig.questionnaireConfig.turnPageMode === 'default') {
            // 默认的情况，默认则根据分页器决定如何分页
            const _splitIndexList = (state.pages[state.currentPageIndex].children as Component[])
              .map((i, index) => (i.name === 'q-page-split' ? index : undefined))
              .filter((i) => i) as number[];
            if (_splitIndexList.length === 0) return true;
            else if (state.currentFormPageIndex < 0 || state.currentFormPageIndex > _splitIndexList.length)
              return false;
            else if (state.currentFormPageIndex === 0) return componentIndex < _splitIndexList[0];
            else if (state.currentFormPageIndex === _splitIndexList.length)
              return componentIndex > _splitIndexList[state.currentFormPageIndex - 1];
            else {
              return (
                componentIndex > _splitIndexList[state.currentFormPageIndex - 1] &&
                componentIndex < _splitIndexList[state.currentFormPageIndex]
              );
            }
          }
        }
        // !editorStore.appConfig.questionnaireConfig.turnPageMode || (isPreview && editorStore.appConfig.questionnaireConfig.turnPageMode && index == editorStore.currentFormPageIndex)
        return false;
      } else {
        return true;
      }
    }
    return false;
  },
  /** 加载应用主体 */
  async loadAppBody(body: ExportAppBody) {
    try {
      if (body?.files?.length) {
        const _fileList = await getFileListByIds(...body.files);
        storageState.fileList.push(..._fileList);
      }

      state.appConfig = body.appConfig;
      state.appConfig.id = body.appConfig.id;
      state.currentPageIndex = 0;

      // let _componentTree = fillPropertys(form.components.children);
      // console.log(_componentTree);
      state.pages = body.pages;
      eventState.allEvents = body.events;

      state.currentSelectedComponents = [];
      state.currentSelectedFirstComponentId = '';
      state.currentSelectedComponentPropertyGroups = [];
      state.currentSelectedComponentPropertyMap = {};

      eventState.allEvents = body.events;
      if (body.theme?.code) themeService.changeTheme(body.theme.code);
      await timeout(100);
    } catch (err) {
      toast('加载数据出错', 'error');
      console.error(err);
    }
  },
  /** 构建组件布局 */
  buildComponentLayout(type: LayoutType): LayoutConfig<typeof type> {
    let _config = {};
    if (type === LayoutType.flex) {
      _config = {
        direction: 'row',
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
      };
    } else if (type === LayoutType.absolute) {
      _config = {
        height: 100,
      };
    } else if (type === LayoutType.table) {
      _config = {
        rowCount: 1,
        colCount: 1,
      };
    }
    return {
      layout: type,
      layoutDetailConfig: {},
      ..._config,
    };
  },
  /**
   * 合并表单数据（需要根据题目合并）
   * @param {Component[]} components 传入的新的组件树
   * @param {Record<string, FormInfoItem>} formdata 当前答案列表
   * @return {Record<string, FormInfoItem>} 需要填充的表单数据
   */
  mergeFormData(newComponents: Component[], formdata: Record<string, FormInfoItem>): Record<string, FormInfoItem> {
    const _re: Record<string, FormInfoItem> = {};
    // 1、将传入的组件树及当前组件树铺平，并且只取题目类型（isFormItem）
    const newComponentList: Component[] = this.getAllFormItem(newComponents);
    const oldComponentList: Component[] = this.getAllFormItem();
    // 2、将两个组件列表做对比，判断并对比出删除/改变的题目列表
    for (let i = 0; i < newComponentList.length; i++) {
      const newComponent = newComponentList[i];
      for (let o = 0; o < oldComponentList.length; o++) {
        const oldComponent = oldComponentList[o];
        if (newComponent.id === oldComponent.id && formdata?.[newComponent.id]) {
          if (JSON.stringify(oldComponent.attrs) === JSON.stringify(newComponent.attrs)) {
            _re[newComponent.id] = formdata[newComponent.id];
          }
        }
      }
    }
    return _re;
  },
  /** 根据Id获取表单控件（默认获取编辑模式主画板下组件） */
  getComponentElementById(componentId?: string, canvasEl?: HTMLElement): HTMLElement | undefined {
    if (componentId) {
      return (canvasEl ?? state.canvasPanelEl).querySelector(`[component-id="${componentId}"]`) as HTMLElement | undefined;
    }
    return undefined;
  },
  /** 跳转到上一页（问卷分页） */
  prevPage() {
    if (state.currentFormPageIndex > 0) {
      state.currentFormPageIndex--;
      eventService.emit(EventTriggerType.prevPage);
      this.onChangePage();
    } else {
      toast('已经是第一页', 'error');
    }
  },
  /** 跳转到下一页（问卷分页） */
  async nextPage() {
    if (state.currentFormPageIndex < state.maxFormPageCount) {
      const { isComplete } = await formFillService.validateForm(state.currentFormPageIndex);
      if (isComplete) {
        state.currentFormPageIndex++;
        eventService.emit(EventTriggerType.nextPage);
        this.onChangePage();
      }
    } else {
      toast('已经是最后一页', 'error');
    }
  },
  /** 跳转到某一页 */
  gotoPage(index: number) {
    if (index > 0 && index < state.maxFormPageCount - 1) {
      if (index !== state.currentFormPageIndex) {
        state.currentFormPageIndex = index;
        this.onChangePage();
      }
    } else {
      toast('页数参数不正确', 'error');
    }
  },
  /** 页面调整大小 */
  onPageSize() {
    setTimeout(() => {
      const _dom = document.querySelector('.design-app-canvas-page');
      if (_dom) {
        state.appConfig.canvasConfig.width = _dom.clientWidth;
      }
    }, 210);
  },
  /** 当前页变更 */
  onChangePage() {
    console.log(state.currentFormPageIndex);
    eventService.emit(EventTriggerType.gotoPage, 'global', state.currentFormPageIndex);
  },
  /** 上一题 */
  prevComponent() {
    if (state.currentFormPageIndex > 0) {
      eventService.emit(EventTriggerType.prevComponent);
      service.gotoComponent(state.currentFormPageIndex - 1);
    } else {
    }
  },
  /** 下一题 */
  nextComponent() {
    if (state.currentFormPageIndex < state.currentPage.children.length - 1) {
      eventService.emit(EventTriggerType.nextComponent);
      service.gotoComponent(state.currentFormPageIndex + 1);
    }
  },
  /** 改变当前题 */
  gotoComponent(newPageIndex: number) {
    if (newPageIndex >= 0 && newPageIndex < state.maxFormPageCount - 1) {
      eventService.emit(EventTriggerType.gotoComponent, 'global', newPageIndex);
      state.prevFormPageIndex = state.currentFormPageIndex;
      state.currentFormPageIndex = newPageIndex;
      eventService.emit(EventTriggerType.showComponent, state.currentPage.children[newPageIndex].id);
      eventService.emit(EventTriggerType.hideComponent, state.currentPage.children[state.prevFormPageIndex].id);
    }
  },
  /** 跳转到下一页（实体页） */
  nextAppPage() {
    if (state.currentPageIndex < state.pages.length - 1) {
      state.currentPageIndex++;
    } else {
      throw new Error('已经是最后一页');
    }
  },
  /** 跳转到上一页（实体页） */
  prevAppPage() {
    if (state.pages.length > 0) {
      state.currentPageIndex--;
    } else {
      throw new Error('已经是第一页');
    }
  },
  /** 根据组件列表（树）查询所有表单项，返回列表，如果不传则默认查询普通页面下所有组件 */
  getAllFormItem(
    rootComponents?: Component[],
    filter?: (component: Component | ComponentGroup) => boolean,
  ): Component[] {
    const _rootComponents: (Component | ComponentGroup)[] =
      rootComponents ?? (state.pages.find((i) => i.pageType === PageType.normalPage)?.children || []);
    const _components: Component[] = [];
    const _cb = (parentComponent: Component | ComponentGroup) => {
      if (filter && !parentComponent.isGroup) {
        if (filter(parentComponent))
          _components.push({
            ...parentComponent,
            children: [],
          });
      } else if (parentComponent.isFormItem) {
        _components.push({
          ...parentComponent,
          children: [],
        });
      }
      if (parentComponent.children?.length) {
        for (let i = 0; i < parentComponent.children.length; i++) {
          const item = parentComponent.children[i];
          _cb(item);
        }
      }
    };
    _rootComponents.forEach((item) => _cb(item));
    return _components;
  },
  /** 查询组件 */
  findComponent(componentId: string | undefined): Component | ComponentGroup | undefined {
    if (!componentId) return undefined;
    let _component: Component | ComponentGroup | undefined = undefined;
    const _cb = (parentComponent: Component | ComponentGroup) => {
      if (parentComponent.id === componentId) {
        _component = parentComponent;
        return;
      }
      if (parentComponent.children) {
        parentComponent.children.forEach((item) => {
          if (item.id === componentId) {
            _component = item;
            return;
          } else _cb(item);
        });
        if (_component) return;
      }
    };
    (state.currentPage.children as Component[]).forEach(_cb);
    return _component;
  },
  /** 查询组件索引 */
  findComponentIndex(componentId: string): number | undefined {
    let _index: number | undefined = undefined;
    const _cb = (parentComponent: Component | ComponentGroup, parentIndex: number) => {
      if (parentComponent.id === componentId) {
        _index = parentIndex;
        return;
      }
      if (parentComponent.children) {
        parentComponent.children.forEach((item, index) => {
          if (item.id === componentId) {
            _index = index;
            return;
          } else _cb(item, index);
        });
        if (_index !== undefined) return;
      }
    };
    (state.currentPage.children as Component[]).forEach(_cb);
    return _index;
  },
  /** 查询父组件及索引 */
  findParentComponent(
    componentId: string,
    { ignoreHidden, ignoreNotForm } = { ignoreHidden: false, ignoreNotForm: false },
  ): { component: Component; originComponent: Component; index: number; level: number } | undefined {
    let _component: Component | ComponentGroup | undefined;
    let _originComponent: Component | ComponentGroup | undefined;
    let _index: number | undefined = undefined;
    let _level: number = 0;
    const _cb = (
      component: Component | ComponentGroup,
      index: number,
      parentComponent: Component | ComponentGroup,
      level: number,
    ) => {
      if (_index !== undefined) return;
      if (component.id === componentId) {
        _index = index;
        _component = parentComponent;
        _level = level;
        _originComponent = component;
        return;
      }
      if (component.children) {
        const _children = component.children.sort((a, b) => (a.slotIndex || 0) - (b.slotIndex || 0));
        let index = 0;
        _children.forEach((item) => {
          if (item.id === componentId) {
            _index = index;
            _component = component;
            _originComponent = item;
            _level = level + 1;
            return;
          } else _cb(item, index, component, level + 1);
          if (!ignoreHidden || (ignoreHidden && item.attrs.visible)) {
            if (!ignoreNotForm || (ignoreNotForm && item.isFormItem)) {
              index++;
            }
          }
        });
        if (_index !== undefined) return;
      }
    };
    let index = 0;
    state.currentPage.children.forEach((item) => {
      _cb(item, index, state.currentPage as unknown as Component, 0);
      if (!ignoreHidden || (ignoreHidden && item.attrs.visible)) {
        if (!ignoreNotForm || (ignoreNotForm && item.isFormItem)) {
          index++;
        }
      }
    });
    if (_component !== undefined && _index !== undefined) {
      return {
        component: _component as Component,
        originComponent: _originComponent as Component,
        index: _index as number,
        level: _level as number,
      };
    } else {
      return undefined;
    }
  },
  /** 设置组件的属性值类型 */
  setComponentAttrType(component: Component, property: ComponentProperty<any>, propertyType: any) {
    const _index = state.currentPage.children.findIndex((i) => i.id == component.id);
    if (_index >= 0) {
      const _name = Array.isArray(property.name) ? property.name.join('_') : property.name;
      state.currentPropertyEditors[_name] = propertyType;

      if (component?.propertyEditors) component.propertyEditors[_name] = propertyType;
      component.attrs[_name] = property.default;
      component.attrs['__' + _name] = '';
    }
  },
};
