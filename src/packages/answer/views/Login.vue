<template>
  <div class="login-page">
    <div class="login-page-form">
      <!-- Logo标题 -->
      <h1 class="login-page-form-title">表单答卷登录</h1>
      <!-- 登录表单 -->
      <Form @submit="login">
        <CellGroup inset>
          <Field
            v-model="state.loginForm.username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <Field
            v-model="state.loginForm.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </CellGroup>
        <div style="margin: 16px 16px;">
          <Button round block type="primary" native-type="submit">
            提交
          </Button>
        </div>
      </Form>
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
import { service as authService } from '@/common/auth-module';
import { Button, CellGroup, Field, Form, Toast } from 'vant';
import { onMounted } from 'vue';

const router = useRouter();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 登录表单 */
  loginForm: {
    username: '',
    password: '',
    rememberMe: false,
    code: ''
  },
});
const rules = {
  username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
  password: [{ required: true, message: '密码必填', trigger: 'blur' }],
};

/** 登录前校验 */
const capctchaCheckSuccess = (params: any) => {
  state.loginForm.code = params.captchaVerification;

  authService.login(state.loginForm).then(d => {
    Toast.success('登录成功');
    router.push('/');
  }).finally(() => {
    state.isLoading = false;
  });
};

onMounted(() => {
  
})

const verify = ref<typeof Verify>();

/** 登录 */
const login = () => {
  state.isLoading = true;
  verify.value?.['show']();
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
    margin-bottom: 40px;
  }

  .ant-row.ant-form-item {
    margin-bottom: 30px;
  }

  .login-page-form {
    position: fixed;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 90vmin;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
