import { Component, LayoutConfig } from '@/@types';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as historyState, service as historyService } from '@/common/history-module';
import { cloneForce } from '@/lib/clone';
import { createModelId, moveNodeOfTree } from '@/tools/common';
import type { DragConfig, DragLayoutParams, DragLayoutReturn } from './@types';
import { AppType, ComponentCategory, LayoutType } from '@/@types/enum';
import { reactive } from 'vue';

/** 拖拽模块状态 */
export const state = reactive({
  /** 对齐线列表（自动） */
  alignLines: [] as { x?: number, y?: number, direction: 'front' | 'center' | 'end' }[],
  /** 定位线列表（用户拖拽） */
  positionLines: [] as { x?: number, y?: number, direction: 'front' | 'center' | 'end' }[],
  /** 拖拽配置 */
  dragConfig: {
    isPreDrag: false,
    isDrag: false,
    isDragArea: false,
    component: null,
    insertComponentId: undefined,
    targetFormComponentId: '',
    startLoc: {
      x: 0,
      y: 0,
    },
    endLoc: {
      x: 0,
      y: 0,
    },
  } as DragConfig,
  /** 是否已存在？ */
  isExisted: false,
  offsetAmount: 10,

  /** 影子节点光标状态 */
  tempShadowMouseState: {} as Record<string, any>,
  /** 影子节点光标横向偏移量 */
  shadowOffsetX: 0,
  /** 影子节点光标纵向偏移量 */
  shadowOffsetY: 0,
  /** 插入插槽（组）索引 */
  insertSlotIndex: 0,
  /** 头部栏高度 */
  headerHeight: 60,
});

export const service = {
  /** 获取9个组件的关键点 */
  getComponentPoints(component: Component, config?: { x?: number, y?: number }) {
    const _x = config?.x ?? component.attrs.x;
    const _y = config?.y ?? component.attrs.y;
    const points = [
      [_x, _y],
      [_x, _y + component.attrs.height / 2],
      [_x, _y + component.attrs.height],
      [_x + component.attrs.width / 2, _y],
      [_x + component.attrs.width / 2, _y + component.attrs.height / 2],
      [_x + component.attrs.width / 2, _y + component.attrs.height],
      [_x + component.attrs.width, _y],
      [_x + component.attrs.width, _y + component.attrs.height / 2],
      [_x + component.attrs.width, _y + component.attrs.height],
    ] as [number, number][];
    return points;
  },
  /** 获取对齐线 */
  getAlignLines(component: Component, config?: { x?: number, y?: number }) {
    const _lines = [] as { x?: number, y?: number, direction: 'front' | 'center' | 'end' }[];
    if (editorState.canvasRect) {
      const _points = this.getComponentPoints(component, config);
      const _parent = editorService.findParentComponent(component.id);
      const _childrenPoints = _parent?.component.children?.filter(i => i.id !== component.id)?.map(i => this.getComponentPoints(i)) || [];
      const _xIndexDirection = {
        0: 'front',
        1: 'front',
        2: 'front',
        3: 'center',
        4: 'center',
        5: 'center',
        6: 'end',
        7: 'end',
        8: 'end',
      };
      const _yIndexDirection = {
        0: 'front',
        3: 'front',
        6: 'front',
        1: 'center',
        4: 'center',
        7: 'center',
        2: 'end',
        5: 'end',
        8: 'end',
      };
      if (_parent?.level === 0) {
        /** 添加外层组件是 */
        _childrenPoints.push([
          [0, 0], 
          [0, editorState.appConfig.height / 2], 
          [0, editorState.appConfig.height],
          [editorState.appConfig.width / 2, 0], 
          [editorState.appConfig.width / 2, editorState.appConfig.height / 2], 
          [editorState.appConfig.width / 2, editorState.appConfig.height],
          [editorState.appConfig.width, 0], 
          [editorState.appConfig.width, editorState.appConfig.height / 2], 
          [editorState.appConfig.width, editorState.appConfig.height],
        ]);
      } else {
        /** 添加外层组件是 */
        _childrenPoints.push(this.getComponentPoints(_parent?.component!));
      }
      for (let i = 0; i < _childrenPoints.length; i++) {
        for (let o = 0; o < 9; o++) {
          for (let p = 0; p < 9; p++) {
            const _x = _childrenPoints[i][o][0];
            const _y = _childrenPoints[i][o][1];
            if (Math.abs(_x - _points[p][0]) < 6) {
              if (_lines.findIndex(line => line.x === _x) === -1) {
                _lines.push({ x: _x, direction: _xIndexDirection[p] });
              }
            }
            if (Math.abs(_y - _points[p][1]) < 6) {
              if (_lines.findIndex(line => line.y === _y) === -1) {
                _lines.push({ y: _y, direction: _yIndexDirection[p] });
              }
            }
          }
        }
      }
    }
    return _lines;
  },
  /** 开始拖拽 */
  startDrag(e, component: Component, isExisted: boolean = false) {
    if (e.button != 0) return;
    state.isExisted = isExisted;
    if (state.dragConfig.shadowDom) {
      state.dragConfig.shadowDom.remove();
      state.dragConfig.shadowDom = undefined;
    }
    state.dragConfig.startLoc.y = e['layerY'];
    state.dragConfig.startLoc.x = e['layerX'];
    if (state.offsetAmount <= 0) service.setShadowDom(e);
    else state.tempShadowMouseState = e;
    state.dragConfig.component = component;
    state.dragConfig.isPreDrag = true;
  },
  /** 拖拽已存在的组件 */
  startDragFormComponent(e, component: Component) {
    state.dragConfig.targetFormComponentId = component.id;
    const _el: HTMLElement = document.createElement('div');
    if (editorState.appConfig.appType === AppType.questionnaire) {
      _el.classList.add('form-design-drag-component');
      _el.innerHTML = component?.title ?? '';
    }
    service.startDrag(
      {
        original: e,
        target: _el,
        button: e.button,
        layerY: e.layerY,
        layerX: e.layerX,
      },
      component,
      true,
    );
  },
  /** 拖拽结束 */
  endDrag(e: MouseEvent) {
    if (state.dragConfig.isDrag || state.dragConfig.isPreDrag) {
      state.dragConfig.shadowDom?.remove();
      state.dragConfig.shadowDom = undefined;

      /** 放置控件 */
      if (state.dragConfig.isDragArea) {
        const _newComponent: Component = cloneForce({
          ...editorState.componentList.find(
            (i) => i.name == state.dragConfig.component.name && i.title == state.dragConfig.component.title,
          ),
          height: 0,
        });

        if (!state.dragConfig.targetFormComponentId) {
          _newComponent.id = createModelId(10);
        } else {
          _newComponent.id = state.dragConfig.targetFormComponentId;
        }
        _newComponent.attrs.id = _newComponent.id;

        // 移动组件 or 新增组件
        if (state.dragConfig.targetFormComponentId) {
          const fromIndex = editorService.findComponentIndex(state.dragConfig.targetFormComponentId);
          const fromParentComponentId = editorService.findParentComponent(state.dragConfig.targetFormComponentId)?.component.id;
          historyService.exec('move-component', {
            objectId: state.dragConfig.targetFormComponentId,
            value: state.dragConfig.targetFormComponentId,
            attrs: {
              fromIndex,
              toIndex: state.dragConfig.insertIndex,
              fromParentComponentId: fromParentComponentId,
              toParentComponentId: state.dragConfig.insertComponentId,
              toParentComponentSlotIndex: state.dragConfig.insertSlotIndex,
              x: state.dragConfig.adsorbLoc?.x ?? (state.dragConfig.mouseX - state.dragConfig.startLoc.x),
              y: state.dragConfig.adsorbLoc?.y ?? (state.dragConfig.mouseY - state.dragConfig.startLoc.y)
            },
          });
          state.alignLines = [];
          state.dragConfig.adsorbLoc = undefined;
        } else {
          // 刚刚插入界面或添加到最后处理方式
          historyService.exec('add-component', {
            objectId: _newComponent.id,
            value: _newComponent,
            attrs: {
              index: state.dragConfig.insertIndex,
              parentComponentId: state.dragConfig.insertComponentId,
              parentComponentSlotIndex: state.dragConfig.insertSlotIndex,
              x: state.dragConfig.mouseX - _newComponent.attrs.width / 2,
              y: state.dragConfig.mouseY - _newComponent.attrs.height / 2
            },
          });
        }
      }

      Object.entries({
        shadowDom: null,
        component: null,
        insertComponentId: undefined,
        targetFormComponentId: '',
        isDrag: false,
        isPreDrag: false,
        isDragArea: false,
        startLoc: { x: 0, y: 0 },
        endLoc: { x: 0, y: 0 },
      }).forEach(([key, value]) => {
        state.dragConfig[key] = value;
      });
      editorService.changeComponentCursorByLine(false);

      setTimeout(() => {
        editorService.refresh();
      }, 200);
    }
  },
  /** 设置影子节点 */
  setShadowDom(e) {
    let _target = e.target as HTMLElement;
    if (
      _target.className.indexOf('component-item-icon') >= 0 ||
      _target.className.indexOf('component-item-title') >= 0
    ) {
      _target = _target.parentNode as HTMLElement;
    }
    state.dragConfig.shadowDom = _target.cloneNode(true) as HTMLElement;
    document.body.appendChild(state.dragConfig.shadowDom);
    state.dragConfig.shadowDom.classList.add('form-design-drag-component', 'hidden');
    const _width = state.dragConfig.shadowDom.offsetWidth;
    const _height = state.dragConfig.shadowDom.offsetHeight;
    if (state.dragConfig.shadowDom) {
      state.dragConfig.shadowDom.style.top = e.clientY + e.layerY - _height / 2 - state.dragConfig.startLoc.y + 'px';
      state.dragConfig.shadowDom.style.left = e.clientX + e.layerX - _width / 2 - state.dragConfig.startLoc.x + 'px';
      state.shadowOffsetY = e.layerY - _height / 2;
      state.shadowOffsetX = e.layerX - _width / 2;
    }
  },
  /** 组件拖拽中 */
  dragMove(e) {
    if (editorState.appConfig.appType === AppType.questionnaire) {
      if (state.dragConfig.isPreDrag) {
        // 如果延迟量大于0且还没有影子节点时则创建
        if (!state.dragConfig.shadowDom) {
          // 判断偏移量
          if (
            !state.isExisted ||
            (state.isExisted && Math.abs(e.layerY - state.dragConfig.startLoc.y) > state.offsetAmount) ||
            Math.abs(e.layerX - state.dragConfig.startLoc.x) > state.offsetAmount
          ) {
            service.setShadowDom(state.tempShadowMouseState);
            if (state.dragConfig.shadowDom !== undefined) {
              (state.dragConfig.shadowDom as HTMLElement).classList.remove('hidden');
            }
            state.dragConfig.isPreDrag = false;
            state.dragConfig.isDrag = true;
          }
        }
      } else if (state.dragConfig.isDrag) {
        state.dragConfig.endLoc.y = e.clientY - state.dragConfig.startLoc.y;
        state.dragConfig.endLoc.x = e.clientX - state.dragConfig.startLoc.x;
        if (state.dragConfig.shadowDom) {
          state.dragConfig.shadowDom.style.top = state.dragConfig.endLoc.y + state.shadowOffsetY + 'px';
          state.dragConfig.shadowDom.style.left = state.dragConfig.endLoc.x + state.shadowOffsetX + 'px';
        }
  
        state.dragConfig.mouseX = state.dragConfig.endLoc.x + state.dragConfig.startLoc.x + editorState.canvasLocation.x;
        state.dragConfig.mouseY = state.dragConfig.endLoc.y + state.dragConfig.startLoc.y + editorState.canvasLocation.y;
  
        const _pageX = e.pageX;
        const _pageY = e.pageY;
  
        if (
          state.dragConfig.mouseX > 0 &&
          state.dragConfig.mouseX < editorState.appConfig.width &&
          state.dragConfig.mouseY > -80
        ) {
          state.dragConfig.isDragArea = true;
          let _y = 0;
          // 计算应该把组件插入到什么地方
          if (state.dragConfig.mouseY < 0) {
            state.dragConfig.insertIndex = 0;
            state.dragConfig.insertComponentId = undefined;
            editorService.changeComponentCursorByLine(undefined, false);
          } else {
            state.dragConfig.top = 0;
            let index = 0;
            let _component: Component | undefined;
            let _prevHeight = 0;
            for (; index < editorState.currentPage.children.length; index++) {
              const _id = editorState.currentPage.children[index].id;
              _component = editorState.currentPage.children[index] as Component;
              state.dragConfig.insertIndex = index;
              state.dragConfig.insertComponentId = undefined;
              _prevHeight = _y;
              _y = (editorState.canvasPanelEl.querySelector(`[component-id='${_id}']`) as HTMLElement).offsetHeight || 0;

              // 注：如果超过行程过大或过小则插入到同级
              if (
                [ComponentCategory.complex, ComponentCategory.layout].includes(_component.type) &&
                _id != state.dragConfig.targetFormComponentId &&
                state.dragConfig.mouseY >= state.dragConfig.top + 10 &&
                state.dragConfig.mouseY <= state.dragConfig.top + _y - 10
              ) {
                /** 根据布局组件类型不同调用函数获得插入结果 */
                const insertResult = service.dragForChildComponent(_component, {
                  pageX: _pageX,
                  pageY: _pageY,
                  parentComponentHeight: _y,
                  parentComponentWidth: 0,
                });
                if (insertResult.isReturn) return;
              } else {
                state.dragConfig.insertComponentId = undefined;
                if (
                  state.dragConfig.mouseY >= state.dragConfig.top - _prevHeight / 2 &&
                  state.dragConfig.mouseY <= state.dragConfig.top + _y / 2
                ) {
                  state.dragConfig.insertIndex = index;
                  state.dragConfig.top += _y;
                  break;
                }
              }
              state.dragConfig.top += _y;
            }
            // 最终统一绘制插入游标
            if (state.dragConfig.mouseY >= state.dragConfig.top - _y / 2 && index === editorState.currentPage.children.length) {
              state.dragConfig.insertIndex = editorState.currentPage.children.length;
              editorService.changeComponentCursorByLine(undefined, true);
            } else if (state.dragConfig.insertIndex !== undefined) {
              editorService.changeComponentCursorByLine(editorService.getComponentElementById(_component?.id), false, false);
            }
            if (state.dragConfig.insertIndex === undefined) state.dragConfig.insertIndex = 0;
          }
        } else {
          state.dragConfig.isDragArea = false;
          editorService.changeComponentCursorByLine(false);
        }
      }
    } else if (editorState.appConfig.appType === AppType.canvas) {
      if (state.dragConfig.isPreDrag) {
        // 如果延迟量大于0且还没有影子节点时则创建
        if (!state.dragConfig.shadowDom) {
          // 判断偏移量
          if (
            !state.isExisted ||
            (state.isExisted && Math.abs(e.layerY - state.dragConfig.startLoc.y) > state.offsetAmount) ||
            Math.abs(e.layerX - state.dragConfig.startLoc.x) > state.offsetAmount
          ) {
            service.setShadowDom(state.tempShadowMouseState);
            if (state.dragConfig.shadowDom !== undefined) {
              (state.dragConfig.shadowDom as HTMLElement).classList.remove('hidden');
            }
            state.dragConfig.isPreDrag = false;
            state.dragConfig.isDrag = true;
          }
        }
      } else if (state.dragConfig.isDrag) {
        state.dragConfig.isDragArea = true;
        state.dragConfig.endLoc.y = e.clientY - state.dragConfig.startLoc.y;
        state.dragConfig.endLoc.x = e.clientX - state.dragConfig.startLoc.x;

        state.dragConfig.mouseX = state.dragConfig.endLoc.x + state.dragConfig.startLoc.x + editorState.canvasLocation.x;
        state.dragConfig.mouseY = state.dragConfig.endLoc.y + state.dragConfig.startLoc.y + editorState.canvasLocation.y;

        // 标准拖拽（到根节点）
        // TODO: 后续需要添加直接拖拽到父组件中的方式
        
        if (state.isExisted) {
          // TODO: 拖拽吸附
          let _x = state.dragConfig.mouseX - state.dragConfig.startLoc.x;
          let _y = state.dragConfig.mouseY - state.dragConfig.startLoc.y;
          state.alignLines = service.getAlignLines(state.dragConfig.component, {
            x: _x, y: _y
          });
          const _xLines = state.alignLines.filter(i => i.x !== undefined);
          if (_xLines.length) {
            if (_xLines[0].direction === 'front') {
              _x = _xLines[0].x!;
            } else if (_xLines[0].direction === 'center') {
              _x = _xLines[0].x! - state.dragConfig.component.attrs.width / 2;
            } else if (_xLines[0].direction === 'end') {
              _x = _xLines[0].x! - state.dragConfig.component.attrs.width;
            }
          }
          const _yLines = state.alignLines.filter(i => i.y !== undefined);
          if (_yLines.length) {
            if (_yLines[0].direction === 'front') {
              _y = _yLines[0].y!;
            } else if (_yLines[0].direction === 'center') {
              _y = _yLines[0].y! - state.dragConfig.component.attrs.height / 2;
            } else if (_yLines[0].direction === 'end') {
              _y = _yLines[0].y! - state.dragConfig.component.attrs.height;
            }
          }

          state.dragConfig.component.attrs.x = _x;
          state.dragConfig.component.attrs.y = _y;
          state.dragConfig.adsorbLoc = { x: _x, y: _y };
          state.dragConfig.insertIndex = editorService.findComponentIndex(state.dragConfig.component?.id) ?? 0;
        } else {
          if (state.dragConfig.shadowDom) {
            state.dragConfig.shadowDom.style.top = state.dragConfig.endLoc.y + state.shadowOffsetY + 'px';
            state.dragConfig.shadowDom.style.left = state.dragConfig.endLoc.x + state.shadowOffsetX + 'px';
          }
          editorService.changeComponentCursorByBlock({
            x: state.dragConfig.mouseX,
            y: state.dragConfig.mouseY, width: 100, height: 100
          }, undefined);
          state.dragConfig.insertIndex = editorState.currentPage.children.length;
        }
      }
    }
  },
  /** 在子组件中拖拽 */
  dragForChildComponent(parentComponent: Component, dragChildConfig: DragLayoutParams): DragLayoutReturn {
    if (!parentComponent?.layoutConfig) throw new Error('父组件的布局配置为空');
    const _layout = parentComponent.layoutConfig;
    if (_layout?.layout === LayoutType.flex && _layout.layoutDetailConfig?.direction === 'column') {
      return service.dragForColumn(parentComponent, dragChildConfig);
    } else if (_layout?.layout === LayoutType.flex && _layout.layoutDetailConfig?.direction === 'row') {
      return service.dragForRow(parentComponent, dragChildConfig);
    } else if (_layout?.layout === LayoutType.table) {
      return service.dragForTable(parentComponent, dragChildConfig);
    } else if (_layout?.layout === LayoutType.absolute) {
      return service.dragForAbsolute(parentComponent, dragChildConfig);
    } else {
      throw new Error('未找到对应类型的布局模型');
    }
  },
  /** 在列布局中拖拽 */
  dragForColumn(parentComponent: Component, dragChildConfig: DragLayoutParams): DragLayoutReturn {
    const dragLayoutReturn = {
      isReturn: false,
    } as DragLayoutReturn;
    state.dragConfig.insertComponentId = parentComponent.id;
    /** 上一个子组件离顶部的高度 */
    let _prevTopHeight = 0;
    let _groupTopHeight = 0;
    let _componentTopHeight = 0;
    /** 上一个子组件的高度 */
    let _prevHeight = 0;
    // 插入到子组件
    const _parentEl = editorService
      .getComponentElementById(parentComponent.id)
      ?.querySelector('.layout-component') as HTMLElement;
    const _groups: HTMLElement[] = Array.from(_parentEl?.querySelectorAll(parentComponent.childrenSlot!)) as HTMLElement[];
    /** 当前组件高度 */
    let _y = 0;
    let groupIndex = 0;
    let childrenIndex = 0;
    let _group: HTMLElement | undefined;
    let _component: Component | undefined;
    let _isGroupComplete = false;

    if (_groups.length === 0) {
      dragLayoutReturn.isInsertInner = true;
      dragLayoutReturn.isReturn = true;
      state.dragConfig.insertIndex = 0;
      editorService.changeComponentCursorByLine(_parentEl, true, true);
      return dragLayoutReturn;
    } else {

      for (; groupIndex < _groups.length && !_isGroupComplete;groupIndex++) {
        _group = _groups[groupIndex];
        const _groupRect = _group.getBoundingClientRect();

        _prevTopHeight = _groupTopHeight;
        _groupTopHeight = _groupRect.top + _groupRect.height - editorState.canvasRect.y - state.headerHeight;
        // _y = _groupRect.height;

        const _components: HTMLElement[] = Array.from(_group?.querySelectorAll(parentComponent.childrenContentSlot!));
        if (
          state.dragConfig.mouseY >= _prevTopHeight &&
          state.dragConfig.mouseY <= _groupTopHeight
        ) {
          // console.log('组拖拽正确!!!', groupIndex, _groups.length, _prevTopHeight, _groupTopHeight, `||| ${_prevTopHeight} < ${service.dragConfig.mouseY} < ${_groupTopHeight}`);
          _isGroupComplete = true;
          _groupTopHeight = _groupRect.top - editorState.canvasRect.y - state.headerHeight;
          if (!_components.length) {
            dragLayoutReturn.isInsertInner = true;
            dragLayoutReturn.isReturn = true;
            state.dragConfig.insertSlotIndex = groupIndex;
            editorService.changeComponentCursorByLine(_group, true, true);
            return dragLayoutReturn;
          } else {
            for (; childrenIndex < _components.length;childrenIndex++) {
              const _childComponentRect = _components[childrenIndex].getBoundingClientRect();

              _component = parentComponent?.children?.[childrenIndex] as Component | undefined;
              _prevTopHeight = _componentTopHeight;
              _componentTopHeight = _childComponentRect.top - editorState.canvasRect.y - state.headerHeight;
              _prevHeight = _y;
              _y = _childComponentRect.height;

              if (
                _component?.type &&
                [ComponentCategory.complex, ComponentCategory.layout].includes(_component?.type) &&
                _component?.id != state.dragConfig.targetFormComponentId &&
                state.dragConfig.mouseY >= state.dragConfig.top + 20 &&
                state.dragConfig.mouseY <= state.dragConfig.top + _y - 20
              ) {
                /** 根据布局组件类型不同调用函数获得插入结果 */
                const insertResult = service.dragForChildComponent(_component, {
                  pageX: dragChildConfig.pageX,
                  pageY: dragChildConfig.pageY,
                  parentComponentHeight: _y,
                  parentComponentWidth: 0,
                });
                if (insertResult.isReturn) {
                  dragLayoutReturn.isReturn = true;
                  return dragLayoutReturn;
                }
              } else {
                if (
                  state.dragConfig.mouseY >= state.dragConfig.top + _componentTopHeight - _prevHeight / 2 &&
                  state.dragConfig.mouseY <= state.dragConfig.top + _componentTopHeight + _y / 2
                ) {
                  state.dragConfig.top += _y;
                  dragLayoutReturn.isInsertInner = true;
                  dragLayoutReturn.isReturn = true;
                  editorService.changeComponentCursorByLine(_components[childrenIndex], false, false);
                  return dragLayoutReturn;
                }
              }

              state.dragConfig.top += _y;
              state.dragConfig.insertIndex++;
            }

            if (childrenIndex === _components?.length) {
              state.dragConfig.insertIndex = (parentComponent?.children?.length || 1) - 1;
              dragLayoutReturn.isInsertInner = true;
              dragLayoutReturn.isReturn = true;
              state.dragConfig.insertSlotIndex = groupIndex;
              const _groupEl = _parentEl.querySelectorAll(parentComponent.childrenSlot!)[groupIndex] as HTMLElement;
              if (childrenIndex > 0) {
                const _componentEl = Array.from(_groupEl.querySelectorAll(parentComponent.childrenContentSlot!)).slice(-1)[0] as HTMLElement;
                editorService.changeComponentCursorByLine(_componentEl, true, false);
              } else {
                editorService.changeComponentCursorByLine(_groupEl, true, true);
              }
              return dragLayoutReturn;
            }
          }
        } else {
          // console.log('组拖拽不正确×××', groupIndex, _groups.length, _prevTopHeight, _groupTopHeight, `||| ${_prevTopHeight} < ${service.dragConfig.mouseY} < ${_groupTopHeight}`);
        }
        
        // console.log('service.dragConfig.top += _y', service.dragConfig.top, _y);
      }

      // 最终统一绘制插入游标
        // console.log('TEST', service.dragConfig.mouseY >= service.dragConfig.top - _y / 2, service.dragConfig.top, _y / 2);
        //service.dragConfig.mouseY >= service.dragConfig.top - _y / 2 && 
      if (childrenIndex === parentComponent?.children?.length) {
        state.dragConfig.insertIndex = parentComponent?.children?.length;
        dragLayoutReturn.isInsertInner = true;
        dragLayoutReturn.isReturn = true;
        const _groupEl = _parentEl.querySelectorAll(parentComponent.childrenSlot!)[groupIndex - 1] as HTMLElement;
        if (childrenIndex > 0) {
          const _componentEl = Array.from(_groupEl.querySelectorAll(parentComponent.childrenContentSlot!)).slice(-1)[0] as HTMLElement;
          editorService.changeComponentCursorByLine(_componentEl, true, false);
        } else {
          editorService.changeComponentCursorByLine(_groupEl, true, true);
        }
      } else if (groupIndex === _groups.length) {
        dragLayoutReturn.isInsertInner = true;
        dragLayoutReturn.isReturn = true;
        if (groupIndex > 0) {
          state.dragConfig.insertSlotIndex = groupIndex - 1;
          editorService.changeComponentCursorByLine(_groups[groupIndex - 1], true, true);
        } else {
          state.dragConfig.insertSlotIndex = 0;
          editorService.changeComponentCursorByLine(_groups[0], true, true);
        }
      } else if (state.dragConfig.insertIndex !== undefined) {
        // const _childEl = _parentEl.querySelectorAll(parentComponent.childrenSlot!)[0] as HTMLElement;
        // editorService.changeComponentCursorByLine(_childEl);

        editorService.changeComponentCursorByLine(editorService.getComponentElementById(_component?.id));
      } else {
        console.error('错了');
      }
      return dragLayoutReturn;
    }
  },
  /** 在行中拖拽 */
  dragForRow(parentComponent: Component, dragChildConfig: Record<string, any>): DragLayoutReturn {
    return {} as DragLayoutReturn;
  },
  /** 在表格中拖拽 */
  dragForTable(parentComponent: Component, dragChildConfig: Record<string, any>): DragLayoutReturn {
    return {} as DragLayoutReturn;
  },
  /** 在自由布局中拖拽 */
  dragForAbsolute(parentComponent: Component, dragChildConfig: Record<string, any>): DragLayoutReturn {
    return {} as DragLayoutReturn;
  },
};

export default {
  state,
  service
}