import { formCommands, type Command, type CommandType } from '@haku-design/core';
import { createModelId } from '@haku-design/common';
import { reactive } from 'vue';

/** 历史记录模块状态 */
export const state = reactive({
  /** 历史记录列表 */
  historyData: [
    { id: 'init', type: 'init', objectId: 'global', objectType: 'global', attrs: {}, executeTime: Date.now() },
  ] as Command[],
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
  /** 获取历史记录图标 */
  getCommandIcon(commandType: string) {
    return formCommands[commandType].icon;
  },
  /** 获取格式化标题 */
  getFormatTitle(command: Command) {
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
  exec(
    commandType: string,
    {
      objectId = 'global',
      value,
      oldValue,
      attrs = {},
    }: {
      /** 关联对象Id（组件Id/'global'） */
      objectId?: string | 'global';
      /** 相关属性 */
      attrs?: Record<string, any>;
      /** 值 */
      value: any;
      /** 旧值 */
      oldValue?: any;
    },
  ) {
    if (!objectId) {
      throw new Error('没有传入objectId');
    }
    const _commandType = formCommands[commandType] as CommandType<Record<string, any>>;
    if (_commandType) {
      const newCommand: Command = {
        id: createModelId(10),
        type: commandType,
        objectType: _commandType.objectType,
        objectId: objectId,
        attrs: attrs,
        newVal: value,
        executeTime: Date.now(),
        oldVal: oldValue,
      };
      Object.entries(_commandType.propertys).forEach(([key, value]) => {
        if (value.required && (attrs[key] === null || attrs[key] === undefined)) {
          throw new Error(`触发${commandType}命令的必要属性${key}不存在。`);
        }
      });
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
      const _commandType = formCommands[_command.type] as CommandType<Record<string, any>>;
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
      const _commandType = formCommands[_command.type] as CommandType<Record<string, any>>;
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