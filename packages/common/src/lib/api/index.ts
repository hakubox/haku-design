import { type ApiConfig, type RequestType, ApiMethodType } from './types';
import './interceptor';
import { request } from './request';
import { AxiosRequestConfig } from 'axios';
import { message, downLoadFile } from '@haku-design/common';

export * from './types';
export * from './token';

/**
 * 请求封装
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {ApiConfig} config
 */
const requestCreator = <T = void>(type: ApiMethodType): RequestType<T> => (url, params = {}, config = {}) => request({
  method: type,
  url,
  params,
  config: {
    responseType: 'json',
    ...config,
  },
});

export const get = requestCreator(ApiMethodType.get);
export const post = requestCreator(ApiMethodType.post);
export const deletes = requestCreator(ApiMethodType.delete);
export const put = requestCreator(ApiMethodType.put);

/** 通用下载方法 */
export function download(
  url,
  params,
  {
    filename = '导出文件',
    method = ApiMethodType.post,
    ...config
  }: {
    filename?: string;
    method?: ApiMethodType;
  } & ApiConfig<any, any> = {
    filename: '导出文件',
    method: ApiMethodType.post,
  },
) {
  return request({
    url,
    params,
    config: {
      headers: { 'Content-Type': 'application/raw' },
      responseType: 'blob',
    },
    ...config,
    method: method || ApiMethodType.post,
  }).then((data) => {
    downLoadFile(filename, data.blob);
  }).catch(() => {
    message.toast('下载文件出现错误，请联系管理员！', 'error');
  });
}

/**
 * Upload请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function upload(url: string, params: Record<string, any> = {}, config: ApiConfig<any, any> = {}): Promise<any> {
  const _params = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length && value[0] instanceof File) {
      (value as File[]).forEach((file) => {
        _params.append(key, file);
      });
    } else {
      _params.append(key, value);
    }
  });
  return request({
    url,
    method: ApiMethodType.post || 'POST',
    params: _params,
    config: {
      ...config,
      responseType: 'json',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    } as AxiosRequestConfig,
  });
}
