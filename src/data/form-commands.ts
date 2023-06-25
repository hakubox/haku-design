import { Component } from '@haku-design/core';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { cloneLoop } from '@/lib/clone';
import { createModelId } from '@/tools/common';
import { useAppHandle } from '@/common/app-handle';
import { getEditors } from '@/data/property-editor';
import { BasicCommand, CommandType, GlobalCommand } from '@haku-design/command';

const {
  setVal,
  getVal
} = useAppHandle();

/** 设置通用属性值 */
export function setGeneralPropertyValue(propName: string | string[], model, value) {
  if (typeof propName === 'string') {
    model[propName] = value;
  } else {
    let _value = model;
    for (let i = 0; i < propName.length - 1; i++) {
      if (!_value[propName[i]]) _value[propName[i]] = {};
      if (_value) _value = _value[propName[i]];
    }
    if (_value) _value[propName[propName.length - 1]] = value;
  }
  return model;
}

/** 定义命令 */
export function defineCommand<CommandName extends keyof GlobalCommand>(commandName: CommandName, commandType: GlobalCommand[CommandName] extends BasicCommand ? CommandType<CommandName> : CommandType<any>): void {
  // @ts-ignore
  if (!formCommands) formCommands = {};
  if (formCommands[commandName]) {
    console.error('已有相同的命令定义');
    // throw new Error('已有相同的命令定义');
  } else {
    formCommands[commandName] = commandType;
  }
}

/** 命令类型键值对 */
export let formCommands: Record<keyof GlobalCommand, CommandType<any>>;

/** 初始化命令 */
export function initCommands() {
  defineCommand('init', {
    description: '开始编辑',
    icon: 'iconfont icon_shiyongwendang',
    format: '开始编辑',
    updatable: false,
    objectType: 'global',
    exec(command) {},
    undo(command) {},
  });

  defineCommand('move-component', {
    description: '移动组件',
    icon: 'iconfont icon-move',
    format: '移动了组件{{component}}',
    updatable: true,
    objectType: 'component',
    exec(command) {
      editorService.moveComponent(command.newVal, {
        toIndex: command.attrs.toIndex, 
        toParentComponentId: command.attrs.toParentComponentId,
        toParentComponentSlotIndex: command.attrs.toParentComponentSlotIndex,
        x: command.attrs.x, y: command.attrs.y
      });
    },
    undo(command) {
      editorService.moveComponent(command.newVal, {
        toIndex: command.attrs.fromIndex,
        toParentComponentId: command.attrs.fromParentComponentId,
        toParentComponentSlotIndex: command.attrs.toParentComponentSlotIndex,
        x: command.attrs.x, y: command.attrs.y
      });
    },
  });

  defineCommand('add-component', {
    description: '添加组件',
    icon: 'iconfont icon-add',
    format: '添加了{{component}}',
    updatable: true,
    objectType: 'component',
    exec(command) {
      editorService.addComponent(command.newVal, {
        index: command.attrs.index,
        parentComponentId: command.attrs.parentComponentId,
        parentComponentSlotIndex: command.attrs.parentComponentSlotIndex,
        x: command.attrs.x, y: command.attrs.y
      });
    },
    undo(command) {
      editorService.removeComponent(command.newVal);
    },
  });

  defineCommand('copy-component', {
    description: '复制组件',
    icon: 'iconfont icon-add',
    format: '复制了{{component}}',
    updatable: true,
    objectType: 'component',
    exec(command) {
      const component = cloneLoop(command.newVal) as Component;
      component.id = createModelId(10);
      component.children = [];
      component.attrs.id = component.id;
      command.objectId = component.id;
      command.newVal = component;
      editorService.addComponent(component, {
        index: command.attrs.index,
        parentComponentId: command.attrs.parentComponentId,
        parentComponentSlotIndex: command.attrs.parentComponentSlotIndex,
      });
      editorService.changeSelectedFormComponent([component]);
    },
    undo(command) {
      editorService.removeComponent(command.newVal);
      editorService.changeSelectedFormComponent([]);
    },
  });

  defineCommand('remove-component', {
    description: '删除组件',
    icon: 'iconfont icon-minus',
    format: '删除了{{component}}',
    updatable: true,
    objectType: 'component',
    exec(command) {
      editorService.removeComponent(command.newVal);
      editorService.changeSelectedFormComponent([]);
    },
    undo(command) {
      editorService.addComponent(command.newVal, { index: command.attrs.index });
    },
  });

  defineCommand('set-property', {
    description: '设置属性值',
    icon: 'iconfont icon-config',
    format: '设置{{propertyTitle}}属性',
    updatable: true,
    objectType: 'component',
    exec(command) {
      // if (!getEditors.value[command.attrs.editor]) {
      //   toast('未找到对应的编辑器', 'error');
      //   throw new Error('未找到对应的编辑器');
      // }
      const prop = command.attrs.property;
      const component = editorService.findComponent(command.objectId);
      if (component && !component.isGroup) {
        command.oldVal = getVal(component.attrs, prop);
        setVal(component.attrs, prop, command.newVal, command.attrs.editor ? getEditors.value[command.attrs.editor] : undefined);
        // console.log('property', command.attrs.property.change);
      }
    },
    undo(command) {
      // if (!getEditors.value[command.attrs.editor]) {
      //   toast('未找到对应的编辑器', 'error');
      //   throw new Error('未找到对应的编辑器');
      // }
      const prop = command.attrs.property;
      const component = editorService.findComponent(command.objectId);
      if (component && !component.isGroup) {
        setVal(component.attrs, prop, command.oldVal, command.attrs.editor ? getEditors.value[command.attrs.editor] : undefined);
      }
    },
  });

  defineCommand('set-property-type', {
    description: '设置值类型',
    icon: 'iconfont icon-config',
    format: '设置了{{component}}的值的类型为{{type}}',
    updatable: true,
    objectType: 'component',
    exec(command) {
      const component = editorService.findComponent(command.objectId);
      if (component && !component.isGroup) {
        const _property = component.propertys.find((i) => i.name == command.attrs.propertyName);
        if (_property) {
          editorService.setComponentAttrType(component, _property, command.newVal);
        }
      }
    },
    undo(command) {
      const component = editorService.findComponent(command.objectId);
      if (component && !component.isGroup) {
        const _property = component.propertys.find((i) => i.name == command.attrs.propertyName);
        if (_property) {
          editorService.setComponentAttrType(component, _property, command.oldVal);
        }
      }
    },
  });

  defineCommand('set-global-config', {
    description: '设置应用配置',
    icon: 'iconfont icon-config',
    format: '设置了{{propertyTitle}}',
    updatable: true,
    objectType: 'global',
    exec(command) {
      setGeneralPropertyValue(command.attrs.propertyName, command.attrs.model, command.newVal);
    },
    undo(command) {
      setGeneralPropertyValue(command.attrs.propertyName, command.attrs.model, command.oldVal);
    },
  });

  defineCommand('change-page-size', {
    description: '调整窗口大小',
    icon: 'iconfont icon-fullscreen',
    format: '调整了窗口大小',
    updatable: false,
    objectType: 'global',
    exec(command) {},
    undo(command) {},
  });

  defineCommand('save', {
    description: '保存',
    icon: 'iconfont icon-save',
    format: '保存数据',
    updatable: false,
    objectType: 'global',
    exec(command) {
      editorService.saveApp();
    },
    undo(command) {},
  });
}
