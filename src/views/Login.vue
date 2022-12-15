<template>
  <div class="login-page">
    <div class="login-page-form">
      <!-- Logo标题 -->
      <h1 class="login-page-form-title">表单设计器登录</h1>
      <!-- 登录表单 -->
      <a-form ref="formRef" :model="state.loginForm" :rules="rules" :label-col="{ span: 4 }">
        <a-form-item name="username">
          <a-input v-model:value.trim="state.loginForm.username" size="large" placeholder="用户名">
            <template #prefix>
              <UserOutlined :style="{ fontSize: '16px', color: '#333333', paddingRight: '4px' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input
            v-model:value.trim="state.loginForm.password"
            size="large"
            type="password"
            placeholder="密码"
            @keyup.enter="login"
          >
            <template #prefix>
              <LockOutlined :style="{ fontSize: '16px', color: '#333333', paddingRight: '4px' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24 }">
          <a-row :gutter="24">
            <a-col :offset="0" :span="24">
              <a-form-item label="" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" :colon="false">
                <a-button
                  :loading="state.isLoading"
                  style="width: 100%"
                  block
                  size="large"
                  type="primary"
                  @click="login"
                >
                  登录
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>

    <Verify
      ref="verify"
      :mode="'pop'"
      :captcha-type="'blockPuzzle'"
      :img-size="{ width: '330px', height: '155px' }"
      @success="capctchaCheckSuccess"
    ></Verify>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import Verify from '@/components/common/verifition/Verify.vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { service as authService } from '@/common/auth-module';
import { toast } from '@/common/message';

const router = useRouter();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 登录表单 */
  loginForm: {
    username: '',
    password: '',
    rememberMe: false,
    code: '',
  },
});
const rules = {
  username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
  password: [{ required: true, message: '密码必填', trigger: 'blur' }],
};
const formRef = ref();

/** 登录前校验 */
const capctchaCheckSuccess = (params: any) => {
  state.loginForm.code = params.captchaVerification;

  authService.login(state.loginForm).then((d) => {
    toast('登录成功', 'success');
    router.push('/design');
  }).finally(() => {
    state.isLoading = false;
  });
};

const verify = ref<typeof Verify>();

/** 登录 */
const login = () => {
  state.isLoading = true;
  formRef.value.validate().then(() => {
    verify.value!.show();
  }).catch((error: any) => {
    console.error('error', error);
    // if (error.errorFields?.length) {
    //   message.error(error.errorFields[0].errors[0]);
    // }
  }).finally(() => {
    state.isLoading = false;
  });
};
</script>

<style lang="less">
.login-page {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: white;
  background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;

  .ant-col-offset-2.ant-form-item-control-wrapper {
    margin-top: 10px;
  }

  .login-page-form-title {
    font-size: 24px;
    display: block;
    text-align: center;
    margin-bottom: 60px;
  }

  .ant-row.ant-form-item {
    margin-bottom: 30px;
  }

  .login-page-form {
    position: fixed;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    max-width: 80%;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
