import { reactive, computed, nextTick } from 'vue';
import { cloneLoop } from '@/lib/clone';
import { LayoutConfig, PropertyGroup, Component, ComponentProperty, AppConfig, RemoteDevice, PropertyEditor, CreateNewConfig, ExportAppBody, FormTimerConfig, ComponentGroup, ComponentRect, FormDimensionItem } from '@haku-design/core';
import { CrossAxisAlignment, DeviceType, LayoutType, MainAxisAlignment, ComponentPropertyEditor, ComponentPropertyGroup, AppType, ComponentCategory, PageType, PropertyLayout } from '@haku-design/core';
import bus, { GlobalBusType } from '@/tools/bus';
import { getComponents } from '@/data/form-components';
import { initRemoteDevices } from '@/data/form-devices';
import { getEditors } from '../../data/property-editor';
import { getMenuComponentItems } from '../../data/menu-component-items';
import { state as configState, service as configService } from '@/modules/config-module';
import { state as eventState, service as eventService, EventTriggerType } from '@/modules/event-module';
import { state as storageState } from "@/modules/storage-module";
import { service as formFillService, type FormInfoItem } from '@/modules/form-fill-module';
import { state as themeState, service as themeService, ThemeConfig } from "@/modules/theme-module";
import { state as historyState, service as historyService } from '@/modules/history-module';
import { state as draggableState, service as draggableService } from '@/modules/draggable-module';
import { service as pluginModule } from '@/modules/plugin-module';
import { createModelId, timeout } from '@/tools/common';
import { AppPage } from '@haku-design/core';
import { state as globalState } from '@/common/global';
import { useAppHandle } from '@/common/app-handle';

const {
  getExportData,
  setDefaultProp
} = useAppHandle();

/** 设备信息表 */
const remoteDevices = initRemoteDevices();

/** 记录问卷操作记录的缓存KEY */
const OperationRecord = '__hakuform__operation__';

import { getFileListByIds } from '@/modules/storage-module/api';
import { formCommands } from '@/data/form-commands';
import { toast } from '@/common/message';
import { editApp } from '@/api/app';
import { appBody2AppInfoDto } from '@/model/app-info-dto';

/** 问卷编辑模块逻辑 */
export const service = {
  /** 创建AppConfig */
  createAppConfig({
    appType,
    isInit,
    formId,
    appTitle,
    width,
    height,
    description,
    layoutConfig,
    deviceType,
  }: {
    appType: AppType,
    isInit: boolean,
    formId?: string,
    appTitle?: string,
    width?: number,
    height?: number,
    description?: string,
    layoutConfig?: LayoutConfig<LayoutType.flex | LayoutType.absolute>,
    deviceType?: DeviceType,
  }): AppConfig {
    if (appType === AppType.canvas) {
      if (!width) throw new Error('画布宽度不能为空');
      if (!height) throw new Error('画布高度不能为空');
    }
    return {
      id: formId || '',
      appVersion: 1,
      appTitle: appTitle || '',
      appType: appType,
      description: description || '',
      headerTags: [],
      headerContent: '',
      appTheme: 'default',
      remark: '',
      background: [],
      layoutConfig: layoutConfig ?? {
        layout: LayoutType.flex,
        layoutDetailConfig: {
          direction: 'column',
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center
        },
      },
      designConfig: {
        isInit: isInit,
        deviceType: deviceType ?? DeviceType.mobile,
        componentIndex: 1,
        themeCode: 'default',
        prevThemeCode: 'default'
      },

      /** 问卷配置 */
      questionnaireConfig: {
        turnPageMode: 'default',
        showPageProgress: true,
        showPageButton: true,
        headerHeight: 48,
        showNo: true,
        timerConfig: {
          isOpen: false,
        },
        dimensionConfig: {
          isOpen: false,
          dimensionList: [] as FormDimensionItem[],
        },
        footer: {
          isShow: false,
          submitButtonText: '提交',
          resetButton: false,
          resetButtonText: '重置'
        },
        hasScore: false,
        isAutoToGrade: true,
        startPageConfig: {
          isOpen: false,
        },
        endPageConfig: {
          isOpen: false,
        },
        ratingList: [
          { startScore: 0, title: '分数正常' }
        ],
        useAutoCache: true,
        autoCacheDuration: 3600000
      },

      /** 画布配置 */
      canvasConfig: {
        width: width || 0,
        height: height || 0,
        scale: 1,
      },

      createdTime: Date.now(),
      updatedTime: Date.now(),
    };
  },
  /** 展开/收起左侧侧边栏 */
  toggleAsidePanel() {
    state.asideFold = !state.asideFold;
    this.refresh();
  },
  /** 获取选择的组件范围 */
  getSelectedComponentRect(selected?: (Component | ComponentGroup)[]): ComponentRect {
    const _selected = selected ?? state.currentSelectedComponents;
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    for (let i = 0; i < _selected.length; i++) {
      const _component = _selected[i];
      if (_component.attrs.x < minX) minX = _component.attrs.x;
      if (_component.attrs.y < minY) minY = _component.attrs.y;
      if (_component.attrs.x + _component.attrs.width > maxX) maxX = _component.attrs.x + _component.attrs.width;
      if (_component.attrs.y + _component.attrs.height > maxY) maxY = _component.attrs.y + _component.attrs.height;
    }

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY, x2: maxX, y2: maxY, rotate: 0 };
  },
  /** 显示组件 */
  showComponentInFormPage(componentId: string, pageIndex?: number): boolean {
    const _pageIndex = pageIndex ?? state.currentPageIndex;
    let componentIndex: number | undefined = undefined;
    let component: Component | ComponentGroup | undefined = undefined;
    let _index = 0;
    for (let i = 0; i < state.pages[_pageIndex].children.length; i++) {
      const _componet = state.pages[_pageIndex].children[i];
      if ( componentId === _componet.id) {
        componentIndex = _index;
        component = _componet;
        break;
      }
      _index++;
    }
    if (componentIndex !== undefined) {
      if (state.pages[_pageIndex].pageType === PageType.normalPage && component) {
        if (state.appConfig.questionnaireConfig.turnPageMode === 'no-page') {
          return true;
        } else {
          // 每题一页
          if (state.appConfig.questionnaireConfig.turnPageMode === 'page') {
            return componentIndex === state.currentFormPageIndex;
          } else if (state.appConfig.questionnaireConfig.turnPageMode === 'default') {
            // 默认的情况，默认则根据分页器决定如何分页
            const _splitIndexList = (state.pages[_pageIndex].children as Component[])
              .map((i, index) => i.name === 'q-page-split' ? index : undefined)
              .filter(i => i) as number[];
            if (_splitIndexList.length === 0) return true;
            else if (state.currentFormPageIndex < 0 || state.currentFormPageIndex > _splitIndexList.length) return false;
            else if (state.currentFormPageIndex === 0) return componentIndex < _splitIndexList[0];
            else if (state.currentFormPageIndex === _splitIndexList.length) return componentIndex > _splitIndexList[state.currentFormPageIndex - 1];
            else {
              return (
                componentIndex > _splitIndexList[state.currentFormPageIndex - 1] &&
                componentIndex < _splitIndexList[state.currentFormPageIndex]
              );
            }
          }
        }
        // !state.appConfig.turnPageMode || (isPreview && state.appConfig.turnPageMode && index == state.currentFormPageIndex)
        return false;
      } else {
        return true;
      }
    }
    return false;
  },
  /** 构建组件布局 */
  buildComponentLayout(type: LayoutType): LayoutConfig<typeof type> {
    let _config = {};
    if (type === LayoutType.flex) {
      _config = {
        direction: 'row',
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start
      };
    } else if (type === LayoutType.absolute) {
      _config = {
        height: 100
      };
    } else if (type === LayoutType.table) {
      _config = {
        rowCount: 1,
        colCount: 1
      };
    }
    return {
      layout: type,
      layoutDetailConfig: {},
      ..._config
    }
  },
  /** 发布 */
  publish() {
    toast('发布', 'loading');
  },
  /** 记录操作问卷 */
  setOperationRecord() {
    try {
      const localOperation = localStorage.getItem(OperationRecord);
      let operationRecordList = [] as any[];
      if (localOperation) {
        operationRecordList = JSON.parse(localOperation);
      }
      const index = operationRecordList.findIndex(x => x.id === state.appConfig.id);
      const questionary = { 
        id: state.appConfig.id,
        appTitle: state.appConfig.appTitle,
        appType: state.appConfig.appType,
        appVersion: state.appConfig.appVersion,
        description: state.appConfig.description,
        createTime: new Date().getTime(),
        previewUrl: state.previewUrl,
      }
      if (index > -1) {
        operationRecordList[index] = questionary;
      } else {
        operationRecordList.push(questionary);
      }
      localStorage.setItem(OperationRecord, JSON.stringify(operationRecordList));
    } catch (e) {
      console.warn(e);
    }
  },
  /** 获取问卷操作记录 */
  getOperationRecord({pageNum=1, pageSize = 10}) {
    return new Promise((resolve, reject) => {
      try {
        let operationRecordList = [] as any[];
        const localOperation = localStorage.getItem(OperationRecord);
        if (localOperation) {
          operationRecordList = JSON.parse(localOperation).sort((a, b) => b.createTime-a.createTime);
        }
        const res = {
          rows: operationRecordList.slice((pageNum -1 )*pageSize, pageSize),
          total: operationRecordList.length
        }
        resolve(res);
      } catch (e: any) {
        reject(e);
      }
    });
  },
  /** 删除问卷操作记录 */
  deleteOperationRecord(id: string) {
    try {
      const localOperation = localStorage.getItem(OperationRecord);
      let operationRecordList = [] as any[];
      if (localOperation) {
        operationRecordList = JSON.parse(localOperation);
      }
      const index = operationRecordList.findIndex(x => x.id === id);
      if (index > -1) {
        operationRecordList.splice(index,1); 
      }
      localStorage.setItem(OperationRecord, JSON.stringify(operationRecordList));
    } catch (e) {
      console.warn(e);
    }
  },
  /** 新建 */
  createNew(createConfig: CreateNewConfig, isPreview: boolean = false) {
    if (!isPreview) service.changeSelectedFormComponent([]);
    if (createConfig.type === AppType.questionnaire) {
      service.initFormByForm(undefined, createConfig.id, { appTitle: createConfig.title, description: createConfig.description });
    } else if (createConfig.type === AppType.complexComponent) {
      service.initFormByComplexComponent(undefined, createConfig.id, { appTitle: createConfig.title, description: createConfig.description });
    } else if (createConfig.type === AppType.canvas) {
      service.initFormByCanvas(undefined, createConfig.id, { appTitle: createConfig.title, description: createConfig.description });
    }

    themeService.changeTheme();
    if (!createConfig.id) {
      const _body = {
        ...service.exportData(),
        title: createConfig.title,
        description: state.appConfig.description,
      } as ExportAppBody;
      editApp(appBody2AppInfoDto(_body)).then(d => {
        state.appConfig.id = d.id + '';
        service.setOperationRecord();
      });
    }
  },
  /** 新建本地问卷 */
  createNewByLocal(createConfig: CreateNewConfig, isPreview: boolean = false) {
    if (!isPreview) service.changeSelectedFormComponent([]);
    if (createConfig.type === AppType.questionnaire) {
      service.initFormByForm(undefined, createConfig.id, { appTitle: createConfig.title, description: createConfig.description });
    } else if (createConfig.type === AppType.complexComponent) {
      service.initFormByComplexComponent(undefined, createConfig.id, { appTitle: createConfig.title, description: createConfig.description });
    } else if (createConfig.type === AppType.canvas) {
      service.initFormByCanvas(undefined, createConfig.id, { appTitle: createConfig.title, description: createConfig.description });
    }
    themeService.changeTheme();
  },
  /** 获取基本Dom节点 */
  getBasicDom() {
    state.canvasPanelEl = document.querySelector('.form-canvas')!;
    state.canvasEl = document.querySelector('.design-form-canvas')!;
  },
  /** 初始化 */
  init() {
    if (state.appConfig.designConfig.deviceType === 'pc') {
      globalState.isMobile = false;
    } else if (state.appConfig.designConfig.deviceType === 'mobile') {
      globalState.isMobile = true;
    }
    
    configService.init();
    bus.$emit(GlobalBusType.refreshShopComponent);
    nextTick(() => {
      service.getBasicDom();
      pluginModule.onAppLoad();
    });
  },
  /** 初始化复合组件 */
  initFormByComplexComponent(form?: ExportAppBody, formId?: string, appConfig?: Record<string, any>) {
    if (form) {
      state.appConfig = form.appConfig;
      if (formId) state.appConfig.id = formId;

      // let _componentTree = fillPropertys(form.components.children);
      // console.log(_componentTree);
      state.pages = form.pages;
    } else {
      const _defaultDevice = remoteDevices.iphone678;
      state.appConfig = service.createAppConfig({
        appType: AppType.complexComponent,
        isInit: true,
        appTitle: appConfig?.title || '',
        description: appConfig?.description || '',
        width: _defaultDevice.width,
        height: _defaultDevice.height,
        deviceType: DeviceType.mobile,
        layoutConfig: {
          layout: LayoutType.flex,
          layoutDetailConfig: {
            direction: 'column',
          }
        } as LayoutConfig<LayoutType.flex>,
      });
      state.pages[0].children = [];
    }

    state.currentSelectedComponents = [];
    state.currentSelectedFirstComponentId = '';
    state.currentSelectedComponentPropertyGroups = [];
    state.currentSelectedComponentPropertyMap = {};

    setTimeout(() => {
      service.getBasicDom();
      service.refresh();
    }, 200);
    service.init();
  },
  /** 加载初始化组件属性列表 */
  loadComponentPropertys(component: Component, loadDefault: boolean = false) {
    const _index = state.componentList.findIndex(i => i.name === component.name);
    if (_index >= 0) {
      if (!component.answerType) component.answerType = state.componentList[_index].answerType;
      component.propertys = cloneLoop(state.componentList[_index].propertys);
      if (loadDefault) {
        setDefaultProp(component.attrs, component.propertys);
      }
    }
  },
  /** 获取所有组件 */
  getAllComponents(...pages: AppPage[]) {
    const _componentList: Component[] = [];
    const _pages = pages?.length ? pages : state.pages;
    
    const _cb = (component) => {
      _componentList.push(component);
      if (component.children) {
        for (let i = 0; i < component.children.length; i++) _cb(i);
      }
    };

    _pages.forEach(i => i.children.forEach(_cb));
    return _componentList;
  },
  /** 获取组件数量 */
  getComponentCount(...pages: AppPage[]) {
    let _componentCount = 0;
    const _pages = pages?.length ? pages : state.pages;
    
    const _cb = (component) => {
      _componentCount++;
      if (component.children) {
        for (let i = 0; i < component.children.length; i++) _cb(i);
      }
    };

    _pages.forEach(i => i.children.forEach(_cb));
    return _componentCount;
  },
  /** 初始化问卷 */
  initFormByForm(form?: ExportAppBody, formId?: string, appConfig?: Record<string, any>) {
    if (form) {
      state.appConfig = form.appConfig;
      if (formId) state.appConfig.id = formId;

      // let _componentTree = fillPropertys(form.components.children);
      // console.log(_componentTree);
      state.pages = form.pages;
      eventState.allEvents = form.events;

      service.getAllComponents(...form.pages).forEach(i => service.loadComponentPropertys(i));
    } else {
      const _defaultDevice = remoteDevices.iphone678;
      state.appConfig = service.createAppConfig({
        appType: AppType.questionnaire,
        isInit: true,
        appTitle: appConfig?.title || '测试问卷',
        description: appConfig?.description || '',
        width: _defaultDevice.width,
        height: _defaultDevice.height,
        deviceType: DeviceType.mobile,
        layoutConfig: {
          layout: LayoutType.flex,
          layoutDetailConfig: {
            direction: 'column',
          }
        } as LayoutConfig<LayoutType.flex>,
      });
      state.pages[0].children = [];
    }

    state.currentSelectedComponents = [];
    state.currentSelectedFirstComponentId = '';
    state.currentSelectedComponentPropertyGroups = [];
    state.currentSelectedComponentPropertyMap = {};

    setTimeout(() => {
      service.getBasicDom();
      service.refresh();
    }, 200);
    service.init();
  },
  /** 初始化画布 */
  initFormByCanvas(form?: ExportAppBody, formId?: string, appConfig?: Record<string, any>) {
    if (form) {
      state.appConfig = form.appConfig;
      if (formId) state.appConfig.id = formId;

      // let _componentTree = fillPropertys(form.components.children);
      // console.log(_componentTree);
      state.pages = form.pages;
      eventState.allEvents = form.events;

      service.getAllComponents(...form.pages).forEach(i => service.loadComponentPropertys(i));
    } else {
      const _defaultDevice = remoteDevices['2kpc'];
      state.appConfig = service.createAppConfig({
        appType: AppType.canvas,
        isInit: true,
        appTitle: appConfig?.title || '测试画布',
        description: appConfig?.description || '',
        width: _defaultDevice.width,
        height: _defaultDevice.height,
        deviceType: DeviceType.pc,
        layoutConfig: {
          layout: LayoutType.flex,
          layoutDetailConfig: {
            direction: 'column',
          }
        } as LayoutConfig<LayoutType.flex>,
      });
      state.pages[0].children = [];
    }

    state.currentSelectedComponents = [];
    state.currentSelectedFirstComponentId = '';
    state.currentSelectedComponentPropertyGroups = [];
    state.currentSelectedComponentPropertyMap = {};

    setTimeout(() => {
      service.getBasicDom();
      service.refresh();
    }, 200);
    service.init();
  },
  /** 获取导出数据 */
  exportData() {
    return getExportData({
      isPublished: false,
      pages: state.pages,
      events: eventState.allEvents,
      theme: {
        id: themeState.themeConfig.id,
        code: themeState.currentThemeCode,
        config: themeState.themeConfig,
        title: themeState.themeConfig.title,
      },
      files: storageState.fileList.map(i => i.id),
      previewUrl: '',
      appConfig: state.appConfig
    });
  },
  /** 加载应用主体 */
  async loadAppBody(questionaryId: string, body: ExportAppBody, isPreview: boolean = false) {
    try {
      if (!isPreview) service.changeSelectedFormComponent([]);
      const hide = toast('数据加载中...', 'loading');
      if (body?.files?.length) {
        const _fileList = await getFileListByIds(...body.files);
        storageState.fileList.push(..._fileList);
      }
      switch (body.appConfig.appType) {
        case AppType.questionnaire:
          service.initFormByForm(body);
          break;
        case AppType.canvas:
          service.initFormByCanvas(body);
          break;
        default:
          break;
      }
      state.appConfig.id = questionaryId;
      state.previewUrl = body.previewUrl || '';
      eventState.allEvents = body.events;
      themeService.changeTheme({
        ...body?.themeConfig,
        ...body?.themeConfig?.config,
      } as unknown as ThemeConfig);
      hide.clear();
      await timeout(100);
      eventService.emit(EventTriggerType.appLoadingComplete, 'global');
      if (!isPreview) toast('加载完成', 'success');
    } catch(err) {
      toast('加载数据出错', 'error');
      console.error(err);
    }
  },
  /** 切换当前选择的控件 */
  async changeSelectedFormComponent(formComponents: (Component | ComponentGroup)[], isRefresh: boolean = false) {

    // 刷新属性栏
    if (isRefresh) {
      await service.changeSelectedFormComponent([]);
      await timeout(20);
    }
    
    // TODO: 如果页面太长看不到则自动滚动到可视区域
    // scrollIntoView({block:“center”,inline:“center”})
    if (window['scrollIntoViewIfNeeded']) {

    } else if (window['scrollIntoView']) {
      window['scrollIntoView'](true);
    }

    // 设置焦点，从而提交未保存属性
    if (!state.footerDom) state.footerDom = document.querySelector('.design-form-footer') as HTMLElement;
    state.footerDom.focus();
    
    await timeout(20);

    bus.$emit(GlobalBusType.componentChange, formComponents);
    bus.$emit(GlobalBusType.propChange);

    state.currentSelectedComponents = formComponents;

    
    if (formComponents.length) {
      // TODO: 确认值改变行为
      const formComponent = state.currentSelectedComponents?.[0];
      state.currentSelectedFirstComponentId = formComponent.id;

      if (!formComponent.isGroup) {
        // 获取当前选择组件的属性表
        const _propertys = cloneLoop(formComponent.propertys) as ComponentProperty<any>[];

        // 判断题型组件是否需要评分，是的话添加评分属性，并给子项添加子项评分
        if ([ComponentCategory.normal, ComponentCategory.complex].includes(formComponent.type) && state.appConfig.questionnaireConfig.hasScore) {
          const _propIndex = formComponent.propertys.findIndex(prop => prop.name === 'options' && prop.editor === ComponentPropertyEditor.modelList);
          if (_propIndex >= 0) {
            const _propOptions = _propertys[_propIndex]?.attrs?.columns;
            if (_propOptions) {
              _propOptions.push({
                name: 'score', width: '80px', title: '分数', default: 1, editor: ComponentPropertyEditor.int, attrs: { min: 1, max: 100 }
              });
            }
          }
          _propertys.push({
            name: 'score', title: '分数', default: 1,
            group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.int, attrs: { suffix: '分', min: 0, max: 100 }
          });
        }

        // 判断是否为子组件，是的话看父组件有没有子组件属性
        const parentComponentInfo = service.findParentComponent(formComponent.id);
        if (parentComponentInfo?.component?.childPropertys) {
          _propertys.push(...(parentComponentInfo?.component.childPropertys || []));
        }

        // 所有组件添加额外数据功能
        if (configState.config.showAttaProps) {
          _propertys.push({
            name: 'attaProps', title: '额外属性', default: {}, layout: PropertyLayout.block,
            group: ComponentPropertyGroup.data, editor: ComponentPropertyEditor.json, attrs: { height: '200px' }
          });
        }

        setDefaultProp(formComponent.attrs, _propertys);

        state.currentSelectedComponentPropertyMap = Object.assign({}, ..._propertys.map(i => {
          const _name = Array.isArray(i.name) ? i.name.join('_') : i.name;
          return { [_name]: i };
        }));
        state.currentSelectedComponentPropertyGroups = Object.entries(ComponentPropertyGroup).map(([key, value]) => ({
          title: value,
          propertys: _propertys.filter(i => i.group === value) as ComponentProperty<any>[]
        })).filter(i => i.propertys.length);
      } else {
        state.currentSelectedComponentPropertyMap = {};
        state.currentSelectedComponentPropertyGroups = [];
      }
    } else {
      state.currentProp = {};
      state.currentSelectedFirstComponentId = undefined;
      state.currentSelectedComponentPropertyMap = {};
      state.currentSelectedComponentPropertyGroups = [];
    }
  },
  /** 页面重绘 */
  refresh() {
    if (!state.canvasPanelEl) return;
    service.getBasicDom();
    if (!state.canvasPanelEl) return;
    const { y, x } = state.canvasPanelEl.getBoundingClientRect();
    state.canvasLocation.y = state.canvasPanelEl.scrollTop - y;
    state.canvasLocation.x = state.canvasPanelEl.scrollLeft - x;

    if (state.canvasEl) {
      const _canvasPage = state.canvasEl.querySelector('.design-form-canvas-page')! as HTMLElement;
      state.canvasRect = {
        x: _canvasPage.offsetLeft ?? 0,
        y: _canvasPage.offsetTop ?? 0,
      };
      draggableState.canvasViewportWidth = state.canvasEl.offsetWidth;
      draggableState.canvasViewportHeight = state.canvasEl.offsetHeight;
    }
  },
  /**
   * 合并表单数据（需要根据题目合并）
   * @param {Component[]} components 传入的新的组件树
   * @param {Record<string, FormInfoItem>} formdata 当前答案列表
   * @return {Record<string, FormInfoItem>} 需要填充的表单数据
   */
  mergeFormData(newComponents: (Component | ComponentGroup)[], formdata: Record<string, FormInfoItem>): Record<string, FormInfoItem> {
    const _re: Record<string, FormInfoItem> = {};
    // 1、将传入的组件树及当前组件树铺平，并且只取题目类型（isFormItem）
    const newComponentList: (Component | ComponentGroup)[] = service.getAllFormItem(newComponents);
    const oldComponentList: (Component | ComponentGroup)[] = service.getAllFormItem();
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
    return componentId ? (canvasEl ?? state.canvasPanelEl).querySelector(`[component-id="${componentId}"]`) ?? undefined : undefined;
  },
  /** 显示或隐藏游标 */
  changeComponentCursorByLine(component: HTMLElement | undefined | false, isAfter: boolean = false, isInner: boolean = true) {
    state.componentCursorEl.className = 'form-canvas-cursor cursor-line';
    if (component !== false) {
      if (!component && state.componentCursorParentEl !== state.rootPanelEl) {
        if (isAfter) {
          state.rootPanelEl.insertAdjacentElement(isInner ? 'beforeend' : 'afterend', state.componentCursorEl);
        } else {
          state.rootPanelEl.insertAdjacentElement(isInner ? 'afterbegin' : 'beforebegin', state.componentCursorEl);
        }
        state.componentCursorParentEl = state.rootPanelEl;
        state.componentCursorIsAfter = isAfter;
      } else if (component && (state.componentCursorParentEl != component || state.componentCursorIsAfter !== isAfter)) {
        if (isAfter) {
          component.insertAdjacentElement(isInner ? 'beforeend' : 'afterend', state.componentCursorEl);
        } else {
          component.insertAdjacentElement(isInner ? 'afterbegin' : 'beforebegin', state.componentCursorEl);
        }
        state.componentCursorParentEl = component;
        state.componentCursorIsAfter = isAfter;
      }
    } else if (state.componentCursorParentEl) {
      state.componentCursorEl?.remove();
      state.componentCursorParentEl = undefined;
      state.componentCursorIsAfter = undefined;
    }
  },
  /** 显示或隐藏组件类型游标 */
  changeComponentCursorByBlock(config: {
    x: number,
    y: number,
    width: number,
    height: number
  }, component: HTMLElement | undefined | false) {
    // state.componentCursorEl.className = 'form-canvas-cursor cursor-block';
    // state.componentCursorEl.setAttribute('style', `left:${config.x}px;top:${config.y}px;width:${config.width}px;height:${config.height}px;`);
    // if (component !== false) {
    //   state.componentCursorEl.style.width = `${config.width}px`;
    //   state.componentCursorEl.style.height = `${config.height}px`;
    //   if (!component && state.componentCursorParentEl !== state.rootPanelEl) {
    //     state.rootPanelEl.insertAdjacentElement('beforeend', state.componentCursorEl);
    //     state.componentCursorParentEl = state.rootPanelEl;
    //   } else if (component && (state.componentCursorParentEl != component)) {
    //     component.insertAdjacentElement('beforeend', state.componentCursorEl);
    //     state.componentCursorParentEl = component;
    //   }
    //   state.componentCursorIsAfter = undefined;
    // } else if (state.componentCursorParentEl) {
    //   state.componentCursorEl?.remove();
    //   state.componentCursorParentEl = undefined;
    //   state.componentCursorIsAfter = undefined;
    // }
  },
  /** 保存问卷 */
  saveQuestionnaire() {
    if (!state.appConfig.id) {
      state.appConfig.id = createModelId();
    }
    const _exportData = cloneLoop(service.exportData());
    /** 是否需要升级 */
    let _canUpgrade = false;
    if (historyState.saveHistoryIndex <= historyState.historyIndex) {
      for (let i = historyState.saveHistoryIndex; i < historyState.historyData.length; i++) {
        if (formCommands[historyState.historyData[i].type].updatable) {
          _canUpgrade = true;
          break;
        }
      }
    } else {
      _canUpgrade = true;
    }
    const hide = toast(_canUpgrade ? '问卷更新中...' : '问卷保存中...', 'loading', 0);
    if (_exportData) {
      _exportData.appConfig.appVersion += 1;
    }
    editApp(appBody2AppInfoDto(_exportData)).then(d => {
      historyState.saveHistoryIndex = historyState.historyIndex;
      configService.setSaveHistory(state.appConfig.id);
      configState.saveHistory;
      setTimeout(() => {
        hide.clear();
        toast(_canUpgrade ? '问卷更新成功' : '问卷保存成功', 'success');
      }, 300);
    }).catch(err => {
      hide.clear();
      toast(err.message || '保存问卷出错', 'error');
    });
  },
  /** 页面调整大小 */
  onPageSize() {
    setTimeout(() => {
      service.refresh();
      const _dom = document.querySelector('.design-form-canvas-page');
      if (_dom) {
        state.appConfig.canvasConfig.width = _dom.clientWidth;
      }
      if (!state.canvasEl) state.canvasEl = document.querySelector('.design-form-canvas')!;
      if (state.canvasEl) {
        draggableState.canvasViewportWidth = state.canvasEl.offsetWidth;
        draggableState.canvasViewportHeight = state.canvasEl.offsetHeight;
      }
    }, 210);
  },
  /** 跳转到上一页（问卷分页） */
  prevPage() {
    if (state.currentFormPageIndex > 0) {
      state.currentFormPageIndex--;
      eventService.emit(EventTriggerType.prevPage);
      service.onChangePage();
    } else {
      toast('已经是第一页');
    }
  },
  /** 跳转到下一页（问卷分页） */
  async nextPage() {
    if (state.currentFormPageIndex < state.maxFormPageCount) {
      const { isComplete } = await formFillService.validateForm(state.currentFormPageIndex);
      if (isComplete) {
        state.currentFormPageIndex++;
        eventService.emit(EventTriggerType.nextPage);
        service.onChangePage();
      }
    } else {
      toast('已经是最后一页');
    }
  },
  /** 跳转到某一页（问卷分页） */
  gotoPage(index: number) {
    if (index > 0 && index < state.maxFormPageCount) {
      if (index !== state.currentFormPageIndex) {
        state.currentFormPageIndex = index;
        service.onChangePage();
      }
    } else {
      toast('页数参数不正确', 'warning');
    }
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
    if (newPageIndex >= 0 && newPageIndex < state.maxFormPageCount) {
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
  /** 跳转到某一页（实体页） */
  gotoAppPage(newPageIndex: number) {
    if (newPageIndex >= 0 && newPageIndex < state.pages.length) {
      state.currentPageIndex = newPageIndex;
    } else {
      throw new Error('传入的页数不正确');
    }
  },
  /** 根据组件列表（树）查询所有表单项，返回列表，如果不传则默认查询普通页面下所有组件 */
  getAllFormItem(rootComponents?: (Component | ComponentGroup)[], filter?: (component: (Component | ComponentGroup)) => boolean) {
    const _rootComponents: (Component | ComponentGroup)[] = rootComponents ?? (state.pages.filter((i) => i.pageType === PageType.normalPage).map(i => i.children) || []).flat();
    const _components: (Component | ComponentGroup)[] = [];
    const _cb = (parentComponent: (Component | ComponentGroup)) => {
      if (filter) {
        if (filter(parentComponent)) _components.push({
          ...parentComponent,
          children: []
        });
      } else {
        _components.push({
          ...parentComponent,
          children: []
        });
      }
      if (parentComponent.children?.length) {
        for (let i = 0; i < parentComponent.children.length; i++) {
          const item = parentComponent.children[i];
          _cb(item);
        }
      }
    };
    _rootComponents.forEach(item => _cb(item));
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
        parentComponent.children.forEach(item => {
          if (item.id === componentId) {
            _component = item;
            return;
          }
          else _cb(item);
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
          }
          else _cb(item, index);
        });
        if (_index !== undefined) return;
      }
    };
    (state.currentPage.children as Component[]).forEach(_cb);
    return _index;
  },
  /** 查询父组件及索引 */
  findParentComponent(componentId: string, { ignoreHidden, ignoreNotForm, appPage }: {
    /** 忽略隐藏项 */
    ignoreHidden: boolean,
    /** 忽略非表单项 */
    ignoreNotForm: boolean,
    /** 指定查询页面 */
    appPage?: AppPage
  } = { ignoreHidden: false, ignoreNotForm: false, appPage: undefined }): { component: Component, originComponent: Component, index: number, level: number } | undefined {
    let _component: Component | ComponentGroup | undefined;
    let _originComponent: Component | ComponentGroup | undefined;
    let _index: number | undefined = undefined;
    let _level: number = 0;
    const _page = appPage ?? state.currentPage;
    const _cb = (component: (Component | ComponentGroup), index: number, parentComponent: (Component | ComponentGroup), level: number) => {
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
        _children.forEach(item => {
          if (item.id === componentId) {
            _index = index;
            _component = component;
            _originComponent = item;
            _level = level + 1;
            return;
          }
          else _cb(item, index, component, level + 1);
          if (!ignoreHidden || ignoreHidden && item.attrs.visible) {
            if (!ignoreNotForm || ignoreNotForm && !item.isGroup && item.isFormItem) {
              index++;
            }
          }
        });
        if (_index !== undefined) return;
      }
    };
    let index = 0;
    _page.children.forEach(item => {
      _cb(item, index, _page as unknown as (Component | ComponentGroup), 0);
      if (!ignoreHidden || ignoreHidden && item.attrs.visible) {
        if (!ignoreNotForm || ignoreNotForm && !item.isGroup && item.isFormItem) {
          index++;
        }
      }
    });
    if (_component !== undefined && _index !== undefined) {
      return  {
        component: _component as Component,
        originComponent: _originComponent as Component,
        index: _index as number,
        level: _level as number
      };
    } else {
      return undefined;
    }
  },
  /** 新增组件 */
  addComponent(component: Component, {
    index,
    parentComponentId,
    parentComponentSlotIndex,
    x, y
  }: {
    /** 组件插入索引 */
    index?: number,
    /** 插入父组件Id */
    parentComponentId?: string,
    /** 插入父组件插槽索引 */
    parentComponentSlotIndex?: number,
    /** X坐标 */
    x?: number,
    /** Y坐标 */
    y?: number,
  } = {}) {
    let _parentComponent: Component | ComponentGroup | undefined = undefined;
    if (!component.attrs.name) {
      if (!state.globalComponentIndexMap[component.component]) state.globalComponentIndexMap[component.component] = 1;
      component.attrs.name = `${component.title}${state.globalComponentIndexMap[component.component]}`;
      state.globalComponentIndexMap[component.component]++;
    }
    if (index !== undefined) {
      if (!parentComponentId) {
        state.currentPage.children.splice(index, 0, component);
      } else {
        _parentComponent = service.findComponent(parentComponentId);
        if (_parentComponent) {
          component.slotIndex = parentComponentSlotIndex;
          _parentComponent.children?.splice(index, 0, component);
        } else {
          throw new Error('未查找到父组件');
        }
      }
    } else {
      if (!parentComponentId) {
        state.currentPage.children.push(component);
      } else {
        _parentComponent = service.findComponent(parentComponentId);
        if (_parentComponent) {
          component.slotIndex = parentComponentSlotIndex;
          _parentComponent.children?.push(component);
        } else {
          throw new Error('未查找到父组件');
        }
      }
    }
    if (x !== undefined) component.attrs.x = x;
    if (y !== undefined) component.attrs.y = y;

    service.setParentDefaultProps(component, _parentComponent);
  },
  /** 移动组件 */
  moveComponent(fromComponentId: string, {
    toIndex,
    toParentComponentId,
    toParentComponentSlotIndex,
    x, y
  }: {
    /** 组件插入索引 */
    toIndex: number | undefined,
    /** 插入父组件Id */
    toParentComponentId?: string,
    /** 插入父组件插槽索引 */
    toParentComponentSlotIndex?: number,
    /** X坐标 */
    x?: number,
    /** Y坐标 */
    y?: number,
  } = { toIndex: 0 }) {
    const _toIndex = toIndex ?? 0;
    // TODO: 需要组件移动后需要处理slotIndex属性
    let _fromChildren: (Component | ComponentGroup)[];
    let _toChildren: (Component | ComponentGroup)[];
    let _toComponent: Component | ComponentGroup | undefined = undefined;
    const _fromParent = service.findParentComponent(fromComponentId);
    const _fromIndex = _fromParent?.index;
    if (_fromIndex === undefined) throw new Error('未查询到组件索引');
    if (_fromParent?.component.id !== toParentComponentId) {
      _fromChildren = _fromParent?.component.children || [];
      if (toParentComponentId !== undefined) {
        _toComponent = service.findComponent(toParentComponentId);
      } else {
        _toComponent = state.currentPage as unknown as Component;
      }
      _toChildren = _toComponent?.children || [];
    } else {
      _toComponent = service.findParentComponent(fromComponentId)?.component;
      _fromChildren = _toComponent?.children || [];
      _toChildren = _fromChildren;
    }

    const _component = _fromChildren[_fromIndex];
    if (toParentComponentSlotIndex !== undefined) _component.slotIndex = toParentComponentSlotIndex;

    // 判断如果被拖出父组件，则自动删除原始子属性默认值
    service.setParentDefaultProps(_component, _fromParent?.component, false);
    // 判断如果拖拽到父组件下，则自动赋值子属性默认值
    service.setParentDefaultProps(_component, _toComponent);

    _toChildren.splice(_toIndex, 0, _component);
    if (_fromParent?.component.id === _toComponent?.id) {
      if (_toIndex > _fromIndex) _fromChildren.splice(_fromIndex, 1);
      else _fromChildren.splice(_fromIndex + 1, 1);
    } else {
      _fromChildren.splice(_fromIndex, 1);
    }
    if (x !== undefined) _component.attrs.x = x;
    if (y !== undefined) _component.attrs.y = y;
    // service.changeSelectedFormComponent();
    // service.refresh();
    // setTimeout(() => {
    //   service.changeSelectedFormComponent(_component);
    // }, 10);
  },
  /** 设置父组件默认属性值 */
  setParentDefaultProps(component: Component | ComponentGroup, parentComponent?: Component | ComponentGroup, isPush: boolean = true) {
    if (parentComponent && !parentComponent.isGroup && parentComponent.childPropertys?.length) {
      setDefaultProp(component.attrs, parentComponent.childPropertys);
    }
  },
  /** 删除组件 */
  removeComponent(component: Component) {
    const _component = service.findParentComponent(component.id);
    if (_component?.component?.children !== undefined && _component.index >= 0) {
      formFillService.removeFormInfo(component.id);
      _component?.component?.children.splice(_component.index, 1);
    }
  },
  /** 设置组件的属性值类型 */
  setComponentAttrType<T extends ComponentPropertyEditor>(component: Component, property: ComponentProperty<T>, propertyType: any) {
    const _index = state.currentPage.children.findIndex(i => i.id == component.id);
    if (_index >= 0) {
      const _name = Array.isArray(property.name) ? property.name.join('_') : property.name;

      state.currentPropertyEditors[_name] = propertyType;
      if (component?.propertyEditors) component.propertyEditors[_name] = propertyType;
      component.attrs[_name] = property.default;
      component.attrs['__' + _name] = '';
    }
  },
  /** 设置设计器主题 */
  selectDesignTheme(themeCode: 'default' | 'dark' | 'translucent', themeTitle: string, loc?: {
    x: number;
    y: number;
  } | undefined) {
    historyService.exec('change-theme', {
      objectId: 'global',
      value: themeCode,
      attrs: {
        themeTitle: themeTitle,
        loc: loc,
      }
    });
  },
};

/** 问卷编辑模块状态 */
export const state = reactive({
  /** 是否已发布 */
  isPublished: false,
  /** 应用配置 */
  appConfig: service.createAppConfig({
    appType: AppType.questionnaire,
    isInit: false,
    appTitle: '测试问卷',
    description: '',
    width: 0,
    height: 0,
    deviceType: DeviceType.mobile,
    layoutConfig: {
      layout: LayoutType.flex,
      layoutDetailConfig: {
        direction: 'column',
      }
    } as LayoutConfig<LayoutType.flex>,
  }),
  /** 左侧栏是否展开 */
  asideFold: false,
  /** 画布尺寸及边距 */
  canvasRect: { x: 0, y: 0 } as { x: number, y: number },
  /** 预览图地址 */
  previewUrl: '',
  /** 是否预览 */
  isPreview: false,
  /** 是否显示样式配置弹出框 */
  showAppStyleDialog: false,
  /** 是否显示应用配置弹出框 */
  showAppConfigDialog: false,
  /** 全局组件索引（新增组件自增） */
  globalComponentIndexMap: {} as Record<string, number>,
  /** 当前应用页索引 */
  currentPageIndex: 0,
  /** 上一次应用页索引 */
  prevPageIndex: 0,
  /** 【题目页】当前分页索引 */
  currentFormPageIndex: 0,
  /** 【题目页】上一次分页索引 */
  prevFormPageIndex: 0,
  /** 画板（HTMLElement） */
  canvasEl: {} as HTMLElement,
  /** 画板主面板元素（HTMLElement） */
  canvasPanelEl: {} as HTMLElement,
  /** 组件放置游标（HTMLElement） */
  componentCursorEl: document.createElement('div') as HTMLElement,
  /** Footer Dom（HTMLElement） */
  footerDom: undefined as HTMLElement | undefined,
  /** 页面列表 */
  pages: [
    { pageTitle: '主页', pageType: PageType.normalPage, children: [] },
  ] as AppPage[],
  /** 当前焦点属性 */
  currentProp: {} as any,
  /** 当前焦点事件 */
  currentEvent: {} as any,
  /** 范围选择器范围 */
  currentRangeEditorRect: {
    x: 0, y: 0, width: 0, height: 0, rotate: 0
  },
  /** 当前已选择组件 */
  currentSelectedComponents: [] as (Component | ComponentGroup)[],
  /** 当前选中的第一个控件Id */
  currentSelectedFirstComponentId: '' as string | undefined,
  /** 当前选择控件所带来的控件属性组 */
  currentSelectedComponentPropertyGroups: [] as PropertyGroup[],
  /** 当前选择控件所带来的控件属性哈希表 */
  currentSelectedComponentPropertyMap: {} as Record<string, ComponentProperty<any>>,
  /** 画板滚动坐标 */
  canvasLocation: {
    x: 0,
    y: 0
  },
  /** 控件画布 */
  componentCanvas : {} as any,
  /** 工具箱列表 */
  menuComponents: getMenuComponentItems,
  /** 组件列表 */
  componentList: getComponents,
  /** 游标父元素 */
  componentCursorParentEl: undefined as any,
  /** 游标父元素前后位置 */
  componentCursorIsAfter: undefined as boolean | undefined,
  /** 画布主panel */
  rootPanelEl: null as any,
  /** 设备类型列表 */
  devices: initRemoteDevices() as Record<string, RemoteDevice>,
  /** 属性编辑器库 */
  propertyEditors: getEditors,
  /** 已选择的所有组件Id列表 */
  currentSelectedIds: computed((): string[] => {
    return state.currentSelectedComponents.map(i => i.id);
  }),
  /** 获取计时配置 */
  getTimerConfig: computed((): FormTimerConfig => {
    return state.appConfig.questionnaireConfig.timerConfig ?? {};
  }),
  /** 主页 */
  mainPage: computed((): AppPage => {
    return state.pages.find(i => i.pageType === PageType.normalPage)!;
  }),
  /** 当前页 */
  currentPage: computed((): AppPage => {
    return state.pages[state.currentPageIndex];
  }),
  /** 当前控件对应的属性编辑器字典 */
  currentPropertyEditors: computed<Record<string, ComponentPropertyEditor>>(() => {
    const _selected = state.currentSelectedComponents;
    if (_selected.length) {
      let _propEditors: Record<string, any> = {};
      if (_selected.length >= 1 && !_selected[0].isGroup) {
        _propEditors = _selected[0].propertyEditors ?? {};
      }
      for (let i = 1; i < _selected.length; i++) {
        const component = _selected[i];
        if (!component.isGroup && component.propertyEditors) {
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
  /** 总分页页数 */
  maxFormPageCount: computed((): number => {
    if (state.appConfig.questionnaireConfig.turnPageMode === 'no-page') return 1;
    else if (state.appConfig.questionnaireConfig.turnPageMode === 'page') return state.currentPage.children.length;
    else return state.currentPage.children.filter(i => {
      if (i.isGroup) {
        return false;
      } else {
        return i.name === 'q-page-split';
      }
    }).length + 1;
  }),
});

window['editorModule'] = state;

export default {
  state,
  service
}