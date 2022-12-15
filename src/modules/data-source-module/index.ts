import type { DataSource, SourceData } from './@types';
import { createModelId } from '@/tools/common';
import { DataSourceType } from './enum';
import { computed, reactive } from 'vue';

/** 转换数据为数据图 */
const transformDataMap = (data: any) => {
  const _re: any = [];
  /** 递归查询函数 */
  const _callback = (data: any, parentData: Array<any> | Record<string, any>) => {
    if (Array.isArray(parentData)) {
    } else {
    }
  };

  _callback(data, _re);
  return _re;
};

export const state = reactive({
  /** 数据树 */
  dataTree: {} as SourceData<any>,
  /** 数据源列表 */
  dataSourceList: [
    {
      id: createModelId(10),
      type: DataSourceType.static,
      title: `默认数据源`,
      icon: 'iconfont icon-shebeiguanli',
      data: [],
      lastTime: Date.now(),
      enabled: true,
    }
  ] as DataSource[],
  /** 获取数据图 */
  getDataMap: computed(() => {
    const _list = state.dataSourceList;
    const _data: any[] = [];
    for (let i = _list.length - 1; i >= 0; i--) {
      _data.push(transformDataMap(_list[i].data));
    }
    return '';
  }),
});

export default {
  state,
}