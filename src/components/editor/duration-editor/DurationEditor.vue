<template>
  <div v-if="props.readonly" class="number-editor-preview editor-preview">
    {{ state.inputValue ?? '——' }}
  </div>
  <a-input-number v-else class="duration-editor" :size="props.size" v-model:value="state.inputValue" :precision="getPrecision" @change="change">
    <template #addonAfter>
      <span v-if="!props?.useUnits?.length">{{ getUnitText(state.unit) }}</span>
      <a-dropdown v-else>
        <a @click.prevent>
          {{ getUnitText(state.unit) }}
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="item in props.useUnits" :key="item">{{ getUnitText(item) }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-input-number>
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { computed } from '@vue/reactivity';
import { onMounted, PropType, reactive, watch } from 'vue';

const props = defineProps({
  attrs: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /** 组件尺寸 */
  size: {
    type: String as PropType<'large' | 'middle' | 'small'>,
    default: 'middle',
  },
  /** 单位 */
  unit: {
    type: String as PropType<'hour' | 'minute' | 'second' | 'millisecond'>,
    default: 'second',
  },
  /** 毫秒数 */
  value: {
    type: Number as PropType<number | undefined>,
    required: true,
  },
  /** 可使用单位列表 */
  useUnits: {
    type: Array as PropType<('hour' | 'minute' | 'second' | 'millisecond')[]>,
    default: () => [],
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: 'change', value: number | undefined): void;
}>();

const state = reactive({
  /** 值 */
  inputValue: undefined as number | undefined,
  /** 单位 */
  unit: 'second',
});

/** 获取单位文本 */
const getUnitText = (unit: string) => {
  switch (unit) {
    case 'millisecond':
      return '毫秒';
    case 'second':
      return '秒';
    case 'minute':
      return '分钟';
    case 'hour':
      return '小时';
  }
};

/** 获取精度 */
const getPrecision = computed(() => {
  switch (props.unit) {
    case 'millisecond':
      return 0;
    case 'second':
      return 0;
    case 'minute':
      return 1;
    case 'hour':
      return 2;
  }
});

/** 获取时间（毫秒） */
const getTime = () => {
  if (state.inputValue === undefined || state.inputValue === null) return undefined;
  switch (props.unit) {
    case 'millisecond':
      return state.inputValue;
    case 'second':
      return state.inputValue * 1000;
    case 'minute':
      return state.inputValue * 60000;
    case 'hour':
      return state.inputValue * 3600000;
  }
};

/** 获取显示内容 */
const getInputValue = () => {
  if (props.value === undefined || props.value === null) return undefined;
  switch (props.unit) {
    case 'millisecond':
      return props.value;
    case 'second':
      return props.value / 1000;
    case 'minute':
      return props.value / 60000;
    case 'hour':
      return props.value / 3600000;
  }
};

/** 初始化 */
const init = () => {
  state.inputValue = getInputValue();
};

/** 改变值 */
const change = throttle(() => {
  emit('change', getTime());
});

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    init();
  }
});

watch(() => props.unit, (val, oldVal) => {
  if (val !== oldVal) {
    state.unit = props.unit;
    init();
  }
});

onMounted(() => {
  state.unit = props.unit;
  init();
});

</script>

<style lang="less" scoped></style>
