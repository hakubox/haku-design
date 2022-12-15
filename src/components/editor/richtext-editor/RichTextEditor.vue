<template>
  <div class="richtext-editor">
    <Toolbar
      style="border-bottom: 1px solid #ddd"
      :editor="editorRef"
      :defaultConfig="state.toolbarConfig"
      :mode="state.mode"
    />
    <Editor
      :style="{ height: props.height ?? ($attrs.style ?? {} as any).height ?? (isTitleMode ? '60px' : '200px') }"
      v-model="state.valueHtml"
      :defaultConfig="{
        placeholder: $attrs.placeholder as string,
        autoFocus: false,
        ...(isTitleMode ? {
          hoverbarKeys: {
            text: {
              menuKeys: []
            }
          }
        } : {

        })
      }"
      :mode="state.mode"
      @onCreated="handleCreated"
      @onChange="change"
    />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, shallowRef, onMounted, reactive, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@/lib/wang-editor-plugin/variable-picker-menu';
import { IDomEditor, IToolbarConfig } from '@wangeditor/core';
import { message } from 'ant-design-vue';
import { throttle } from '@/tools/common';

/** 编辑器实例，必须用 shallowRef */
const editorRef = shallowRef();

const props = defineProps({
  /** 信息 */
  value: {
    type: String,
    default: '',
  },
  /** 标题模式 */
  isTitleMode: {
    type: Boolean,
    default: false,
  },
  /** 高度 */
  height: {
    type: String,
  },
});

const emit = defineEmits(['change']);

const state = reactive({
  /** 内容HTML */
  valueHtml: '',
  /** 模式 */
  mode: 'default',
  /** 工具栏配置 */
  toolbarConfig: {
    toolbarKeys: props.isTitleMode
      ? ['bold', 'italic', 'underline', 'through', 'sub', 'sup', 'color', 'bgColor', 'redo', 'undo', 'clearStyle']
      : [
          // {
          //   key: 'group-more-style', // 必填，要以 group 开头
          //   title: '标题', // 必填
          //   // iconSvg: '<svg>....</svg>', // 可选
          //   menuKeys: ['header1', 'header2', 'header3', 'header4', 'header5'] // 下级菜单 key ，必填
          // },
          'bold',
          'underline',
          'italic',
          'through',
          'code',
          'sub',
          'sup',
          'clearStyle',
          'color',
          'bgColor',
          'divider',
          'emotion',
          'insertLink',
          'headerSelect',
          'fontSize',
          'fontFamily',
          'lineHeight',
          'indent',
          'delIndent',
          'justifyLeft',
          'justifyRight',
          'justifyCenter',
          'justifyJustify',
          'viewImageLink',
          'codeBlock',
          'blockquote',
          'todo',
          'redo',
          'undo',
          'bulletedList',
          'numberedList',
          'insertImage',
          'insertVideo',
          'variablePicker'
        ],
    modalAppendToBody: true,
  } as Partial<IToolbarConfig>,
});

// ['bold', 'underline', 'italic', 'through', 'code', 'sub', 'sup', 'clearStyle', 'color', 'bgColor', 'fontSize', 'fontFamily', 'indent', 'delIndent', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify', 'lineHeight', 'insertImage', 'deleteImage', 'editImage', 'viewImageLink', 'imageWidth30', 'imageWidth50', 'imageWidth100', 'divider', 'emotion', 'insertLink', 'editLink', 'unLink', 'viewLink', 'codeBlock', 'blockquote', 'headerSelect', 'header1', 'header2', 'header3', 'header4', 'header5', 'todo', 'redo', 'undo', 'fullScreen', 'enter', 'bulletedList', 'numberedList', 'insertTable', 'deleteTable', 'insertTableRow', 'deleteTableRow', 'insertTableCol', 'deleteTableCol', 'tableHeader', 'tableFullWidth', 'insertVideo', 'uploadVideo', 'editVideoSize', 'uploadImage', 'codeSelectLang']

watch(
  () => props.value,
  (val, oldVal) => {
    if (val !== oldVal) {
      state.valueHtml = val;
    }
  },
);

/** 改变值 */
const change = throttle(() => {
  let _value = state.valueHtml;
  if (props.isTitleMode) {
    _value = '<p>' + _value.replace(/<\/?(p|br)>/g, '') + '</p>';
  }
  if (props.value !== _value) {
    emit('change', editorRef.value.isEmpty() ? '' : _value);
  }
});

const handleCreated = (editor) => {
  // [important]记录 editor 实例
  editorRef.value = editor;
};

onMounted(() => {
  setTimeout(() => {
    if (editorRef.value) {
      state.valueHtml = props.value;

      if (props.isTitleMode) {
        editorRef.value.insertBreak = () => {};
      }

      editorRef.value.customAlert = (s: string, type: string) => {
        switch (type) {
          case 'success':
            message.success(s);
            break;
          case 'info':
            message.info(s);
            break;
          case 'warning':
            message.warning(s);
            break;
          case 'error':
            message.error(s);
            break;
          default:
            message.info(s);
            break;
        }
      };
    }
  }, 10);
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.richtext-editor {
  height: auto !important;
}

:deep(.w-e-toolbar) {
  background-color: #fafafa;
}

:deep(.w-e-text-container) {
  background-color: #f7f9fc;
  padding: 5px 0;

  p {
    font-size: 13px !important;
  }

  [data-slate-editor] p {
    margin: 2px 0;
  }
}

:deep(.richtext-editor) {
  background-color: #fafafa !important;

  .w-e-toolbar {
    background-color: #fafafa !important;
    border: none !important;
    margin-bottom: 2px;
  }

  .w-e-text-container {
    background-color: #f7f9fc;
    border: 1px solid transparent !important;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    transition: 0.2s;

    &:hover {
      border: 1px solid fadeout(@primary-color, 20%) !important;
    }

    &:focus-within {
      box-shadow: 0px 0px 0px 2px rgba(77, 140, 228, 0.3);
    }

    > .w-e-text {
      &:focus {
        box-shadow: 0px 0px 0px 2px rgba(77, 140, 228, 0.3);
      }
    }
  }
}
</style>
