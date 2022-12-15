import { state as formFillState } from '@/modules/form-fill-module';
import { state as editorState } from '@/modules/editor-module';
import { state as dataSourceState } from '@/modules/data-source-module';
import { service as scoringService } from '@/modules/scoring-module';
import { createModelId, timeFormat } from '@/tools/common';
import type { VariableTreeNode, VariableType } from './@types';
import { cloneForce } from '@/lib/clone';
import { DataSourceType } from '../data-source-module/enum';
import { computed, reactive, toRefs } from 'vue';

/** 获取变量数据源下拉项 */
export const getVariableDataSource = (): VariableTreeNode[] => {
  const _re = dataSourceState.dataSourceList.filter(i => i.enabled).map(i => {
    return i.data?.length ? [ { key: createModelId(), title: i.title, value: i.title, selectable: false, children: i.data, type: 'object' as VariableType, name: '' } ] : [];
  }).flat();
  return _re;
}

/** 获取变量值类型 */
export const getValueType = (type: VariableType) => {
  switch (type) {
    case 'string': return '文本';
    case 'number': return '数值';
    case 'datetime': return '日期';
    case 'boolean': return '真假';
    case 'list': return '列表';
    case 'object': return '对象';
    default: return '';
  }
}

/** 默认变量 */
export const getDefaultVariables = () => [
  editorState.appConfig.hasScore ? {
    title: '评价',
    name: 'getRating',
    type: 'object',
    selectable: false,
    children: [
      { title: '评价标题', name: 'title', type: 'string' },
      { title: '评价详情', name: 'description', type: 'string' },
    ],
  } : undefined,
  editorState.appConfig.hasScore ? {
    title: '总分',
    name: 'totalScore',
    type: 'number'
  } : undefined,
  editorState.appConfig.turnPageMode !== 'no-page' ? {
    title: '当前表单页数',
    name: 'formPageIndex',
    type: 'number',
  } : undefined,
  editorState.appConfig.timerConfig?.isOpen ? {
    title: '记时信息',
    name: 'timerInfo',
    type: 'object',
    selectable: false,
    children: [
      { title: '是否开始', name: 'isStart', type: 'boolean' },
      { title: '开始时间', name: 'startTime', type: 'datetime' },
      { title: '完成时间', name: 'completeTime', type: 'datetime' },
      { title: '总时长', name: 'duration', type: 'number' },
      { title: '是否暂停', name: 'isPause', type: 'boolean' },
      { title: '是否完成', name: 'isComplete', type: 'boolean' },
      { title: '时间列表', name: 'timeList', type: 'list' },
      { title: '回答时间列表', name: 'answerTimeList', type: 'list' },
    ],
  } : undefined
].filter(i => i) as VariableTreeNode[];

/** 变量递归转换为TreeNode项 */
export const _variable_treenode_callback = (treeNodes: VariableTreeNode[]) => {
  const _data: VariableTreeNode[] = cloneForce(treeNodes);
  const _cb = (arr: VariableTreeNode[], parentPath: string, parentType: string) => {
    if (arr.length) {
      for (let i = 0; i < arr.length; i++) {
        const _name = (parentPath ? `${parentPath}${parentType === 'list' ? `[${i}]` : `.${arr[i].name}`}` : arr[i].name) || '';
        arr[i]['value'] = _name || arr[i]['key'];
        delete arr[i]['key'];
        if (arr[i].children?.length) _cb(arr[i].children!, _name, arr[i].type);
      }
    }
  };
  _cb(_data, '', 'object');
  return _data;
};

/** 变量模块状态 */
export const state = reactive({
  /** 获取下拉列表树节点 */
  getVarTree: computed(() => {
    return [
      ..._variable_treenode_callback(getDefaultVariables()),
      ..._variable_treenode_callback(getVariableDataSource()),
    ];
  }),
});

/** 变量模块逻辑 */
export const service = {
  /** 更新变量 */
  updateVariable() {
    editorState.bus.$emit('update-variable');
  },
  /** 获取系统变量Map */
  getSystemVariableMap() {
    return {
      getRating: scoringService.getCurrentRating(),
      /** 完成时长 */
      completeTimeTxt: timeFormat(formFillState.timerInfo.duration, true),
      /** 总分数 */
      totalScore: formFillState.totalScore,
      /** 当前表单页数 */
      formPageIndex: editorState.currentFormPageIndex,
      /** 总时长 */
      nowUseTime: formFillState.nowUseTime,
      /** 记时信息 */
      timerInfo: formFillState.timerInfo,
      /** 设备信息 */
      remoteInfo: formFillState.remoteInfo,
      /** 维度得分 */
      dimensionScore: formFillState.dimensionScore,
    };
  },
  /** 获取所有数据源变量Map */
  getDataSourceVariableMap() {
    const _dataSourceList = dataSourceState.dataSourceList.filter(i => i.enabled && i.type === DataSourceType.static);
    if (_dataSourceList.length) {
      const _re = {} as any;
      const _cb = (arr: VariableTreeNode[], parentResultData: any, parentData: VariableTreeNode) => {
        if (arr.length) {
          for (let i = 0; i < arr.length; i++) {
            let _reData = _re;
            if (parentData.type === 'list') {
              if (arr[i].type === 'object') {
                parentResultData.push({});
              } else if (arr[i].type === 'list') {
                parentResultData.push([]);
              } else {
                parentResultData.push(arr[i]['value']);
              }
              _reData = parentResultData[parentResultData.length - 1];
            } else if (arr[i].type === 'list') {
              parentResultData[arr[i].name] = [];
              _reData = parentResultData[arr[i].name];
            } else if (arr[i].type === 'object') {
              parentResultData[arr[i].name] = {};
              _reData = parentResultData[arr[i].name];
            }  else {
              parentResultData[arr[i].name] = arr[i]['value'];
              _reData = parentResultData[arr[i].name];
            }
            if (arr[i].children?.length) _cb(arr[i].children!, _reData, arr[i]);
          }
        }
      };

      _dataSourceList.map(i => {
        _cb(i.data, _re, { name: '', title: '', type: 'object' });
      });
      return _re;
    }
    return {};
  },
  /** 根据字符串获取变量的值 */
  getVar(variableTxt: string): any {
    if (!variableTxt) return undefined;
    return new Function('__data__', `return __data__.${variableTxt};`)({
      ...service.getSystemVariableMap(),
      ...service.getDataSourceVariableMap(),
    });
  },
  /** 设置值 */
  setVar(variableTxt: string, value: any) {
    const _dataSource = dataSourceState.dataSourceList.find(i => i.enabled && i.type === DataSourceType.static);

    /** TODO: 需要完成设置变量功能 */
    const _arr = variableTxt.split(/\.|[\d+]/);
    let _targetIndex = 0;
    let _isComplete = false;

    const _cb = (variable: VariableTreeNode, parent: VariableTreeNode) => {
      if (_isComplete) return;
      if (variable.name === _arr[_targetIndex]) {
        if (_targetIndex === _arr.length - 1) {
          variable.value = value;
          _isComplete = true;
          return;
        } else {
          _targetIndex += 1;
        }
        // if (parent.type === 'object') {
        //   if (_targetIndex === _arr.length - 1) {
        //     const _index = parent.children?.findIndex(i => i.name === _arr[_targetIndex]);
        //     parent.children![_index].value = value;
        //     _isComplete = true;
        //   }
        // } else if (parent.type === 'list') {
        //   const _index = parseInt(_arr[_targetIndex].slice(1, -1));
        //   if (_targetIndex === _arr.length - 1) {
        //     parent.children![_index].value = value;
        //     _isComplete = true;
        //   }
        // } else {
        //   _target = variable.value;
        //   if (_targetIndex === _arr.length - 1) {
        //     _isComplete = true;
        //   }
        // }
      }
      if (!_isComplete && parent?.children?.length) {
        for (let i = 0; i < parent.children.length; i++) {
          const item = parent.children[i];
          _cb(item, parent);
        }
      }
    };

    const dataSourceCopy = cloneForce(_dataSource?.data);
    dataSourceCopy.forEach(p => _cb(p, {
      type: 'object',
      name: '[root]',
      title: '根节点',
      children: p,
    }));

    _dataSource!.data = dataSourceCopy;

    setTimeout(() => {
      service.updateVariable();
    }, 20);
  },
  /** 获取变量处理的文本，判断 {{}} */
  getVarText(text: string): string {
    const reg = /\{\{.*?\}\}/g;
    const _re: string[] = [];
    const _indexes: number[] = [];
    let match: RegExpExecArray | null = reg.exec(text);
    let _index = 0;
    while (match) {
      if (!_indexes.includes(match.index)) _indexes.push(match.index);
      _indexes.push(match.index + match.toString().length);
      match = reg.exec(text);
    }
    _indexes.push(text.length);
    _index = 0;
    for (let i = 0; i < _indexes.length; i++) {
      const val = text.substring(_index, _indexes[i]) || '';
      if (val.startsWith('{{') && val.endsWith('}}')) {
        _re.push(service.getVar(val.slice(2, -2).trim()));
      } else {
        _re.push(val);
      }
      _index = _indexes[i];
    }
    return _re.join('');
  },
};

export default {
  state,
  service,
}