import { Ref, UnwrapNestedRefs, reactive, ref } from "vue";

/** 拖拽事件 */
export interface DragEvent {
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
  screenX: number;
  screenY: number;
}

/** 创建拖拽钩子 */
export const useDragHook = <T = undefined>({ el, drag, dragStart, dragEnd, destory, config }: {
  el?: HTMLElement,
  /** 拖拽时响应函数 */
  drag: (e: DragEvent, config: T extends undefined ? void : UnwrapNestedRefs<T>) => void,
  /** 拖拽开始时响应函数 */
  dragStart?: (e: DragEvent, config: T extends undefined ? void : UnwrapNestedRefs<T>) => void,
  /** 拖拽结束时响应函数 */
  dragEnd?: (e: DragEvent, config: T extends undefined ? void : UnwrapNestedRefs<T>) => void,
  /** 销毁函数 */
  destory?: () => void,
  /** 配置项 */
  config?: T,
}) => {
  /** 是否开始拖拽 */
  const isStart = ref<boolean>(false);
  /** 状态 */
  const state = reactive({
    /** 初始化完毕 */
    isInit: false,
    /** 上一次的拖拽点 */
    prevLoc: undefined as DragEvent | undefined,
  });
  let stateConfig = reactive({}) as UnwrapNestedRefs<T>;

  /** 开始拖拽 */
  const startDrag = (e: MouseEvent, config?: T) => {
    if (state.isInit) {
      isStart.value = true;
      state.prevLoc = e as unknown as DragEvent;
      if (config !== undefined) {
        Object.entries(config as Record<string, any>).forEach(([key, value]) => {
          if (stateConfig === undefined) stateConfig = reactive({}) as UnwrapNestedRefs<T>;
          stateConfig[key] = value;
        });
      }
      if (dragStart) dragStart(e as unknown as DragEvent, stateConfig as T extends undefined ? void : UnwrapNestedRefs<T>);
    }
  };
  /** 拖拽中 */
  const dragging = (e: MouseEvent) => {
    if (isStart.value) {
      state.prevLoc = e as unknown as DragEvent;
      drag(state.prevLoc, stateConfig as T extends undefined ? void : UnwrapNestedRefs<T>);
    }
  };
  /** 结束拖拽 */
  const endDrag = (e: MouseEvent) => {
    isStart.value = false;
    if (dragEnd) dragEnd(e as unknown as DragEvent, stateConfig as T extends undefined ? void : UnwrapNestedRefs<T>);
  };

  /** 拖拽初始化 */
  const _init = () => {
    if (el) el.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', endDrag);
    state.isInit = true;
  };
  /** 销毁拖拽事件 */
  const _destory = () => {
    if (el) el.removeEventListener('mousedown', startDrag);
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', endDrag);
    if (destory) destory();
  };

  return {
    config: stateConfig,
    isStart,
    drag,
    startDrag,
    init: _init,
    destory: _destory,
  }
}