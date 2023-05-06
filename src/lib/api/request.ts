import { state as globalState } from '@/common/global';
import axios, { Method } from 'axios';
import { getToken } from '@/lib/api/token';
import { service as authService } from '@/common/auth-module';
import qs from 'qs';
import { clearBlankProps, removeProp } from '../../tools/common';
import { ApiConfig, ApiMethodType, ApiPageList, ApiReturn, ParamConfig, ParamLinkType } from './types';
import { replacePathParams, transFormData } from './utils';
import { toast } from '@/common/message';

/** 默认接口参数配置 */
const defaultConfig = {};

/** 获取默认请求参数 */
function getRequestParams<ReturnResponse extends boolean, TReturnPageList extends boolean>(
  url: string,
  methodType: ApiMethodType,
  params: Record<string, any> | any[],
  config: ApiConfig<ReturnResponse, TReturnPageList>,
) {
  /** 判断参数是否为数组，如果是数组则直接传给body */
  if (Array.isArray(params)) {
    return {
      url,
      data: params,
    };
  }
  /** 是否使用params，否则使用data传输 */
  let _useParamsOrData = false;
  let _params: Record<string, any> = {
    ...defaultConfig,
    ...params,
  };
  const _resultDefaultParams = replacePathParams(url, _params);
  /** 返回参数并处理path参数 */
  const _resultParams = {
    url: _resultDefaultParams.url,
    data: {} as Record<string, any> | FormData | any[],
    params: {} as any,
  };
  _params = _resultDefaultParams.params;

  /** 如果包含额外参数配置 */
  if (config.requestParamConfig) {
    Object.entries(config.requestParamConfig).forEach(([key, _config]) => {
      const lintType = (_config as ParamConfig)?.paramLinkType ?? _config;
      /** 处理传参方式 */
      switch (lintType) {
        case ParamLinkType.body:
          if (!(_resultParams.data instanceof FormData) && !Array.isArray(_resultParams.data)) {
            _resultParams.data[key] = _params[key];
          }
          break;
        case ParamLinkType.query:
          _resultParams.params[key] = _params[key];
          break;
        case ParamLinkType.formdata:
          if (_resultParams.data instanceof FormData) {
            _resultParams.data.append(key, _params[key]);
          }
          break;
        default:
          break;
      }
      _params = removeProp(_params, key);
    });
  }

  /** 如果包含通用参数传输类型 */
  if (config.requestParamsLinkType) {
    switch (config.requestParamsLinkType) {
      case ParamLinkType.query:
        _resultParams.params = { ..._resultParams.params, ..._params };
        break;
      case ParamLinkType.body:
        _resultParams.data = { ..._resultParams.params, ..._params };
        break;
      case ParamLinkType.formdata:
        _resultParams.data = transFormData(_params);
        break;
      default:
        break;
    }
  } else {
    /** 判断默认请求类型 */
    switch (methodType) {
      case 'get':
        _params = clearBlankProps(_params);
        _useParamsOrData = true;
        break;
      case 'post':
      case 'put':
      case 'delete':
        _useParamsOrData = false;
        break;
      default:
        break;
    }
  }

  if (_useParamsOrData) {
    if (_resultParams.url.includes('?')) {
      _resultParams.url += `&${qs.stringify({ ..._resultParams.params, ..._params })}`;
    } else {
      _resultParams.url += `?${qs.stringify({ ..._resultParams.params, ..._params })}`;
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (_resultParams.data instanceof FormData) {
      const _formData: FormData = _resultParams.data;
      Object.entries(_params).forEach(([key, value]) => {
        if (!_formData.has(key)) {
          _formData.append(key, value);
        }
      });
      _resultParams.data = _formData;
    } else {
      _resultParams.data = { ..._resultParams.data, ..._params };
    }
  }
  return _resultParams;
}

/**
 * 基础请求提交
 */
export function request<ReturnResponse extends boolean, ReturnPageList extends boolean>({
  method,
  url,
  params = {},
  config = {},
}: {
  method: ApiMethodType;
  url: string;
  params?: Record<string, any>;
  config?: ApiConfig<ReturnResponse, ReturnPageList>;
}): Promise<ReturnPageList extends true ? ApiPageList<any> : ReturnResponse extends true ? ApiReturn<any> : any> {
  return new Promise((resolve, reject) => {
    /** 是否需要获取 token */
    const isGetToken = config?.getToken !== false;
    const _params: Record<string, any> | any[] = Array.isArray(params) ? params : {
      _t: new Date().getTime(),
      ...defaultConfig,
      ...params,
    };

    (config.axios ?? axios).request({
      method: method as Method,
      signal: config.abortSignal,
      responseType: config?.responseType ?? 'json',
      ...config,
      ...config.events,
      headers: {
        /** 获取用户身份校验信息（jwt） */
        Authorization: isGetToken ? getToken(true) : '',
        ...config.headers,
      },
      ...getRequestParams<ReturnResponse, ReturnPageList>(url, method, _params, config),
    }).then((d) => {
      const _data = d.data;
      if (_data.repCode !== undefined) {
        if (_data.success) {
          resolve(_data.repData);
        } else {
          reject(_data);
        }
      } else if (_data instanceof Blob) {
        resolve({
          filename: (
            /.*;?filename=(.*?);?$/.exec(d.headers['content-disposition'] ?? '') ?? [`未命名文件`]
          ) /** ${localConfig.defaultSuffix ?? ''} */
            .pop() as string,
          blob: _data,
        } as any);
      } else if (_data.code === '401') {
        localStorage.removeItem('Authorization');
        toast('登录超时，请重新登录。', 'error');
        globalState.router.push('/login');
        authService.logout();
        reject(_data);
      } else if (!_data.isSuccess) {
        if (!_data.isSuccess && _data.message) {
          toast(`[Bad Request]${_data.message}`, 'error');
        }
        reject(_data);
      } else if (_data.code === 200) {
        if (config.returnResponse || config.returnPageList) {
          resolve(_data);
        } else if (_data.data) {
          resolve(_data.data);
        } else {
          resolve(undefined as any);
        }
      } else if (_data.code === 401) {
        toast(_data.msg, 'error');
        /** router.push('/login'); */
        reject(_data);
      } else {
        toast(_data.msg, 'error');
        reject(_data);
      }
    }).catch((err) => {
      let _err = err;
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else if (err.response && err.response.status === 401) {
        localStorage.removeItem('Authorization');
        toast('登录超时，请重新登录。', 'error');
        globalState.router.push('/login');
        reject(err);
        return;
      } else if (err?.response?.data) {
        _err = `[${err.response.status}]${
          err.response.data.errMsg || err.response.data.title || err.response.data.error
        }`;
      } else if (err?.response) {
        _err = `[${err.response.status}]${err.response.message || err.response.error}`;
      }
      toast(_err, 'error');
      reject(_err);
    });
  });
}
