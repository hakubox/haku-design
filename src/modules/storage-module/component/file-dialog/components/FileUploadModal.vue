<template>
  <Modal title="上传新文件" class="upload-file-modal-container" @ok="onOk" :visible="props.visible" @cancel="onCancel">
    <Form :label-col="{ span: 5 }">
      <FormItem label="上传类型" v-bind="validateInfos.fileType">
        <RadioGroup v-model:value="fileType" :options="[{ label: '上传文件', value: UploadFileType.file }]" />
      </FormItem>
      <FormItem label="上传文件" v-bind="validateInfos.file">
        <Upload
          :multiple="false"
          :before-upload="beforeUpload"
          :accept="fileDialogState.uploadFileType"
          :fileList="file ? [file] : []"
        >
          <Button>
            <plus-outlined />
            上传文件
          </Button>
        </Upload>
      </FormItem>

      <FormItem label="自定义标签" v-bind="validateInfos.customTags">
        <Tag v-for="tag in customTags" :key="tag" :closable="true" @close="handleClose(tag)">
          {{ tag }}
        </Tag>
        <template v-if="customTags.length < 5">
          <Input
            v-if="inputVisible"
            ref="inputRef"
            v-model:value="inputValue"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
            :maxlength="5"
          />
          <Tag v-else style="background: #fff; border-style: dashed" @click="showInput">
            <plus-outlined />
            添加新标签
          </Tag>
        </template>
      </FormItem>

      <FormItem label="描述" v-bind="validateInfos.des">
        <Textarea v-model:value="des" show-count :maxlength="100"></Textarea>
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts" setup>
/**
 * 文件上传弹窗
 */
import { nextTick, reactive, Ref, ref, toRefs, watchEffect } from 'vue';
import {
  Modal,
  Form,
  FormItem,
  Textarea,
  Tag,
  RadioGroup,
  Upload,
  Input,
  Button,
  UploadFile,
  UploadProps,
} from 'ant-design-vue';
import { fileDialogState } from '../fileDialogController';

/** 提交的表单 */
export interface UploadFileForm {
  file: null | UploadFile;
  customTags: string[];
  des: string;
}

/** 上传文件类型 */
enum UploadFileType {
  file,
}

interface IEmit {
  (e: 'ok', form: UploadFileForm): void;
  (e: 'cancel'): void;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits<IEmit>();

const useCustomTagsControl = (customTags: Ref<string[]>) => {
  const inputRef = ref();
  const state = reactive({
    inputVisible: false,
    inputValue: '',
  });

  const handleClose = (removedTag: string) => {
    const tags = customTags.value.filter((tag) => tag !== removedTag);
    customTags.value = tags;
  };

  const showInput = () => {
    state.inputVisible = true;
    nextTick(() => {
      inputRef.value.focus();
    });
  };

  const handleInputConfirm = () => {
    const inputValue = state.inputValue;
    let tags = customTags.value;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    customTags.value = tags;
    Object.assign(state, {
      inputVisible: false,
      inputValue: '',
    });
  };
  return {
    ...toRefs(state),
    handleClose,
    showInput,
    handleInputConfirm,
    inputRef,
  };
};

const useUploadFileForm = () => {
  const useForm = Form.useForm;
  const modelRef = reactive({
    fileType: UploadFileType.file, // 文件类型
    file: null as UploadFile | null, // 文件数据
    customTags: [] as string[], // 自定义标签
    des: '', // 描述
  });

  const rulesRef = reactive({
    fileType: [
      {
        required: true,
        message: '请选择文件类型',
      },
    ],
    file: [
      {
        required: true,
        message: '请上传文件',
      },
    ],
  });
  const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    modelRef.file = file;
    return false;
  };
  return {
    ...toRefs(modelRef),
    resetFields,
    validateInfos,
    validate,
    beforeUpload,
  };
};

const { fileType, file, customTags, des, validateInfos, validate, beforeUpload, resetFields } = useUploadFileForm();

const { inputVisible, inputValue, handleClose, showInput, handleInputConfirm, inputRef } =
  useCustomTagsControl(customTags);

const onOk = async () => {
  await validate();
  emits('ok', {
    file: file.value,
    customTags: customTags.value,
    des: des.value,
  });
};

const onCancel = () => {
  emits('cancel');
  resetFields();
};

watchEffect(() => {
  if (props.visible) {
    resetFields();
  }
});
</script>
