<template>
  <Empty v-if="!pluginState.plugins.length" description="暂未安装插件" :style="{ marginTop: '20vh' }">
    <Dropdown :trigger="['click']">
      <Button type="primary" style="margin-top: 10px">
        <template #icon><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }" /></template>
        添加新插件
      </Button>
      <template #overlay>
        <Menu>
          <MenuItem v-for="item in state.registerChannel" :key="item.type" @click="registerNewPlugin(item.type)">
            {{ item.title }}
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </Empty>
  <div v-else class="plugin-config">
    <!-- 当前已安装插件列表 -->
    <ul class="plugin-list">
      <li class="plugin-item" v-for="(plugin, index) in pluginState.plugins" :key="plugin.id">
        <div class="plugin-item-header">
          <i :class="plugin.icon ?? pluginState.typeCategorys[plugin.pluginType].icon"></i>
          <span class="plugin-item-title" :class="{ 'blank-remark': !plugin.description }">
            {{ plugin.title }}
          </span>
          <div class="plugin-item-tools">
            <Popconfirm
              :title="`是否确认移除“${plugin.title}”插件？`"
              ok-text="确认"
              cancel-text="取消"
              @confirm="pluginService.removePlugin(plugin)"
            >
              <Button size="small" type="text" danger>
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Popconfirm>
          </div>
        </div>
        <span class="plugin-item-remark">
          {{ plugin.description }}
        </span>
        <div class="plugin-item-info">
          <dl class="plugin-item-info-detail">
            <dt>状态</dt>
            <dd style="padding-left: 5px">
              <Badge color="green" :status="plugin.isEnable ? 'processing' : 'default'" :text="plugin.isEnable ? '已启用' : '未启用'" />
            </dd>
          </dl>
          <dl class="plugin-item-info-detail">
            <dt>版本号</dt>
            <dd>{{ plugin.version }}</dd>
          </dl>
          <dl class="plugin-item-info-detail">
            <dt>类型</dt>
            <dd>本地插件</dd>
          </dl>
          <dl class="plugin-item-info-detail" v-if="plugin.author">
            <dt>作者</dt>
            <dd>{{ plugin.author }}</dd>
          </dl>
          <dl class="plugin-item-info-detail" v-if="plugin.homepage">
            <dt>地址</dt>
            <dd>{{ plugin.homepage }}</dd>
          </dl>
        </div>
      </li>
    </ul>
    <div class="plugin-config-create">
      <Dropdown :trigger="['click']">
        <Button type="primary">
          <template #icon
            ><PlusOutlined :style="{ fontSize: '16px', lineHeight: '14px', verticalAlign: 'middle' }"
          /></template>
          添加新插件
        </Button>
        <template #overlay>
          <Menu>
            <MenuItem
              v-for="item in state.registerChannel"
              :key="item.type"
              @click="registerNewPlugin(item.type)"
            >
              {{ item.title }}
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { Empty, Dropdown, Popconfirm, Button, Menu, MenuItem, Badge } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { state as pluginState, service as pluginService } from '..';

const state = reactive({
  /** 注册渠道 */
  registerChannel: [
    { title: '注册本地插件', type: 'local-register' },
    { title: '注册远程插件', type: 'remote-register' },
    { title: '查看插件市场', type: 'plugin-market' },
  ]
});

/** 注册新插件 */
const registerNewPlugin = (type: string) => {

}
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.plugin-config {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > .plugin-list {
    overflow-y: auto;
  }

  > .plugin-config-create {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 8px;
  }
}

:deep(.ant-table-cell-with-append) {

  .ant-input {
    width: 120px;
  }
}

.plugin-item {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  padding: 5px 0px 0px 0px;
  margin: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  > .plugin-item-header {
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

    > .plugin-item-title {
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

    > .plugin-item-tools {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }

  > .plugin-item-remark {
    display: block;
    font-size: 11px;
    padding-bottom: 10px;
    margin: 3px 10px 10px 10px;
    color: #888;
    border-bottom: 1px solid #f0f0f0;
  }

  > .plugin-item-info {
    padding: 0px 10px;
    margin-top: 5px;

    > .plugin-item-info-detail {
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

  > .plugin-item-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
    height: 40px;

    > .plugin-item-btn {
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

      + .plugin-item-btn {
        margin-left: 10px;

        &:before {
          display: block;
        }
      }
    }
  }
}
</style>