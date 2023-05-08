import { removeProp } from '../../tools/common';

/** 转换对象为FormData */
export function transFormData(obj: Record<string, any>): FormData {
  if (!obj) throw new TypeError('参数不能为空');
  if (obj instanceof FormData) return obj;
  if (typeof obj !== 'object') throw new TypeError('参数必须为对象类型');

  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

/** 替换path参数 */
export function replacePathParams(url: string, params: Record<string, any>) {
  const _result = {
    url,
    params,
  };
  _result.url = url.replace(/\{.*?\}/g, (val) => {
    if (params[val]) {
      _result.params = removeProp(params, val);
      return params[val];
    }
    console.error(`在发送到[${url}]请求参数中未查询到${val}`, params);
    return '';
  });
  return _result;
}
