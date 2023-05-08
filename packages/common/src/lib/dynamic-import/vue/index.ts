import { defineComponent, defineAsyncComponent } from "vue";

/** 导入Vue代码 */
export const importVueCode = (data: string) => {
  return new Promise((resolve, reject) => {
    try {
      const _data = new Function(`return ${data};`)();
      const _component = defineComponent(_data);
      resolve(_component);
    } catch (err) {
      reject(err);
    }
  });
};

/** 导入Vue模块 */
export const importVueModule = (importFn: () => any) => {
  return new Promise((resolve, reject) => {
    try {
      const _component = defineAsyncComponent({
        // 加载函数
        loader: importFn,

        // 加载异步组件时使用的组件
        // loadingComponent: LoadingComponent,
        // 展示加载组件前的延迟时间，默认为 200ms
        delay: 200,

        // 加载失败后展示的组件
        // errorComponent: ErrorComponent,
        // 如果提供了一个 timeout 时间限制，并超时了
        // 也会显示这里配置的报错组件，默认值是：Infinity
        timeout: 3000
      });
      resolve(_component);
    } catch (err) {
      reject(err);
    }
  });
};