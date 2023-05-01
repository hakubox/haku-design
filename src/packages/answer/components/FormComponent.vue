<template>
  <div
    class="form-component"
    :component-id="componentId"
    :class="{
      visible: !component.isHidden && component.attrs.visible && (!!isFullScreen === !!component.attrs.isFullScreen),
      error: formFillService.getErrorByComponent(componentId).length
    }"
    :style="{
      position: component.attrs.sticky ? 'sticky' : 'relative',
      top: component.attrs.sticky ? '0px' : 'initial',
      'z-index': component.attrs.sticky ? 1 : 'initial',
    }"
  >
    <component
      v-bind="getAttrs(component.attrs)"
      :component="component"
      :is="component.name"
      :isFormItem="component.isFormItem"
      :error-txt="formFillService.getErrorByComponent(componentId).join('\n')"
      v-model:value="value"
      v-model:options="component!.attrs.options"
      v-model:dataSource="component!.attrs.dataSource"
      ref="componentRef"
    >
      <!-- <template v-for="(component, index) in children" :key="index" #[`child${index}`] > -->
      <template v-for="(childComponent, index) in component.children" :key="index" #[`child_${childComponent.slotIndex}_${childComponent.id}`]>
        <FormComponent
          :component-id="childComponent.id"
          :ref="childComponent.id"
          :class="{
            'form-component-layout': !childComponent.isGroup && ['complex', 'layout'].includes(childComponent.type),
          }"
          :children="childComponent.children"
          :component="childComponent"
          :index="index"
          :isFullScreen="isFullScreen"
        />
        <div class="form-component-disabled" v-if="scoringState.isScoring"></div>
      </template>
      <!-- <template v-for="slot in Object.keys(component.slot)" #[slot]>
        <div :key="slot">
          <component
            v-for="detailComponent in component.slot[slot]"
            :key="slot + detailComponent.component.name"
            v-bind="detailComponent.attrs"
            :is="detailComponent.component"
          >
            <template v-for="defaultSlot in Object.keys(detailComponent.slot)" #[defaultSlot]>
              <component
                v-for="detail2Component in detailComponent.slot[defaultSlot]"
                :key="defaultSlot + detail2Component.component.name"
                v-bind="detail2Component.attrs"
                :is="detail2Component.component"
              >
              </component>
            </template>
          </component>
        </div>
      </template> -->
    </component>
    <!-- 评分模块 -->
    <template v-if="!component.isGroup && !['complex', 'layout'].includes(component.type)">
      <div v-if="scoringState.isScoring && formFillState.formInfo[componentId]" class="form-component-scoring">
        <span class="form-component-scoring-label">
          <i class="iconfont icon-edit-file"></i>
          评分
        </span>
        <Rate
          v-if="maxScore <= 10"
          v-model="score"
          :size="22"
          color="#FFDA52"
          :count="maxScore"
          icon-prefix="iconfont icon"
          icon="star-solid"
          void-icon="star-solid"
          allow-half
        />
        <span class="form-component-scoring-score">
          <Stepper
            v-model.number="score"
            theme="round"
            button-size="20px"
            :default-value="0"
            :step="0.5"
            :min="0"
            :max="maxScore"
            :decimal-length="1" 
          /> 
        </span>
      </div>
      <div v-else-if="scoringState.isScoring && !formFillState.formInfo[componentId]" class="form-component-scoring form-component-scoring-invalid">
        —— 当前题目未作答，无法评分 ——
      </div>
    </template>
    <div class="form-component-disabled-overlay" v-if="scoringState.isScoring"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, PropType, ref } from "vue";
import { state as scoringState, service as scoringService } from '@/modules/scoring-module';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { service as eventService } from '@/modules/event-module';
import { service as variableService } from "@/modules/variable-module";
import { EventTriggerType } from "@/modules/event-module/enum";
import { Rate, Stepper } from 'vant';
import type { Component, ComponentGroup } from "@/@types";

const props = defineProps({
  /** 控件Id */
  componentId: {
    type: String,
    required: true
  },
  /** 控件 */
  component: {
    type: Object as PropType<Component | ComponentGroup>,
    required: true
  },
  /** 子组件 */
  children: {
    type: Object as PropType<(Component | ComponentGroup)[]>,
    default: () => [] as (Component | ComponentGroup)[],
    required: true
  },
  /** 索引 */
  index: {
    type: Number,
    required: true
  },
  /** 是否全屏组件 */
  isFullScreen: {
    type: Boolean,
    required: true
  },
});

const componentRef = ref();
nextTick(() => formFillService.setRef(props.componentId, componentRef.value));

const emit = defineEmits<{
  (event: 'setData', componentId: string, val: any): void;
}>();

const value = computed({
  get() {
    return formFillState.formInfo[props.component.id]?.value;
  },
  set(val) {
    if (!props.component.isGroup) {
      formFillService.setFormInfo(props.component.id, val, props.component.answerType);
      emit('setData', props.component.id, val);
      nextTick(() => eventService.emit(EventTriggerType.valueChange, props.component.id, val));
    }
  }
});

/** 获取单个属性 */
const getAttr = (value: any) => {
  if (!value) return value;
  if (value.type) {
    switch (value.type) {
      case 'variable':
        return variableService.getVar(value.value);
      default:
        return value.value;
    }
  } else {
    return value;
  }
};

/** 获取属性 */
const getAttrs = (attrs: Record<string, any>) => {
  const attrObj = Object.assign({}, ...Object.entries(attrs).map(([key, value]) => ({
    [key.startsWith('__') ? key.slice(2) : key]: getAttr(value)
  })));
  // if (scoringStore.isScoring) attrObj.disabled = true;
  return attrObj;
};

/** 评分 */
const score = computed({
  get() {
    return scoringService.getComponentScore(props.component.id);
  },
  set(val: number | undefined) {
    scoringService.setComponentScore(props.component.id, val);
  },
});

/** 最大份数 */
const maxScore = computed(() => {
  return props.component?.attrs?.score || 100;
});

</script>

<style lang="less" scoped></style>
