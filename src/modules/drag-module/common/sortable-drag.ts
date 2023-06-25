import { getDataByArrs, getDom, getRect } from "../common";
import type { AllDroppableConfig, DroppableState, DraggableState, DragHookState, DragNode, SortableConfig, DragRect } from "../index.d";

// export function getInsertIndex<T>({
//   e, parentId, treeData, state, draggableState, droppableState
// }: {
//   e: MouseEvent,
//   parentId: string,
//   treeData: DragNode[],
//   state: DragHookState<T>,
//   draggableState: DraggableState,
//   droppableState: DroppableState & AllDroppableConfig
// }): number[] {
//   return getInsertIndexBySortable<T>({ e, parentId, treeData, state, draggableState, droppableState });
// }

/** 获取插入信息 */
export function getInsertIndexBySortable<T, U>({
  e, parentId, treeData, state, draggableState, droppableState
}: {
  e: MouseEvent,
  parentId: string,
  treeData: DragNode<U>[],
  state: DragHookState<T>,
  draggableState: DraggableState,
  droppableState: DroppableState & AllDroppableConfig,
}): {
  /** 拖拽元素DragId */
  id: string,
  /** 插入索引 */
  index: number, 
  /** 子节点类型 */
  childType: 'draggable' | 'droppable',
  /** 父元素Dom */
  parentDom: HTMLElement | undefined,
  /** 拖拽节点DragId */
  childId: string
} {

  let childType = '' as 'draggable' | 'droppable';

  let parentDom: HTMLElement | undefined = undefined;
  const insertDom: HTMLElement | undefined = undefined;

  // 获取所有基本DOM节点
  const _draggableRect = getRect(draggableState.dom);
  const _droppableRect = getRect(droppableState.dom);

  // 获取列表下方所有可拖拽及可放置（目标）DOM节点的坐标
  const _treeList = treeData.map(i => {
    let rect: DragRect;
    if (i.type === 'draggable') {
      rect = getRect(state.draggableMap[i.id].dom);
    } else {
      rect = getRect(state.droppableMap[i.id].dom);
    }
    return { ...i, rect };
  }) as (DragNode<U> & { rect: DragRect })[];

  // console.error('_treeList', _treeList);

  // 重构所有坐标，使成为表格
  const _rects = getRects(parentId, droppableState, _treeList);
  // console.log('_rects', _rects);

  // 计算插入点（如果是在内部就做回调）
  let _reLocIndex = -1;

  if (droppableState.component === 'sortable') {
    if (droppableState.direction === 'row') {
      if (e.pageX < _droppableRect.left) {
        _reLocIndex = 0;
      } else if (e.pageX > _droppableRect.left + _droppableRect.width) {
        _reLocIndex = _treeList.length;
      }
    } else if (droppableState.direction === 'column') {
      if (e.pageY < _droppableRect.top) {
        _reLocIndex = 0;
      } else if (e.pageY > _droppableRect.top + _droppableRect.height) {
        _reLocIndex = _treeList.length;
      }
    }
  }

  if (_reLocIndex === -1) {
    for (let i = 0; i < _treeList.length; i++) {
      const item = _treeList[i];
      if (item.type === 'draggable') {

        const _areaLoc = inArea({
          type: 'draggable',
          point: { x: e.pageX, y: e.pageY },
          rect: item.rect,
          parentState: droppableState,
          prevRect: i > 0 ? _treeList[i - 1].rect : undefined
        });

        if (_areaLoc === 'start') {
          childType = 'draggable';
          _reLocIndex = i;
          break;
        } else if (_areaLoc === 'end') {
          childType = 'draggable';
          _reLocIndex = i + 1;
          break;
        }

      } else if (item.children?.length) {

        const _areaLoc = inArea({
          type: 'droppable',
          point: { x: e.pageX, y: e.pageY },
          rect: item.rect,
          parentState: droppableState,
          prevRect: i > 0 ? _treeList[i - 1].rect : undefined
        });

        if (_areaLoc === 'in') {
          childType = 'droppable';
          _reLocIndex = i;
          return getInsertIndexBySortable<T, U>({ e, parentId: item.children[i].id, treeData: item.children, state, draggableState, droppableState });
        }

      }
    }
  }
  if (_reLocIndex === -1) {
    _reLocIndex = _treeList.length;
  } else {
    _reLocIndex = _reLocIndex - 1;
  }
  parentDom = getDom(droppableState.dom);
  // console.log('结果', { id: parentId, childType, index: _reLocIndex, parentDom: parentDom, childId: _treeList[_reLocIndex]?.id });
  return { id: parentId, childType, index: _reLocIndex, parentDom: parentDom, childId: _treeList[_reLocIndex]?.id };
}

/** 重构所有坐标及宽高度 */
export function getRects<T>(
  parentId: string,
  droppableState: DroppableState & AllDroppableConfig,
  treeList: (DragNode<T> & { rect: DragRect; })[]
) {
  if (!parentId) return [];
  
  const _rectList = [] as (DragNode<T> & { rect: DragRect; })[];
  if (droppableState.component === 'sortable') {
    if (droppableState.direction === 'row') {
      
      for (let i = 0; i < treeList.length; i++) {
        const item = treeList[i];
        _rectList.push(item);
      }
      
    } else if (droppableState.direction === 'column') {

      for (let i = 0; i < treeList.length; i++) {
        const item = treeList[i];
        _rectList.push(item);
      }

    }
  }

  return _rectList;
}

/** 是否在范围内 */
export function inArea({
  type, parentState, point, rect, prevRect
}: {
  type: 'droppable' | 'draggable',
  parentState: DroppableState & AllDroppableConfig,
  point: { x: number, y: number },
  rect: { top: number, left: number, width: number, height: number },
  prevRect: { top: number, left: number, width: number, height: number } | undefined,
}): 'in' | 'start' | 'end' | 'out' {
  if (parentState.component === 'sortable') {
    if (type === 'droppable') {
      if (point.y > rect.top && point.y < rect.top + rect.height && point.x > rect.left && point.x < rect.left + rect.width) {
        return 'in';
      }
    } else if (type === 'draggable') {
      
      if (prevRect) {
        if (point.y > prevRect.top + prevRect.height && point.y < rect.top + rect.height / 2) {
          return 'start';
        } else if (point.y >= rect.top + rect.height / 2 && point.y < rect.top + rect.height) {
          return 'end';
        }
      } else {
        if (point.y < rect.top + rect.height / 2) {
          return 'start';
        } else if (point.y >= rect.top + rect.height / 2 && point.y < rect.top + rect.height) {
          return 'end';
        }
      }
    }
  } else {
    throw new Error(`错误的拖拽组件类型[${parentState.component}]`);
  }

  return 'out';
}