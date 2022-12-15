<template>
  <div class="code-editor" ref="containerRef" :height="($attrs.style as any).height"></div>
</template>

<script lang="ts">
import { throttle } from '@/tools/common';
import { defineComponent, onBeforeUnmount, onMounted, PropType, reactive, ref, shallowRef, toRefs, watch } from 'vue';

export default defineComponent({
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      required: true,
    },
    marker: {
      type: Function,
    },
    height: {
      type: String,
      default: '200px',
    },
    /** 主题名称 */
    theme: {
      type: String,
      default: 'gj-dark',
    },
    /** 语言类型 */
    language: {
      type: String,
      default: 'json',
    },
    /** 是否为表达式 */
    isExpression: {
      type: Boolean,
      default: false,
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
  },
  mounted() {
  },
  methods: {
  },
  setup(props, { emit }) {

    let state = reactive({
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

    const editorRef = shallowRef();
    const containerRef = ref(null);
    let _subscription: any;

    onMounted(()=>{
      let _options = {
        ...state.defaultOptions,
        ...props.options,
        theme: props.theme,
        language: props.language,
        fontFamily: 'Courier New',
        wordWrap: 'on',
        minimap: {
          enabled: false // 是否启用预览图
        },
      };

      const editor = editorRef.value = monaco.editor.create(containerRef.value, {
        value: props.value,
        ..._options,
      });
      editor.onDidFocusEditorText(() => {
        emit('focus');
      });
      _subscription = editor.onDidChangeModelContent(throttle((event) => {
        if (!state.preventTriggerChangeEvent) {
          emit('change', editor.getValue(), event);
        }
      }));
    })

    /** 获取值 */
    const getValue = () => {
      const editor = editorRef.value;
      return editor?.getValue?.() || '';
    };
    /** 销毁 */
    const destory = () => {
      const editor = editorRef.value;
      if (_subscription) _subscription.dispose()
      const model = editor.getModel();
      if (model) model.dispose();
      editor.dispose();
    };
    /** 监听值 */
    watch(() => props.value, (count, prevCount) => {
      const editor = editorRef.value;
      if (editor) {
        if (count != editor.getValue()) {
          editor.setValue(count);
        }
      }
    });
    
    if (props.isExpression) {
      monaco.editor.defineTheme('gj-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ token: 'custom-variable', foreground: 'ffa500', fontStyle: 'underline' }],
        colors: {}
      });

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

    } else {
      monaco.editor.defineTheme('gj-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ token: 'custom-variable', foreground: 'ffa500', fontStyle: 'underline' }],
        colors: {}
      });

      const _languages = monaco.languages.getLanguages().map((i) => i.id);
      if (!_languages.includes(props.language)) {
        switch (props.language) {
          case 'sql':
            break;
          default:
            break;
        }
      }
    }
    
    onBeforeUnmount(() => {
      destory();
    })

    return {
      ...toRefs(state),
      editorRef,
      containerRef,
      getValue
    }
  }
});
</script>

<style lang="less" scoped>
.code-editor {
  position: relative;
}
</style>
