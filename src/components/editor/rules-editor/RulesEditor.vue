<template>
  <div class="rules-editor">
    <!-- 是否必填 -->
    <InputGroup v-if="state.allRules.required.show" compact class="rule-item">
      <Checkbox class="rule-item-label" @change="changeEnable()" v-model:checked="state.allRules.required.value">是否必填</Checkbox>
    </InputGroup>
    <!-- 最大文本长度 -->
    <InputGroup v-if="state.allRules.len.show" compact class="rule-item" :class="{ enable: state.allRules.len.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.len)" v-model:checked="state.allRules.len.enable">固定长度</Checkbox>
      <InputNumber
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.len.enable"
        v-model.lazy="state.allRules.len.value"
      />
    </InputGroup>
    <!-- 最小值 -->
    <InputGroup v-if="state.allRules.min.show" compact class="rule-item" :class="{ enable: state.allRules.min.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.min)" v-model:checked="state.allRules.min.enable">最小{{ type == 'text' ? '长度' : '值' }}</Checkbox>
      <InputNumber
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.min.enable"
        v-model.lazy="state.allRules.min.value"
      />
    </InputGroup>
    <!-- 最大值 -->
    <InputGroup v-if="state.allRules.max.show" compact class="rule-item" :class="{ enable: state.allRules.max.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.max)" v-model:checked="state.allRules.max.enable">最大{{ type == 'text' ? '长度' : '值' }}</Checkbox>
      <InputNumber
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.max.enable"
        v-model.lazy="state.allRules.max.value"
      />
    </InputGroup>
    <!-- 正则表达式 -->
    <InputGroup v-if="state.allRules.pattern.show" compact class="rule-item" :class="{ enable: state.allRules.pattern.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.pattern)" v-model:checked="state.allRules.pattern.enable">正则表达式</Checkbox>
      <Input
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.pattern.enable"
        v-model:value.trim="state.allRules.pattern.value"
      />
    </InputGroup>
    <!-- 内建校验类型 https://github.com/yiminghe/async-validator#type -->
    <InputGroup v-if="state.allRules.type.show" compact class="rule-item" :class="{ enable: state.allRules.type.enable }">
      <Checkbox class="rule-item-label" @change="changeEnable(state.allRules.type)" v-model:checked="state.allRules.type.enable">数值类型</Checkbox>
      <Select
        class="rule-item-value"
        @change="change"
        size="small"
        v-show="state.allRules.type.enable"
        :options="state.types"
        v-model:value="state.allRules.type.value"
      ></Select>
    </InputGroup>
    <!-- 自定义校验 -->
    <InputGroup
      v-if="state.allRules.validator.show"
      compact
      class="rule-item"
      :class="{ enable: state.allRules.validator.enable }"
    >
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
    <InputGroup v-if="state.allRules.whitespace.show" compact class="rule-item">
      <Checkbox class="rule-item-label" @change="changeEnable()" v-model:checked="state.allRules.whitespace.value">允许空格</Checkbox>
    </InputGroup>
  </div>
</template>

<script lang="ts" setup>
import { Checkbox, Input, InputGroup, InputNumber, Select } from 'ant-design-vue';
import { PropType, reactive, onMounted, watch } from 'vue';

interface Rules {
  /** 是否启用校验 */
  enable: boolean;
  /** 值 */
  value: any;
  /** 是否显示 */
  show?: boolean;
  /** 提示信息 */
  message(): string;
}

const props = defineProps({
  /** 当前变量 */
  value: {
    type: Array as PropType<Array<any>>,
    default: () => [],
    required: true,
  },
  /** 筛选变量类型 */
  type: {
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
  allRules: {
    required: { show: false, enable: true, value: undefined, message: () => '{{label}}不能为空。' },
    enum: { show: false, enable: false, value: undefined, message: () => '{{label}}必须为指定值。' },
    len: { show: false, enable: false, value: undefined, message: () => '{{label}}长度必须为{{value}}位。' },
    min: {
      show: false,
      enable: false,
      value: undefined,
      message: () => `{{label}}最小不能低于{{value}}${props.type == 'text' ? '位' : ''}。`,
    },
    max: {
      show: false,
      enable: false,
      value: undefined,
      message: () => `{{label}}最大不能超过{{value}}${props.type == 'text' ? '位' : ''}。`,
    },
    pattern: { show: false, enable: false, value: undefined, message: () => '{{label}}格式不正确。' },
    type: { show: false, enable: false, value: undefined, message: () => '{{label}}必须为{{value}}格式。' },
    validator: { show: false, enable: false, value: undefined, message: () => '{{label}}格式不正确。' },
    whitespace: { show: false, enable: true, value: undefined, message: () => '' },
  },
  /** 内建校验类型选项 */
  types: [
    { value: 'any', label: '任意值' },
    { value: 'string', label: '字符串' },
    { value: 'number', label: '数字' },
    { value: 'boolean', label: '布尔/真假' },
    { value: 'method', label: '函数' },
    { value: 'regexp', label: '正则表达式' },
    { value: 'integer', label: '整数' },
    { value: 'float', label: '浮点数' },
    { value: 'array', label: '数组' },
    { value: 'object', label: '对象' },
    { value: 'enum', label: '枚举' },
    { value: 'date', label: '日期' },
    { value: 'url', label: '地址' },
    { value: 'hex', label: 'HEX颜色' },
    { value: 'email', label: '邮箱' },
  ],
});

const emit = defineEmits<{
  (event: 'change', val: any): void;
}>();

/** 初始化 */
const init = () => {
  if (props.value) {
    props.value.forEach((i) => {
      state.allRules[i.category] = {
        ...state.allRules[i.category],
        enable: !!i[i.category],
        value: i[i.category],
      };
    });
  }
  changeType();
};

const changeType = () => {
  let _rules: string[] = [];
  switch (props.type) {
    case 'any':
      _rules = ['required', 'enum', 'len', 'min', 'max', 'pattern', 'validator', 'whitespace']; //'type',
      break;
    case 'text':
      _rules = ['required', 'enum', 'len', 'min', 'max', 'pattern', 'validator', 'whitespace']; //'type',
      break;
    case 'number':
      _rules = ['required', 'min', 'max', 'validator', 'whitespace'];
      break;
    case 'select':
      _rules = ['required'];
      break;
    case 'date':
      _rules = ['required'];
      break;
    case 'upload':
      _rules = ['required'];
      break;
  }
  Object.entries(state.allRules).forEach(([key, value]) => {
    state.allRules[key].show = _rules.includes(key);
  });
};

/** 改变值 */
const change = () => {
  let re = Object.entries(state.allRules)
    .filter(([key, value]) => value.enable && !!value.value)
    .map(([key, value]) => {
      return { [key]: value.value, category: key, message: value.message() };
    });
  emit('change', re);
};

const changeEnable = (variable?) => {
  if (variable) {
    variable.value = undefined;
  }
  change();
};

watch(() => props.type, () => {
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
