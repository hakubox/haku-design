<template>
  <!-- TODO: 需要移除visible类，换成hidden -->
  <div
    class="form-component"
    :component-id="componentId"
    :class="{
      visible: (!props.component.isHidden || !props.isPreview) && props.component.attrs.visible && !!isFullScreen === !!props.component.attrs.isFullScreen,
      error: props.isPreview && formFillService.getErrorByComponent(componentId).length,
      preselect: draggableState.rangeSelectConfig.componentIds.includes(componentId)
    }"
    :style="editorState.appConfig.appType === AppType.canvas ? {
      position: position,
      top: props.component.attrs.sticky ? '0px' : 'initial',
      'z-index': props.component.attrs.sticky ? 1 : 'initial',
      width: `${component.attrs.width}px`,
      height: `${getComponentHeight}px`,
      top: `${component.attrs.y}px`,
      left: `${component.attrs.x}px`,
      transform: `rotate(${component.attrs.rotate || 0}deg)`
    } : {}"
    @mousedown.stop="mouseDownEvent($event, props.component)"
    ref="formComponent"
  >
    <CanvasNodeActionEditor
      v-if="editorState.appConfig.appType === AppType.canvas"
      :component="props.component"
      :show="editorState.currentSelectedComponents.length === 1 && editorState.currentSelectedFirstComponentId === props.component.id"
      :disabledHeight="props.component.attrs.disabledHeight"
      :disabledWidth="props.component.attrs.disabledWidth"
    >
      <component
        v-bind.prop="getAttrs(props.component.attrs)"
        :component="props.component"
        :is="props.component.name"
        :isFormItem="props.component.isFormItem"
        :error-txt="props.isPreview ? formFillService.getErrorByComponent(componentId).join('\n') : undefined"
        v-model:value.prop="value"
        v-model:dataSource.prop="props.component!.attrs.dataSource"
        v-model:options.prop="props.component!.attrs.options"
        :isPreview="props.isPreview"
        ref="componentRef"
      >
        <template v-for="(childComponent, index) in component.children" :key="index" #[`child_${childComponent.slotIndex}_${childComponent.id}`]>
          <FormDesignComponent
            :component-id="childComponent.id"
            :ref="childComponent.id"
            :class="{
              'form-component-layout': ['complex', 'layout'].includes(childComponent.type),
              active:
                !props.isPreview &&
                editorState.currentSelectedComponents.find(i => i.id === childComponent.id),
                'is-drag': dragConfig && dragConfig.targetFormComponentId === childComponent.id,
            }"
            :children="childComponent.children"
            :component="childComponent"
            :isPreview="props.isPreview"
            :isFormItem="false"
            :index="index"
            :isFullScreen="isFullScreen"
          />
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
    </CanvasNodeActionEditor>
    <component
      v-else
      v-bind.prop="getAttrs(props.component.attrs)"
      :component="props.component"
      :is="props.component.name"
      :isFormItem="props.component.isFormItem"
      :error-txt="props.isPreview ? formFillService.getErrorByComponent(componentId).join('\n') : undefined"
      v-model:value.prop="value"
      v-model:dataSource.prop="props.component!.attrs.dataSource"
      v-model:options.prop="props.component!.attrs.options"
      :isPreview="props.isPreview"
      ref="componentRef"
    >
      <template v-for="(childComponent, index) in component.children" :key="index" #[`child_${childComponent.slotIndex}_${childComponent.id}`]>
        <FormDesignComponent
          :component-id="childComponent.id"
          :ref="childComponent.id"
          :class="{
            'form-component-layout': ['complex', 'layout'].includes(childComponent.type),
            active:
              !props.isPreview &&
              editorState.currentSelectedComponents.find(i => i.id === childComponent.id),
              'is-drag': dragConfig && dragConfig.targetFormComponentId == childComponent.id,
          }"
          :children="childComponent.children"
          :component="childComponent"
          :isPreview="props.isPreview"
          :isFormItem="false"
          :index="index"
          :isFullScreen="isFullScreen"
        />
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
    <Transition name="form-component-tools">
      <div v-if="!props.isPreview && editorState.currentSelectedComponents.length === 1 && editorState.currentSelectedFirstComponentId == component.id" class="form-component-tools">
        <div class="form-component-tool-item form-component-tool-item-info" @mousedown.stop="mouseDownEvent($event, props.component)">
          <i class="form-component-tool-item-icon" :class="editorState.menuComponents.find(x=>x.name===component.name)?.icon" alt="" />
          <span class="form-component-tool-item-title">{{ component.attrs.name }}</span>
        </div>
        <div v-if="componentQuickTools?.length" class="form-component-tool-group">
          <template :key="index" v-for="(item, index) in componentQuickTools">
            <div
              v-if="item.icon && !item.label"
              class="form-component-tool-item form-component-tool-item-btn"
              @mousedown.stop="item.callback?.(component)"
            >
              <Tooltip placement="top" :title="typeof item.tooltip === 'function' ? item.tooltip(component) : item.tooltip" arrowPointAtCenter>
                <i class="form-component-tools-item" :class="`${typeof item.icon === 'function' ? item.icon(component) : item.icon}`"></i>
              </Tooltip>
            </div>
            <div
              v-else-if="item.label"
              class="form-component-tool-item form-component-tool-item-btn"
              @mousedown.stop="item.callback?.(component)"
            >
              <Tooltip placement="top" :title="typeof item.tooltip === 'function' ? item.tooltip(component) : item.tooltip" arrowPointAtCenter>
                <i v-if="item.icon" class="form-component-tool-item-icon" :class="`${typeof item.icon === 'function' ? item.icon(component) : item.icon}`" />
                <span class="form-component-tool-item-title">{{ item.label }}</span>
              </Tooltip>
            </div>
          </template>
        </div>
        <div class="form-component-tool-group">
          <div class="form-component-tool-item form-component-tool-item-btn" @mousedown.stop="props.component.attrs.visible = !props.component.attrs.visible">
            <Tooltip placement="top" :title="component.attrs.visible ? '显示' : '隐藏'" arrowPointAtCenter>
              <i class="form-component-tools-item iconfont" :class="`${component.attrs.visible ? 'icon-icon_yulan' : 'icon-miwen'}`"></i>
            </Tooltip>
          </div>
          <div v-if="editorState.appConfig.appType !== AppType.canvas" class="form-component-tool-item form-component-tool-item-btn" @mousedown.stop="componentHandle('componentMovePrev', $event, component)">
            <Tooltip placement="top" title="上移" arrowPointAtCenter>
              <ArrowUpOutlined class="form-component-tools-item" />
            </Tooltip>
          </div>
          <div v-if="editorState.appConfig.appType !== AppType.canvas" class="form-component-tool-item form-component-tool-item-btn" @mousedown.stop="componentHandle('componentMoveNext', $event, component)">
            <Tooltip placement="top" title="下移" arrowPointAtCenter>
              <ArrowDownOutlined class="form-component-tools-item" />
            </Tooltip>
          </div>
          <div v-if="editorState.appConfig.appType !== AppType.canvas" class="form-component-tool-item form-component-tool-item-btn" @mousedown.stop="componentHandle('componentCopy', $event, component)">
            <Tooltip placement="top" title="复制" arrowPointAtCenter>
              <CopyOutlined class="form-component-tools-item" />
            </Tooltip>
          </div>
        </div>
        <div class="form-component-tool-item form-component-tool-item-btn danger" @mousedown.stop="componentHandle('componentRemove', $event, component)">
          <Tooltip placement="top" title="删除" arrowPointAtCenter>
            <DeleteOutlined class="form-component-tools-item" />
          </Tooltip>
        </div>
      </div>
    </Transition>
    <!-- 评分模块 -->
    <div v-if="props.isPreview && scoringState.isScoring && formFillState.formInfo[componentId]" class="form-component-scoring">
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
    <div v-else-if="props.isPreview && scoringState.isScoring && !formFillState.formInfo[componentId]" class="form-component-scoring form-component-scoring-invalid">
      —— 当前题目未作答，无法评分 ——
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from '@/@types';
import type { DragConfig } from '@/modules/draggable-module/@types';
import { computed, nextTick, ref, type PropType, onMounted, onUnmounted } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { useComponentHandle } from "@/common/component-handle";
import { state as draggableState, service as draggableService } from '@/modules/draggable-module';
import { service as eventService } from '@/modules/event-module';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { service as variableService } from '@/modules/variable-module';
import { service as formulaService } from "@/modules/formula-module";
import { state as scoringState, service as scoringService } from "@/modules/scoring-module";
import { EventTriggerType } from '@/modules/event-module/enum';
import { any } from 'vue-types';
import { Tooltip } from 'ant-design-vue';
import { Rate, Stepper } from 'vant';
import { ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { DragGesture } from '@use-gesture/vanilla';
import { AppType } from '@/@types/enum';
import CanvasNodeActionEditor from '../common/CanvasNodeActionEditor.vue';

const props = defineProps({
  /** 拖拽状态 */
  dragConfig: {
    type: Object as PropType<DragConfig>,
  },
  /** 控件Id */
  componentId: {
    type: String,
    required: true,
  },
  /** 控件 */
  component: {
    type: Object as PropType<Component>,
    required: true,
  },
  /** 子组件 */
  children: {
    type: Object as PropType<Component[]>,
    default: () => [] as Component[],
    required: true,
  },
  /** 索引 */
  index: {
    type: Number,
    required: true,
  },
  /** 是否预览 */
  isPreview: {
    type: Boolean,
    required: true,
  },
  /** 是否只读 */
  isReadonly: {
    type: Boolean,
    default: false,
  },
  /** 是否全屏组件 */
  isFullScreen: {
    type: Boolean,
    required: true,
  },
});

const formComponent = ref<HTMLElement>();

const { componentHandle } = useComponentHandle();
const componentRef = ref();
formFillService.setRef(props.componentId, componentRef.value);

const emit = defineEmits<{
  (event: 'setData', id: string, value: any): void;
}>();

/** 获取组件高度 */
const getComponentHeight = computed(() => {
  if (props.component.attrs.height) {
    return props.component.attrs.height;
  } else {
    const _el = formComponent.value?.querySelector('.component-item') as HTMLElement;
    return _el?.offsetHeight ?? 0;
  }
});

/** 获取单个属性 */
const getAttr = (value: any) => {
  if (!value) return value;
  if (value?.value?.dataOrigin === 'data-editor') {
    return formFillService.getOriginDataValue(value.value);
  } else if (value.type) {
    switch (value.type) {
      case 'data-variable':
        return variableService.getVar(value.value);
      case 'variable':
        return variableService.getVar(value);
      case 'formula':
        return formulaService.getValue(value.value);
      default:
        return value.value;
    }
  } else {
    return value;
  }
};

/** 最大分数 */
const maxScore = computed(() => {
  return props.component?.attrs?.score || 100;
});

/** 组件快捷工具栏 */
const componentQuickTools = computed(() => {
  return editorState.componentList.find(i => i.name === props.component.name)?.quickTools;
});

/** 获取属性 */
const getAttrs = (attrs: Record<string, any>) => {
  return Object.assign(
    {},
    ...Object.entries(attrs).map(([key, value]) => ({
      [key.startsWith('__') ? key.slice(2) : key]: getAttr(value),
    })),
  );
};

/** 鼠标按下事件 */
const mouseDownEvent = (e, component: Component) => {
  if (!props.isPreview) {
    draggableService.startDragFormComponent(e, component);
    editorService.changeSelectedFormComponent([component]);
  } else {
    eventService.emit(EventTriggerType.click, component.id);
  }
};

/** 获取定位模式 */
const position = computed(() => {
  if (editorState.appConfig.appType === AppType.canvas) return 'absolute';
  else return props.isPreview ? (props.component.attrs.sticky ? 'sticky' : 'relative') : 'relative';
});

const value = computed({
  get() {
    return getAttr(formFillState.formInfo[props.component.id]);
  },
  set(val) {
    if (props.isPreview) {
      formFillService.setFormInfo(props.component.id, val, props.component.answerType!);
      emit('setData', props.component.id, val);
      nextTick(() => eventService.emit(EventTriggerType.valueChange, props.component.id, val));
      // nextTick(props.formFillState.countScore);
    }
  },
});

/** 评分 */
const score = computed({
  get() {
    return scoringService.getComponentScore(props.component.id);
  },
  set(val: number | undefined) {
    if (props.isPreview) {
      scoringService.setComponentScore(props.component.id, val);
    }
  },
});

let gesture: DragGesture;

onMounted(() => {
  if (formComponent.value) {
    gesture = new DragGesture(formComponent.value, ({ active, swipe: [swipeX, swipeY], movement: [mx, my] }) => {
      if (swipeX) {
        const _directionX = swipeX > 0 ? 'right' : 'left';
        eventService.emit(EventTriggerType.swipe, props.component.id, { direction: _directionX });
      }
      if (swipeY) {
        const _directionY = swipeY > 0 ? 'down' : 'up';
        eventService.emit(EventTriggerType.swipe, props.component.id, { direction: _directionY });
      }
    });
  }
});

onUnmounted(() => {
  gesture.destroy();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.form-component-tools-enter-active,
.form-component-tools-leave-active {
  transition: opacity 0.3s ease;
}

.form-component-tools-enter-from,
.form-component-tools-leave-to {
  opacity: 0;
}

.tools-item() {
  cursor: default;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: 0.15s;
  height: 22px;
  background-color: @primary-color;
  color: #fff;
  
  &.danger {
    background-color: @error-color;
  }

  &.form-component-tool-item-btn {
    cursor: pointer;

    &:hover {
      background-color: @primary-color-dark;
      
      &.danger {
        background-color: @error-color-dark;
      }
    }
  }
  

  > .form-component-tools-item {
    font-size: 14px;
    margin-left: 4px;

    &:first-child {
      margin-left: 0;
    }
  }

  
  > .form-component-tool-item-icon {
    font-size: 12px;
    margin-left: 4px;
    margin-right: 1px;
    color: #fff;

    + .form-component-tool-item-title {
      margin-left: 4px;
    }
  }

  > .form-component-tool-item-title {
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    flex-shrink: 1;
    max-width: 120px;
  }
}

// 悬浮操作栏
.form-component-tools {
  cursor: default;
  position: absolute;
  right: 6px;
  bottom: -22px;
  height: 22px;
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 999;

  
  > .form-component-tool-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-left: 4px;
    padding: 0 4px;
    background-color: @primary-color;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 2px 2px 3px 0px rgba(0,0,0,0.15);
    transition: 0.15s;
    transform: translateY(1px);

    &:hover {
      box-shadow: 2px 2px 6px 0px rgba(0,0,0,0.25);
    }

    > .form-component-tool-item {
      .tools-item();
      padding: 0 3px;

      &:first-child {
        border-bottom-left-radius: 4px;
      }

      &:last-child {
        border-bottom-right-radius: 4px;
      }

      + .form-component-tool-item {
        margin-left: 4px;

        &:before {
          content: '';
          position: absolute;
          display: inline-block;
          top: 4px;
          left: -2px;
          bottom: 4px;
          border-left: 1px solid #82aeec;
        }
      }
    }
  }

  > .form-component-tool-item {
    .tools-item();
    margin-left: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0 6px;
    box-shadow: 2px 2px 3px 0px rgba(0,0,0,0.15);
    transform: translateY(1px);

    &.form-component-tool-item-info {
      cursor: -webkit-grab;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    &.form-component-tool-item-btn {
      &:hover {
        box-shadow: 2px 2px 6px 0px rgba(0,0,0,0.25);
      }
    }
  }
}
</style>
