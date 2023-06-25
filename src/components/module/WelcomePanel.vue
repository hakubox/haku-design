<template>
  <div class="welcome-panel">
    <!-- 左侧快捷功能 -->
    <div class="welcome-panel-left">
      <div class="welcome-panel-operate">
        <div class="operate-title">新建</div>
        <div class="operate-list">
          <div class="operate-item welcome-link" @click="emit('create', 'questionnaire')">
            <i class="iconfont icon-add"></i>
            <span class="operate-item-label">新建调查问卷...</span>
          </div>
          <!-- <div class="operate-item welcome-link" @click="emit('create', 'complex-component')">
            <i class="iconfont icon-add"></i>
            <span class="operate-item-label">新建复合组件...</span>
          </div> -->
          <div class="operate-item welcome-link" @click="emit('create', 'canvas')">
            <i class="iconfont icon-add"></i>
            <span class="operate-item-label">新建画布...</span>
          </div>
        </div>
      </div>
      <div class="welcome-panel-operate">
        <div class="operate-title">打开</div>
        <div class="operate-list">
          <div class="operate-item welcome-link">
            <i class="iconfont icon-dakai"></i>
            <span class="operate-item-label">打开文件...</span>
          </div>
          <div class="operate-item welcome-link" @click="emit('openQuestionnaireLibrary')">
            <i class="iconfont icon-dakai"></i>
            <span class="operate-item-label">打开问卷库...</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧最近使用项 -->
    <div class="welcome-panel-right">
      <div class="recent-panel">
        <!-- 头部 -->
        <div class="recent-header">
          <div class="recent-header-label">最近使用项</div>
          <div class="recent-header-tools">
            <div class="recent-header-tool-showmode">
              <i class="iconfont icon-app2" :class="{ active: state.reviewType === 'card' }" @click="state.reviewType = 'card'"></i>
              <i
                class="iconfont icon-wuxupailie"
                :class="{ active: state.reviewType === 'list' }"
                @click="state.reviewType = 'list'"
              ></i>
            </div>
          </div>
        </div>
        <!-- 功能 -->
        <div class="recent-function">
          <!-- 排序 -->
          <div class="recent-function-sort">
            <div class="recent-function-sort-label">排序</div>
            <div class="recent-function-sort-content">
              <Select v-model:value="state.sortType" size="small" @change="sortTypeChange">
                <SelectOption value="time">最近使用项</SelectOption>
                <SelectOption value="name">名称</SelectOption>
                <SelectOption value="type">类型</SelectOption>
              </Select>
              <div class="recent-function-sort-reverse">
                <!-- <i class="iconfont icon-add reverse"></i> -->
                <Tooltip>
                  <template #title>反转排序</template>
                  <vertical-align-bottom-outlined style="font-size: 18px" />
                </Tooltip>
              </div>
            </div>
          </div>
          <!-- 排序 -->
          <div class="recent-function-filter">
            <div class="recent-function-filter-label">筛选</div>
            <div class="recent-function-filter-content">
              <Input v-model:value="state.filterTxt" size="small" placeholder="筛选最近的文件" />
            </div>
          </div>
        </div>
        <!-- 最近列表（卡片） -->
        <Spin :spinning="state.isLoading" tip="加载中...">
          <div v-if="state.reviewType === 'card'" class="recent-card">
            <div
              class="recent-item"
              v-for="item in state.recentList"
              :key="item.id"
            >
              <img
                class="recent-item-img"
                :src="item.previewUrl || 'https://cdn.hakuq.com/assets/image/default-app-image.png'"
                alt=""
                @click="selectApp(item)"
              />
              <div class="recent-item-version" v-if="item.version"><span style="padding-right: 1px;">v</span>{{item.version}}</div>
              <div class="recent-item-title" @click="selectApp(item)">
                <div class="recent-item-id"> [{{ item.id.slice(-5) }}] </div>
                {{ item.title }}
              </div>
              <div class="recent-item-infos">
                <div class="recent-item-type">{{ getTypeName(item.appType) }}</div>
                <div class="recent-item-date">{{ dateFormat(new Date(item.createdTime), 'yyyy-MM-dd HH:mm') }}</div>
                <div class="recent-item-tool">
                  <Dropdown @click.stop>
                    <i class="iconfont iconfont-menu icon-gengduo"></i>
                    <template #overlay>
                      <Menu>
                        <MenuItem key="1" @click="item['collect'] = !item['collect']">
                          <i class="iconfont iconfont-menu icon-star-solid" style="color: #EDBC6B;" v-if="item['collect']"></i>
                          <i class="iconfont iconfont-menu icon-star" v-else></i>
                          星标
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem danger key="2" @click="removeItem(item)">
                          <i class="iconfont iconfont-menu icon-shanchu"></i>
                          移除
                        </MenuItem>
                      </Menu>
                    </template>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div v-if="state.reviewType === 'card' && state.pagination.total> state.pagination.pageSize">
            <!-- 翻页 -->
            <Pagination
              v-model:current="state.pagination.current"
              show-quick-jumper
              :total="state.pagination.total"
              @change="state.pagination.onChange"
            />
          </div>
          <!-- 最近列表（列表） -->
          <List
            class="recent-list"
            v-if="state.reviewType === 'list'"
            item-layout="vertical"
            size="large"
            :pagination="state.pagination"
            :data-source="state.recentList"
          >
            <template #footer></template>
            <template #renderItem="{ item }">
              <ListItem key="item.title">
                <template #actions>
                  <div class="questionnaire-library-item-body-tools">
                    <div class="questionnaire-library-item-body-tool tool-primary" @click="selectApp(item)">
                      <i class="iconfont icon-zidingyi"></i>
                      设计
                    </div>
                    <div class="questionnaire-library-item-body-tool tool-red" @click="deleteOperationRecord(item.id)">
                      <i class="iconfont icon-shanchu"></i>
                      删除
                    </div>
                  </div>
                </template>
                <template #extra>
                  <Tooltip overlayClassName="recent-item-preview" placement="leftTop">
                    <template #title>
                      <img :src="item.previewUrl || 'https://cdn.hakuq.com/assets/image/default-app-image.png'" alt="" />
                    </template>
                    <div class="recent-item-img">
                      <img :alt="item.appTitle" :src="item.previewUrl || 'https://cdn.hakuq.com/assets/image/default-app-image.png'" />
                    </div>
                  </Tooltip>
                </template>
                {{ item.description ?? '暂无描述' }}
              </ListItem>
            </template>
          </List>
        </Spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted, createVNode } from 'vue';
import { service as editorService } from '@/modules/editor-module';
import { service as introService } from '@/modules/intro-module';
import { dateFormat } from '@/tools/common';
import { Input, List, ListItem, Dropdown, Select, SelectOption, Tooltip, message, Menu, MenuItem, MenuDivider, Modal, Spin, Pagination } from 'ant-design-vue';
import { getApp, getApps, getAppsByPage } from '@/api/app';
import { AppInfoDto, appInfoDto2AppBody } from '@/model/app-info-dto';
import { removeApp } from '@/api/app';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';


const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 预览类型 */
  reviewType: 'card' as 'card' | 'list',
  /** 排序类型 */
  sortType: 'time',
  /** 筛选关键字 */
  filterTxt: '',
  /** 列表分页 */
  pagination: {
    onChange: (page: number) => {
      console.log(page);
    },
    current: 0,
    pageSize: 10,
    total: 0,
  },
  /** 最近列表 */
  recentList: [] as AppInfoDto[],
});

const emit = defineEmits<{
  (event: 'create', string: string): void;
  (event: 'openQuestionnaireLibrary'): void;
}>();

/** 获取类型名称 */
const getTypeName = (type) => {
  switch (type) {
    case 'questionnaire': return '问卷';
    case 'canvas': return '画布';
    case 'complex-component': return '复合组件';
    default: return '未定义';
  }
};

const startShowIntro = () => {
  if (document.querySelector('.welcome-panel-operate')) {
    introService.start('welcome_page', [{
      element: document.querySelectorAll('.welcome-panel-operate')[0],
      title: '新建问卷',
      intro: '用于新建调查问卷或者其他类型的表单'
    }, {
      element: document.querySelectorAll('.welcome-panel-operate')[1],
      title: '打开问卷',
      intro: '用于打开现有问卷或其他类型的表单'
    }, {
      element: document.querySelector('.recent-panel'),
      title: '最近使用项',
      intro: '用于打开最近访问的问卷或其他类型的表单'
    }])?.catch(() => {
      introService.complete('welcome_page');
    });
  }
}

/** 搜索应用 */
const search = () => {
  state.isLoading = true;
  getAppsByPage({
    pageIndex: state.pagination.current + 1,
    pageSize: state.pagination.pageSize,
    filters: [
      { key: 'title', value: state.filterTxt, type: 'contains' },
      { key: 'formJson', value: state.filterTxt, type: 'contains' },
    ],
    orders: ['updatedTime'],
  }).then(d => {
    state.recentList = d.data;
    state.pagination.total = d.totalCount;
    startShowIntro();
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    state.isLoading = false;
  });
};

/** 选择应用 */
const selectApp = (app: AppInfoDto) => {
  const id = app.id || '';
  state.isLoading = true;
  const hide = message.loading('加载中...');
  getApp(id).then(appInfo => {
    const _appInfo = appInfoDto2AppBody(appInfo);
    editorService.loadAppBody(id, _appInfo);
  }).catch(err => {
    console.error(err);
    message.error(`应用加载失败，错误原因：${err.message}`);
  }).finally(() => {
    state.isLoading = false;
    hide();
  });
};

/** 移除项 */
const removeItem = (item: AppInfoDto) => {
  console.log(item.id);
  Modal.confirm({
    title: `删除确认`,
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:red;' }, `是否确认删除《${item.title}》？删除之后将无法恢复`),
    onOk() {
      removeApp(item.id).then(d => {
        search();
      });
    },
    onCancel() {
    },
  });
};

/** 删除问卷操作记录 */
const deleteOperationRecord = (id: string) => {
  editorService.deleteOperationRecord(id);
  search();
}

/** 排序类型修改 */
const sortTypeChange = () => {};

onMounted(() => {
  search();
});

onUnmounted(() => {
  introService.exit('welcome_page');
});
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

.welcome-link {
  cursor: pointer;
  color: #396aad;
  font-size: 14px;
  line-height: 20px;
  transition: 0.1s;

  &:hover {
    color: #107dd7;
  }
}

// 欢迎界面
.welcome-panel {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: #ffffff;
  color: #616161;

  > .welcome-panel-left {
    flex-shrink: 0;
    flex-grow: 0;
    width: 300px;
    padding: 40px;

    > .welcome-panel-operate {
      > .operate-title {
        font-size: 24px;
        font-weight: 100;
        margin-bottom: 10px;
      }

      > .operate-list {
        > .operate-item {
          font-size: 14px;
          line-height: 20px;

          > .iconfont {
            margin-right: 5px;
            font-size: 18px;
            line-height: 20px;
            vertical-align: text-bottom;
          }

          + .operate-item {
            margin-top: 6px;
          }
        }
      }

      + .welcome-panel-operate {
        margin-top: 50px;
      }
    }
  }

  > .welcome-panel-right {
    flex-shrink: 1;
    flex-grow: 1;
    padding: 40px;
    overflow: auto;

    > .recent-panel {
      display: flex;
      flex-direction: column;
      height: 100%;

      > .recent-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        > .recent-header-label {
          font-size: 24px;
          font-weight: 100;
          margin-bottom: 10px;
        }

        > .recent-header-tools {
          > .recent-header-tool-showmode {
            > .iconfont {
              font-size: 20px;
              padding: 6px;
              border-radius: 4px;
              transition: 0.1s;
              background-color: rgba(51, 122, 183, 0);

              + .iconfont {
                margin-left: 4px;
              }

              &.active {
                background-color: rgba(51, 122, 183, 0.2);
              }
            }
          }
        }
      }

      > .recent-function {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        > .recent-function-sort {
          flex-grow: 1;
          display: flex;
          flex-direction: row;

          > .recent-function-sort-label {
            display: inline-block;
            font-size: 14px;
            margin-right: 10px;
          }
          > .recent-function-sort-content {
            display: flex;
            flex-direction: row;
            font-size: 14px;

            > .recent-function-sort-reverse {
              cursor: pointer;
              border-left: 1px solid #ccc;
              padding-left: 10px;
              margin-left: 10px;

              > .anticon {
                vertical-align: bottom;
              }
            }
          }
        }

        > .recent-function-filter {
          flex-grow: 0;
          display: flex;
          flex-direction: row;

          > .recent-function-filter-label {
            display: inline-block;
            font-size: 14px;
            margin-right: 10px;
          }
        }
      }

      .ant-spin-nested-loading {
        flex-shrink: 1;
        flex-grow: 1;
      }

      // 最近的文件列表
      .recent-card {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: 20px;

        > .recent-item {
          cursor: pointer;
          position: relative;
          margin-right: 20px;
          margin-bottom: 20px;
          width: 200px;

          > .recent-item-img {
            position: relative;
            width: 200px;
            height: 200px;
            object-fit: cover;
            object-position: top center;
            padding: 10px;
            background-color: #f8f8f8;
            border-radius: 3px;
            margin-bottom: 15px;
            transition: 0.1s;

            &:hover {
              background-color: #e1efff;
            }
          }

          > .recent-item-version {
            position: absolute;
            top: 20px;
            left: 20px;
            color: rgba(0, 0, 0, 0.851);
            font-feature-settings: "tnum";
            display: inline-block;
            padding: 0 4px;
            font-size: 12px;
            line-height: 16px;
            border: 1px solid #91d5ff;
            border-radius: 4px;
            color: #1890ff;
            background: #e6f7ff;
          }

          > .recent-item-title {
            display: block;
            white-space: nowrap;
            font-size: 13px;

            > .recent-item-id {
              display: inline-block;
              color: #396AAD;
              font-size: 12px;
              max-width: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              vertical-align: bottom;
            }
          }

          > .recent-item-infos {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            color: #999;
            font-size: 12px;
            padding-top: 4px;

            > .recent-item-tool {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 2px;
              height: 18px;

              > .iconfont {
                font-size: 16px;
              }
            }
          }
        }
      }

      // 最近的文件列表
      .recent-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: 20px;

        > .ant-spin-nested-loading {
          width: 100%;
        }

        // 列表形式样式覆盖
        .ant-list-item {
          padding: 0px 0px 16px 0px;
          margin-bottom: 14px;

          > .ant-list-item-extra {
            position: relative;
            display: flex;
            flex-direction: column;

            > .recent-item-img {
              flex-grow: 1;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              object-position: top center;

              > img {
                width: 200px;
                max-height: 250px;
                flex-grow: 1;
                object-fit: cover;
              }
            }
          }

          &:last-child {
            padding-bottom: 0px;
            margin-bottom: 0px;
            border-bottom: none;
          }
        }
      }
    }
  }
}

.recent-item-preview {
  max-width: initial;

  > .ant-tooltip-content {
    background-color: white;

    > .ant-tooltip-arrow {
      > .ant-tooltip-arrow-content {
        background-color: white;
      }
    }
    > .ant-tooltip-inner {
      background-color: white;

      > img {
        max-height: 98vh;
      }
    }
  }
}

.questionnaire-library-item-body-tools {
  > .questionnaire-library-item-body-tool {
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin-right: 5px;
    padding: 4px 12px;
    color: @primary-color;
    transition: @animation-duration-fast;
    border-radius: 4px;

    &:hover {
      color: @primary-8;
    }

    &.tool-primary {
      color: white;
      background-color: @primary-color;

      &:hover {
        color: white;
        background-color: @primary-8;
      }
    }

    &.tool-orange {
      color: #ff9b02;

      &:hover {
        color: #f47e34;
      }
    }

    &.tool-red {
      color: #ff7070;

      &:hover {
        color: #e41717;
      }
    }

    > .iconfont {
    }

    + .questionnaire-library-item-body-tool {
    }
  }
}
</style>
