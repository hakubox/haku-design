<template>
  <div
    :style="{
      padding: getBoxModel(props.padding),
    }"
    class="component-item"
    :class="[{ required: props.required }, className]"
    :layout="layout"
  >
    <label class="component-item-label" v-if="props.show && (componentLabel ?? label)">
      {{ editerState.appConfig.questionnaireConfig.showNo && component!.isFormItem ? serialNumberService.getQuestionNo(id!) : '' }}
      <span v-html="componentLabel ?? label"></span>
    </label>
    <label
      v-if="componentDescription ?? description"
      class="component-item-description richtext-value"
      :style="{ marginTop: componentLabel ?? label ? '10px' : '0px' }"
      v-html="componentDescription ?? description"
    ></label>
    <slot><q-blank v-if="['complex', 'layout'].includes(component!.type)" /></slot>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { getBoxModel } from '@/tools/common';
import { state as editerState } from '@/modules/editor-module';
import { service as serialNumberService } from '@/modules/serial-number-module';
import { Component } from '@haku-design/core';

const props = defineProps({
  /** 组件Id */
  id: {
    type: String,
  },
  /** 是否显示 */
  show: {
    type: Boolean,
    default: true,
  },
  /** 标签 */
  label: {
    type: String,
    default: '',
  },
  /** 类名 */
  className: {
    type: String,
    default: '',
  },
  /** 描述 */
  description: {
    type: String,
    default: '',
  },
  /** 组件标签，会覆盖label属性 */
  componentLabel: {
    type: String,
  },
  /** 组件标签，会覆盖description属性 */
  componentDescription: {
    type: String,
  },
  /** 内边距 */
  padding: {
    type: Array as PropType<any>,
    default: () => [0, 0, 0, 0] as [number, number, number, number],
  },
  /** 外边距 */
  margin: {
    type: Array as PropType<any>,
    default: () => [0, 0, 0, 0] as [number, number, number, number],
  },
  component: {
    type: Object as PropType<Component>,
  },
  layout: {
    type: String,
  },
  required: {
    type: Boolean,
    default: false
  }
});
</script>
