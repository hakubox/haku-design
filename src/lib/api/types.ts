import { AxiosInstance, AxiosRequestConfig } from 'axios';

/** 请求错误类 */
class RequestError extends Error {
  /** 错误码 */
  code: string;

  /** 相关数据 */
  data: any;

  constructor(msg: string, code: string, data?: any) {
    super(msg);
    this.code = code;
    if (data) this.data = data;
  }
}

/** 参数引入类型 */
export enum ParamLinkType {
  query = 'query',
  path = 'path',
  body = 'body',
  formdata = 'formdata',
}

/** 请求类型 */
export enum ApiMethodType {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

/** 返回值类型 */
export enum ApiResponseType {
  arraybuffer = 'arraybuffer',
  blob = 'blob',
  document = 'document',
  json = 'json',
  text = 'text',
}

/** Api接口调用返回值 */
export interface ApiReturn<T = any> {
  /** 返回Code */
  code: number | string;
  /** 描述信息 */
  msg: string;
  /** 返回数据 */
  data: T;
}

/** Api接口返回分页基础结构 */
export type PageList<T = any> = Promise<{
  /** 返回Code */
  code: number | string;
  /** 描述信息 */
  msg: string;
  /** 真实数据 */
  rows: T extends any[] ? T : T[];
  /** 数据总条数 */
  total: number;
}>;

/** Api接口返回分页基础结构 */
export interface ApiPageList<T = any> {
  /** 返回Code */
  code: number | string;
  /** 描述信息 */
  msg: string;
  /** 真实数据 */
  rows: T extends any[] ? T : T[];
  /** 数据总条数 */
  total: number;
}

/** 单个参数配置 */
export interface ParamConfig {
  /** 参数引入类型 */
  paramLinkType: ParamLinkType;
}

/** API配置 */
export interface ApiConfig<TReturnResponse, TReturnPageList> extends AxiosRequestConfig {
  /** 返回Response */
  returnResponse?: TReturnResponse;
  /** 返回分页数据 */
  returnPageList?: TReturnPageList;
  /** 通用参数传入类型 */
  requestParamsLinkType?: ParamLinkType;
  /** 请求参数配置 */
  requestParamConfig?: Record<string, ParamConfig | ParamLinkType>;
  /** 取消控制器 */
  abortSignal?: AbortSignal;
  /** 事件集 */
  events?: Record<string, ((...args: any[]) => any) | undefined>;
  /** 真实使用的Axios对象 */
  axios?: AxiosInstance;
  /** 是否获取token */
  getToken?: boolean;
  /** 是否使用QS */
  useQS?: boolean;
  /** 上传进度变更事件 */
  onUploadProgress?: (...args) => any;
}

export type RequestType = <T = any, ReturnResponse extends boolean = false, ReturnPageList extends boolean = false>(
  /** url访问路径 */
  url: string,
  /** 参数 */
  params?: Record<string, any>,
  /** 请求配置 */
  config?: ApiConfig<ReturnResponse, ReturnPageList>,
) => Promise<
  ReturnPageList extends true
    ? ApiPageList<T extends void ? any[] : T>
    : ReturnResponse extends true
    ? ApiReturn<T extends void ? any : T>
    : T extends void
    ? any
    : T
>;
