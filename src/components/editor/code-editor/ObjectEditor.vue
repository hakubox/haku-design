<template>
  <div class="code-editor" ref="containerRef"></div>
</template>

<script lang="ts" setup>
import { throttle } from '@/tools/common';
import { onBeforeMount, onBeforeUnmount, onMounted, PropType, reactive, ref, shallowRef, watch } from 'vue';
import * as monaco from 'monaco-editor';

const props = defineProps({
  value: {
    type: Object as PropType<Record<string, any> | Record<string, any>[]>,
    required: true,
  },
  marker: {
    type: Function,
    default: undefined,
  },
  height: {
    type: String,
    default: '200px',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  /** 主题名称 */
  theme: {
    type: String,
    default: 'gj-dark',
  },
  /** 是否为表单表达式 */
  isExpression: {
    type: Boolean,
    default: false,
  },
  unseenLines: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请输入JSON字符串',
  },
  /** 表单变量 */
  variables: {
    type: Array,
    default: () => [],
  },
});

const editorRef = shallowRef();
const containerRef = ref<HTMLElement>();

const emit = defineEmits<{
  (event: 'change', value: string, eventName: string): void;
  (event: 'focus'): void;
}>();

const state = reactive({
  content: '',
  /** TS转JS的数据 */
  realJavascript: '',
  defaultOptions: {
    wordWrap: 'off', //控制如何换行
    automaticLayout: true,
    fontFamily: "'Fira Code', Consolas, 'Courier New', monospace, 'Microsoft YaHei'",
  },
  /** 停止绘制 */
  preventTriggerChangeEvent: false,
});

let _subscription: any;

/** 获取值 */
const getValue = () => {
  const editor = editorRef.value;
  return JSON.parse(editor?.getValue?.() || '');
};
/** 销毁 */
const destory = () => {
  const editor = editorRef.value;
  if (_subscription) _subscription.dispose();
  const model = editor.getModel();
  if (model) model.dispose();
  editor.dispose();
};
/** 监听值 */
watch(() => props.value, (count, prevCount) => {
  const editor = editorRef.value;
  if (editor) {
    if (!editor.getValue()) {
      editor.setValue('');
    } else if (JSON.stringify(count, undefined, '  ') !== editor.getValue()) {
      editor.setValue(JSON.stringify(count, undefined, '  '));
    }
  }
});

onMounted(() => {
  const _options = {
    ...state.defaultOptions,
    ...props.options,
    theme: props.theme,
    language: 'json',
    fontFamily: 'Courier New',
    wordWrap: 'on',
    minimap: {
      enabled: false, // 是否启用预览图
    },
  };

  editorRef.value = monaco.editor.create(containerRef.value!, {
    value: JSON.stringify(props.value, undefined, '  '),
    ..._options,
  } as monaco.editor.IStandaloneEditorConstructionOptions);
  const editor = editorRef.value;

  editor.onDidFocusEditorText(() => {
    emit('focus');
  });
  _subscription = editor.onDidChangeModelContent(throttle((event) => {
    if (!state.preventTriggerChangeEvent) {
      emit('change', editor.getValue(), event);
    }
  }));
});

onBeforeMount(() => {
  monaco.editor.defineTheme(props.theme, {
    base: 'vs-dark',
    inherit: true,
    rules: [{ token: 'custom-variable', foreground: 'ffa500', fontStyle: 'underline' }],
    colors: {}
  });
  
  if (props.isExpression) {
    // validation settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
    });
  }
});

onBeforeUnmount(() => {
  destory();
});
</script>

<style lang="less" scoped>
.code-editor {
  position: relative;

  > :deep(.monaco-editor) {
    opacity: 1;
  }
}
</style>
