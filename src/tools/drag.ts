import { StyleValue, UnwrapNestedRefs, reactive, ref } from "vue";
import { throttle } from "./common";

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
  /** 相对视窗横坐标X */
  screenX: number;
  /** 相对视窗纵坐标Y */
  screenY: number;
}

/** 转换鼠标事件参数 */
function transformMouseEvent(e: MouseEvent): DragEvent {
  return e as unknown as DragEvent;
}

/** 合并配置项 */
function mergeConfig<T>(stateConfig: UnwrapNestedRefs<T>, config: T) {
  if (config !== undefined) {
    Object.entries(config as Record<string, any>).forEach(([key, value]) => {
      if (stateConfig === undefined) stateConfig = reactive({}) as UnwrapNestedRefs<T>;
      stateConfig![key] = value;
    });
  }
}

/** 切换样式 */
function toggleStyle(target: HTMLElement | undefined, isOpen: boolean, { basicCss, css, className }: { basicCss: string, css?: StyleValue, className?: string }) {
  if (!css && !className) return;
  if (target) {
    if (isOpen) {
      if (className) target.classList.add(className);
      if (css) {
        const _css = Object.entries(css);
        for (let i = 0; i < _css.length; i++) {
          const [key, value] = _css[i];
          target.style[key] = value;
        }
      }
    } else {
      if (className) target.classList.remove(className);
      if (css) {
        target.setAttribute('style', basicCss);
      }
    }
  } else {
    throw new Error('未传入对应DOM节点');
  }
}

/** 创建拖拽钩子 */
export const useDragHook = <T extends undefined | object = undefined, UseShadow extends boolean = false>({
  el, proxyMove, startDragTargetClassName, startDragTargetStyle, 
  drag, dragCheck, dragStart, dragEnd, dragEndError, dragEnterRange, dragLeaveRange, destory, config, throttleTime
}: {
  /** 快速绑定节点 */
  el?: HTMLElement,
  /** 代理移动 */
  proxyMove?: boolean,
  /** 开启拖拽影子 */
  useShadow?: UseShadow,
  /** 拖拽时节点类样式名 */
  startDragTargetClassName?: string,
  /** 拖拽时节点样式 */
  startDragTargetStyle?: StyleValue,
  /** 拖拽时响应钩子 */
  drag: (e: DragEvent) => void,
  /** 拖拽校验（是否拖拽到指定区域） */
  dragCheck?: (e: DragEvent) => boolean,
  /** 拖拽开始时响应钩子 */
  dragStart?: (e: DragEvent) => void,
  /** 拖拽结束时响应钩子 */
  dragEnd?: (e: DragEvent) => void,
  /** 拖拽结束错误的响应钩子 */
  dragEndError?: (e: DragEvent) => void,
  /** 刚拖入指定范围时的响应钩子 */
  dragEnterRange?: (e: DragEvent) => void,
  /** 刚离开指定范围时的响应钩子 */
  dragLeaveRange?: (e: DragEvent) => void,
  /** 销毁钩子 */
  destory?: () => void,
  /** 回弹函数，返回回弹位置 */
  onBounceBack?: () => { x: number, y: number },
  /** 配置项 */
  config?: T,
  /** 节流时间（0或undefined为取消节流） */
  throttleTime?: number,
}) => {

  /** 校验 */
  if (!dragCheck && (dragEnterRange || dragLeaveRange)) {
    console.warn('未指定拖拽中的校验函数');
  }

  /** 是否开始拖拽 */
  const isStart = ref<boolean>(false);
  /** 拖拽节点 */
  const target = ref<HTMLElement>(); 
  /** 拖拽节点基础样式 */
  let targetBasicCss = '';
  /** 状态 */
  const state = reactive({
    /** 初始化完毕 */
    isInit: false,
    /** 是否拖拽到指定范围 */
    isInnerRange: true,
    /** 上一次的拖拽点 */
    prevLoc: undefined as DragEvent | undefined,

    prevX: 0,
    prevY: 0,
    x: 0,
    y: 0,
  });
  /** 其他状态或配置项 */
  const stateConfig = reactive({
    ...config
  }) as UnwrapNestedRefs<T>;

  /** 开始拖拽 */
  const startDrag = (e: MouseEvent, config?: T) => {
    if (state.isInit) {
      isStart.value = true;
      const _e = transformMouseEvent(e);
      target.value = _e.target;
      state.prevLoc = _e;
      if (config !== undefined) mergeConfig(stateConfig, config);
      if (dragStart) {
        targetBasicCss = target.value.getAttribute('style') || '';
        if (proxyMove) {
          const [ x, y ] = target.value.style.transform.match(/translate\((\n+)px, (\n+)px\)/g) || [0, 0];
          state.prevX = +x;
          state.prevY = +y;
        }
        toggleStyle(target.value, true, {
          basicCss: targetBasicCss,
          css: startDragTargetStyle,
          className: startDragTargetClassName
        });
        dragStart(_e);
      }
    }
  };
  /** 拖拽中回调函数 */
  const _cb = (e: MouseEvent) => {
    if (isStart.value) {
      const _e = transformMouseEvent(e);
      if (proxyMove && target.value) {
        target.value.style.transform = `translate(${state.x + state.prevX}px, ${state.y + state.prevY}px)`;
      }
      if (dragCheck === undefined) {
        state.prevLoc = _e;
        drag(_e);
      } else {
        const _isSuccess = dragCheck(_e);
        if (_isSuccess) {
          state.prevLoc = _e;
          if (!state.isInnerRange) {
            state.isInnerRange = true;
            dragEnterRange?.(_e);
          }
          drag(_e);
        } else {
          if (state.isInnerRange) {
            state.isInnerRange = false;
            dragLeaveRange?.(_e);
          }
        }
      }
    }
  };
  /** 拖拽中事件 */
  const dragging = throttleTime ? throttle(_cb, throttleTime, { leading: true, trailing: true }) : _cb;
  /** 结束拖拽 */
  const endDrag = (e: MouseEvent) => {
    isStart.value = false;
    const _e = transformMouseEvent(e);
    toggleStyle(target.value, false, {
      basicCss: targetBasicCss,
      css: startDragTargetStyle,
      className: startDragTargetClassName
    });
    if (dragEnd) {
      if (dragCheck === undefined) {
        dragEnd(_e);
      } else {
        // 判断是否拖拽到指定范围
        if (state.isInnerRange) {
          dragEnd(_e);
        } else {
          if (target.value) target.value.style.transform = `translate(${state.prevX}px, ${state.prevY}px)`;
          dragEndError?.(_e);
        }
        state.isInnerRange = false;
      }
    }
  };
  /** 拖拽函数（不做拖拽开始检测） */
  const _drag = (e: MouseEvent, config?: T) => {
    const _e = transformMouseEvent(e);
    if (config !== undefined) mergeConfig(stateConfig, config);
    drag(_e);
  }
  /** 拖拽初始化 */
  const _init = () => {
    if (el) el.addEventListener('mousedown', startDrag, { passive: true });
    window.addEventListener('mousemove', dragging, { passive: true });
    window.addEventListener('mouseup', endDrag, { passive: true });
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
    target,
    state,
    drag: _drag,
    startDrag,
    init: _init,
    destory: _destory,
  }
}