<template>
  <div class="file-picker">
    <div v-if="multiple">
      <Tag v-for="item in value" :key="item">{{ storageService.getFileInfo(item)?.name }}</Tag>
    </div>
    <input
      v-else
      :value="value ? storageService.getFileInfo(value)?.name : undefined"
      @change="change"
      type="text"
      :readonly="true"
      :placeholder="placeholder || '请选择文件'"
    />
    <Tooltip placement="topRight" arrowPointAtCenter @click="openFileDialog">
      <template #title>打开资源库</template>
      <div class="file-editor-suffix">
        <i class="iconfont icon-weizhigeshi"></i>
      </div>
    </Tooltip>
  </div>
</template>

<script lang="ts">
import { state as storageState, service as storageService } from '../../index';
import { defineComponent, reactive } from 'vue';
import fileDialog from '../file-dialog';
import { Tag, Tooltip } from 'ant-design-vue';

export default defineComponent({
  props: {
    /** 文件Id（多个时用逗号隔开） */
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    /** 是否允许选择多个文件 */
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /** 改变值 */
    change() {
        this.$emit("change", this.value);
    },
    /** 打开文件选择器 */
    openFileDialog() {
      const prevFiles = !this.value ? [] : (("" + this.value).split(",") as string[]);
      fileDialog.open({
        canSelectFile: true,
        allowMultiSelect: true,
        onConfirm: (files) => {
          files.forEach((file) => {
            const _file = {
              ...file,
              id: "" + file.id,
            };
            const _index = this.storageState.fileList.findIndex((i) => i.id === _file.id);
            if (_index >= 0 && prevFiles.includes(_file.id)) {
              this.storageState.fileList.splice(_index, 1);
            }
            else if (_index < 0 && !prevFiles.includes(_file.id)) {
              this.storageState.fileList.push(_file);
            }
          });
          if (this.multiple) {
            this.$emit("change", files.map((i) => "" + i.id).join(","));
          }
          else {
            this.$emit("change", "" + files[0].id);
          }
        },
      });
    },
  },
  setup() {
    const state = reactive({
      files: [] as string[],
    });
    return {
      state,
      storageState,
      storageService,
    };
  },
  components: { Tooltip, Tag }
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.file-picker {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  background-color: #f7f9fc;
  border: 1px solid #f7f9fc;
  border-radius: 3px;
  height: 30px;
  width: calc(100%);
  transition: 0.3s;

  > .file-editor-suffix {
    cursor: pointer;
    flex-shrink: 0;
    flex-grow: 0;
    display: inline-block;
    color: #bbb;
    font-size: 12px;
    vertical-align: top;
    line-height: 24px;
    padding: 0px 4px;
    border-radius: 4px;
    transition: 0.1s;
    margin: 2px;
    margin-right: 4px;

    &:hover {
      background-color: #eee;
      color: @primary-color;
    }
  }

  &:hover {
    border-color: fadeout(@primary-color, 20%);
    border-right-width: 1px !important;
  }

  &:focus-within {
    box-shadow: 0px 0px 0px 2px fadeout(@primary-color, 70%);
  }

  > input {
    width: 100%;
    border: none;
    vertical-align: top;
    line-height: 18px;
    padding-right: 2px;
    padding-left: 8px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 12px;
    border-radius: 3px;
    background-color: transparent;

    &::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #ccc;
    }
  }
}
</style>
