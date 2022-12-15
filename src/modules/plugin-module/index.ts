import { reactive, provide, inject } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { importEventAction, importEventTrigger } from './import-event';
import { importConfig } from './import-config';
import { importComponent } from './import-component';

const state = {};

window['importComponent'] = importComponent;
window['importConfig'] = importConfig;
window['importEventTrigger'] = importEventTrigger;
window['importEventAction'] = importEventAction;

const _state = reactive(state);

export const pluginModuleSymbol = Symbol('_pluginModule');
export const createPluginModule = () => _state;
export const setPluginModule = (config) => {
  Object.entries(config).forEach(([key, value]) => {
    state[key] = value;
  });
};
export const usePluginModule = () => {
  return inject(pluginModuleSymbol) as typeof state;
};
export const providePluginModule = () => provide(pluginModuleSymbol, createPluginModule());
