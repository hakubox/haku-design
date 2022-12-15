import { formComponents, initComponents } from '@/data/form-components';
import { cloneForce } from '@/lib/clone';
import { createModelId } from './common';
import { FormScript, Component } from '@/@types';

/** 获取数据源 */
export function getDataSource(
  /** 数据源 */
  dataSource: any,
  /** 类型 */
  type: any,
  /** 配置项 */
  options: { map?: (arr: any) => any; filter?: (arr: any) => boolean } = {},
): Promise<Record<string, any>[]> {
  if (!type) throw new Error('类型参数不能为空。');

  let re: Promise<Record<string, any>[]> = new Promise((resolve, reject) => resolve([]));

  const _exec = (_re) => {
    if (options.map && _re?.map) {
      _re = _re.map(options.map);
    }
    if (options.filter && _re?.filter) {
      _re = _re.filter(options.filter);
    }
    return _re;
  };

  switch (type) {
    case 'model-list':
      re = new Promise((resolve, reject) => resolve(_exec(dataSource)));
      break;
    case 'json':
      re = new Promise((resolve, reject) => resolve(_exec(dataSource)));
      break;
    case 'variable':
      if (typeof dataSource == 'string') {
        // re = new Promise((resolve, reject) => {
        //   try {
        //     console.log(store.getters);
        //     const _re = Function('__data__', 'return __data__.' + dataSource)(store.getters?.getFormScript?.data);
        //     resolve(_exec(_re));
        //   } catch (error) {
        //     reject(error);
        //   }
        // });
      } else {
        re = new Promise((resolve, reject) => resolve(_exec(dataSource)));
      }
      break;
    case 'expression':
      re = new Promise((resolve, reject) =>
        resolve(
          _exec(
            Function(
              '__data__',
              'let me = __data__; return ' + dataSource,
            )({
              // ...store.getters?.getFormScript?.data,
              // ...store.getters?.getformScript?.methods,
            }),
          ),
        ),
      );
      break;
    default:
      if (type?.type === 'api') {
        // const api: Api | undefined = store.getters?.getApiList?.find((i) => i.address == dataSource?.address);
        // if (api) {
        //   re = axios
        //     .request({
        //       method: api.type,
        //       url: api.address,
        //       [{ get: 'params', post: 'data' }[api.type]]: dataSource?.params ? Function(dataSource.params)() : {},
        //     })
        //     .then(
        //       (d) =>
        //         new Promise((resolve, reject) =>
        //           resolve(_exec(dataSource?.formatter ? Function(dataSource.formatter)()(d) : d)),
        //         ),
        //     );
        // } else {
        //   throw new Error('API不存在。');
        // }
      }
      break;
  }

  return re;
}

/** 填充控件属性 */
export function fillPropertys(components: Component[]): Component[] {
  /** 原始组件列表 */
  const _originalComponentList: Component[] = cloneForce(components);
  /** 对应组件库组件列表 */
  const _componentList: Component[] = formComponents as Component[];

  const _cb = (list: Component[]) => {
    if (list?.length) {
      for (let i = 0; i < list.length; i++) {
        const _component = _componentList.find((component) => component.name == list[i].name);
        if (_component) {
          list[i].id = list[i].id || createModelId(10);
          // list[i].component.defaultAttrs = cloneForce(_component.component.defaultAttrs);
          list[i].title = _component.title;
          list[i].propertys = cloneForce(_component.propertys);
        }
      }
      const _list = initComponents(list) as Component[];
      for (let index = 0; index < list.length; index++) {
        list[index] = {
          ..._list[index],
          // propertyEditors: list[index].propertyEditors
        };
      }
    }
  };

  _cb(_originalComponentList);

  return _originalComponentList;
}

/** 根据变量返回对应类型的原始变量字符串 */
export function getDefaultStrForValue(val: any): string {
  if (typeof val != 'object') {
    switch (typeof val) {
      case 'string':
        return '""';
      case 'number':
        return '0';
      case 'boolean':
        return 'false';
      case 'function':
        return '() => {}';
      case 'symbol':
        return 'Symbol()';
      default:
        return 'undefined';
    }
  } else {
    const type = Object.prototype.toString.apply(val).slice(8, -1);

    if (type == 'Object')
      return JSON.stringify(val, undefined, '    ')
        .split('\n')
        .map((i, index) => {
          if (index > 0) return '    ' + i.replace(/"\S+":/g, (txt) => txt.slice(1, -2) + ':');
          else return i;
        })
        .join('\n');
    else return `new ${val}()`;
  }
}

/** 解析函数并获取函数头 */
export function functionHeaderParse(
  match: [string, string],
  content: string,
): { body: string; bodyRanges: Array<Array<number>> } {
  const _regRange = new RegExp(`${match[0]}|${match[1]}`, 'g');
  let _item: RegExpExecArray | null = null;
  let _rangeIndex = 0;
  const _functionRanges: Array<Array<number>> = [];
  let _content = content;

  while ((_item = _regRange.exec(_content))) {
    if (_item !== null) {
      if (!_functionRanges[_rangeIndex]) {
        _functionRanges[_rangeIndex] = [_item.index, 0];
      }
      switch (_content[_item.index]) {
        case match[0]:
          _functionRanges[_rangeIndex][1] = _functionRanges[_rangeIndex][1] + 1;
          break;
        case match[1]:
          _functionRanges[_rangeIndex][1] = _functionRanges[_rangeIndex][1] - 1;
          break;
        default:
          break;
      }
      if (_functionRanges[_rangeIndex][1] == 0) {
        _functionRanges[_rangeIndex][1] = _item.index;
        _rangeIndex++;
      }
    }
  }

  for (let index = _functionRanges.length - 1; index >= 0; index--) {
    _content = `${_content.substr(0, _functionRanges[index][0])};${_content.substr(_functionRanges[index][1] + 1)}`;
  }

  return {
    body: _content,
    bodyRanges: _functionRanges,
  };
}

/** 获取真实属性 */
export function getRealProp(component: Component, propName: string, script: FormScript) {
  const props = component.attrs;

  if (!props['__' + propName]) return props[propName];

  const _editor = component.propertyEditors?.[propName];
  let _value = props['__' + propName];
  switch (_editor) {
    case 'expression':
      _value = Function(
        '__data__',
        'let me = __data__; return ' + _value,
      )({
        ...(script.data instanceof Function ? script.data() : script.data),
        ...script.methods,
      });
      break;
  }

  return _value;
}

export function getRealProps(component: Component, script: FormScript) {
  return Object.keys(component.attrs).map((i) => getRealProp(component, i, script));
}

/** 解析Vue代码 */
export function variableVueScript(strVariable: string): { script: FormScript; comment: Record<string, string> } {
  const _reg = /\/\*\*\s*(?<remark>.*?)\s*\*\/\s*(?<name>[a-zA-Z0-9_]+)(:|\()/g;
  let _item: RegExpExecArray | null;
  const _list: Record<string, string> = {};
  while ((_item = _reg.exec(strVariable))) {
    if (_item !== null) {
      _list[_item.groups?.name || ''] = _item.groups?.remark || '';
    }
  }
  return {
    script: Function(strVariable)() as FormScript,
    comment: _list,
  };
}
