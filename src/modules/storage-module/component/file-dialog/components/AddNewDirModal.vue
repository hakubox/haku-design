<template>
  <Modal title="上传新文件" @ok="onOk" :visible="props.visible" @cancel="onCancel">
    <Form :label-col="{ span: 5 }">
      <FormItem label="父级文件夹" v-bind="validateInfos.parentDirId">
        <Select v-model:value="parentDirId" style="width: 120px" :options="parentDirSelectOptions" />
      </FormItem>

      <FormItem label="文件夹名" v-bind="validateInfos.dirName">
        <Input v-model:value="dirName"></Input>
      </FormItem>

      <FormItem label="描述" v-bind="validateInfos.des">
        <Textarea v-model:value="des" show-count :maxlength="100"></Textarea>
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts" setup>
/**
 * 添加新文件夹弹窗
 */
import { computed } from 'vue';
import { Modal, Form, FormItem, Textarea, Select, Input } from 'ant-design-vue';
import type { TreeDataItem } from 'ant-design-vue/lib/tree';
import { PropType, reactive, toRefs, watch, watchEffect } from 'vue';

/** 提交的表单 */
export interface AddNewDirForm {
  dirName: string; // 文件夹名称
  parentDirId: string; // 父文件夹id
  des: string; // 描述
}

interface IEmit {
  (e: 'ok', form: AddNewDirForm): void;
  (e: 'cancel'): void;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true,
  },
  parentFolderId: {
    type: String,
    default: '0',
    required: true,
  },
  dirTree: {
    type: Array as PropType<TreeDataItem[]>,
    default: () => [],
    required: true,
  },
});
const emits = defineEmits<IEmit>();

const useUploadFileForm = () => {
  const useForm = Form.useForm;
  const modelRef = reactive({
    des: '', // 描述
    parentDirId: props.parentFolderId, // 父文件夹id
    dirName: '', // 文件夹名称
  });

  const rulesRef = reactive({
    dirName: [
      {
        required: true,
        message: '请输入文件夹名称',
      },
    ],
    parentDirId: [
      {
        required: true,
        message: '请选择父级文件夹',
      },
    ],
  });
  const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

  return {
    ...toRefs(modelRef),
    resetFields,
    validateInfos,
    validate,
  };
};

const { des, parentDirId, dirName, validateInfos, validate, resetFields } = useUploadFileForm();

/** 摊平dirTree到数组 */
const getDirList = (dirItem: TreeDataItem, dirListArr: TreeDataItem[]) => {
  dirListArr.push(dirItem);
  if (dirItem.children) {
    dirItem.children.forEach((item) => {
      getDirList(item, dirListArr);
    });
  }
};

/** 父级文件夹选择器选项 */
const parentDirSelectOptions = computed(() => {
  const res: TreeDataItem[] = [];
  props.dirTree.forEach((item) => getDirList(item, res));

  return res.map((item) => ({
    value: item.key,
    label: item.title,
  }));
});

const onOk = async () => {
  await validate();
  emits('ok', {
    parentDirId: parentDirId.value,
    dirName: dirName.value,
    des: des.value,
  });
};

const onCancel = () => {
  emits('cancel');
  resetFields();
};

watch(() => props.parentFolderId, () => {
  parentDirId.value = props.parentFolderId;
});

watchEffect(() => {
  if (props.visible) {
    resetFields();
  }
});
</script>
