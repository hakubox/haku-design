<template>
  <div>
    <div class="formula-editor" :class="{ 'has-error': state.errorList.length, focus: state.isFocus }">
      <div class="formula-editor-prefix">=</div>
      <div class="formula-editor-code" ref="containerRef" style="height: 20px;"></div>
      <div class="formula-editor-tools">
        <Tooltip v-if="state.errorList.length" placement="topRight" title="当前函数不正确" color="#DD4F38" arrow-point-at-center>
          <warning-outlined class="formula-editor-tool-bug" />
        </Tooltip>
        <Tooltip placement="topRight" title="打开函数编辑器" arrow-point-at-center>
          <function-outlined class="formula-editor-tool-function" />
        </Tooltip>
      </div>
      <div v-if="!props?.value?.value?.length" class="formula-editor-placeholder">请输入公式</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createModelId, throttle, timeout } from '@/tools/common';
import { onBeforeUnmount, onMounted, PropType, reactive, ref, shallowRef, toRefs, watch } from 'vue';
import { state as formulaState } from '../../';
import { getDefaultVariables, getVariableDataSource } from '@/modules/variable-module';
import { state as editorState } from '@/modules/editor-module';
import { Tooltip } from 'ant-design-vue';
import { GlobalBusType } from '@/tools/bus';
// import monaco from 'monaco-editor';

/** LibModel */
let libModel = undefined as any;
let libUri = 'ts:filename/facts.d.ts';

const props = defineProps({
  value: {
    type: Object as PropType<{ type: 'formula', value: '' }>,
    required: true,
  },
  marker: {
    type: Function,
  },
  /** 主题名称 */
  theme: {
    type: String,
    default: 'gj-dark',
  },
  /** 提示文本 */
  placeholder: {
    type: String,
    default: '请输入JSON字符串',
  },
  /** 改变事件 */
  onChange: {
    type: Function as PropType<(value: string) => void>
  },
  /** 附加参数 */
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  (eventName: 'update:value', val): void;
  (eventName: 'change', val): void;
  (eventName: 'focus'): void;
}>();

const state = reactive({
  defaultOptions: {
    wordWrap: 'off', //控制如何换行
    automaticLayout: true,
    fontFamily: "'Fira Code', Consolas, 'Courier New', monospace, 'Microsoft YaHei'",
  },
  /** 停止绘制 */
  preventTriggerChangeEvent: false,
  /** 错误列表 */
  errorList: [] as Record<string, any>[],
  /** 真实值 */
  inputValue: { type: 'formula', value: '' },
  /** 是否具有焦点 */
  isFocus: false,
});

const editorRef = shallowRef();
const containerRef = ref(null);
let _subscription: any;

onMounted(() => {
  const _options = {
    ...state.defaultOptions,
    ...props.options,
    theme: props.theme,
    language: 'typescript',
    fontFamily: 'Courier New',
    wordWrap: 'off',
    lineNumbers: 'off',
    selectOnLineNumbers: 'off',
    lineNumbersMinChars: 1,
    minimap: {
      enabled: false // 是否启用预览图
    },
    renderLineHighlight: 'none',
    contextmenu: false,
  };

  const editor = editorRef.value = monaco.editor.create(containerRef.value!, {
    value: props.value.value,
    ..._options,
    scrollbar: {
      useShadows: false,
      vertical: 'hidden',
      horizontal: 'hidden',
    },
    maxTokenizationLineLength: 200,
    lineNumbersMinChars: 1,
    lineHeight: 20,
    scrollBeyondLastColumn: 1,
    fastScrollSensitivity: 1,
  });
  editor.onDidChangeModelDecorations(() => {
    const _decorations = editor.getLineDecorations(1);
    state.errorList = _decorations?.filter?.(i => i?.options?.className?.includes('squiggly-error')) || [];
  });
  editor.onDidFocusEditorText(() => {
    state.isFocus = true;
    emit('focus');
  });
  editor.onDidBlurEditorText(() => {
    state.isFocus = false;
  });
  
  _subscription = editor.onDidChangeModelContent(throttle(() => {
    if (!state.preventTriggerChangeEvent && !state.errorList.length) {
      state.inputValue.value = editor.getValue();
      emit('update:value', state.inputValue);
      emit('change', state.inputValue);
    }
  }));

  if (!formulaState.initFormulaComponent) {
    init();
  }
});

/** 获取值 */
const getValue = () => {
  const editor = editorRef.value;
  return editor?.getValue?.() || '';
};
/** 销毁 */
const destory = () => {
  const editor = editorRef.value;
  if (libModel) {
    libModel.dispose();
  }
  if (_subscription) _subscription.dispose();
  const model = editor.getModel();
  if (model) model.dispose();
  editor.dispose();
};

/** 监听值 */
watch(() => props.value, (val, oldVal) => {
  const editor = editorRef.value;
  if (editor) {
    if (val.value && val.value != editor.getValue() && !state.errorList.length) {
      editor.setValue(val.value);
    }
  }
});

/** 刷新库（针对变量更新） */
const refreshLibSource = () => {
  libUri = `ts:filename/facts_${createModelId(6)}.d.ts`;
  monaco.languages.typescript.typescriptDefaults.setExtraLibs([
    { content: '/** —— */', filePath: libUri }
  ]);

  setTimeout(() => {
    if (libModel) {
      libModel.dispose();
      libModel = undefined;
    }
    let libSource = formulaState.formulaList.map(i => `
/**\n ${i.params.map(p => `* @param {${p.type}} ${p.name} ${p.description}`).join('\n ')}\n */
declare const ${i.name} = (${i.params.map(p => `${p.isExtend ? '...' : ''}${p.name}: ${p.type}`).join(', ')}) => ${i.returnType};`).join('') + '\n\n';

    // 添加默认变量
    libSource += getDefaultVariables().map(i => `/** ${i.title} */\ndeclare const ${i.name}: ${i.type};`).join('\n') + '\n';
    // 添加其他数据源变量
    libSource += getVariableDataSource().map(source => source.children ? source.children.map(prop => `/** ${prop.title} */\ndeclare const ${prop.name}: ${prop.type};`).join('\n') : '').join('\n') + '\n';

    monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri);
    libModel = monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
  }, 100);
}
  
editorState.bus.$on(GlobalBusType.updateVariable, () => {
  refreshLibSource();
});

/** 初始化 */
const init = () => {
  refreshLibSource();

  monaco.languages.registerHoverProvider('typescript', {
    provideHover(model, position) {
      return timeout(0).then(() => {
        let hoverStr = ``;
        let example = ``;
        const _defaultHoverTitle = `### 公式\n`;
        const currentWord = model.getWordAtPosition(position);
        if (currentWord?.word) {
          for (let i = 0; i < formulaState.formulaList.length; i++) {
            const item = formulaState.formulaList[i];
            if (item.name === currentWord.word) {
              hoverStr = `${_defaultHoverTitle} **${item.name}** ${item.summary}`;
              example = item.example ?? '';
              break;
            }
          }
          return {
            contents: [
            hoverStr ? { value: `${hoverStr}` } : undefined,
              example ? { value: `#### 使用示例\n` + '```javascript\n' + example + '\n```' } : undefined,
            ].filter(i => i)
          };
        } else {
          return {
            contents: []
          };
        }
      });
    },
  });
  formulaState.initFormulaComponent = true;
};

monaco.editor.defineTheme('gj-dark', {
  base: 'vs',
  inherit: true,
  rules: [{ token: 'custom-variable', foreground: 'ffa500', fontStyle: 'underline' }],
  colors: {
  }
});

// validation settings
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
});

// compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  allowNonTsExtensions: true,
});


onBeforeUnmount(() => {
  destory();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.formula-editor {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  background-color: #f7f9fc;
  border: 1px solid #f7f9fc;
  border-radius: 3px;
  transition: 0.3s;
  
  &:hover {
    border-color: fadeout(@primary-color, 20%);
    border-width: 1px !important;
  }

  &.focus {
    box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
  }

  &.has-error {
    background-color: #F4E8E5;
  }

  > .formula-editor-prefix {
    width: 18px;
    flex-grow: 0;
    flex-shrink: 0;
    padding-left: 8px;
    padding-right: 6px;
  }

  > .formula-editor-code {
    position: relative;
    width: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    height: 20px !important;
    margin-left: -20px;

    :deep(.overflow-guard) {
      height: 20px !important;

      > .margin {
        display: none !important;
      }
      > .monaco-scrollable-element {
        // left: 0px !important;
        height: 20px !important;
      }
    }

    :deep(.monaco-editor) {
      background-color: transparent;
    }

    :deep(.decorationsOverviewRuler) {
      display: none !important;
    }

    :deep(.monaco-editor-background) {
      background-color: transparent;
    }
  }

  > .formula-editor-tools {
    flex-grow: 1;
    flex-shrink: 0;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 4px;
    width: 60px;

    > span {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #EFEFEF;
      border-radius: 3px;
      font-size: 16px;
      padding: 2px;
      transition: 0.15s;

      + span {
        margin-left: 4px;
      }
    }

    // 
    > .formula-editor-tool-bug {
      cursor: default;
      color: #DD4F38;
    }

    > .formula-editor-tool-function {
      cursor: pointer;
      color: @primary-color;

      &:hover {
        background-color: #dfdfdf;
      }
    }
  }

  > .formula-editor-placeholder {
    pointer-events: none;
    position: absolute;
    display: inline-block;
    top: 0px;
    left: 24px;
    line-height: 28px;
    color: rgb(207, 205, 205);
    z-index: 0;
    font-size: 13px;
  }
}
</style>
