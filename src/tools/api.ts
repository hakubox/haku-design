import { state as globalState } from '@/common/global';
import { toast } from '@/common/message';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import qs from 'qs';

/** 默认接口参数配置 */
const default_config = {};

/** 移除空参数 */
export function clearNullParams(params: Record<string, any>): Record<string, any> {
  const _arr: Record<string, any>[] = Object.entries(params || {})
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      [key]: value,
    }));
  return Object.assign({}, ..._arr);
}

/** 获取Token */
export function getToken(hasBearer: boolean = false): string {
  const _authorization = localStorage.getItem('Authorization');
  return _authorization ? (hasBearer ? 'Bearer ' + _authorization : _authorization) : '';
}

/** 设置Token */
export function setToken(authorization: string): void {
  localStorage.setItem('Authorization', authorization);
}

/** 是否过期 */
export function isExpired(token: string) {
  const strings = token.split('.');
  const userinfo: Record<string, any> = JSON.parse(
    decodeURIComponent(escape(window.atob(strings[1].replace(/-/g, '+').replace(/_/g, '/')))),
  );
  return userinfo.created;
}

/**
 * Get请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function get<T = any>(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {},
  _axios: AxiosInstance = axios,
): Promise<any> {
  const _params = clearNullParams(params);
  return request<T>({
    type: 'get',
    url,
    method: 'get',
    responseType: 'json',
    params: Object.assign({}, ...Object.entries(_params).map(([key, value]) => ({ [key]: value }))),
    config,
    _axios,
    localConfig: {},
  });
}

/**
 * Post请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function post<T = any>(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {},
  _axios: AxiosInstance = axios,
): Promise<any> {
  const contentType: string = 'application/json';
  const _params =
    contentType == 'application/x-www-form-urlencoded'
      ? qs.stringify({
          ...clearNullParams(params),
          ...default_config,
        })
      : Array.isArray(params)
      ? params
      : {
          ...clearNullParams(params),
          ...default_config,
        };
  return request<T>({
    type: 'post',
    url,
    method: 'post',
    responseType: 'json',
    params: _params,
    config: {
      ...config,
      headers: {
        'Content-Type': contentType,
      },
    },
    _axios,
    localConfig: {},
  });
}

/**
 * Delete请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function deletes<T = any>(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {},
  _axios: AxiosInstance = axios,
): Promise<any> {
  return request<T>({
    type: 'delete',
    url,
    method: 'delete',
    responseType: 'json',
    params: clearNullParams(params),
    config: config,
    _axios,
    localConfig: {},
  });
}

/**
 * Get请求（下载文件）
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function download<T = { filename: string; blob: string }>(
  url: string,
  params: Record<string, any> = {},
  config:
    | AxiosRequestConfig
    | {
        defaultSuffix: string | undefined;
      } = {},
  _axios: AxiosInstance = axios,
): Promise<T> {
  const _params = clearNullParams(params);
  return request<T>({
    type: 'download',
    url,
    method: 'get',
    params: Object.assign({}, ...Object.entries(_params).map(([key, value]) => ({ [key]: value }))),
    config: config as AxiosRequestConfig,
    _axios,
    responseType: 'blob',
    localConfig: {
      defaultSuffix: config['defaultSuffix'] ?? '.txt',
    },
  });
}

/**
 * Upload请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function upload<T = any>(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig<{
    onUploadProgress: ((...args) => any) | undefined;
  }> = {},
  _axios: AxiosInstance = axios,
): Promise<T> {
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
  return request<T>({
    type: 'upload',
    url,
    method: 'post',
    responseType: 'json',
    params: _params,
    events: {
      onUploadProgress: config.onUploadProgress,
    },
    config: {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    } as AxiosRequestConfig,
    _axios,
    localConfig: {},
  });
}

/**
 * [PUT]Upload请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function uploadPut<T = any>(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig<{
    onUploadProgress: ((...args) => any) | undefined;
  }> = {},
  _axios: AxiosInstance = axios,
): Promise<T> {
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
  return request<T>({
    type: 'upload',
    url,
    method: 'put',
    responseType: 'json',
    params: _params,
    events: {
      onUploadProgress: config.onUploadProgress,
    },
    config: {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    } as AxiosRequestConfig,
    _axios,
    localConfig: {},
  });
}

/**
 * 基础请求提交
 */
export function request<T = any>({
  type,
  url,
  method,
  params = {},
  config = {},
  events = {},
  _axios = axios,
  responseType = 'json',
  localConfig = {},
}: {
  type: 'get' | 'post' | 'put' | 'delete' | 'upload' | 'download';
  url: string;
  method: string;
  params?: Record<string, any>;
  config?: AxiosRequestConfig;
  events?: Record<string, ((...args) => any) | undefined>;
  _axios?: AxiosInstance;
  responseType: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';
  localConfig?: Record<string, any>;
}): Promise<T> {
  return new Promise((resolve, reject) => {
    _axios
      .request({
        url: url,
        method: method as Method,
        cancelToken: config.cancelToken,
        responseType: responseType,
        params:
          method == 'get'
            ? {
                _t: new Date().getTime(),
                ...params,
                ...default_config,
              }
            : {},
        data:
          method != 'get'
            ? params instanceof FormData
              ? params
              : {
                  _t: new Date().getTime(),
                  ...params,
                  ...default_config,
                }
            : {},
        ...config,
        headers: {
          Authorization: getToken(true),
          deviceInfo: navigator.userAgent || '',
          ...config.headers,
        },
        ...events,
      })
      .then((d) => {
        if (!d.data.error) {
          if (type == 'download') {
            resolve({
              filename: (
                /.*;?filename=(.*?);?$/.exec(d.headers['content-disposition'] ?? '') ?? [
                  '未命名文件' + (localConfig.defaultSuffix ?? ''),
                ]
              ).pop() as string,
              blob: d.data,
            } as any);
          } else {
            resolve(d.data.result || d.data);
          }
        } else {
          toast(d.data.error || d.data.exception, 'error');
          reject(d.data);
        }
      })
      .catch((err) => {
        let _err = err;
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else if (url.startsWith(axios.defaults?.baseURL || '') && err.response && err.response.status == 401) {
          localStorage.removeItem('Authorization');
          toast('登录超时，请重新登录。', 'error');
          globalState.router.push('/login');
          reject(err);
          return;
        } else if (err?.response?.data) {
          _err =
            `[${err.response.status}]` +
            (err.response.data.errMsg || err.response.data.title || err.response.data.error);
        } else if (err?.response) {
          _err = `[${err.response.status}]` + (err.response.message || err.response.error);
        }
        toast(_err, 'error');
        reject(_err);
      });
  });
}
