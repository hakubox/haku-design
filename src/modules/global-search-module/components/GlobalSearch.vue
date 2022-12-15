<template>
  <div class="global-search-modal"
    :class="{
      show: globalSearchState.isOpen && state.isShowing,
      leave: state.isLeaving
    }"
    @mousedown.self.stop="close"
  >
    <div
      class="global-search-body"
      :style="{
        maxHeight: globalSearchState.searchTxt?.length ? 'calc(100vh - 120px)' : '300px',
        minHeight: globalSearchState.searchTxt?.length && (globalSearchState.isLoading || !globalSearchState.searchGroupList.length) ? '300px' : '0px'
      }"
    >
      <div class="global-search-input">
        <i class="iconfont"
          :class="globalSearchState.isLoading ? 'icon-loading-2 icon-rotate' : 'icon-search'"
        ></i>
        <input
          autofocus
          ref="searchInput"
          type="text"
          @input="change"
          v-model="globalSearchState.searchTxt"
          placeholder="请输入关键词搜索"
          tabindex="1"
        />
        <div class="global-search-cancel" @click="close">取消搜索</div>
      </div>
      <div class="global-search-loading"
        :class="{
          show: globalSearchState.searchTxt?.length && globalSearchState.isLoading
        }"
      >
        <i class="global-search-loading-icon iconfont icon-loading-2 icon-rotate"></i>
        <div class="global-search-loading-title">数据加载中...</div>
      </div>
      <div class="global-search-empty"
        :class="{
          show: globalSearchState.searchTxt?.length && !globalSearchState.isLoading && !globalSearchState.resultList.length
        }"
      >
        <Empty v-if="globalSearchState.searchTxt?.length && !globalSearchState.isLoading && !globalSearchState.resultList.length">
          <template #description>
            <div style="color: #333;margin-top: 15px;">通过 <span style="font-weight: bold;">“{{ globalSearchState.searchTxt }}“</span> 没有查找到结果。</div>
          </template>
        </Empty>
      </div>
      <div class="global-search-content">
        <!-- 查询列表 -->
        <ul class="global-search-result-group-list" :class="{
          show: globalSearchState.searchTxt?.length && !globalSearchState.isLoading && globalSearchState.resultList.length
        }">
          <li
            class="global-search-result-group-item"
            v-for="(group, groupIndex) in globalSearchState.searchGroupList"
            :key="group.name"
          >
            <div class="global-search-result-group-label">{{ group.title }}</div>
            <ul class="global-search-result-list">
              <li
                class="global-search-result-item"
                :class="{ 'result-current': state.currentIndex === `${groupIndex}_${index}` }"
                v-for="(item, index) in globalSearchState.resultList.filter(item => item.group === group.name)"
                @click="selectItem(item)"
                @mouseenter="setCurrentIndex(groupIndex, index, item)"
                :key="item.id"
              >
                <i :class="group.icon"></i>
                <div class="global-search-result-item-body">
                  <div class="global-search-result-item-title">
                    <template v-for="(fragment, i) in txtSplit(item.title)">
                      <span v-if="fragment.toLowerCase() === globalSearchState.searchTxt.toLowerCase()" :key="i+'1'" style="color: #2857ff">
                        {{ fragment }}
                      </span>
                      <span v-else :key="i+'2'" style="color: #36395a;">{{ fragment }}</span>
                    </template>
                  </div>
                  <ul class="global-search-result-item-crumbs" v-if="item.crumbs?.length">
                    <li
                      v-for="(crumb, crumbIndex) in item.crumbs"
                      :key="crumbIndex"
                      :title="crumb.tooltip"
                      :class="{ disabled: !crumb.goto }"
                      @click="clickCrumb(crumb)"
                    >
                      <template v-for="(fragment, i) in txtSplit(crumb.label)">
                        <span v-if="fragment.toLowerCase() === globalSearchState.searchTxt.toLowerCase()" :key="i+'1'" style="color: #2857ff">
                          {{ fragment }}
                        </span>
                        <span v-else :key="i+'2'">{{ fragment }}</span>
                      </template>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <!-- 查询详情 -->
        <div class="global-search-result-detail" :class="{
          hidden: !currentGroup || !state.currentItem || !globalSearchState.searchTxt?.length || !globalSearchState.resultList.length
        }">
          <!-- 详情页图标 -->
          <i class="global-search-result-detail-icon" :class="currentGroup?.icon"></i>
          <!-- 详情页面包屑 -->
          <ul class="global-search-result-detail-crumbs" v-if="state.currentItem?.crumbs?.length">
            <li
              v-for="(crumb, crumbIndex) in state.currentItem?.crumbs"
              :key="crumbIndex"
              :title="crumb.tooltip"
              :class="{ disabled: !crumb.goto }"
              @click="clickCrumb(crumb)"
            >
              <template v-for="(fragment, i) in txtSplit(crumb.label)">
                <span v-if="fragment.toLowerCase() === globalSearchState.searchTxt.toLowerCase()" :key="i+'1'" style="color: #2857ff">
                  {{ fragment }}
                </span>
                <span v-else :key="i+'2'">{{ fragment }}</span>
              </template>
            </li>
          </ul>
          <!-- 详情页标题 -->
          <div class="global-search-result-detail-title">
            <template v-for="(fragment, i) in txtSplit(state.currentItem?.title)">
              <span v-if="fragment.toLowerCase() === globalSearchState.searchTxt.toLowerCase()" :key="i+'1'" style="color: #2857ff">
                {{ fragment }}
              </span>
              <span v-else :key="i+'2'" style="color: #36395a;">{{ fragment }}</span>
            </template>
          </div>
          <!-- 详情页内容 -->
          <div class="global-search-result-detail-description" v-show="state.currentItem?.description">
            <template v-for="(fragment, i) in txtSplit(state.currentItem?.description)">
              <span v-if="fragment.toLowerCase() === globalSearchState.searchTxt.toLowerCase()" :key="i+'1'" style="color: #2857ff">
                {{ fragment }}
              </span>
              <span v-else :key="i+'2'" style="color: #36395a;">{{ fragment }}</span>
            </template>
          </div>
          <!-- 相关内容 -->
          <div class="global-search-result-detail-related" v-show="state.currentItem?.related">
            <span>相关内容</span>
            <ul>
              <li v-for="(related, index) in state.currentItem?.related" :key="index" @click="related?.goto?.()">
                <span style="padding-right: 6px;">{{(index + 1) + '. '}}</span>{{ related.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="global-search-footer"
        :class="{
          show: globalSearchState.searchTxt?.length && !globalSearchState.isLoading && globalSearchState.searchGroupList.length
        }"
      >
        <ul class="global-search-keymap">
          <li>
            <i class="iconfont icon-enter"></i>
            <span>选择项</span>
          </li>
          <li>
            <i class="iconfont icon-arrow-down-2"></i>
            <i class="iconfont icon-arrow-up-2"></i>
            <span>上下移动</span>
          </li>
          <li>
            <i><span>esc</span></i>
            <span>关闭</span>
          </li>
        </ul>
        <span class="global-search-footer-tooltip">
          一共查询到 {{ globalSearchState.searchGroupList.length }} 项
        </span>
      </div>
      
    </div>
    <!-- 最后记得在右下角加一个小问号 -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { GlobalSearchGroupInstance, GlobalSearchItem, GlobalSearchItemCrumb } from '../@types';
import { state as globalSearchState, service as globalSearchService } from '../';
import { service as hotkeyService } from '@/modules/hotkey-module';
import { throttle } from '@/tools/common';
import { Empty, message } from 'ant-design-vue';
import { computed } from '@vue/reactivity';

/** 全局搜索状态管理 */
interface GlobalSearchState {
  /** 查询历史 */
  searchHistory: string[];
  /** 收藏列表 */
  collectList: GlobalSearchItem[];
  /** 正在开启中 */
  isShowing: boolean;
  /** 正在关闭中 */
  isLeaving: boolean;
  /** 是否加载中 */
  isLoading: boolean;
  /** 当前选项标记 */
  currentIndex: string;
  /** 当前选择项 */
  currentItem: GlobalSearchItem | undefined;
}

const state: GlobalSearchState = reactive<GlobalSearchState>({
  isShowing: false,
  isLeaving: false,
  isLoading: false,
  searchHistory: [],
  collectList: [],
  currentIndex: '0_0',
  currentItem: undefined,
});

const searchInput = ref<HTMLInputElement>();

const change = throttle(async () => {
  await globalSearchService.search();
  if (globalSearchState.searchGroupList?.length && globalSearchState.resultList?.length) {
    const _item = globalSearchState.resultList.filter(i => i.group === globalSearchState.searchGroupList[0].name)?.[0];
    setCurrentIndex(0, 0, _item);
  }
}, 300, { leading: true, trailing: true });

/** 设置当前索引 */
const setCurrentIndex = (groupIndex: number, index: number, item: GlobalSearchItem | undefined) => {
  state.currentIndex = `${groupIndex}_${index}`;
  state.currentItem = item;
};

/** 当前选择项 */
const currentGroup = computed<GlobalSearchGroupInstance | undefined>(() => {
  if (globalSearchState.isLoading) return undefined;
  const _name = state.currentItem?.group;
  if (!_name) return undefined;
  else return globalSearchState.groupList.find(i => i.name === _name);
})

/** 当前选择项 */
// const currentItem = computed(() => {
//   if (globalSearchState.isLoading) return undefined;
//   const [ groupIndex, optionIndex ] = state.currentIndex.split('_');
//   return globalSearchState.resultList.filter(i => i.group === globalSearchState.searchGroupList[groupIndex].name)?.[optionIndex];
// })

/** 选择项 */
const selectItem = (item: GlobalSearchItem) => {
  if (typeof item.goto !== 'string') item.goto();
  close();
}

/** 切分字符串 */
const txtSplit = (txt?: string) => {
  if (!txt) return [];
  return txt.toString().split(new RegExp(`(?<=${globalSearchState.searchTxt})|(?=${globalSearchState.searchTxt})`, 'i'));
}

/** 开启弹窗 */
const open = () => {
  setTimeout(() => {
    state.isShowing = true;
    setTimeout(() => {
      searchInput.value?.focus();
    }, 200);
  }, 50);
};

/** 关闭预览 */
const close = () => {
  state.isLeaving = true;
  setTimeout(() => {
    globalSearchState.searchTxt = '';
    globalSearchState.isExtend = false;
    globalSearchState.isLoading = false;
    state.isLeaving = false;
    globalSearchService.close();
  }, 300);
};

/** 上一项 */
const prevItem = () => {
  if (globalSearchState.resultList.length <= 1) return;

  const [ groupIndex, itemIndex ] = state.currentIndex.split('_').map(i => +i);

  if (itemIndex > 0) {
    const _group = globalSearchState.searchGroupList[groupIndex];
    const _groupList = globalSearchState.resultList.filter(i => i.group === _group.name);
    setCurrentIndex(groupIndex, itemIndex - 1, _groupList[itemIndex - 1]);
  } else if (groupIndex > 0) {
    const _group = globalSearchState.searchGroupList[groupIndex - 1];
    const _groupList = globalSearchState.resultList.filter(i => i.group === _group.name);
    setCurrentIndex(groupIndex - 1, _groupList.length - 1, _groupList[_groupList.length - 1]);
  } else if (groupIndex === 0) {
    const _group = globalSearchState.searchGroupList[globalSearchState.searchGroupList.length - 1];
    const _groupList = globalSearchState.resultList.filter(i => i.group === _group.name);
    setCurrentIndex(globalSearchState.searchGroupList.length - 1, _groupList.length - 1, _groupList[globalSearchState.searchGroupList.length - 1]);
  }
};

/** 下一项 */
const nextItem = () => {
  if (globalSearchState.resultList.length <= 1) return;

  const [ groupIndex, itemIndex ] = state.currentIndex.split('_').map(i => +i);

  const _maxResultCount = globalSearchState.resultList.filter(i => i.group === globalSearchState.searchGroupList[groupIndex].name).length;

  if (itemIndex < _maxResultCount - 1) {
    const _group = globalSearchState.searchGroupList[groupIndex];
    const _groupList = globalSearchState.resultList.filter(i => i.group === _group.name);
    setCurrentIndex(groupIndex, itemIndex + 1, _groupList[itemIndex + 1]);
  } else if (groupIndex < globalSearchState.searchGroupList.length - 1) {
    const _group = globalSearchState.searchGroupList[groupIndex + 1];
    const _groupList = globalSearchState.resultList.filter(i => i.group === _group.name);
    setCurrentIndex(groupIndex + 1, 0, _groupList[0]);
  } else if (groupIndex === globalSearchState.searchGroupList.length - 1) {
    const _group = globalSearchState.searchGroupList[0];
    const _groupList = globalSearchState.resultList.filter(i => i.group === _group.name);
    setCurrentIndex(0, 0, _groupList[0]);
  }
};

/** 执行某一项 */
const executeItem = () => {
  if (state.currentItem?.goto) {
    if (typeof state.currentItem.goto === 'string') {
      message.warn('暂未处理字符串类型命令');
    } else {
      state.currentItem?.goto();
    }
  }
};

/** 点击面包屑 */
const clickCrumb = (crumb: GlobalSearchItemCrumb) => {
  if (crumb.goto) {
    crumb.goto();
    close();
  }
}

watch(() => globalSearchState.isOpen, (val) => {
  if (val) {
    open();
  } else {
    close();
  }
});

onMounted(() => {
  hotkeyService.createHotkey('esc', { scope: 'all' }, (keyBoard, hotKeys) => {
    if (globalSearchState.isOpen) close();
  });
  hotkeyService.createHotkey('enter', { scope: 'all' }, (keyBoard, hotKeys) => {
    executeItem();
  });
  hotkeyService.createHotkey('up', { scope: 'all' }, (keyBoard, hotKeys) => {
    prevItem();
    if (globalSearchState.resultList.length > 1) return false;
  });
  hotkeyService.createHotkey('down', { scope: 'all' }, (keyBoard, hotKeys) => {
    nextItem();
    if (globalSearchState.resultList.length > 1) return false;
  });
});

onUnmounted(() => {
  hotkeyService.removeHotkey('esc');
  hotkeyService.removeHotkey('enter');
  hotkeyService.removeHotkey('up');
  hotkeyService.removeHotkey('down');
});

</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

@keyframes icon-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}

.icon-rotate {
  animation: icon-rotate 2s linear infinite;
  transform-origin: center center;
}

.global-search-enter-active,
.global-search-leave-active {
  transition: opacity 0.5s ease;
}
.global-search-enter-from,
.global-search-leave-to {
  opacity: 0;
  visibility: hidden;
}

// 预览弹窗
.global-search-modal {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  visibility: hidden;
  background-color: rgba(191, 194, 230, 0.502);
  z-index: 1000;
  opacity: 0;
  transition: 0.2s;

  &.show {
    visibility: visible;
    opacity: 1;

    > .global-search-body {
      transform: translateY(0px);
    }
  }

  &.leave {
    opacity: 0;

    > .global-search-body {
      transform: translateY(-30px);
    }
  }

  .global-search-body {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 8px 22px 0 rgb(37 44 97 / 15%), 0 4px 6px 0 rgb(93 100 148 / 20%);
    width: 60vw;
    transition: 0.25s;
    transform: translateY(-30px);
    margin-top: 60px;
    overflow: hidden;
    min-height: 0px;
    max-height: calc(100vh - 120px);

    > .global-search-input {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid rgba(119, 122, 175, 0.102);

      &:focus-within {

        > .iconfont {
          color: @primary-color;
        }

        > input {
          color: #333;
        }
      }

      > .iconfont {
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        color: fadeout(@primary-color, 50%);
        font-size: 20px;
        font-weight: 600;
        padding-left: 2px;
        transform-origin: 26px 25px;
        transition: 0.2s;

        &:before {
          flex-grow: 0;
          flex-shrink: 0;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
        }
      }

      > input {
        flex-shrink: 1;
        flex-grow: 1;
        width: 100%;
        border: none;
        height: 60px;
        font-size: 20px;
        padding: 0px;
        padding-bottom: 2px;
        color: fadeout(#333, 50%);
        transition: 0.2s;
        

        &::placeholder {
          color: #9698c3;
        }
      }

      > .global-search-cancel {
        cursor: pointer;
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        height: 40px;
        padding: 0px 20px;
        transition: 0.2s;
        color: #777aaf;
        border-left: 1px solid #F5F5F5;

        &:hover {
          color: #484c7a;
        }
      }
    }

    > .global-search-loading {
      position: absolute;
      top: 61px;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0.0;
      background-color: white;
      z-index: -1;
      visibility: hidden;

      &:before {
        content: '';
        position: absolute;
        top: 0px;
        left: 0;
        bottom: 0;
        right: 0;
      }
      
      &.show {
        opacity: 1.0;
        z-index: 1;
        visibility: visible;
      }

      > .global-search-loading-icon {
        flex-shrink: 0;
        flex-grow: 0;
        display: inline-block;
        width: 50px;
        height: 50px;
        color: #9698c3;

        &:before {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          font-size: 38px;
        }
      }

      > .global-search-loading-title {
        margin-top: 20px;
        margin-left: 10px;
        font-size: 14px;
        color: #333;
      }
    }

    > .global-search-empty {
      flex-shrink: 1;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      max-height: 0px;

      &.show {
        max-height: initial;
      }

      > span {

      }
    }

    > .global-search-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: stretch;

      > .global-search-result-group-list {
        flex-shrink: 1;
        flex-grow: 1;
        margin-bottom: 0px;
        opacity: 0.0;
        transition: 0.2s;
        width: 100%;
        visibility: hidden;
        max-height: 0px;

        &.show {
          opacity: 1.0;
          visibility: visible;
          max-height: initial;
        }
          
        > .global-search-result-group-item {

          > .global-search-result-group-label {
            display: block;
            font-size: 14px;
            background-color: #f5f5fa;
            padding: 0px 20px;
            line-height: 30px;
            color: #777aaf;
            font-size: 90%;
            font-weight: 600;
          }
          
          > .global-search-result-list {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            margin-bottom: 0px;

            > .global-search-result-item {
              cursor: default;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: stretch;
              padding: 10px;
              color: #36395a;
              transition: 0.2s;
              border-bottom: 1px solid #f5f5fa;

              &:after {
                content: '\e653';
                flex-grow: 0;
                flex-shrink: 0;
                position: relative;
                display: inline-block;
                font-family: 'iconfont' !important;
                font-style: normal;
                color: white;
                font-size: 22px;
                margin-top: 6px;
                margin-right: 12px;
                line-height: 30px;
              }

              &.result-current {
                background-color: @primary-color;
                color: white;

                > .iconfont {
                  color: white;
                }

                > .global-search-result-item-body {
                  > .global-search-result-item-title {
                    color: white !important;

                    span {
                      color: white !important;
                    }
                  }

                  > .global-search-result-item-crumbs {

                    > li {

                      > span {
                        color: white !important;
                      }

                      &:before {
                        color: white;
                      }
                    }
                  }
                }
              }

              > .iconfont {
                margin-left: 4px;
                margin-right: 12px;
                font-size: 22px;
                color: #b6b7d5;
                transition: 0.2s;
              }

              > .global-search-result-item-body {
                flex-grow: 1;
                flex-shrink: 1;
                width: 100%;

                > .global-search-result-item-title {
                  font-weight: 600;
                  // transition: 0.2s;

                  > span {
                    transition: 0.2s;
                  }
                }

                > .global-search-result-item-crumbs {
                  display: flex;
                  flex-direction: row;
                  justify-content: flex-start;
                  align-items: center;
                  width: 100%;

                  > li {
                    cursor: pointer;
                    flex-grow: 0;
                    flex-shrink: 1;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 12px;
                    transition: 0.2s;

                    > span {
                      color: #777aaf;
                      transition: 0.2s;
                    }

                    &.disabled {
                      cursor: default;

                      > span {
                        color: #ababab;
                      }
                    }

                    + li {

                      &:before {
                        content: '\e643';
                        font-family: 'iconfont' !important;
                        font-style: normal;
                        display: inline-block;
                        padding: 0px 3px 0px 4px;
                        font-size: 12px;
                        color: hsla(238, 27%, 77%, 0.6);
                        transition: 0.2s;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      > .global-search-result-detail {
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 500px;
        padding: 20px 60px;
        background-color: rgba(245, 245, 250, 0.6);
        box-shadow: inset 1px 1px 2px rgb(148 150 160 / 24%), inset 2px 2px 8px rgb(148 150 160 / 10%);
        overflow-y: auto;
        overflow-x: hidden;

        &.hidden {
          visibility: hidden;
          max-height: 0px;
          padding: 0px;
        }

        > .global-search-result-detail-icon {
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          box-shadow: 0 4px 11px 0 rgb(37 44 97 / 15%), 0 1px 3px 0 rgb(93 100 148 / 20%);
          margin: 10px 0px 20px 0px;
        }

        > .global-search-result-detail-crumbs {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 10px;

          > li {
            cursor: pointer;
            flex-grow: 0;
            flex-shrink: 1;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            transition: 0.2s;

            > span {
              color: #777aaf;
              transition: 0.2s;
            }

            &.disabled {
              cursor: default;

              > span {
                color: #ababab;
              }
            }

            + li {

              &:before {
                content: '\e643';
                font-family: 'iconfont' !important;
                font-style: normal;
                display: inline-block;
                padding: 0px 3px 0px 4px;
                font-size: 12px;
                color: hsla(238, 27%, 77%, 0.6);
                transition: 0.2s;
              }
            }
          }
        }

        > .global-search-result-detail-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 30px;
        }

        > .global-search-result-detail-description {
          margin-bottom: 30px;
          font-size: 14px;
          color: #484c7a;
          width: 100%;
        }

        > .global-search-result-detail-related {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;

          > span {
            display: block;
            margin: 10px 0px;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1.5px;
            color: #9698c3;
          }

          > ul {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;

            > li {
              cursor: pointer;
              padding: 10px 5px 10px 4px;
              color: #777aaf;
              font-size: 12px;
              border-bottom: 1px solid rgba(90, 94, 154, 0.102);
              transition: 0.2s;
              width: 100%;

              &:hover {
                color: #484c7a;
              }
            }
          }
        }
      }
    }

    > .global-search-footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
      border-top: 0px solid rgba(119, 122, 175, 0.102);

      &.show {
        padding: 15px;
        border-top-width: 1px;

        > .global-search-keymap {
          max-height: initial;
          visibility: visible;
        }

        > .global-search-footer-tooltip {
          max-height: initial;
          visibility: visible;
        }
      }

      > .global-search-keymap {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 0px 0px 0px 5px;
        max-height: 0px;
        visibility: hidden;

        > li {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          margin-right: 20px;
          font-size: 12px;

          > span {
            display: inline-block;
            color: #777aaf;
            font-size: 12px;
            transform: scale(0.95);
          }

          > i {
            display: inline-flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: #777aaf;
            border-radius: 4px;
            border: 1px solid #d6d6e7;
            border-bottom-width: 2px;
            background-image: linear-gradient(to top left, #f5f5fa, rgba(214,214,231,0.6));
            font-size: 12px;
            font-style: normal;
            width: 24px;
            height: 24px;
            margin-right: 6px;
            box-shadow: 0 4px 11px 0 rgba(37, 44, 97, 0.15), 0 1px 3px 0 rgba(93, 100, 148, 0.6);
          
            &:before {
              flex-grow: 0;
              flex-shrink: 0;
              display: inline-block;
              width: 23px;
              height: 23px;
              text-align: center;
              border-radius: 4px;
              border: 1px solid #fff;
              // transform: scale(0.9);
            }

            > span {
              flex-grow: 0;
              flex-shrink: 0;
              display: inline-block;
              width: 23px;
              height: 23px;
              text-align: center;
              border-radius: 4px;
              border: 1px solid #fff;
              // transform: scale(0.9);
            }
          }
        }
      }

      > .global-search-footer-tooltip {
        font-size: 12px;
        color: #777aaf;
        max-height: 0px;
        visibility: hidden;
      }
    }
  }
}
</style>