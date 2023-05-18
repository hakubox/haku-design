<template>
  <div class="rules-editor">
    <!-- 是否必填 -->
    <!-- <InputGroup v-if="state.allRules.required.show" compact class="rule-item">
      <Checkbox class="rule-item-label" @change="changeEnable()" v-model:checked="state.allRules.required.value">是否必填</Checkbox>
    </InputGroup> -->
    <!-- 最大文本长度 -->
    <InputGroup v-if="state.allRules?.len?.show" compact class="rule-item" :class="{ enable: state.allRules.len.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.len)" v-model:checked="state.allRules.len.enable">固定长度</Checkbox>
      <InputNumber
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.len.enable"
        v-model:value="state.allRules.len.value"
      >
        <template #addonAfter>位</template>
      </InputNumber>
    </InputGroup>
    <!-- 最小值 -->
    <InputGroup v-if="state.allRules?.min?.show" compact class="rule-item" :class="{ enable: state.allRules.min.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.min)" v-model:checked="state.allRules.min.enable">最小{{ props.validateType === 'text' ? '长度' : '值' }}</Checkbox>
      <InputNumber
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.min.enable"
        v-model:value="state.allRules.min.value"
      />
    </InputGroup>
    <!-- 最大值 -->
    <InputGroup v-if="state.allRules?.max?.show" compact class="rule-item" :class="{ enable: state.allRules.max.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.max)" v-model:checked="state.allRules.max.enable">最大{{ props.validateType === 'text' ? '长度' : '值' }}</Checkbox>
      <InputNumber
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.max.enable"
        v-model:value="state.allRules.max.value"
      />
    </InputGroup>
    <!-- 正则表达式 -->
    <InputGroup v-if="state.allRules?.pattern?.show" compact class="rule-item" :class="{ enable: state.allRules.pattern.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.pattern)" v-model:checked="state.allRules.pattern.enable">正则表达式</Checkbox>
      <Input
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.pattern.enable"
        v-model:value.trim="state.allRules.pattern.value"
      >
        <template #addonAfter><i class="iconfont icon-regexp"></i></template>
      </Input>
    </InputGroup>
    <!-- 内建校验类型 https://github.com/yiminghe/async-validator#type -->
    <InputGroup v-if="state.allRules?.type?.show" compact class="rule-item" :class="{ enable: state.allRules.type.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.type)" v-model:checked="state.allRules.type.enable">固定类型</Checkbox>
      <Select
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.type.enable"
        :options="validateState.types"
        v-model:value="state.allRules.type.value"
      ></Select>
    </InputGroup>
    <!-- 自定义校验 -->
    <InputGroup v-if="state.allRules?.validator?.show" compact class="rule-item" :class="{ enable: state.allRules.validator.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.validator)" v-model:checked="state.allRules.validator.enable">自定义校验</Checkbox>
      <Input
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.validator.enable"
        v-model:value="state.allRules.validator.value"
      />
    </InputGroup>
    <!-- 允许空格 -->
    <InputGroup v-if="state.allRules?.whitespace?.show" compact class="rule-item">
      <Checkbox class="rule-item-label" @change="changeEnable()" v-model:checked="state.allRules.whitespace.value">允许空格</Checkbox>
    </InputGroup>
  </div>
</template>

<script lang="ts" setup>
import { Checkbox, Input, InputGroup, InputNumber, Select } from 'ant-design-vue';
import { PropType, reactive, onMounted, watch } from 'vue';
import { state as validateState, service as validateService } from '../';
import type { ValidateType } from '../index.d';

const props = defineProps({
  /** 当前变量 */
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
    required: true,
  },
  /** 校验变量类型 */
  validateType: {
    type: String as PropType<'any' | 'text' | 'number' | 'select' | 'date' | 'upload'>,
    default: 'any',
  },
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
  },
});

const state = reactive({
  /** 真实值 */
  inputValue: [] as string[],
  /** 所有条件状态 */
  allRules: {} as Record<ValidateType, { show: boolean, enable: boolean, value: any }>,
});

const emit = defineEmits<{
  (event: 'change', val: any): void;
}>();

/** 初始化 */
const init = () => {
  changeType();
  if (props.value) {
    props.value.forEach((i) => {
      state.allRules[i.category] = {
        ...state.allRules[i.category],
        enable: !!i[i.category],
        value: i[i.category],
      };
    });
  }
};

const changeType = () => {
  state.allRules = Object.assign({}, ...validateService.getRulesByValidateType(props.validateType).map(key => ({
    [key]: { show: true, enable: false, value: undefined }
  })));
};

/** 改变值 */
const change = () => {
  console.log('change', Object.entries(state.allRules).filter(([key, value]) => value.enable && !!value.value));
  const re = Object.entries(state.allRules)
    .filter(([key, value]) => value.enable && !!value.value)
    .map(([key, value]) => {
      return { [key]: value.value };
    });
  emit('change', re);
};

const changeEnable = (variable?) => {
  if (variable) {
    variable.value = undefined;
  }
  change();
};

watch(() => props.validateType, () => {
  changeType();
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.rules-editor {
  word-break: break-all;
  white-space: normal;

  > .rule-item {
    display: inline-block;
    margin-bottom: 8px;
    width: auto;

    &.enable {
      display: flex;
      width: 100%;
    }

    > :deep(.rule-item-label) {
      display: flex;
      align-items: flex-start;
      user-select: none;
      vertical-align: middle;
      line-height: 22px;
      padding-left: 2px;
      flex-grow: 1;
      white-space: nowrap;
      margin-top: 4px;

      > .ant-checkbox {
        white-space: nowrap;

        > .ant-checkbox-inner {
          display: inline-block;
          vertical-align: text-top;
        }
      }
    }
    > .rule-item-value {
      flex-grow: 200;
    }
  }
}
</style>
