<template>
  <div class="login-page">
    <div class="login-page-form">
      <!-- Logo标题 -->
      <h1 class="login-page-form-title">表单设计器登录</h1>
      <!-- 登录表单 -->
      <Form ref="formRef" :model="state.loginForm" :rules="rules" :label-col="{ span: 4 }">
        <FormItem name="username">
          <Input v-model:value.trim="state.loginForm.username" size="large" placeholder="用户名">
            <template #prefix>
              <UserOutlined :style="{ fontSize: '16px', color: '#333333', paddingRight: '4px' }" />
            </template>
          </Input>
        </FormItem>
        <FormItem name="password">
          <Input
            v-model:value.trim="state.loginForm.password"
            size="large"
            type="password"
            placeholder="密码"
            @keyup.enter="login"
          >
            <template #prefix>
              <LockOutlined :style="{ fontSize: '16px', color: '#333333', paddingRight: '4px' }" />
            </template>
          </Input>
        </FormItem>
        <FormItem :wrapper-col="{ span: 24 }">
          <Row :gutter="24">
            <Col :offset="0" :span="24">
              <FormItem label="" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" :colon="false">
                <Button
                  :loading="state.isLoading"
                  style="width: 100%"
                  block
                  size="large"
                  type="primary"
                  @click="login"
                >
                  登录
                </Button>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>

    <Verify
      ref="verifyRef"
      mode="pop"
      captcha-type="blockPuzzle"
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
import { toast } from '@/common/message';
import { Button, Col, Form, Input, Row, FormItem } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { RuleObject } from 'ant-design-vue/lib/form';

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
const rules: { [k: string]: RuleObject[] } = {
  username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
  password: [{ required: true, message: '密码必填', trigger: 'blur' }],
};
const formRef = ref<typeof Form>();
const verifyRef = ref<typeof Verify>();

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

/** 登录 */
const login = () => {
  state.isLoading = true;
  formRef.value!.validate().then(() => {
    verifyRef.value!.show();
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
