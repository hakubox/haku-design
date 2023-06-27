import { StyleValue, UnwrapNestedRefs, reactive } from "vue";
import { CustomDragEvent, DragNode, DragRect, DraggableState } from "./index.d";


/** 转换鼠标事件参数 */
export function transformCustomMouseEvent<T>({
  e,
  state,
  config,
  target,
}: {
  e?: MouseEvent;
  config: any;
  state: T;
  target?: HTMLElement;
}): CustomDragEvent<any> {
  return {
    event: e,
    state,
    config,
    target,
  } as unknown as CustomDragEvent<any>;
}

/** 合并配置项 */
export function mergeConfig<T>(stateConfig: UnwrapNestedRefs<T>, config: T) {
  if (config !== undefined) {
    Object.entries(config as Record<string, any>).forEach(([key, value]) => {
      if (stateConfig === undefined) stateConfig = reactive({}) as UnwrapNestedRefs<T>;
      stateConfig![key] = value;
    });
  }
}

export function getDom(dom: HTMLElement | (() => HTMLElement)): HTMLElement {
  return typeof dom === 'function' ? dom() : dom;
}

export function getRect(dom: HTMLElement | (() => HTMLElement)): DragRect {
  const _rect = (typeof dom === 'function' ? dom() : dom).getBoundingClientRect();
  return {
    top: _rect.top,
    left: _rect.left,
    width: _rect.width,
    height: _rect.height,
  };
}

/** 转换鼠标事件参数 */
function transformMouseEvent(e: MouseEvent): DragEvent {
  return e as unknown as DragEvent;
}

/** 是否碰撞 */
export function isCrash(a: DragRect, b: DragRect) {
  const l1 = a.left;
  const t1 = a.top;
  const r1 = l1 + a.width;
  const b1 = t1 + a.height;

  const l2 = b.left;
  const t2 = b.top;
  const r2 = l2 + b.width;
  const b2 = t2 + b.height;
  // console.log(`┏ A: ${toDecimal(a.top)}:${toDecimal(a.left)}:${toDecimal(a.width)}:${toDecimal(a.height)}`);
  // console.log(`┗ B: ${toDecimal(b.top)}:${toDecimal(b.left)}:${toDecimal(b.width)}:${toDecimal(b.height)}`);
  if (r2 < l1 || r1 < l2 || b2 < t1 || b1 < t2) {
    return false;
  } else {
    return true;
  }
}

/** 切换样式 */
export function toggleStyle(
  target: HTMLElement | undefined,
  isOpen: boolean,
  { basicCss, css, className }: { basicCss: string; css?: StyleValue; className?: (string | undefined)[] },
) {
  if (!css && !className) return;
  if (target) {
    if (isOpen) {
      if (className) target.classList.add(...className.filter(i => i) as string[]);
      if (css) {
        const _css = Object.entries(css);
        for (let i = 0; i < _css.length; i++) {
          const [key, value] = _css[i];
          target.style[key] = value;
        }
      }
    } else {
      if (className) target.classList.remove(...className.filter(i => i) as string[]);
      if (css) {
        target.setAttribute('style', basicCss);
      }
    }
  } else {
    throw new Error('未传入对应DOM节点');
  }
}

/** 查询节点 */
export const findTreeNode = (itemId: string, tree: DragNode[]): DragNode | undefined => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item.id === itemId) {
      return item;
    } 
    else if (item.type === 'droppable' && item.children?.length) {
      return findTreeNode(itemId, item.children);
    }
  }
  return undefined;
};






/** 移动节点 */
export function moveItem({ arr, itemId, parentId, index }: {
  arr: [string, string | undefined][],
  itemId: string,
  parentId: string,
  index: number
}) {
  let cur = 0;
  const targetChildList: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === itemId) {
      cur = i;
      arr[i][1] = parentId;
    } else if (arr[i][1] === parentId) {
      targetChildList.push(i);
    }
  }
  const size = targetChildList.length;
  if (size === 0) {
    return;
  }
  const num = (index >= size ? targetChildList[size - 1] + 1 : targetChildList[index]) - cur;
  swap(arr, cur, num > 0 ? num - 1 : num);
}

const swap = (arr: any[], start: number, num: number) => {
  let target;
  const step = Math.abs(num);
  let temp: any;
  for (let i = 0; i < step; i++) {
    target = num > 0 ? start + 1 : start - 1;
    temp = arr[start];
    arr[start] = arr[target];
    arr[target] = temp;
    start = target;
  }
}