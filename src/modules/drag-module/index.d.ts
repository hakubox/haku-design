import { Ref, WritableComputedRef } from "vue";

/** Rect */
export interface DragRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** 拖拽节点 */
export type DragNode = {
  /** 节点Id */
  id: string;
  /** 节点类型 */
  type: 'draggable';
} | {
  /** 节点Id */
  id: string;
  /** 节点类型 */
  type: 'droppable';
  /** 节点配置 */
  config: AllDroppableConfig;
  /** 子节点列表 */
  children: DragNode[];
};

/** 拖拽节点状态 */
export interface DraggableState {
  dom: HTMLElement | (() => HTMLElement);

  domComment: Comment | undefined;
  /** 副本DOM节点 */
  duplicateDom: HTMLElement;
  /** 拖拽完成目标副本DOM节点 */
  droppableDuplicateDom: HTMLElement;
  /** 手柄DOM节点 */
  handleDom: undefined | HTMLElement | (() => HTMLElement);
  x: number;
  y: number;
  startX: number;
  startY: number;
  layerX: number;
  layerY: number;
  width: number;
  height: number;
  /** 自由拖拽 */
  freeDrag: boolean;
  /** 旧目标Id（拖拽完毕更新） */
  prevDroppableId: string;
  /** 目标Id（拖拽时更新） */
  inDroppableId: string;
  /** 使用拖拽副本 */
  useDuplicate: boolean;
  /** 拖拽副本样式 */
  duplicateClass?: string;
  /** 使用Transoform坐标 */
  useTransformPosition: boolean;
}

/** 拖拽节点配置 */
export interface DraggableConfig {
  /** 手柄DOM节点 */
  handleDom: undefined | HTMLElement | (() => HTMLElement);
  /** 是否自由拖拽 */
  freeDrag: boolean;
  /** 使用拖拽副本 */
  useDuplicate: boolean;
  /** 拖拽副本样式 */
  duplicateClass?: string;
  /** 使用Transform坐标 */
  useTransformPosition: boolean;
}

export type AllDroppableConfig = DroppableConfig | SortableConfig;

/** 放置节点配置 */
export interface DroppableConfig {
  /** 组件类型 */
  component: 'droppable';
}

/** 放置节点配置 */
export interface SortableConfig {
  /** 组件类型 */
  component: 'sortable';
  /** 方向 */
  direction: 'row' | 'column';
  /** 是否反向 */
  reverse: boolean;
}

export interface DroppableState {
  dom: HTMLElement | (() => HTMLElement);
  x: number;
  y: number;
  startX: number;
  startY: number;
  layerX: number;
  layerY: number;
  width: number;
  height: number;
  /** 使用Transoform坐标 */
  useTransformPosition: boolean;
}

export interface DragHook<T = Record<string, any>> {
  /** hookName */
  name: string;
  /** 配置项 */
  config: T;
  /** 是否开始拖拽 */
  isStart: Ref<boolean>;
  /** 拖拽节点键值对 */
  draggableMap: Record<string, DraggableState>;
  /** 目标节点键值对 */
  droppableMap: Record<string, HTMLElement | (() => HTMLElement)>;
  /** 设置状态 */
  setState: (obj: Partial<DragHookState<T>>) => void;
  /** 可手动绑定的拖拽函数 */
  onDrag: (id: string, fn: (e: CustomDragEvent<T>) => void) => void;
  /** 可手动绑定的拖拽函数 */
  onEndDrag: (id: string, fn: (e: CustomDragEvent<T> & { droppableId?: string }) => void) => void;
  /** 可手动绑定的拖拽函数 */
  drag: (e: MouseEvent, config?: T | undefined) => void;
  /** 开始拖拽 */
  startDrag: <T extends Record<string, any>>(e: MouseEvent, config?: T) => void;
  /** 设置上下文 */
  setContext: (rect: DragRect | (() => DragRect)) => void;
  /** 设置DOM节点坐标 */
  setDraggableLoc: (id: string, x: number, y: number) => void;
  /** 设置DOM节点坐标 */
  setDroppableLoc: (id: string, x: number, y: number) => void;
  /** 设置拖拽节点 */
  addDraggable: (id: string, dom: HTMLElement | (() => HTMLElement), config: DraggableConfig) => boolean;
  /** 移除拖拽节点 */
  removeDraggable: (id: string) => boolean;
  /** 设置目标节点 */
  addDroppable: (id: string, dom: HTMLElement | (() => HTMLElement), config: AllDroppableConfig) => boolean;
  /** 移除目标节点 */
  removeDroppable: (id: string) => boolean;
  /** 设置数据链 */
  addDataParent: (id: string, parentId: string | undefined) => void;
  /** 移除数据链 */
  removeDataParent: (id: string) => void;
  /** 绑定数据 */
  bingData: <T>(id: string, config: {
    get: () => void,
    set: (val: any[]) => void
  }) => void;
  /** 解绑数据 */
  unBingData: (id: string) => void;
}

/** 拖拽事件 */
export interface CustomDragEvent<T> {
  /** 触发节点 */
  target: HTMLElement;
  /** 配置项 */
  config: T;
  state: {
    /** 横轴坐标X */
    x,
    /** 纵轴坐标Y */
    y,
    /** 离当前组件的左上角横坐标X */
    layerX: number,
    /** 离当前组件的左上角纵坐标Y */
    layerY: number,
    /** 开始拖拽点X */
    startX: number,
    /** 开始拖拽点Y */
    startY: number,
    /** 在范围内 */
    inArea: boolean,
  },
  /** 鼠标事件参数 */
  event: {
    /** 响应DOM节点 */
    target: HTMLElement;
    /** 鼠标按键 */
    button: number;
    /** 是否按下Ctrl按键 */
    ctrlKey: boolean;
    /** 是否按下Shift按键 */
    shiftKey: boolean;
    clientX: number;
    clientY: number;
    layerX: number;
    layerY: number;
    offsetX: number;
    offsetY: number;
    /** 相对页面横坐标X */
    pageX: number;
    /** 相对页面纵坐标Y */
    pageY: number;
    /** 相对视窗横坐标X */
    screenX: number;
    /** 相对视窗纵坐标Y */
    screenY: number;
  }
}

export interface DragHookState<T> {
  /** 上下文DOM */
  contextDom: HTMLElement | (() => HTMLElement);
  /** 是否拖拽到边缘 */
  dragOnEdge: boolean;
  /** 允许超出范围 */
  overflow: Boolean;
  /** 拖拽完成时（进入预定范围）拖拽节点类名 */
  successDragDraggableClass: string;
  /** 拖拽完成时（进入预定范围）目标节点类名 */
  successDragDroppableClass: string;
  /** 可拖拽节点键值对 */
  draggableMap: Record<string, DraggableState>;
  /** 目标节点键值对 */
  droppableMap: Record<string, DroppableState & AllDroppableConfig>;
  /** 拖拽索引 */
  dragId: string;
  /** 初始化完毕 */
  isInit: boolean;
  /** 上一次的拖拽点 */
  prevLoc: CustomDragEvent<T> | undefined;
  
}