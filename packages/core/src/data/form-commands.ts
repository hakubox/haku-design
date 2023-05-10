import { Component, CommandType, Props } from '@haku-design/core';
import { VarType } from '@haku-design/core/enum';
import { state as editorState, service as editorService } from '@haku-design/editor';
import { cloneLoop } from '@haku-design/common/src/lib/clone';
import { createModelId } from '@haku-design/common';


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
export function defineCommand<T extends { [key: string]: Props }>(commandType: CommandType<T>): void {
  if (formCommands[commandType.name]) {
    console.error('已有相同的命令定义');
    // throw new Error('已有相同的命令定义');
  } else {
    formCommands[commandType.name] = commandType;
  }
}

/** 命令类型键值对 */
export const formCommands: Record<string, CommandType<any>> = {};

/** 初始化命令 */
export function initCommands() {
  defineCommand({
    name: 'init',
    description: '开始编辑',
    icon: 'iconfont icon_shiyongwendang',
    format: '开始编辑',
    updatable: false,
    objectType: 'global',
    propertys: {},
    exec(command) {},
    undo(command) {},
  });

  defineCommand({
    name: 'move-component',
    description: '移动组件',
    icon: 'iconfont icon-move',
    format: '移动了组件{{component}}',
    updatable: true,
    objectType: 'component',
    propertys: {
      /** 来源索引 */
      fromIndex: { type: VarType.number, required: true },
      /** 目标索引 */
      toIndex: { type: VarType.number, required: true },
      /** 来源父组件Id */
      fromParentComponentId: { type: VarType.string, required: false },
      /** 目标父组件Id */
      toParentComponentId: { type: VarType.string, required: false },
      /** 目标父节点插槽索引 */
      toParentComponentSlotIndex: { type: VarType.number, required: false },
      /** X坐标 */
      x: { type: VarType.number, required: false },
      /** Y坐标 */
      y: { type: VarType.number, required: false },
    },
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

  defineCommand({
    name: 'add-component',
    description: '添加组件',
    icon: 'iconfont icon-add',
    format: '添加了{{component}}',
    updatable: true,
    objectType: 'component',
    propertys: {
      /** 位置索引 */
      index: { type: VarType.number, required: true },
      /** 父组件Id */
      parentComponentId: { type: VarType.string, required: false },
      /** 父组件组索引 */
      parentComponentSlotIndex: { type: VarType.number, required: false },
      /** X坐标 */
      x: { type: VarType.number, required: false },
      /** Y坐标 */
      y: { type: VarType.number, required: false },
    },
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

  defineCommand({
    name: 'copy-component',
    description: '复制组件',
    icon: 'iconfont icon-add',
    format: '复制了{{component}}',
    updatable: true,
    objectType: 'component',
    propertys: {
      /** 位置索引 */
      index: { type: VarType.number, required: true },
      /** 父组件Id */
      parentComponentId: { type: VarType.string, required: false },
      /** 父组件组索引 */
      parentComponentSlotIndex: { type: VarType.number, required: false },
    },
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

  defineCommand({
    name: 'remove-component',
    description: '删除组件',
    icon: 'iconfont icon-minus',
    format: '删除了{{component}}',
    updatable: true,
    objectType: 'component',
    propertys: {
      componentId: { type: VarType.string, required: true },
      parentComponentId: { type: VarType.string, required: false },
      index: { type: VarType.number, required: true },
    },
    exec(command) {
      editorService.removeComponent(command.newVal);
      editorService.changeSelectedFormComponent([]);
    },
    undo(command) {
      editorService.addComponent(command.newVal, { index: command.attrs.index });
    },
  });

  defineCommand({
    name: 'set-property',
    description: '设置值',
    icon: 'iconfont icon-config',
    format: '设置{{propertyTitle}}属性',
    updatable: true,
    objectType: 'component',
    propertys: {
      /** 组件标题 */
      componentTitle: { type: VarType.string, required: true },
      /** 属性 */
      property: { type: VarType.object, required: true },
      /** 属性标题 */
      propertyTitle: { type: VarType.string, required: true },
      /** 属性名（Code） */
      propertyName: { type: VarType.string, required: true },
    },
    exec(command) {
      const component = editorService.findComponent(command.objectId);
      if (component) {
        command.oldVal = component.attrs[command.attrs.propertyName];
        editorService.setComponentAttr(component, command.attrs.propertyName, command.newVal);
        // console.log('property', command.attrs.property.change);
      }
    },
    undo(command) {
      const component = editorService.findComponent(command.objectId);
      if (component) {
        editorService.setComponentAttr(component, command.attrs.propertyName, command.oldVal);
      }
    },
  });

  defineCommand({
    name: 'set-property-type',
    description: '设置值类型',
    icon: 'iconfont icon-config',
    format: '设置了{{component}}的值的类型为{{type}}',
    updatable: true,
    objectType: 'component',
    propertys: {
      componentId: { type: VarType.string, required: true },
      propertyName: { type: VarType.string, required: true },
    },
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

  defineCommand({
    name: 'set-global-config',
    description: '设置问卷配置',
    icon: 'iconfont icon-config',
    format: '设置了{{propertyTitle}}',
    updatable: true,
    objectType: 'global',
    propertys: {
      model: { type: VarType.object, required: true },
      propertyName: { type: VarType.array, required: true },
      propertyTitle: { type: VarType.string, required: true },
    },
    exec(command) {
      setGeneralPropertyValue(command.attrs.propertyName, command.attrs.model, command.newVal);
    },
    undo(command) {
      setGeneralPropertyValue(command.attrs.propertyName, command.attrs.model, command.oldVal);
    },
  });

  defineCommand({
    name: 'change-page-size',
    description: '调整窗口大小',
    icon: 'iconfont icon-fullscreen',
    format: '调整了窗口大小',
    updatable: false,
    objectType: 'global',
    propertys: {},
    exec(command) {},
    undo(command) {},
  });

  defineCommand({
    name: 'save',
    description: '保存',
    icon: 'iconfont icon-save',
    format: '保存数据',
    updatable: false,
    objectType: 'global',
    propertys: {},
    exec(command) {
      editorService.saveQuestionnaire();
    },
    undo(command) {},
  });
}
