import { type App } from 'vue';

const hakuDebug = {
  XMLHttpRequest: window.XMLHttpRequest,
  targetTypes_mousedown: ['a', 'input', 'button', 'textarea', 'i'],
  targetTypes_keydown: ['a', 'input', 'button', 'textarea'],
  message: {
    JSERR: { code: '01', msg: 'JS异常' },
    EVENTERR: { code: '02', msg: '静态资源加载异常' },
    AJAXERR: { code: '03', msg: 'AJAX请求异常' },
    AJAXTIMEOUTERR: { code: '04', msg: 'AJAX请求超时' },
  },
  config: {},
};

/** 将异常发送给服务器 */
export function send() {
  navigator.sendBeacon('/log', undefined);
};

/** 通用XMLHttpRequest事件 */
export function XMLTYPE(event) {
  let target = event.target;

  if ('readystatechange' === event.type) {
    // console.log('请求状态码改变')
    if (target.readyState == 4) {
      if (target.status == 404) {
        console.log({
          errMsg: '错误码：' + event.target.status,
          errUrl: target.responseURL,
          errType: hakuDebug.message.AJAXERR,
        });
      }
    }
  }

  if ('error' === event.type) {
    // console.log('请求出错')
    console.log({
      errMsg: '错误码：' + event.target.status,
      errUrl: target.responseURL,
      errType: hakuDebug.message.AJAXERR,
    });
  }

  if ('timeout' === event.type) {
    // console.log('请求超时')
    console.log({
      errMsg: '错误码：' + event.target.status,
      errUrl: target.responseURL,
      errType: hakuDebug.message.AJAXTIMEOUTERR,
    });
  }
};

/** 计算加载时间 */
export function getPerformanceTiming() {
  if (!window.PerformanceNavigationTiming) {
    // 当前浏览器不支持
    throw new Error('你的浏览器不支持 performance 接口');
  }


  const observer = new PerformanceObserver((list) => {

    const _list = list.getEntries().map((entry) => {

      let t = entry.toJSON();
      if (!t.duration) return undefined;
      return {
        t,
        /**【重要】页面加载完成的时间 */
        loadPage: t.domContentLoadedEventEnd,
        /**【重要】解析 DOM 树结构的时间 */
        domReady: t.domComplete - t.responseEnd,
        /**【重要】重定向的时间 */
        redirect: t.redirectEnd - t.redirectStart,
        /**【重要】DNS 查询时间 */
        lookupDomain: t.domainLookupEnd - t.domainLookupStart,
        /**【重要】读取页面第一个字节的时间 */
        ttfb: t.responseStart - t.startTime,
        /**【重要】内容加载完成的时间 */
        request: t.responseEnd - t.requestStart,
        /**【重要】执行 onload 回调函数的时间 */
        loadEvent: t.loadEventEnd - t.loadEventStart,
        /** DNS 缓存时间 */
        appcache: t.domainLookupStart - t.fetchStart,
        /** 卸载页面的时间 */
        unloadEvent: t.unloadEventEnd - t.unloadEventStart,
        /** TCP 建立连接完成握手的时间 */
        connect: t.connectEnd - t.connectStart,
      };
    });
    if (_list[0]) console.warn('性能监测', _list[0]);
    // observer.disconnect();
  });
  observer.observe({ type: "navigation", buffered: true });
}


/** 初始化 */
export function init(vue: App<Element>) {
  // 全局点击事件捕获
  window.addEventListener('mousedown', function (e) {
    if (hakuDebug.targetTypes_mousedown.indexOf(e.target?.['tagName'].toLowerCase()) >= 0) {
      // console.log('鼠标点击', e);
    }
  });
  
  // 全局按键事件捕获
  window.addEventListener('keydown', function (e) {
    if (
      [27, 13, 116].indexOf(e.keyCode) >= 0 &&
      hakuDebug.targetTypes_keydown.indexOf(e.target?.['tagName'].toLowerCase()) >= 0
    ) {
      // console.log('键盘按键', e);
    }
  });
  
  // 全局页面跳转
  window.addEventListener('popstate', function (event) {
    // console.log('页面跳转', event);
  });
  
  /******************************/
  
  // 全局js错误
  window.addEventListener('error', function (e: ErrorEvent) {
    const _targetList = e.composedPath();
    console.error('全局错误', e.message, e.filename, e.lineno, e.colno, _targetList, e.error);
  });
  
  // 监听静态资源加载错误
  window.addEventListener('error', function (event) {
    let errorTarget = event.target;

    if (errorTarget) {
      // @ts-ignore
      if (errorTarget.baseURI) {
        // @ts-ignore
        let a = { errMsg: errorTarget.outerHTML, errUrl: errorTarget.baseURI, errType: '' };
        console.log(a);
      }
    }
  }, true);
  
  /**
   * 全局异步错误
   */
  window.addEventListener('unhandledrejection', function (event) {
    console.error('异步错误', event);
  });
  
  /**
   * Vue内部错误监控
   */
  vue.config.errorHandler = function (err, vm, info) {
    console.error('Vue内部错误', err, vm, info);
  };
  
  /**
   * 监听页面所有AJAX请求
   */
  /** @ts-ignore */
  window.XMLHttpRequest = function() {
    let _request = new hakuDebug.XMLHttpRequest();
    _request.addEventListener('readystatechange', XMLTYPE);
    _request.addEventListener('error', XMLTYPE);
    _request.addEventListener('timeout', XMLTYPE);
    _request.addEventListener('loadstart', XMLTYPE);
    _request.addEventListener('loadend', XMLTYPE);
    return _request;
  };
  
  /**
   * 页面初始加载后自动计算加载时间
   */
  getPerformanceTiming();
}

export default function (cfg) {
  if (cfg && toString.call(cfg) === '[object Object]') {
    hakuDebug.config = {
      ...hakuDebug.config,
      ...cfg,
    };
  }
}
