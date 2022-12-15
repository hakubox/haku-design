<template>
  <div>
    <template v-for="tag in state.tags" :key="tag">
      <a-tooltip v-if="tag.length > props.maxCount" :title="tag">
        <a-tag :closable="true" @close="handleClose(tag)">
          {{ `${tag.slice(0, props.maxCount)}...` }}
        </a-tag>
      </a-tooltip>
      <a-tag v-else :closable="true" @close="handleClose(tag)">
        {{ tag }}
      </a-tag>
    </template>
    <a-input
      v-if="state.inputVisible"
      ref="inputRef"
      v-model:value="state.inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
      <plus-outlined />
      新标签
    </a-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, PropType, reactive, nextTick, watch } from 'vue';

const props = defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  maxCount: {
    type: Number,
    default: 20
  }
});

/** 新标签输入框 */
const inputRef = ref<HTMLInputElement>();

const emit = defineEmits<{
  (event: 'change', val: string[]): void;
  (event: 'input', val: string[]): void;
}>();

let state = reactive({
  inputValue: '',
  tags: [] as string[],
  inputVisible: false,
});

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value!.focus();
  });
};
const handleClose = (removedTag: string) => {
  const tags = state.tags.filter(tag => tag !== removedTag);
  state.tags = tags;
  change();
};
const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && tags.indexOf(state.inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
  change();
};
/** 初始化 */
const init = () => {
  if (props.value) state.tags = props.value;
  else state.tags = [];
};
/** 改变值 */
const change = () => {
  const value = state.tags;
  if (value !== props.value) {
    emit('change', value);
  }
};

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    if (val) state.tags = val;
    else state.tags = [];
  }
});

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.textarea-editor {
}
</style>
