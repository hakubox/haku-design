<template>
  <!-- 登录界面 -->
  <a-modal
    title="登录系统"
    :width="500"
    :visible="visible"
    :force-render="true"
    :closable="false"
    :centered="true"
    @cancel="onClose"
    @ok="onSubmit"
  >
    <a-spin tip="加载中..." :spinning="isLoading">
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item name="username" :rules="rules.username">
          <template #label><user-outlined />&nbsp;账号</template>
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item name="password" :rules="rules.password">
          <template #label><lock-outlined />&nbsp;密码</template>
          <a-input-password v-model:value="form.password" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, watch, PropType } from 'vue';
import { service as authService } from '@/common/auth-module';
import { message } from 'ant-design-vue';

export default defineComponent({
  components: {},
  props: {
    /** 是否显示 */
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
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
      formRef.value
        .validate()
        .then(() => {
          authService
            .login(state.form)
            .then((d) => {
              message.success('登录成功');
              emit('update:visible', false);
              emit('submit', d);
            })
            .finally(() => {
              state.isLoading = false;
            });
        })
        .catch((error: any) => {
          state.isLoading = false;
          console.error('error', error);
        });
    };

    watch(
      () => props.visible,
      (count) => {
        if (count) {
        }
      },
    );

    return {
      ...toRefs(state),
      formRef,
      clear,
      onSubmit,
    };
  },
  methods: {
    /** 显示弹出框 */
    showDialog() {
      this.$emit('update:visible', true);
    },
    /** 关闭登录框 */
    onClose() {
      // this.clear();
      // this.$emit('update:visible', false);
    },
  },
});
</script>

<style lang="less" scoped></style>
