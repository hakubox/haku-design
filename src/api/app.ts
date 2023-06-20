import { ApiPageList, deletes, get, post } from '@/lib/api';
import { AppInfoDto } from '@/model/app-info-dto';

/** 查询问卷列表 */
export function getApps() {
  return new Promise<AppInfoDto[]>((resolve, reject) => {
    get(`${process.env.serverApi}/FdForm/GetFormList`, {}, {
    }).then(data => {
      resolve(data);
    });
  });
}

/** 获取应用信息详情 */
export function getApp(id: string, version?: string): Promise<any> {
  return get(`${process.env.serverApi}/FdForm/GetForm`, { id, version }, {
  });
}

/** 编辑应用 */
export function editApp(appInfo: AppInfoDto): Promise<any> {
  return post(`${process.env.serverApi}/FdForm/EditForm`, appInfo, {
  });
}

/** 删除应用 */
export function removeApp(appId: string, version?: string) {
  return deletes(`${process.env.serverApi}/FdForm/DeleteForm?id=${appId}`, {}, {
  })
}

/** 发布应用 */
export function publishApp(appId: string, isPublished = true) {
  return post(`${process.env.serverApi}/FdForm/PublishForm`, { appId, isPublished });
}

/** 获取分页应用 */
export function getAppsByPage({
  pageIndex, pageSize, orders, filters
}: {
  pageIndex: number,
  pageSize: number,
  orders: (keyof AppInfoDto)[] | Record<(keyof AppInfoDto), 'esc' | 'desc'>,
  filters: Record<keyof AppInfoDto, {
    value: string,
    type: 'contains' | 'equal' | 'in'
  }>,
}) {
  const _filters: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    switch(value.type) {
      case 'equal':
        _filters[`_${key}_e`] = value.value;
        break;
      case 'contains':
        _filters[`_${key}_c`] = value.value;
        break;
      case 'in':
        _filters[`_${key}_i`] = value.value;
        break;
    }
  });

  let _orders = {} as Record<(keyof AppInfoDto), 'esc' | 'desc'>;
  if (Array.isArray(orders)) {
    _orders = Object.assign({}, ...orders.map(i => ({ [i]: 'esc' })));
  } else {
    _orders = orders;
  }

  return post(`${process.env.serverApi}/FdForm/GetFormPageList`, {
    pageIndex,
    pageSize,
    orders: _orders,
    filters: _filters
  }, {
    returnPageList: true
  }) as Promise<ApiPageList<AppInfoDto>>;
}