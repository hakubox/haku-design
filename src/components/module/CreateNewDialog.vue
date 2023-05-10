<template>
  <div>
    <!-- 产品预览 -->
    <Modal
      :width="1000"
      :visible="visible"
      :footer="false"
      :centered="true"
      wrapClassName="create-new-dialog"
      :bodyStyle="{ padding: '0px', borderRadius: '8px' }"
      @cancel="onClose"
    >
      <template #title>
        <!-- <i class="iconfont icon-zidingyi" style="margin-right: 10px;font-size: 16px;" /> -->
        <FormOutlined style="margin-right: 10px" />
        {{ title }}
      </template>
      <div class="create-new-panel">
        <div class="create-new-panel-left">
          <div class="create-new-bg">
            <img class="create-new-bg-img" :alt="`${getTitle}类型`" :src="getBackgroundImage" />
            <!-- :style="{ objectPosition: getBackgroundPosition }" -->
            <div class="create-new-bg-info">
              <span class="create-new-bg-title">{{ getTitle }}</span>
              <span class="create-new-bg-description">{{ getDescription }}</span>
            </div>
          </div>
        </div>
        <div class="create-new-config">
          <Form
            :model="state.formState"
            autocomplete="off"
            layout="vertical"
            @finish="onSubmit"
            @finishFailed="onFinishFailed"
          >
            <FormItem
              v-if="state.isShowCreateType"
              label="应用类型"
              type="title"
              :rules="[{ required: true, message: '请选择创建应用类型' }]"
            >
              <div class="create-new-list">
                <div
                  class="create-new-item"
                  v-for="item in state.appTypeList"
                  :key="item.type"
                  @click="changeType(item)"
                  :class="{ active: item.type === state.formState.type }"
                >
                  <img class="create-new-item-img" :alt="`${item.title}类型`" :src="item.backgroundImage" />
                  <div class="create-new-item-info">
                    <h4 class="create-new-item-title">新建{{ item.title }}</h4>
                    <!-- <span class="create-new-item-description">{{ item.description }}</span> -->
                  </div>
                </div>
              </div>
            </FormItem>
            <FormItem label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
              <Input v-model:value="state.formState.title" />
            </FormItem>
            <FormItem :label="`${getTitle}描述`" name="title">
              <Textarea v-model:value="state.formState.description" />
            </FormItem>
            <FormItem v-if="state.formState.type === 'complex-component'" label="组件类型" :name="['params', 'ccc']" :rules="[{ required: true, message: '请输入评测类型' }]">
              <RadioGroup v-model:value="state.formState.params.ccc">
                <Radio value="a">标准组件</Radio>
                <Radio value="b">自定义组件</Radio>
              </RadioGroup>
            </FormItem>

            <FormItem class="form-item-btn">
              <Button block type="primary" size="large" html-type="submit">创建新{{ getTitle }}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, computed, PropType } from 'vue';
import { CreateNewConfig } from '@haku-design/core';
import { AppType } from '@haku-design/core/enum';
import { Button, Form, FormItem, Input, Modal, Radio, RadioGroup, Textarea } from 'ant-design-vue';
import { FormOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  /** 是否显示 */
  visible: {
    type: Boolean,
    default: false,
  },
  /** 资源创建类型 */
  createType: {
    type: String as PropType<AppType>,
  },
  /** 标题 */
  title: {
    type: String,
    default: '创建新应用'
  }
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
  (event: 'complete', val: typeof state.formState): void;
}>();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 是否显示创建类型 */
  isShowCreateType: true,
  /** 创建类型列表 */
  appTypeList: [
    {
      title: '问卷',
      type: 'questionnaire',
      description: '创建新的调查问卷',
      backgroundImage: new URL('@/assets/img/create-questionnaire.webp', import.meta.url).href,
    },
    {
      title: '画布',
      type: 'canvas',
      description: '创建新的空白画布',
      backgroundImage: new URL('@/assets/img/create-canvas.webp', import.meta.url).href,
    },
    // {
    //   title: '复合组件',
    //   type: 'complex-component',
    //   description: '创建新的可复用组件',
    //   backgroundImage: new URL('@/assets/img/create-component.webp', import.meta.url).href,
    // },
    // {
    //   title: '课件',
    //   type: 'courseware',
    //   description: '创建新的课件',
    //   backgroundImage: new URL('@/assets/img/create-courseware.webp', import.meta.url).href,
    // },
  ],
  /** 提交表单 */
  formState: {
    /** 标题 */
    title: '新建问卷',
    /** 类型 */
    type: 'questionnaire',
    /** 描述 */
    description: '',
    /** 其他参数 */
    params: {},
  } as CreateNewConfig,
});

const getTitle = computed(() => {
  return state.appTypeList.find((i) => i.type === state.formState.type)?.title;
});

const getBackgroundImage = computed(() => {
  return state.appTypeList.find((i) => i.type === state.formState.type)?.backgroundImage;
});

const getDescription = computed(() => {
  return state.appTypeList.find((i) => i.type === state.formState.type)?.description;
});

/** 关闭 */
const onClose = () => {
  emit('update:visible', false);
};
/** 提交 */
const onSubmit = () => {
  state.isLoading = true;
  emit('complete', state.formState);
  onClose();
};
/** 提交错误 */
const onFinishFailed = (e) => {
  console.log('提交错误', e);
};
/** 改变应用类型 */
const changeType = (typeObj) => {
  state.formState.type = typeObj.type;
};

watch(() => props.createType, (value, oldValue) => {
  if (value !== oldValue) {
    if (props.createType === undefined) {
      state.formState.type = AppType.questionnaire;
      state.isShowCreateType = true;
    } else {
      state.formState.type = props.createType;
      state.isShowCreateType = false;
    }
    state.formState = {
      title: `新建${state.appTypeList.find((i) => i.type === value)?.title || ''}`,
      type: value ?? AppType.questionnaire,
      description: '',
      params: {},
    };
  }
});

watch(() => state.formState.type, (value, oldValue) => {
  if (value !== oldValue) {
    state.formState = {
      title: `新建${state.appTypeList.find((i) => i.type === value)?.title || ''}`,
      type: value,
      description: '',
      params: {},
    };
  }
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';
.create-new-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 8px;
  height: 650px;

  .create-new-panel-left {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    width: 100%;

    > .create-new-bg {
      flex-grow: 1;
      position: relative;

      > .create-new-bg-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-bottom-left-radius: 10px;
      }

      > .create-new-bg-info {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0) 42%);
        padding: 30px;
        border-bottom-left-radius: 10px;

        > .create-new-bg-title {
          display: block;
          color: white;
          font-size: 32px;
          margin-bottom: 8px;
        }
        > .create-new-bg-description {
          display: block;
          color: white;
          font-size: 16px;
        }
      }
    }
  }

  .create-new-item-img {
    object-fit: cover;
    height: 100px;
  }

  .create-new-config {
    position: relative;
    width: 600px;
    flex-shrink: 0;
    flex-grow: 0;
    display: block;
    border: 1px solid #f0f0f0;
    border-radius: 10px;

    > .create-new-config-title {
      margin: 20px;
      font-weight: bold;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    > .ant-form {
      position: relative;
      display: flex;
      flex-direction: column;
      height: calc(100% - 20px);
      padding-top: 25px;
      padding-left: 25px;
      padding-right: 25px;

      > .form-item-btn {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex-grow: 1;
        margin-bottom: 0px;

        > :deep(.ant-form-item-control) {
          flex-grow: 0;
        }
      }
    }
  }
}

.create-new-list {
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: -15px;

  > .create-new-item {
    flex-shrink: 0;
    cursor: pointer;
    position: relative;
    height: 58px;
    width: calc(33.333% - 10px);
    margin-bottom: 3px;
    border-radius: 6px;
    margin-bottom: 15px;
    margin-right: 15px;

    &:nth-child(3n) {
      margin-right: 0px;
    }

    &:before {
      content: '';
      position: absolute;
      bottom: 0px;
      right: 0;
      border-top: 12px solid transparent;
      border-left: 12px solid transparent;
      border-right: 12px solid @primary-color;
      border-bottom: 12px solid @primary-color;
      border-bottom-right-radius: 6px;
      opacity: 0;
      transition: 0.1s;
      z-index: 1;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 6px;
      transition: 0.1s;
    }

    &.active {
      &:before {
        opacity: 1;
      }

      &:after {
        background-color: rgba(0, 0, 0, 0.7);
      }

      > .create-new-item-info {
        > .create-new-item-title {
          color: #eee;
        }
        > .create-new-item-description {
          color: #eee;
        }
      }
    }

    > .create-new-item-img {
      position: absolute;
      object-fit: cover;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: 0;
      border-radius: 6px;
    }

    > .create-new-item-info {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      padding: 15px;
      z-index: 1;

      > .create-new-item-title {
        display: block;
        text-align: center;
        color: white;
        font-size: 18px;
        letter-spacing: 1px;
      }

      > .create-new-item-description {
        color: white;
        font-size: 14px;
      }
    }
  }
}
</style>
