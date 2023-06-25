import bus, { GlobalBusType } from '@/tools/bus';
import { createModelId, throttle, toDecimal } from '@/tools/common';
import { StyleValue, UnwrapNestedRefs, WritableComputedRef, computed, reactive, ref } from 'vue';
import {
  AllDroppableConfig,
  CustomDragEvent,
  DragHookState,
  DragNode,
  DragRect,
  DraggableConfig,
  DraggableState,
  DroppableState,
} from './index.d';
import {
  findTreeNode,
  getDom,
  getRect,
  isCrash,
  mergeConfig,
  moveItem,
  toggleStyle,
  transformCustomMouseEvent,
} from './common';
import gsap from 'gsap';
import { getInsertIndexBySortable } from './common/sortable-drag';

/** 创建自定义拖拽钩子 */
export const useCustomDragHook = <T extends undefined | object = undefined>({
  name,
  el,
  edgeClass,
  startDragDraggableClassName,
  startDragDraggableStyle,
  successDragDraggableClass,
  successDragDroppableClass,
  init,
  draw,
  drag,
  dragStart,
  dragEnd,
  dragEndError,
  dragEnterRange,
  dragLeaveRange,
  destory,
  config,
  throttleTime,
}: {
  /** hookName */
  name: string;
  /** 快速绑定节点 */
  el?: HTMLElement;
  /** 拖拽到边缘的类名 */
  edgeClass?: string;
  /** 拖拽时拖拽节点类名 */
  startDragDraggableClassName?: string;
  /** 拖拽时拖拽节点样式 */
  startDragDraggableStyle?: StyleValue;
  /** 拖拽完成时（进入预定范围）拖拽节点类名 */
  successDragDraggableClass?: string;
  /** 拖拽完成时（进入预定范围）目标节点类名 */
  successDragDroppableClass?: string;
  /** 初始化事件 */
  init?: ({ config }: { config: T }) => void;
  /** 拖拽时响应钩子 */
  draw?: (e: CustomDragEvent<T>) => void;
  /** 拖拽时响应钩子 */
  drag?: (e: CustomDragEvent<T>) => void;
  /** 拖拽开始时响应钩子 */
  dragStart?: (e: CustomDragEvent<T>) => void;
  /** 拖拽结束时响应钩子 */
  dragEnd?: (e: CustomDragEvent<T>) => void;
  /** 拖拽结束错误的响应钩子 */
  dragEndError?: (e: CustomDragEvent<T>) => void;
  /** 刚拖入指定范围时的响应钩子 */
  dragEnterRange?: (e: CustomDragEvent<T>) => void;
  /** 刚离开指定范围时的响应钩子 */
  dragLeaveRange?: (e: CustomDragEvent<T>) => void;
  /** 销毁钩子 */
  destory?: () => void;
  /** 回弹函数，返回回弹位置 */
  onBounceBack?: () => { x: number; y: number };
  /** 配置项 */
  config?: T;
  /** 节流时间（0或undefined为取消节流） */
  throttleTime?: number;
}) => {
  const hookName = name;
  /** 是否开始拖拽 */
  const isStart = ref<boolean>(false);
  /** 拖拽节点基础样式 */
  let targetBasicCss = '';
  /** 插入节点信息 */
  let insertInfo: {
    id: string;
    index: number;
    childType: 'draggable' | 'droppable';
    parentDom: HTMLElement | undefined;
    childId: string;
  };
  /** 事件表 */
  const events = {
    onDrag: {},
    onEndDrag: {},
  } as {
    onDrag: Record<string, (e: CustomDragEvent<T>) => void>;
    onEndDrag: Record<string, (e: CustomDragEvent<T>) => void>;
  };
  /** 上一个Display样式 */
  let prevDisplay = '';
  /** 上一个坐标 */
  let prevLocation = [0, 0];
  /** 父级目标Id（拖拽时更新） */
  let prevDroppableId = '';
  /** 父级目标内的索引 */
  let prevDroppableIndexId = '';
  /** 绑定数据 */
  const bindState: Record<
    string,
    {
      get: () => any[];
      set: (val: any[]) => void;
    }
  > = {};
  /** 状态 */
  const state = reactive({
    /** 可拖拽上下文 */
    contextDom: () => {
      throw Error('尚未初始化上下文');
    },
    overflow: true,
    /** 是否拖拽到边缘 */
    dragOnEdge: false,
    /** 拖拽完成时（进入预定范围）拖拽节点类名 */
    successDragDraggableClass,
    /** 拖拽完成时（进入预定范围）目标节点类名 */
    successDragDroppableClass,
    /** 拖拽索引 */
    dragId: '',
    /** 可拖拽节点键值对 */
    draggableMap: {},
    /** 目标节点键值对 */
    droppableMap: {},
    /** 初始化完毕 */
    isInit: false,
    /** 上一次的拖拽点 */
    prevLoc: undefined as CustomDragEvent<T> | undefined,
  }) as DragHookState<T>;

  /** 其他状态或配置项 */
  const stateConfig = reactive({
    ...config,
  }) as UnwrapNestedRefs<T>;

  const dataList = ref<[string, string][]>([]);

  const treeList = ref<Record<string, DragNode<any>>>({});

  // const getState = (id: string): DraggableState | DroppableState | undefined => {
  //   if (state.draggableMap[id]) {
  //     return state.draggableMap[id];
  //   } else if (state.droppableMap[id]) {
  //     return state.droppableMap[id];
  //   }
  //   return undefined;
  // };

  const treeData = computed<DragNode<any>[]>(() => {
    const _items = dataList.value.map<DragNode<any> | undefined>(([id, parentId]) => {
      if (state.draggableMap[id]) {
        return {
          id,
          parentId,
          type: 'draggable',
          state: state.draggableMap[id],
          children: [] as DragNode<any>[],
          data: bindState[id].get()
        };
      } else if (state.droppableMap[id]) {
        return {
          id,
          parentId,
          type: 'droppable',
          state: state.droppableMap[id],
          config: {} as AllDroppableConfig,
          children: [] as DragNode<any>[],
          data: bindState[id].get()
        };
      }
      return undefined;
    });
    const _tree = {} as Record<string, DragNode<any>[]>;
    let _re: DragNode<any>[] = [];
    for (let i = 0; i < _items.length; i++) {
      const item = _items[i] as DragNode<any> & { parentId: string };
      if (item?.type === 'droppable') {
        item.children = _tree[item!.id] ?? ([] as DragNode<any>[]);
      }
      if (item) {
        // if (!item['children']) item['children'] = [];
        treeList.value[item.id] = item;
        if (item.parentId) {
          if (!_tree[item.parentId]) {
            const _node = _tree['___']?.find(o => o.id === item.parentId);
            if (_node) {
              _tree[item.parentId] = _node['children'];
            } else {
              _tree[item.parentId] = [];
            }
          }
          _tree[item.parentId].push(item);
        } else {
          if (!_tree['___']) _tree['___'] = [];
          _tree['___'].push(item);
        }
      }
    }
    _re = _tree['___'];
    return _re;
  });

  /** 开始拖拽 */
  const startDrag = (e: MouseEvent, config?: T) => {
    if (state.isInit) {
      state.dragId = '';
      if (e.target) {
        const _dragId = (e.target as HTMLElement).getAttribute('drag-id');
        if (_dragId) {
          state.dragId = _dragId;
          // state.draggableMap[state.dragId].dom = e.target as HTMLElement;
        }
      }
      if (!state.dragId) {
        console.error('未查到对应节点', e.target, e);
        throw new Error('未查到对应节点');
      }
      isStart.value = true;
      const _currentState = state.draggableMap[state.dragId];
      const _dom = e.target as HTMLElement;
      const _rect = _dom.getBoundingClientRect();
      prevLocation = [_rect.left, _rect.top];
      const _cloneDom = _dom.cloneNode(true) as HTMLElement;

      let _comment;
      if (!_currentState.parentId) {
        _comment = document.createComment(`--${state.dragId}--`);
        _dom.parentElement!.insertBefore(_comment, _dom);
      }

      _cloneDom.classList.add('drag-duplicate-dom');
      const _duplicateDom = document.createElement('div');
      _duplicateDom.className = 'drag-duplicate';
      const _style = window.getComputedStyle(_dom);
      _duplicateDom.style.borderRadius = _style.borderRadius;
      _duplicateDom.style.setProperty('--drag-x', `${_rect.left}px`);
      _duplicateDom.style.setProperty('--drag-y', `${_rect.top}px`);
      _duplicateDom.style.setProperty('--drag-width', `${_rect.width}px`);
      _duplicateDom.style.setProperty('--drag-height', `${_rect.height}px`);

      _duplicateDom.appendChild(_cloneDom);
      document.body.appendChild(_duplicateDom);

      const _droppableDuplicateDom = _dom.cloneNode(true) as HTMLElement;
      _droppableDuplicateDom.style.opacity = '0.5';

      setTimeout(() => {
        _duplicateDom.style.transition = 'transform 0.08s, box-shadow 0.08s';
        _duplicateDom.style.setProperty('--drag-scale', `1.05`);
        _duplicateDom.classList.add('dragging');
        setTimeout(() => {
          _duplicateDom.style.transition = '';
        }, 80);
      }, 10);

      if (_currentState.useDuplicate) {
        prevDisplay = _dom.style.display;
        _dom.style.display = 'none';
      } else {
        prevDisplay = _dom.style.display;
        _dom.style.display = 'none';
      }

      state.draggableMap[state.dragId] = {
        ..._currentState,
        domComment: _comment,
        duplicateDom: _duplicateDom,
        droppableDuplicateDom: _droppableDuplicateDom,
        startX: _currentState.x,
        startY: _currentState.y,
        layerX: _currentState.inDroppableId ? e['layerX'] + _currentState.x : e['layerX'],
        layerY: _currentState.inDroppableId ? e['layerY'] + _currentState.y : e['layerY'],
      };
      // prevDroppableId = _currentState.prevDroppableId;
      const _e = transformCustomMouseEvent({
        e,
        config: stateConfig as T,
        target: _dom,
        state: getCurrentState.value,
      });
      state.prevLoc = _e;
      if (config !== undefined) mergeConfig(stateConfig, config);
      if (dragStart) {
        targetBasicCss = _dom.getAttribute('style') || '';
        toggleStyle(_dom, true, {
          basicCss: targetBasicCss,
          css: startDragDraggableStyle,
          className: [startDragDraggableClassName],
        });
        dragStart(_e);
      }
    }
  };

  /** 拖拽中回调函数 */
  const _cb = (e: MouseEvent) => {
    if (isStart.value) {
      const _dom = getCurrentDom.value;
      const _currentState = getCurrentState.value;
      const _e = transformCustomMouseEvent({
        e,
        config: stateConfig as T,
        target: _dom,
        state: _currentState,
      });
      // console.log('_currentState', _currentState.x, _currentState.y);

      const _contextDom = getDom(state.contextDom);
      const _contextRect = getRect(_contextDom);

      // 检测是否超出外边框
      if (!_contextRect) {
        throw new Error('未查询到拖拽上下文节点');
      }

      let _x = e.pageX - _contextRect.left - _currentState.layerX;
      let _y = e.pageY - _contextRect.top - _currentState.layerY;

      const _changeOnEdge = state.dragOnEdge;
      state.dragOnEdge = false;
      if (state.overflow === false) {
        if (_x < 0) {
          _x = 0;
          state.dragOnEdge = true;
        } else if (_x + _currentState.width > _contextRect.width) {
          _x = _contextRect.width - _currentState.width;
          state.dragOnEdge = true;
        }
        if (_y < 0) {
          _y = 0;
          state.dragOnEdge = true;
        } else if (_y + _currentState.height > _contextRect.height) {
          _y = _contextRect.height - _currentState.height;
          state.dragOnEdge = true;
        }
      }

      if (edgeClass && _changeOnEdge !== state.dragOnEdge) {
        if (state.dragOnEdge) {
          _contextDom.classList.add(edgeClass);
        } else {
          _contextDom.classList.remove(edgeClass);
        }
      }

      // _currentState.duplicateDom.firstChild!.innerText = `${toDecimal(_x, 0)} : ${toDecimal(_y, 0)}`;
      _currentState.duplicateDom.style.setProperty('--drag-x', `${_x + _contextRect.left}px`);
      _currentState.duplicateDom.style.setProperty('--drag-y', `${_y + _contextRect.top}px`);
      //  else {
      //   state.draggableMap[state.dragId].x = _x;
      //   state.draggableMap[state.dragId].y = _y;
      // }

      // 检测与目标节点是否有碰撞
      const _keyValues = Object.keys(state.droppableMap);
      let _draggableCrashCount = 0;
      _currentState.inDroppableId = '';
      for (let i = 0; i < _keyValues.length; i++) {
        const item = state.droppableMap[_keyValues[i]].dom;
        const _dom = typeof item === 'function' ? item() : item;
        const _rect = _dom.getBoundingClientRect();

        if (isCrash(
          { left: _rect.left - _contextRect.left, top: _rect.top - _contextRect.top, width: _rect.width, height: _rect.height },
          { left: _x, top: _y, width: _currentState.width, height: _currentState.height },
        )) {
          _draggableCrashCount++;
          _currentState.inDroppableId = _keyValues[i];
          if (state.successDragDroppableClass) _dom.classList.add(state.successDragDroppableClass);
        } else {
          if (state.successDragDroppableClass) _dom.classList.remove(state.successDragDroppableClass);
        }
      }
      if (state.successDragDraggableClass) {
        if (_draggableCrashCount > 0) {
          (_currentState.duplicateDom.firstChild as HTMLElement).classList.add(state.successDragDraggableClass);
        } else {
          (_currentState.duplicateDom.firstChild as HTMLElement).classList.remove(state.successDragDraggableClass);
        }
      }

      treeData.value;
      if (!treeList.value[_currentState.inDroppableId]) {
        _currentState.droppableDuplicateDom.remove();
        _currentState.domComment?.parentElement!.insertBefore(_dom, _currentState.domComment);
        prevDroppableIndexId = '';
      } else {
        // 测试拖拽列表组件
        insertInfo = getInsertIndexBySortable<T, any>({
          e,
          parentId: _currentState.inDroppableId,
          treeData: treeList.value[_currentState.inDroppableId]['children'],
          state: state,
          draggableState: _currentState,
          droppableState: state.droppableMap[_currentState.inDroppableId],
        });

        // 【执行条件】
        // 条件1：
        // 条件2：没有插入任何节点
        // 条件3：
        if (
          _currentState.parentId !== _currentState.inDroppableId ||
          !insertInfo ||
          insertInfo.childId !== prevDroppableIndexId
        ) {
          _dom.style.display = 'none';
          // 如果是在拖拽位置
          if (_currentState.inDroppableId) {
            // 移除原始DOM节点
            // const _domDroppable = getDom(state.droppableMap[_currentState.inDroppableId].dom);
            // _domDroppable.appendChild(_currentState.droppableDuplicateDom);

            // console.log('insertInfo', insertInfo);
            if (insertInfo) {
              if (insertInfo.childId) {
                const _child = getDom(state.draggableMap[insertInfo.childId].dom);
                _child.insertAdjacentElement('beforebegin', _currentState.droppableDuplicateDom);
              } else {
                insertInfo.parentDom?.appendChild(_currentState.droppableDuplicateDom);
              }
            }
          } else {
            _currentState.droppableDuplicateDom.remove();
            _currentState.domComment?.parentElement!.insertBefore(_dom, _currentState.domComment);
          }
          prevDroppableIndexId = insertInfo.childId;
        }
      }

      prevDroppableId = _currentState.inDroppableId;
      // console.log(`当前prevDroppableId: ${prevDroppableId}`);

      if (draw) draw(_e);
      _onDrag(state.dragId, _e);

      state.prevLoc = _e;
      if (drag) drag(_e);

      // if (dragCheck === undefined) {
      //   state.prevLoc = _e;
      //   if (drag) drag(_e);
      // } else {
      //   const _isSuccess = dragCheck(_e);
      //   if (_isSuccess) {
      //     state.prevLoc = _e;
      //     if (!state.isInnerRange) {
      //       state.isInnerRange = true;
      //       dragEnterRange?.(_e);
      //     }
      //     if (drag) drag(_e);
      //   } else {
      //     if (state.isInnerRange) {
      //       state.isInnerRange = false;
      //       dragLeaveRange?.(_e);
      //     }
      //   }
      // }
    }
  };
  /** 拖拽中事件 */
  const dragging = throttleTime ? throttle(_cb, throttleTime, { leading: true, trailing: true }) : _cb;

  /** 结束拖拽 */
  const endDrag = (e: MouseEvent) => {
    if (isStart.value) {
      const _dom = getCurrentDom.value;
      isStart.value = false;
      const _e = transformCustomMouseEvent({
        e,
        config: stateConfig as T,
        target: _dom,
        state: getCurrentState.value,
      });
      const _currentState = getCurrentState.value;
      const _contextDom = getDom(state.contextDom);
      if (dragEnd) dragEnd(_e);

      // 判断是否碰撞，并添加碰撞效果
      const _draggableDom = _currentState.duplicateDom.firstChild;

      // console.log('开始 dataList', JSON.stringify(dataList.value, undefined, ''));
      const _pid = findTreeNode(state.dragId, treeData.value)?.parentId;
      // debugger
      moveItem({
        arr: dataList.value,
        itemId: state.dragId,
        parentId: _currentState.inDroppableId,
        index: insertInfo.index,
      });
      // debugger
      if (_pid) {
        setBindData(_pid);
      }
      // console.log('结束 dataList', JSON.stringify(dataList.value, undefined, ''));

      console.log('_currentState.inDroppableId', _currentState.inDroppableId);
      if (_currentState.inDroppableId) {
        treeData.value;
        setAlpha(0);
        _dom.classList.add('drag-in-area');

        let _reRect: DOMRect;
        if (state.successDragDroppableClass) _contextDom.classList.remove(state.successDragDroppableClass);

        if (prevDroppableId !== _currentState.parentId) _reRect = getRect(_currentState.droppableDuplicateDom) as DOMRect;
        else if (_currentState.parentId) _reRect = getRect(_currentState.droppableDuplicateDom) as DOMRect;
        else _reRect = getDom(_currentState.dom).getBoundingClientRect();

        const _droppableDuplicateRect = getRect(_currentState.droppableDuplicateDom);
        _currentState.parentId = _currentState.inDroppableId;
        setBindData(_currentState.inDroppableId);
        _currentState.droppableDuplicateDom.remove();

        gsap.to(_currentState.duplicateDom, {
          '--drag-x': `${_reRect.left}px`,
          '--drag-y': `${_reRect.top}px`,
          '--drag-width': `${_droppableDuplicateRect.width}px`,
          '--drag-height': `${_droppableDuplicateRect.height}px`,
          '--drag-scale': '1.0',
          boxShadow: '0px 0px 0px 0px rgba(34, 33, 81, 0.01)',
          duration: 0.15,
        }).then((d) => {
          // setAlpha(1);
          // if (insertInfo.childId) {
          //   const _child = getDom(state.draggableMap[insertInfo.childId].dom)
          //   _child.insertAdjacentElement('beforebegin', _dom);
          // } else {
          //   insertInfo.parentDom?.appendChild(_dom);
          // }
          // _droppableDom.appendChild(_dom);

          _dom.style.display = prevDisplay;
          setAlpha(1);
          _currentState.duplicateDom.remove();
        });
      } else {
        treeData.value;
        if (_currentState.parentId !== _currentState.inDroppableId) {
          setAlpha(0);
        }

        _dom.classList.remove('drag-in-area');

        // 是否自由拖拽
        if (_currentState.freeDrag) {
          const _contextRect = getRect(state.contextDom);
          state.draggableMap[state.dragId].x = e.pageX - _contextRect.left - _currentState.layerX;
          state.draggableMap[state.dragId].y = e.pageY - _contextRect.top - _currentState.layerY;
          gsap.to(_currentState.duplicateDom, {
            boxShadow: '0px 0px 0px 0px rgba(34, 33, 81, 0.01), 0px 0px 0px 0px rgba(34, 33, 81, 0.01)',
            '--drag-scale': '1.0',
            duration: 0.15,
          }).then((d) => {
            _currentState.droppableDuplicateDom.remove();
            _currentState.duplicateDom.classList.remove('dragging');
            setAlpha(1);
            _dom.style.display = prevDisplay;
            _contextDom.appendChild(_dom);
            _currentState.duplicateDom.remove();
          });
        } else {
          if (!_currentState.freeDrag && _currentState.inDroppableId === '') {
            // 非自由拖拽且没有拖拽到目标点，则返回原点
            _currentState.domComment?.parentElement!.insertBefore(_dom, _currentState.domComment);
            gsap.to(_currentState.duplicateDom, {
              '--drag-x': `${prevLocation[0]}px`,
              '--drag-y': `${prevLocation[1]}px`,
              boxShadow: '0px 0px 0px 0px rgba(34, 33, 81, 0.01), 0px 0px 0px 0px rgba(34, 33, 81, 0.01)',
              '--drag-scale': '1.0',
              duration: 0.15,
            }).then((d) => {
              _currentState.droppableDuplicateDom.remove();
              _currentState.duplicateDom.classList.remove('dragging');
              _dom.style.display = prevDisplay;
              setAlpha(1);
              _currentState.duplicateDom.remove();
            });
          } else if (_currentState.parentId === _currentState.inDroppableId && _currentState.inDroppableId === '') {
            // 一直在外部拖拽的逻辑
            gsap.to(_currentState.duplicateDom, {
              '--drag-x': `${prevLocation[0]}px`,
              '--drag-y': `${prevLocation[1]}px`,
              boxShadow: '0px 0px 0px 0px rgba(34, 33, 81, 0.01), 0px 0px 0px 0px rgba(34, 33, 81, 0.01)',
              '--drag-scale': '1.0',
              duration: 0.15,
            }).then((d) => {
              _currentState.droppableDuplicateDom.remove();
              _currentState.duplicateDom.classList.remove('dragging');
              _dom.style.display = prevDisplay;
              _contextDom.appendChild(_dom);
              setAlpha(1);
              _currentState.duplicateDom.remove();
            });
          } else {
            const _contextRect = getRect(state.contextDom);
            state.draggableMap[state.dragId].x = e.pageX - _contextRect.left - _currentState.layerX;
            state.draggableMap[state.dragId].y = e.pageY - _contextRect.top - _currentState.layerY;
            gsap.to(_currentState.duplicateDom, {
              '--drag-x': `${e.pageX - _currentState.layerX}px`,
              '--drag-y': `${e.pageY - _currentState.layerY}px`,
              boxShadow: '0px 0px 0px 0px rgba(34, 33, 81, 0.01), 0px 0px 0px 0px rgba(34, 33, 81, 0.01)',
              '--drag-scale': '1.0',
              duration: 0.15,
            }).then((d) => {
              _currentState.droppableDuplicateDom.remove();
              _currentState.duplicateDom.classList.remove('dragging');
              _dom.style.display = prevDisplay;
              _contextDom.appendChild(_dom);
              setAlpha(1);
              _currentState.duplicateDom.remove();
            });
          }
        }
        _currentState.parentId = '';
      }

      prevDroppableId = '';
      prevDroppableIndexId = '';

      if (edgeClass) getDom(state.contextDom).classList.remove(edgeClass);

      toggleStyle(_draggableDom as HTMLElement, false, {
        basicCss: targetBasicCss,
        css: startDragDraggableStyle,
        className: [startDragDraggableClassName, state.successDragDraggableClass],
      });

      if (drag) drag(_e);
      _onDrag(state.dragId, _e);

      setTimeout(() => {
        _onEndDrag(state.dragId, { ..._e, droppableId: _currentState.inDroppableId });
      }, 300);
    }
  };
  /** 拖拽函数（不做拖拽开始检测） */
  const _drag = (e: MouseEvent, config?: T) => {
    const _e = transformCustomMouseEvent({
      e,
      config: stateConfig as T,
      target: getCurrentDom.value,
      state: getCurrentState.value,
    });
    if (config !== undefined) mergeConfig(stateConfig, config);
    if (drag) drag(_e);
    _onDrag(state.dragId, _e);
  };
  /** 拖拽初始化 */
  const _init = () => {
    console.log('DRAG_INIT');
    if (el) {
      el.addEventListener('mousedown', startDrag, { passive: true });
      clearDraggable();
      addDraggable(createModelId(10), el, {
        freeDrag: true,
        handleDom: undefined,
        useDuplicate: true,
        useTransformPosition: true,
      });
    }

    bus.$on(GlobalBusType.onBodyMouseMove, dragging);
    bus.$on(GlobalBusType.onBodyMouseUp, endDrag);
    state.isInit = true;
    if (init) init({ config: stateConfig as T });
  };
  /** 销毁拖拽事件 */
  const _destory = () => {
    if (el) {
      el.removeEventListener('mousedown', startDrag);
      clearDraggable();
    }
    bus.$off(GlobalBusType.onBodyMouseMove, dragging);
    bus.$off(GlobalBusType.onBodyMouseUp, endDrag);
    if (destory) destory();
  };

  /** 获取所有碰撞的放置点 */
  const getCrashAllDroppables = () => {
    const _re = [] as [string, DroppableState][];
    const _draggableDom = getCurrentDom.value?.getBoundingClientRect();
    if (_draggableDom) {
      const _keyValues = Object.entries(state.droppableMap);
      for (let i = 0; i < _keyValues.length; i++) {
        const item = _keyValues[i][1].dom;
        const _dom = typeof item === 'function' ? item() : item;
        const _rect = _dom.getBoundingClientRect();
        if (isCrash(_rect, _draggableDom)) {
          _re.push(_keyValues[i]);
        }
      }
    }
    return _re;
  };

  /** 设置透明度 */
  const setAlpha = (alpha: number) => {
    // console.log(state.dragId, alpha);
    // console.log('获取节点', getCurrentDom.value);
    getCurrentDom.value.style.opacity = alpha + '';
  };

  /** 设置上下文画布节点 */
  const setContext = (dom: HTMLElement | (() => HTMLElement)) => {
    state.contextDom = dom;
  };

  /** 获取当前拖拽的DOM节点 */
  const getCurrentDom = computed(() => {
    const _dom = state.draggableMap[state.dragId].dom;
    if (typeof _dom === 'function') {
      return _dom();
    } else {
      return _dom;
    }
  });

  /** 获取当前拖拽的DOM状态 */
  const getCurrentState = computed({
    get() {
      return state.draggableMap[state.dragId];
    },
    set(value) {
      state.draggableMap[state.dragId] = value;
    },
  });

  const setDraggableLoc = (id: string, x?: number, y?: number) => {
    if (id) {
      let _item = state.draggableMap[id].dom;
      if (typeof _item === 'function') {
        _item = _item();
      }
      if (x !== undefined) state.draggableMap[id].x = x;
      if (y !== undefined) state.draggableMap[id].y = y;
      const _e = transformCustomMouseEvent({
        config: stateConfig as T,
        target: _item,
        state: state.draggableMap[id],
      });
      if (draw) draw(_e);
    }
  };

  const clearDraggable = () => {
    state.draggableMap = {};
  };

  const findDraggable = (dom: HTMLElement | (() => HTMLElement)) => {
    const _re = Object.entries(state.draggableMap).find(([key, value]) => {
      const _draggable = value.dom;
      if (typeof _draggable === 'function') {
        if (typeof dom === 'function') {
          return dom === _draggable;
        } else {
          return dom.isSameNode(_draggable());
        }
      } else {
        if (typeof dom === 'function') {
          return dom() === _draggable;
        } else {
          return _draggable.isSameNode(dom);
        }
      }
    });
    if (_re) return _re[0];
    else return undefined;
  };

  /** 设置可拖拽节点 */
  const addDraggable = (id: string, dom: HTMLElement | (() => HTMLElement), config: DraggableConfig) => {
    if (state.draggableMap[id] === undefined) {
      const _dom = typeof dom === 'function' ? dom() : dom;
      const _rect = _dom.getBoundingClientRect();
      state.draggableMap[id] = {
        ...config,
        dom,
        domComment: document.createComment(`--${id}--`),
        duplicateDom: document.createElement('div'),
        droppableDuplicateDom: document.createElement('div'),
        handleDom: config.handleDom,
        layerX: 0,
        layerY: 0,
        startX: 0,
        startY: 0,
        x: _rect.left,
        y: _rect.top,
        width: _rect.width,
        height: _rect.height,
        inDroppableId: '',
        parentId: '',
      };
    }
  };

  /** 移除可拖拽节点 */
  const removeDraggable = (id: string) => {
    delete state.draggableMap[id];
  };

  const setDroppableLoc = (id: string, x?: number, y?: number) => {
    if (id) {
      let _item = state.droppableMap[id].dom;
      if (typeof _item === 'function') {
        _item = _item();
      }
      if (x !== undefined) state.droppableMap[id].x = x;
      if (y !== undefined) state.droppableMap[id].y = y;
      const _e = transformCustomMouseEvent({
        config: stateConfig as T,
        target: _item,
        state: state.droppableMap[id],
      });
      if (draw) draw(_e);
    }
  };

  /** 设置目标节点 */
  const addDroppable = (id: string, dom: HTMLElement | (() => HTMLElement), config: AllDroppableConfig) => {
    if (state.droppableMap[id] === undefined) {
      const _dom = typeof dom === 'function' ? dom() : dom;
      const _rect = _dom.getBoundingClientRect();
      state.droppableMap[id] = {
        ...config,
        dom: dom,
        layerX: 0,
        layerY: 0,
        startX: 0,
        startY: 0,
        x: _rect.left,
        y: _rect.top,
        width: _rect.width,
        height: _rect.height,
        useTransformPosition: true,
      };
    }
  };

  /** 移除可拖拽节点 */
  const removeDroppable = (id: string) => {
    delete state.droppableMap[id];
  };

  /** 手动绑定的拖拽监听事件 */
  const _onDrag = (id: string, e: CustomDragEvent<T>) => {
    if (events.onDrag[id]) {
      events.onDrag[id](e);
    }
  };

  const onDrag = (id: string, fn: (e: CustomDragEvent<T>) => void) => {
    events.onDrag[id] = fn;
  };

  const _onEndDrag = (id: string, e: CustomDragEvent<T> & { droppableId?: string }) => {
    if (events.onEndDrag[id]) {
      events.onEndDrag[id](e);
    }
  };

  const onEndDrag = (id: string, fn: (e: CustomDragEvent<T>) => void) => {
    events.onEndDrag[id] = fn;
  };

  const setState = (obj: Partial<DragHookState<T>>) => {
    const _keyValues = Object.entries(obj);
    for (let i = 0; i < _keyValues.length; i++) {
      const [key, value] = _keyValues[i];
      state[key] = value;
    }
  };

  const addDataParent = (id: string, parentId: string = '') => {
    const _index = dataList.value.findIndex((i) => i[0] == id);
    if (_index < 0) {
      dataList.value.push([id, parentId]);
    } else {
      dataList.value[_index][1] = parentId;
    }
    if (state.draggableMap[id]) {
      state.draggableMap[id].parentId = parentId;
    }
    if (state.droppableMap[id]) {
      state.droppableMap[id].parentId = parentId;
    }
  };

  const setBindData = (parentId: string | undefined) => {
    if (parentId && bindState[parentId]) {
      const treeNode = findTreeNode(parentId, treeData.value);
      if (treeNode?.type === 'droppable') {
        console.log('设置数据', parentId, treeNode.children.map(i => i.data));
        bindState[parentId]?.set(treeNode.children.map(i => i.data));

        // console.log('设置数据', parentId, treeNode.children.map(i => bindState[i.id].get()));
        // bindState[parentId]?.set(treeNode.children.map(i => bindState[i.id].get()));
      }
    }
  };

  const removeDataParent = (id: string) => {
    const _index = dataList.value.findIndex((i) => i[0] == id);
    dataList.value.splice(_index, 1);
    delete bindState[id];
  };

  /** 绑定数据 */
  const bingData = (
    id: string,
    config: {
      get: () => any[];
      set: (val: any[]) => void;
    },
  ) => {
    bindState[id] = config;
  };

  /** 绑定数据 */
  const unBingData = (id: string) => {
    delete bindState[id];
  };

  return {
    name: hookName,
    config: stateConfig,
    isStart,
    treeList,
    draggableMap: state.draggableMap,
    droppableMap: state.droppableMap,
    setState,
    drag: _drag,
    startDrag,
    onDrag,
    onEndDrag,
    init: _init,
    destory: _destory,
    setDraggableLoc,
    setDroppableLoc,
    setContext,
    addDraggable,
    removeDraggable,
    addDroppable,
    removeDroppable,
    addDataParent,
    removeDataParent,
    bingData,
    unBingData,
  };
};
