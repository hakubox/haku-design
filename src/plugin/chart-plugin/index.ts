import { App, reactive } from 'vue';
import {
  componentBarChart,
  componentLineChart,
  componentPieChart
} from './data';

export * from './index.d';

/** 客户端主题模块状态 */
export const state = reactive({
});

/** 变量模块逻辑 */
export const service = {
};

export default {
  state,
  service,
  install(app: App) {
    componentBarChart(app);
    componentLineChart(app);
    componentPieChart(app);
  }
}