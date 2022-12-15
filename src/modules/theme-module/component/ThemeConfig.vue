<template>
  <GeneralEditor
    v-model:model="themeState.themeConfig"
    :groups="state.groups"
    :propertys="themePropertys"
    :labelWidth="props.labelWidth"
    @change="onChange"
  ></GeneralEditor>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { state as themeState, service as themeService } from '../index';
import GeneralEditor from '@/components/module/config-panel/general-config/GeneralEditor.vue';
import { themePropertys } from '../data/theme-propertys';

const props = defineProps({
  /** 标签宽度 */
  labelWidth: {
    type: String,
    default: '110px'
  }
});

const state = reactive({
  groups: [
    { title: '基本样式', name: 'primary', icon: '' },
    { title: '标题样式', name: 'title', icon: '' },
    { title: '描述样式', name: 'description', icon: '' },
    { title: '背景样式', name: 'background', icon: '' },
    { title: '内容样式', name: 'content', icon: '' },
  ],
});

const onChange = (value, prop, props, model) => {
  if (prop.attrs?.cssVariable) {
    themeService.setVariable(prop.attrs?.cssVariable, value);
  }
  if (prop.name === 'css') {
    themeService.loadCSS(value);
  }
};
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

.theme-config {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > .theme-config-list {
    overflow-y: auto;
  }

  > .theme-config-create {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
  }
}

.theme-item {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  padding: 5px 0px 0px 0px;
  margin: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  > .theme-item-header {
    position: relative;
    padding: 0px 10px;

    > .iconfont {
      float: left;
      display: block;
      color: @primary-color;
      margin-left: 5px;
      margin-right: 15px;
      font-size: 32px;
    }

    > .theme-item-title {
      display: inline-block;
      font-size: 14px;
      margin-top: 10px;
      line-height: 20px;
      font-weight: bold;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.blank-remark {
        line-height: 34px;
        margin-bottom: 4px;
        margin-top: 8px;
      }
    }

    > .theme-item-tools {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }

  > .theme-item-remark {
    display: block;
    font-size: 11px;
    padding-bottom: 3px;
    margin: 3px 10px 10px 10px;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
  }

  > .theme-item-info {
    padding: 0px 10px;
    margin-top: 5px;

    > .theme-item-info-detail {
      display: inline-block;
      width: 50%;
      margin-bottom: 5px;

      &.detail-full {
        width: 100%;
      }

      > dt {
        font-size: 11px;
        color: #888;
      }

      > dd {
        display: block;
        font-size: 13px;
        color: #2f2e3f;
        font-weight: bold;
        margin-top: 2px;
        margin-bottom: 0px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  > .theme-item-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
    height: 40px;

    > .theme-item-btn {
      position: relative;
      width: 100%;
      display: flex;
      flex-grow: 1;
      justify-content: center;
      align-items: center;

      &:hover {
        > .iconfont {
          color: @primary-color;
        }
      }

      &:before {
        content: '';
        position: absolute;
        display: none;
        top: 10px;
        left: 0px;
        bottom: 10px;
        width: 1px;
        background-color: #f0f0f0;
      }

      > .iconfont {
        color: #898989;
        font-size: 16px;
        transition: 0.15s;
      }

      + .theme-item-btn {
        margin-left: 10px;

        &:before {
          display: block;
        }
      }
    }
  }
}
</style>
