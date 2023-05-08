<template>
  <Empty
    v-if="!versionHistoryState.versionHistoryList.length"
    description="暂无数据"
    :style="{ marginTop: '20vh' }"
  ></Empty>
  <ul v-else class="history-version-list">
    <li class="history-version-item" :class="{'history-version-item-active': isNewVersion(item.appVersion)}" v-for="(item, index) in versionHistoryState.versionHistoryList" :key="index">
      <div class="history-version-item-header">
        <i class="iconfont icon-box3"></i>
        <span class="history-version-item-title" :class="{ 'blank-remark': !item.remark }"> v{{ item.appVersion }} </span>
        <div class="history-version-item-tools">
          <Tag v-if="isNewVersion(item.appVersion)" color="#CF1322">当前版本</Tag>
        </div>
      </div>
      <span class="history-version-item-remark">
        {{ item.remark }}
      </span>
      <span class="" v-show="!item.remark"></span>
      <div class="history-version-item-info">
        <dl class="history-version-item-info-detail">
          <dt>创建日期</dt>
          <dd>{{ dateFormat(new Date(item.updateTime), 'yyyy-MM-dd HH:mm') }}</dd>
        </dl>
      </div>
      <div class="history-version-item-info">
        <dl class="history-version-item-info-detail">
          <dt>升级描述</dt>
          <dd>{{ item.description }}</dd>
        </dl>
      </div>
      <div class="history-version-item-btns">
        <Tooltip placement="top">
          <template #title>
            <span>预览版本</span>
          </template>
          <div class="history-version-item-btn" @click="previewVersion(item)">
            <i class="iconfont icon-icon_yulan"></i>
          </div>
        </Tooltip>
        <Tooltip placement="top" v-if="!isNewVersion(item.appVersion)">
          <template #title>
            <span>回滚到当前版本</span>
          </template>
          <div class="history-version-item-btn" @click="undoVersion(item)">
            <i class="iconfont icon-undo"></i>
          </div>
        </Tooltip>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { createVNode, onMounted, reactive } from 'vue';
import { state as editorState, service as editorService } from '@haku-design/editor';
import { state as versionHistoryState, service as versionHistoryService } from '@/modules/version-history-module';
import { VersionHistoryInstance } from '@/modules/version-history-module/@types';
import { dateFormat } from '@/tools/common';
import { Empty, Modal, Tag, Tooltip } from 'ant-design-vue';

/** 预览版本 */
const previewVersion = (item: VersionHistoryInstance) => {};
/** 回滚到当前版本 */
const undoVersion = (item: VersionHistoryInstance) => {
  Modal.confirm({
      title: '是否要切换版本？',
      content: createVNode('div', { style: 'color:red;' }, '切换版本将会切换问卷信息，是否继续操作？'),
      onOk() {
        versionHistoryService.setQuestionaryVersion(editorState.appConfig.id, item.appVersion);
      },
      onCancel() {},
    });
};
/** 是否为最新版本 */
const isNewVersion = (version: string) => {
  return editorState.appConfig.appVersion === version;
};
/** 查询项图标 */
const getComponentIcon = (componentName: string): string => {
  const component = editorState.menuComponents.find((i) => i.name == componentName);
  return component ? component.icon : '';
};

onMounted(() => {
  if (editorState.appConfig.id) {
    versionHistoryService.getQuestionaryVersionList(editorState.appConfig.id);
  }
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

// 左侧已配置题目列表
.history-version {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > .history-version-list {
    overflow-y: auto;
  }

  > .history-version-create {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
  }
}

.history-version-item {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  padding: 5px 0px 0px 0px;
  margin: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  &.history-version-item-active {
    border-color: #bbc6d5;
  }

  > .history-version-item-header {
    position: relative;
    padding: 0px 10px;

    > .iconfont {
      float: left;
      display: block;
      color: @primary-color;
      margin-left: 5px;
      margin-right: 10px;
      line-height: 26px;
      font-size: 16px;
    }

    > .history-version-item-title {
      display: inline-block;
      font-size: 14px;
      margin-top: 0px;
      margin-bottom: 0px;
      line-height: 16px;
      font-weight: bold;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.blank-remark {
        line-height: 26px;
        margin-top: 0px;
        margin-bottom: 0px;
      }
    }

    > .history-version-item-tools {
      position: absolute;
      top: 5px;
      right: 10px;

      > :deep(.ant-tag) {
        margin-left: 2px;
        font-weight: normal;
        font-size: 12px;
        border: none;
        transform: scale(0.85);
        float: right;
        margin-right: 0px;
      }
    }
  }

  > .history-version-item-remark {
    display: block;
    font-size: 11px;
    padding-bottom: 3px;
    margin: 3px 10px 10px 10px;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
  }

  > .history-version-item-info {
    padding: 0px 10px;
    margin-top: 5px;

    > .history-version-item-info-detail {
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

  > .history-version-item-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
    height: 40px;

    > .history-version-item-btn {
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

      + .history-version-item-btn {
        margin-left: 10px;

        &:before {
          display: block;
        }
      }
    }
  }
}
</style>
