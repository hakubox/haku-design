

import { Command, CommandType, GlobalCommand, CommandHistory } from '@haku-design/command';
import { formCommands } from '@/data/form-commands';
import { createModelId } from '@/tools/common';
import { reactive } from 'vue';
import { SetPartials } from '@haku-design/core';

/** 历史记录模块状态 */
export const state = reactive({
  /** 历史记录列表 */
  historyData: [
    { id: 'init', type: 'init', objectId: 'global', objectType: 'global', attrs: {}, executeTime: Date.now() },
  ] as CommandHistory<keyof GlobalCommand>[],
  /** 当前状态位于历史记录的索引 */
  historyIndex: 0,
  /** 保存时历史记录的索引（用于判断是否需要升版本号） */
  saveHistoryIndex: 0,
  /** 是否能撤回 */
  canUndo(): boolean {
    return state.historyIndex >= 0;
  },
  /** 是否能重做 */
  canRedo(): boolean {
    return state.historyIndex < state.historyData.length - 1;
  },
});

/** 历史记录模块逻辑 */
export const service = {
  /** 判断命令类型 */
  isCommand<T extends keyof GlobalCommand>(item: Command<keyof GlobalCommand>, type: T | T[]): item is Command<T> {
    if (Array.isArray(type)) {
      return (type as Array<keyof GlobalCommand>).includes(item.type);
    } else {
      return item.type === type;
    }
  },
  /** 获取历史记录图标 */
  getCommandIcon(commandType: string) {
    return formCommands[commandType].icon;
  },
  /** 获取格式化标题 */
  getFormatTitle<T extends keyof GlobalCommand>(command: Command<T>) {
    const format = formCommands[command.type].format;

    const reg = /\{\{.*?\}\}/g;
    let match: RegExpExecArray | null = reg.exec(format);
    let _index = 0;
    const _re: string[] = [];
    const _indexes: number[] = [];
    while (match) {
      if (!_indexes.includes(match.index)) _indexes.push(match.index);
      _indexes.push(match.index + match.toString().length);
      match = reg.exec(format);
    }
    _indexes.push(format.length);
    _index = 0;
    for (let i = 0; i < _indexes.length; i++) {
      const val = format.substring(_index, _indexes[i]);
      if (val) _re.push(val);
      _index = _indexes[i];
    }
    return _re;
  },

  

  /** 执行命令 */
  exec<T extends keyof GlobalCommand>(
    commandType: T,
    config: SetPartials<{
      /** 关联对象Id（组件Id/'global'） */
      objectId?: string | 'global';
      /** 相关属性 */
      attrs: GlobalCommand[T]['attrs'];
      /** 值 */
      value: GlobalCommand[T]['value'];
      /** 旧值 */
      oldValue?: GlobalCommand[T]['value'];
    }>,
  ) {
    const _config: Record<string, any> = config ?? {};
    if (!_config.objectId) {
      throw new Error('没有传入objectId');
    }
    const _commandType = formCommands[commandType] as CommandType<T>;
    if (_commandType) {
      const newCommand: Command<T> = {
        id: createModelId(10),
        type: commandType,
        objectType: _commandType.objectType,
        objectId: _config.objectId,
        attrs: _config.attrs,
        newVal: _config.value,
        executeTime: Date.now(),
        oldVal: _config.oldValue,
      };
      // Object.entries(_commandType.).forEach(([key, value]) => {
      //   if (value.required && (attrs[key] === null || attrs[key] === undefined)) {
      //     throw new Error(`触发${commandType}命令的必要属性${key}不存在。`);
      //   }
      // });
      _commandType.exec(newCommand);
      state.historyData.splice(state.historyIndex + 1, state.historyData.length - state.historyIndex);
      state.historyIndex++;
      state.historyData.push(newCommand);
    } else {
      throw new Error(`命令${commandType}不存在`);
    }
  },
  /** 撤销 */
  undo(): boolean {
    if (!state.canUndo) return false;
    const _command = state.historyData[state.historyIndex];
    if (_command) {
      const _commandType = formCommands[_command.type];
      if (_commandType.updatable) _commandType.undo(_command);
      state.historyIndex--;
      return true;
    }
    return false;
  },
  /** 撤销到某一步 */
  undoByIndex(index: number): boolean {
    while (state.historyIndex > index) {
      this.undo();
    }
    return true;
  },
  /** 恢复 */
  redo(): boolean {
    if (!state.canRedo) return false;
    const _command = state.historyData[state.historyIndex + 1];
    if (_command) {
      const _commandType = formCommands[_command.type];
      if (_commandType.updatable) _commandType.exec(_command);
      state.historyIndex++;
      return true;
    }
    return false;
  },
  /** 恢复到某一步 */
  redoByIndex(index: number): boolean {
    while (state.historyIndex < index) {
      this.redo();
    }
    return true;
  },
};

export default {
  state,
  service
}