import { watch, reactive, computed, ConcreteComponent } from 'vue';
import { Config } from '@/@types/config';
import { service as historyService } from '@/common/history-module';
import { state as editorState } from '@/modules/editor-module';
import { destoryComponent, loadComponent } from '@/lib/component-loader';
import dayjs from 'dayjs';

let container;

/** 记录问卷保存记录的缓存KEY */
const SaveHistory = '__hakuform__save__history__';

/** 全局设置状态 */
export const state = reactive({
  /** 配置弹出框 */
  ConfigDialog: undefined as any,
  /** 是否打开 */
  isOpen: false,
  /** 配置 */
  config: {
    proMode: 'normal',
    autoSave: false,
    autoSaveDuration: 10,
    showWelcome: true,
    prevSaveTime: 0,
    showAttaProps: false,
  } as Config,
  /** 自动保存计时器 */
  autoSaveTimer: undefined as undefined | number,
  /** 最后一次保存记录 */
  latestSaveHistory: '——',
  /** 获取问卷保存记录 */
  saveHistory: computed((): { time: Date, index: number }[] => {
    let history = [] as any[];
    const localOperation = localStorage.getItem(SaveHistory);
    let operationRecordList = [] as any[];
    if (localOperation) {
      operationRecordList = JSON.parse(localOperation);
    }
    history = operationRecordList.find(x => x.id === editorState.appConfig.id)?.history ?? [];
    return history.map((i, index) => ({ ...i, index }));
  }),
  /** 获取模式文本 */
  getModeTxt: computed(() => {
    if (state.config) {
      switch (state.config.proMode) {
        case 'easy': return '简易模式';
        case 'normal': return '普通模式';
        case 'advanced': return '专业模式';
        case 'engineering': return '工程师模式';
      }
    }
    return '——';
  }),
});

/** 全局设置逻辑 */
export const service = {
  /** 全局设置模块初始化 */
  init() {
    if (state.config.autoSave && !state.autoSaveTimer) {
      service.autoSave();
    }
    watch(() => state.config.autoSave, (val, oldVal) => {
      if (val !== oldVal) {
        if (val && state.config.autoSave && !state.autoSaveTimer) {
          service.autoSave();
        } else if (!val && state.autoSaveTimer) {
          clearTimeout(state.autoSaveTimer);
        }
      }
    });
    service.getLatestSaveHistory(60000);
  },
  /** 自动保存功能 */
  autoSave() {
    state.autoSaveTimer = window.setTimeout(() => {
      historyService.exec('save', { value: 'save' });
      if (state.config.autoSave) {
        service.autoSave();
      } else {
        clearTimeout(state.autoSaveTimer);
      }
    }, state.config.autoSaveDuration * 60000);
  },
  /** 设置问卷保存记录 */
  setSaveHistory(id) {
    try {
      const localOperation = localStorage.getItem(SaveHistory);
      let operationRecordList = [] as any[];
      if (localOperation) {
        operationRecordList = JSON.parse(localOperation);
      }
      const index = operationRecordList.findIndex(x => x.id === id);
      const questionary = { 
        id,
        history: [{
          time: new Date().getTime()
        }],
      }
      if (index > -1) {
        operationRecordList[index].history.push({time: new Date().getTime()});
        if (operationRecordList[index].history.length > 10) {
          operationRecordList[index].history.shift();
        }
      } else {
        operationRecordList.push(questionary);
      }
      localStorage.setItem(SaveHistory, JSON.stringify(operationRecordList));
    } catch (e) {
      console.warn(e);
    }
  },
  /** 获取最后一次保存记录 */
  getLatestSaveHistory(delay) {
    const _cb = () => {
      setTimeout(() => {
        state.latestSaveHistory = state.saveHistory.length ? dayjs(state.saveHistory.slice(-1)[0].time).fromNow() : '暂无记录';
        _cb();
      }, delay);
    };
    _cb();
    state.latestSaveHistory = state.saveHistory.length ? dayjs(state.saveHistory.slice(-1)[0].time).fromNow() : '暂无记录';
  },
  /** 打开设置界面 */
  async open() {
    if (process.env.buildProj === 'design') {
      container = loadComponent(state.ConfigDialog as ConcreteComponent, {
        onClose() {
          destoryComponent(container);
          container = undefined;
        }
      }).dom;
      state.isOpen = true;
    }
  },
  /** 关闭设置界面 */
  close() {
    state.isOpen = true;
    destoryComponent(container);
    container = undefined;
  }
};

export default {
  state,
  service
}