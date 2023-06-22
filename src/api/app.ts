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
  orders?: (keyof AppInfoDto)[] | Record<(keyof AppInfoDto), 'esc' | 'desc'>,
  filters?: {
    key: keyof AppInfoDto,
    value: string,
    type: 'contains' | 'equal' | 'in'
  }[],
}) {
  const _filters: Record<string, string> = {};
  if (filters) {
    filters.forEach(item => {
      if (item.value) {
        switch(item.type) {
          case 'equal':
            _filters[`_${item.key}_e`] = item.value;
            break;
          case 'contains':
            _filters[`_${item.key}_c`] = item.value;
            break;
          case 'in':
            _filters[`_${item.key}_i`] = item.value;
            break;
        }
      }
    });
  }

  let _orders = {} as Record<(keyof AppInfoDto), 'esc' | 'desc'>;
  if (orders) {
    if (Array.isArray(orders)) {
      _orders = Object.assign({}, ...orders.map(i => ({ [i]: 'esc' })));
    } else {
      _orders = orders;
    }
  }

  return get(`${process.env.serverApi}/FdForm/GetFormPageList`, {
    pageIndex,
    pageSize,
    orders: _orders,
    filters: _filters
  }, {
    returnPageList: true
  }) as Promise<ApiPageList<AppInfoDto>>;
}