<template>
  <!-- 登录界面 -->
  <Modal
    title="登录系统"
    :width="500"
    :visible="visible"
    :force-render="true"
    :closable="false"
    :centered="true"
    @cancel="onClose"
    @ok="onSubmit"
  >
    <Spin tip="加载中..." :spinning="state.isLoading">
      <Form ref="formRef" :model="state.form" :rules="state.rules">
        <FormItem name="username" :rules="state.rules.username">
          <template #label><UserOutlined />&nbsp;账号</template>
          <Input v-model:value="state.form.username" />
        </FormItem>
        <FormItem name="password" :rules="state.rules.password">
          <template #label><LockOutlined />&nbsp;密码</template>
          <InputPassword v-model:value="state.form.password" />
        </FormItem>
      </Form>
    </Spin>
  </Modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { service as authService } from '@/common/auth-module';
import { Form, FormItem, Input, InputPassword, Modal, Spin, message } from 'ant-design-vue';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  /** 是否显示 */
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
  (event: 'submit', val: any): void;
}>();

const formRef = ref();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 表单 */
  form: {
    username: '',
    password: '',
    code: '',
  },
  /** 表单规则 */
  rules: {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
  },
});

/** 清空数据 */
const clear = () => {
  state.form = {
    username: '',
    password: '',
    code: '',
  };
};

/** 登录 */
const onSubmit = () => {
  state.isLoading = true;
  formRef.value.validate().then(() => {
    authService.login(state.form).then((d) => {
      message.success('登录成功');
      emit('update:visible', false);
      emit('submit', d);
    }).finally(() => {
      state.isLoading = false;
    });
  }).catch((error: any) => {
    state.isLoading = false;
    console.error('error', error);
  });
};

/** 显示弹出框 */
const showDialog = () => {
  emit('update:visible', true);
};
/** 关闭登录框 */
const onClose = () => {
  // this.clear();
  // this.$emit('update:visible', false);
};
</script>

<style lang="less" scoped></style>
