<template>
  <div class="history-log-panel">
    <div class="history-log-header">
      <span class="history-log-title">操作历史记录</span>
    </div>
    <a-empty
      v-if="historyState.historyData.length == 0"
      description="暂无历史记录"
      :style="{ marginTop: '20vh' }"
    ></a-empty>
    <ul class="history-log-list" v-else>
      <li
        class="history-log-item"
        :class="{
          active: index == historyState.historyIndex,
          noupdatable: !isUpdatable(item.type),
        }"
        v-for="(item, index) in historyState.historyData"
        :key="index"
      >
        <i class="history-log-item-icon" :class="historyService.getCommandIcon(item.type)" alt="" />
        <div class="history-log-item-content">
          <template v-for="(label, index) in historyService.getFormatTitle(item)">
            <span :key="'a' + index" v-if="label == '{{component}}'">{{ item.newVal.title }}</span>
            <span :key="'b' + index" v-else-if="label.startsWith('{{') && label.endsWith('}}')">{{
              item.attrs[label.substring(2, label.length - 2)]
            }}</span>
            <span :key="'c' + index" v-else>{{ label }}</span>
          </template>
        </div>
        <span class="history-log-item-active">
          <a-tooltip placement="right">
            <template #title><span>当前节点</span></template>
            <i class="iconfont icon-position"></i>
          </a-tooltip>
        </span>
        <span class="history-log-item-noupdatable">
          <a-tooltip placement="right">
            <template #title><span>无法回退</span></template>
            <i class="iconfont icon-box3"></i>
          </a-tooltip>
        </span>
        <span class="history-log-item-time">{{ getTimeStr(item.executeTime) }}</span>
        <div class="history-log-item-tools">
          <div class="history-log-item-tool danger" @click="undo(index)" v-show="index < historyState.historyIndex">
            <i class="iconfont icon-undo" />
            <span>撤回</span>
          </div>
          <div class="history-log-item-tool warning" @click="redo(index)" v-show="index > historyState.historyIndex">
            <i class="iconfont icon-redo" />
            <span>恢复</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as historyState, service as historyService } from '@/common/history-module';
import { dateFormat } from '@/tools/common';
import { formCommands } from '@/data/form-commands';

export default defineComponent({
  name: 'HistoryLog',
  components: {},
  methods: {
    /** 撤销 */
    undo(index: number) {
      this.historyService.undoByIndex(index);
    },
    /** 恢复 */
    redo(index: number) {
      this.historyService.redoByIndex(index);
    },
    /** 是否可更新 */
    isUpdatable(commandType: string): boolean {
      return formCommands[commandType].updatable;
    },
  },
  setup(props) {
    const state = reactive({});

    const getTimeStr = (time: number) => {
      return dateFormat(new Date(time), 'HH:mm');
    };

    return {
      ...toRefs(state),
      historyState,
      historyService,
      getTimeStr,
    };
  },
});
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

.history-log-panel {
  display: flex;
  flex-direction: column;

  > .history-log-header {
    > .history-log-title {
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      color: #666;
      padding: 12px 0px 10px 10px;
    }
  }

  > .history-log-list {
    > .history-log-item {
      cursor: default;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 5px 10px;
      transition: 0.1s;

      &.active {
        background-color: #f1f1f5;

        > .history-log-item-icon {
          color: #4d8ce4;
        }

        > .history-log-item-content {
          color: #2c3e50;
        }

        > .history-log-item-active {
          display: inline-block;
        }
      }

      &:hover {
        background-color: #d6e4f1;

        > .history-log-item-tools {
          display: block;
        }

        &:not(.active) {
          > .history-log-item-time {
            display: none;
          }

          > .history-log-item-active {
            display: none;
          }
        }
      }

      &.noupdatable {
        &:hover {
          > .history-log-item-noupdatable {
            display: inline-block;
          }

          > .history-log-item-tools {
            display: none;
          }

          > .history-log-item-time {
            display: inline-block;
          }
        }

        > .history-log-item-noupdatable {
          display: inline-block;
        }
      }

      > .history-log-item-icon {
        flex-grow: 0;
        margin-right: 5px;
        font-size: 16px;
        color: #4d8ce4;
      }

      > .history-log-item-content {
        flex-grow: 1;
        font-size: 14px;
        color: #2c3e50;
      }

      > .history-log-item-time {
        display: inline-block;
        font-size: 12px;
        height: 16px;
        color: #919fc7;
      }

      > .history-log-item-active {
        display: none;
        font-size: 10px;
        color: @primary-color;
        padding: 0px 4px;
        margin-right: 4px;
        height: 16px;
        line-height: 16px;
      }

      > .history-log-item-noupdatable {
        display: none;
        font-size: 10px;
        color: #e6a23c;
        padding: 0px 4px;
        margin-right: 4px;
        height: 16px;
        line-height: 16px;
      }

      > .history-log-item-tools {
        display: none;

        > .history-log-item-tool {
          cursor: pointer;
          user-select: none;
          display: inline-block;
          background-color: #909399;
          color: white;
          padding: 1px 8px;
          font-size: 12px;
          border-radius: 4px;
          transition: 0.2s;

          &.warning {
            background-color: #e6a23c;
          }

          &.danger {
            background-color: #f56c6c;
          }

          &:hover {
            &.warning {
              background-color: #e7b66b;
            }

            &.danger {
              background-color: #ee8d8d;
            }
          }

          > .iconfont {
            font-size: 14px;
            padding-right: 4px;
          }
        }
      }
    }
  }
}
</style>
