import { cloneLoop } from '@/lib/clone';
import { toRaw } from 'vue';

/** QBasic属性名称列表 */
const QBasicPropNameList: string[] = [ 'id', 'label', 'component', 'description', 'componentLabel', 'componentDescription', 'disabled', 'visible', 'padding', 'margin', 'required', 'error-txt' ];

/** 获取QBasic组件的属性 */
export const getQBasicProps = (props: Record<string, any>) => {
  const _props = Object.assign({}, ...Object.entries(props).filter(([key, value]) => QBasicPropNameList.includes(key)).map(([key, value]) => ({ [key]: value })) );
  return _props;
};

/** 根据两个坐标点获取夹角度数 参考：https://blog.csdn.net/qq_34887145/article/details/124584773 */
export function getAngle({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  const angle = Math.atan2(det, dot) / Math.PI * 180
  return (angle + 360) % 360
}

/** 判断两个矩形是否相交 */
export function intersectsRect(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
  const maxX = x1+w1 >= x2+w2 ? x1+w1 : x2+w2;
  const maxY = y1+h1 >= y2+h2 ? y1+h1 : y2+h2;
  const minX = x1 <= x2 ? x1 : x2;
  const minY = y1 <= y2 ? y1 : y2;
 
  return maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2;
}

/** 保留小数位 */
export function toDecimal(num: number | string, pos: number = 0): number {
  let re: number;
  if (typeof num === 'string') {
    if (num === '') {
      return 0;
    } else if (num.includes('.')) {
      re = parseFloat(num);
    } else {
      return parseInt(num);
    }
  } else {
    if (pos === 0) {
      return Math.round(num);
    } else if (num.toString().includes('.')) {
      re = num;
    } else {
      return num;
    }
  }
  if (isNaN(re)) {
    return 0;
  } else if (pos === 0) {
    return Math.round(re);
  } else {
    return Math.round(re * Math.pow(10, pos)) / Math.pow(10, pos);
  }
}

/** 计算两点之间的距离 */
export function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** 获取垂点代码 */
export function getPerpendicularPoint(a: [number, number], b: [number, number], c: [number, number]): { ratio: number, x: number, y: number } {
  // 已知A, B, P三点坐标
  const [x1, y1] = a;
  const [x2, y2] = b;
  const [x3, y3] = c;

  // 向量
  // AP = (x0-x1, y0-y1)
  // AB = (x2-x1, y2-y1)
  // 计算AP在AB方向上的投影长度
  // 投影*|AB|
  const dist1 = (x3-x1) * (x2-x1) + (y3-y1) * (y2-y1);
  // |AB| * |AB|
  const dist2 = (x2-x1) ** 2 + (y2 - y1) ** 2;

  // AD = 投影 / |AB| * AB
  const ratio = dist1 / dist2;
  const x4 = x1 + ratio * (x2 - x1);
  const y4 = y1 + ratio * (y2 - y1);
  return { x: x4, y: y4, ratio };
}

/**
 * NPM版本号对比，前版本号是否大于后版本号
 * 
 * @example
 * 
 *  // 将返回false
 *  compareVersion('1.1', '1.2')
 */
export function compareVersion(
  curV: string,
  reqV: string
): boolean {
  if (!curV || !reqV) {
    throw new Error('对比的版本号不能为空');
  }
  // 将两个版本号拆成数字
  const arr1 = curV.split('.');
  const arr2 = reqV.split('.');
  const minLength = Math.min(arr1.length, arr2.length);
  let position = 0;
  let diff = 0;
  //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
  while(position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {
    position++;
  }
  diff = (diff != 0) ? diff : (arr1.length - arr2.length);
  //若curV大于reqV，则返回true
  return diff > 0;
}

/** 对比函数（不对比减少项） */
export function diffNode(oldNodes: Record<string, any>[], newNodes: Record<string, any>[], {
  childField,
  diff,
}: { childField: string, diff: (nodeA: Record<string, any>, nodeB: Record<string, any>) => boolean } = {
  childField: 'children',
  diff: (nodeA, nodeB) => JSON.stringify({ ...nodeA, [childField]: undefined }) === JSON.stringify({ ...nodeB, [childField]: undefined })
}): { node: Record<string, any>, diffNode: Record<string, any> | undefined, path: (string | number)[] }[] {
  const _newNodes = toRaw(newNodes);
  const _oldNodes = toRaw(oldNodes);
  const _diffNodes: { node: Record<string, any>, diffNode: Record<string, any> | undefined, path: (string | number)[] }[] = [];

  const getNodeByPath = (path: (string | number)[]): Record<string, any> | undefined => {
    let _node;
    let _currentIndex = 0;
    for (; _currentIndex < path.length; _currentIndex++) {
      if (_currentIndex === 0) {
        _node = _oldNodes[path[_currentIndex]];
      } else {
        _node = _node[path[_currentIndex]];
      }
    }
    return _node;
  };

  const cb = (_nodes: Record<string, any>[], path: (string | number)[]) => {
    for (let i = 0; i < _nodes.length; i++) {
      const _node = _nodes[i];
      
      if (_node[childField]?.length) {
        cb(_node[childField], [ ...path, i, childField ]);
      } else {
        const _oldNode = getNodeByPath([ ...path, i ]);
        if (_oldNode === undefined) {
          _diffNodes.push({ node: _node, diffNode: undefined, path: [ ...path, i ] });
        } else {
          if (!diff(_node, _oldNode)) {
            _diffNodes.push({ node: _node, diffNode: _oldNode, path: [ ...path, i ] });
          }
        }
      }
    }
  };
  cb(_newNodes, []);

  return _diffNodes;
}

/** 节流函数 */
export function throttle(
  /** 需要节流的函数 */
  func: Function, 
  /** 等待时长（毫秒） */
  wait = 600, 
  /** 附加参数 */
  options: {
    /** 是否头部立刻执行 */
    leading: boolean,
    /** 是否尾部附加执行 */
    trailing: boolean
} = { leading: false, trailing: true }) {
  let timer, result;
  let previous = 0;
  const _leading = options?.leading ?? false;
  const _trailing = options?.trailing ?? true;

  const throttled = async function (this: any, ...args) {
    const now = Date.now(); // 当前时间
    // 下次触发 func 剩余时间
    if (!previous && _leading === false) previous = now;
    const remaining = wait - (now - previous);

    // 如果没有剩余时间或者改了系统时间,这时候不需要等待，直接立即执行，这样就会第一次就执行
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = now;
      return await func.apply(this, args);
    } else if (!timer && _trailing !== false) {
      // 剩余的情况就是remaining<=wait的情况，这里使用setTimeout就可以最后也会执行一次
      timer = setTimeout(async () => {
        timer = null;
        previous = _leading === false ? 0 : Date.now(); // 这里是将previous重新赋值当前时间
        return await func.apply(this, args);
      }, remaining);
    }
    return result;
  };

  throttled.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    previous = 0;
    timer = result = undefined;
  };
  return throttled;
}

/** 切换元素的全屏模式 */
export const toggleFullScreen = (el: HTMLElement, exitCallback?: () => void) => {
  const documentEL = document;
  const videoEL = documentEL.querySelector('video') as HTMLVideoElement;
  const isFullscreen = documentEL['webkitIsFullScreen'] || documentEL.fullscreen;
  if (!isFullscreen) {
    const inFun = el.requestFullscreen || el['webkitRequestFullScreen'];
    // 让当前播放器进入全屏状态
    if (inFun) {
      inFun.call(el);
    } else {
      videoEL['webkitEnterFullscreen']();
      if (exitCallback) {
        // 针对iOS监听不到webkitfullscreenchange事件做的兼容，感知退出全屏
        const timer = setInterval(() => {
          if (!videoEL['webkitDisplayingFullscreen']) {
            // 退出了全屏
            clearInterval(timer);
            exitCallback();
          }
        }, 1000);
      }
    }
  } else {
    const exitFun = document.exitFullscreen || documentEL['webkitExitFullScreen'];
    // 退出全屏状态要使用document
    exitFun.call(documentEL);
  }
  return !isFullscreen;
};

/** 延时函数 */
export function timeout(time = 10) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(resolve);
    }, time);
  });
}

/** 移除对象中的属性 */
export function removeProp(obj: Record<string, any>, ...removePropNames: string[]) {
  let _obj = obj;
  removePropNames.forEach((propName) => {
    const _keys = Object.keys(_obj).filter((i) => i !== propName);
    _obj = Object.fromEntries(Object.entries(obj).filter(([key]) => _keys.includes(key)));
  });
  return _obj;
}

/** 移除空数据 */
export function clearBlankProps(params: Record<string, any> | Array<any>): Record<string, any> {
  if (Array.isArray(params)) {
    return params;
  }
  const _arr: Record<string, any>[] = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      [key]: value,
    }));
  return Object.assign.apply({}, [{}, ..._arr]);
}

export function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

/** 当前参数都为空 */
export function isBlank(...val: any[]) {
  return val.every((item) => {
    return item === undefined || item === null;
  });
}

/** 当前参数都不为空 */
export function isNotBlank(...val: any[]) {
  return val.every((item) => {
    return item !== undefined && item !== null && item !== '';
  });
}

/** 生成随机组件Id */
export function createModelId(len = 36) {
  const s: Array<string> = [];
  const hexDigits = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < len; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 26), 1);
  }
  // s[8] = s[13] = s[18] = s[23] = "-";
  const uuid = s.join('');
  return uuid;
}

/** 生成随机数字Id */
export function createNumberId(len = 36) {
  const s: Array<string> = [];
  const hexDigits = '0123456789';
  for (let i = 0; i < len; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 10), 1);
  }
  // s[8] = s[13] = s[18] = s[23] = '-';
  const uuid = s.join('');
  return uuid;
}

/** 时间格式化 */
export function timeFormat(time: number, useMillisecond: boolean = false, foreKeepHour: boolean = false) {
  if (useMillisecond) time = parseInt(time / 1000 + '');
  let hh: any = ~~(time / 3600);
  let mm: any = ~~((time % 3600) / 60);
  let ss: any = Math.ceil(time % 60); //取整
  hh = hh < 10 ? '0' + hh : hh; //个位数补0
  mm = mm < 10 ? '0' + mm : mm; //个位数补0
  ss = ss < 10 ? '0' + ss : ss; //个位数补0
  if (hh != '00' || foreKeepHour) {
    return `${hh}:${mm}:${ss}`;
  } else {
    return `${mm}:${ss}`;
  }
}

/**
 * 日期格式化
 * @param {Date} [date=new Date()] 日期
 * @param {string} [fmt='yyyy-MM-dd'] 格式化参数
 * @return {string} 格式化后的日期
 */
export function dateFormat(date: number | string | Date = new Date(), fmt: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  else if (typeof date === 'number') date = new Date(date);
  else if (typeof date === 'string') date = new Date(date);
  else if ('' + date == 'Invalid Date') return '';
  const o: Record<string, any> = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  let _fmt = fmt;
  if (/(y+)/.test(fmt)) _fmt = _fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(_fmt)) {
      _fmt = _fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return _fmt;
}

/** 交互数组中两段数值的位置 */
export function arrChange(arr: any[], num1: number, num2: number, num1length: number = 1, num2length: number = 1) {
  if (num1 > num2) [num1, num2, num1length, num2length] = [num2, num1, num2length, num1length];

  return arr
    .slice(0, num1)
    .concat(arr.slice(num2, num2 + num2length))
    .concat(arr.slice(num1 + num1length, num2))
    .concat(arr.slice(num1, num1 + num1length))
    .concat(arr.slice(num2 + num2length));
}

/** 移动组件树中某一项的位置 */
export function moveNodeOfTree<T = string>(
  tree: Record<string, any>[],
  id: T,
  pid: T,
  prop: string = 'id',
): Record<string, any>[] {
  const _tree = cloneLoop(tree);
  let _node = null;
  let _oldIndex = -1;
  let _orderIndex: number | undefined;

  let _isOver = false;
  const _cb = (parentNode, fn) => {
    if (parentNode?.children?.length) {
      for (let index = 0; index < parentNode.children.length; index++) {
        _isOver || _cb(parentNode.children[index], fn);
        const _re = fn(parentNode, index);
        if (_re) return;
      }
    }
  };

  _cb({ children: _tree, id: '' }, (parentNode, index): boolean => {
    if (!_isOver) {
      if (parentNode.id == '') {
        if (parentNode.children[index].id == id) {
          _orderIndex = undefined;
          _isOver = true;
          return true;
        }
      } else {
        for (let i = 0; i < parentNode.children[index].length; i++) {
          if (parentNode.children[index][i].id == id) {
            _orderIndex = i;
            _isOver = true;
            return true;
          }
        }
      }
    }
    return false;
  });

  _isOver = false;
  _cb({ children: _tree, id: '' }, (parentNode, index): boolean => {
    if (!_isOver) {
      if (_orderIndex != undefined) {
        if (parentNode.children[index][_orderIndex]?.[prop] == id) {
          _oldIndex = index;
          _node = parentNode.children[index][_orderIndex];
          parentNode.children[index].splice(_orderIndex, 1);
          _isOver = true;
          return true;
        }
      } else if (parentNode.children[index][prop] == id) {
        _oldIndex = index;
        _node = parentNode.children[index];
        parentNode.children.splice(index, 1);
        _isOver = true;
        return true;
      }
    }
    return false;
  });

  if (!pid) {
    _tree.push(_node);
    return _tree;
  } else {
    _isOver = false;
    _cb({ children: _tree, id: '' }, (parentNode, index): boolean => {
      if (!_isOver) {
        if (parentNode.id == '') {
          const _insertIndex = pid ? parentNode.children.findIndex((i) => i.id == pid) : parentNode.children.length;
          parentNode.children.splice(_insertIndex, 0, _node);
          _isOver = true;
          return true;
        }
      }
      return false;
    });
  }

  return _tree;
}

/** 获取LocalStorage的值 */
export function getLocalstorge(item: string): string | null {
  return window.localStorage.getItem(item) || null;
}

//Base64转Buffer
export function base64ToBuffer(b: string): Uint8Array {
  const str = atob(b);
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buffer[i] = str.charCodeAt(i);
  }
  return buffer;
}

export function initAPI(api: Record<string, any>) {
  const re = {};
  const fn = (parent: any, reParent: any, url: string) => {
    if (parent) {
      Object.keys(parent).forEach((key: string) => {
        if (parent[key]) {
          if (typeof parent[key] !== 'function') {
            reParent[key] = {};
            fn(parent[key], reParent[key], `${url.endsWith('/') ? url + '/' : url}${key}`);
          } else {
            reParent[key] = parent[key].bind(`${url}/${key}/`);
          }
        }
      });
    }
  };
  fn(api, re, '');
  return re;
}

/** 获取默认的分页参数 */
export function getPagination(config: Record<string, any> = {}): Record<string, any> {
  return {
    pageSizeOptions: ['10', '20', '40'],
    showQuickJumper: true,
    showSizeChanger: true,
    defaultCurrent: 1,
    current: 1,
    defaultPageSize: 10,
    ...config,
  };
}

/** 将数字插入千分位符 */
export function thousandNum(money: number | string): string {
  if (!isNaN(Number(money))) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    throw new TypeError('添加千分位符失败，当前参数为：' + money);
  }
}

/** 筛选对象的属性 */
export function filterObj(
  obj: Record<string, any>,
  outKeys: string[] = [],
  inKeys: string[] = [],
): Record<string, any> {
  let keys = Object.keys(obj);
  if (outKeys.length) {
    keys = keys.filter((i) => !outKeys.includes(i));
  }
  if (inKeys.length) {
    keys = keys.filter((i) => inKeys.includes(i));
  }
  const _keys = keys.map((i) => ({ [i]: obj[i] }));
  return Object.assign({}, ..._keys);
}

/** 获取Url参数 */
export function getParams() {
  return new URLSearchParams(location.search.replace(/\?/gi, ''));
}

function fakeClick(obj) {
  const ev = document.createEvent('MouseEvents');
  ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  obj.dispatchEvent(ev);
}

/** dataURL转Blob */
export function dataURL2Blob(dataurl: string) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/** File转Blob */
export function file2Blob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const blob = new Blob([e.target?.result as string], { type: file.type });
        resolve(blob);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });
}

let _prevFileDialog: HTMLElement;
/** 打开文件选择框 */
export function openFileDialog<Multiple extends boolean = false>(config: {
  /** 限制接受文件的类型 */
  accept?: string,
  /** 如果 accept是图片或者视频类型，则指定使用哪个摄像头去获取这些数据。 */
  capture?: 'user' | 'environment',
  /** 是否多选 */
  multiple?: Multiple,
  /** 仅选择文件夹 */
  webkitdirectory?: boolean,
} | undefined): Promise<Multiple extends true ? File[] : (File | undefined)> {
  return new Promise((resolve, reject) => {
    _prevFileDialog?.remove();
    const inputObj = document.createElement('input');
    inputObj.setAttribute('type', 'file');
    inputObj.setAttribute('style', 'visibility:hidden;position: fixed; left: -100px; top: -100px;');
    if (config?.accept) inputObj.setAttribute('accept', config.accept);
    if (config?.capture) inputObj.setAttribute('capture', config.capture);
    if (config?.multiple === true) inputObj.setAttribute('multiple', 'true');
    if (config?.webkitdirectory === true) inputObj.setAttribute('webkitdirectory', 'true');
    document.body.appendChild(inputObj);
    inputObj.addEventListener('change', (e: any) => {
      if (e.target.files && e.target.files.length) {
        const _fileCount = e.target.files.length;
        const _fileList: File[] = [];
        for (let i = 0; i < _fileCount; i++) {
          _fileList.push(e.target.files[i]);
        }
        resolve((config?.multiple === true ? _fileList : _fileList?.[0]) as Multiple extends true ? File[] : File | undefined);
      }
      inputObj.remove();
    });
    inputObj.addEventListener('close', (e) => {
      console.log('e:close', e);
    });
    inputObj.click();
    _prevFileDialog = inputObj;
  });
}

/** 下载文件 */
export function downLoadFile(name: string, data: string | Blob) {
  const urlObject = window.URL || window.webkitURL || window;
  const export_blob = typeof data === 'string' ? new Blob([data]) : data;
  const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.setAttribute('href', urlObject.createObjectURL(export_blob));
  save_link.setAttribute('download', name);
  fakeClick(save_link);
}

/** 递归函数 */
export function recursive(
  formVariables: Array<Record<string, any>>,
  callback?: {
    filter?: (variable: Record<string, any>, chain: Array<Record<string, any>>) => boolean;
    map?: (variable: Record<string, any>, chain: Array<Record<string, any>>) => any;
  },
  childField: string = 'children',
): Array<Record<string, any>> {
  if (!callback) {
    return formVariables;
  }

  const _list: Array<Record<string, any>> = [];

  // 递归
  const _cb = (newParent: Record<string, any>, parent: Record<string, any>, chain: Array<Record<string, any>>) => {
    if (callback?.filter?.(newParent, chain) === false) {
      return;
    }
    const _item = {
      ...parent,
      children: [],
    };
    chain.push(_item);
    if (parent?.children?.length) {
      for (let i = 0; i < parent.children.length; i++) {
        _cb(_item, parent.children[i], chain);
      }
    }
    newParent.children.push(callback.map?.(_item, chain) || _item);
  };

  formVariables.forEach((item) => {
    const _item = {
      ...item,
      children: [],
    };
    if (callback?.filter?.(_item, []) === false) {
      return;
    }

    if (item?.children?.length) {
      for (let i = 0; i < item.children.length; i++) {
        _cb(_item, item.children[i], [_item]);
      }
    }

    _list.push(callback.map?.(_item, [_item]) || _item);
  });

  return _list;
}

/** 获取盒模型CSS值 */
export function getBoxModel(arr?: number[]) {
  if (!arr?.length) return '0px 0px 0px 0px';
  return [arr[0] + 'px', arr[1] + 'px', arr[2] + 'px', arr[3] + 'px'].join(' ');
}

/** UTF16转UTF8 */
export function utf16to8(str) {
  let out, i, c;
  out = '';
  const len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}

/** UTF8转UTF16 */
export function utf8to16(str) {
  let out, i, c;
  let char2, char3;
  out = '';
  const len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
        break;
    }
  }
  return out;
}

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */
const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const base64DecodeChars = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 50, 51, -1, -1, -1, -1, -1,
];

export function base64encode(str) {
  let out, i;
  let c1, c2, c3;
  const len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xf) << 2);
      out += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return out;
}

export function base64decode(str) {
  let c1, c2, c3, c4;
  let i, out;
  const len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c1 == -1);
    if (c1 == -1) break;
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c2 == -1);
    if (c2 == -1) break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61) return out;
      c3 = base64DecodeChars[c3];
    } while (i < len && c3 == -1);
    if (c3 == -1) break;
    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61) return out;
      c4 = base64DecodeChars[c4];
    } while (i < len && c4 == -1);
    if (c4 == -1) break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}

export function safe64(base64: string): string {
  base64 = base64.replace(/\+/g, '-');
  base64 = base64.replace(/\//g, '_');
  return base64;
}

export default {
  dateFormat,
  getLocalstorge,
  initAPI,
  getPagination,
  thousandNum,
  getParams,
  downLoadFile,
  recursive,
  filterObj,
};
