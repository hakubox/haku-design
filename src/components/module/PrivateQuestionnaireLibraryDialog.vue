<template>
  <ConfigProvider v-bind="globalState.antdConfigProvider">
    <Modal
      title="私人应用库"
      :width="1080"
      :visible="typeof props.visible === 'boolean' ? props.visible : props.visible.value"
      :footer="false"
      @cancel="onClose"
    >
      <div class="questionnaire-library-panel">
        <!-- 搜索栏 -->
        <div class="questionnaire-library-search">
          <InputSearch
            v-model:value="state.filter.searchTxt"
            placeholder="请输入需要搜索问卷的关键词"
            size="large"
            @search="search()"
          >
            <template #prefix>
              <SearchOutlined style="color: #888;" />&nbsp;
            </template>
            <template #enterButton>
              <SearchOutlined />&nbsp;
              <span>搜索</span>
            </template>
          </InputSearch>
        </div>
        <!-- 筛选 / 排序栏 -->
        <!-- <div class="questionnaire-library-filter">
          <span class="questionnaire-library-filter-label">筛选项：</span>
          <CheckboxGroup v-model:value="filter.tags" name="checkboxgroup" :options="filterTags" />
        </div> -->
        <!-- 展示列表 -->
        <div class="questionnaire-library-list">

          <div class="questionnaire-library-item" v-for="item in state.dataList" :key="item.id">
            <!-- 问卷预览图 -->
            <Tooltip overlayClassName="questionnaire-library-item-preview" placement="rightTop">
              <template v-if="item.previewUrl" #title>
                <img :src="item.previewUrl" alt="">
              </template>
              <div class="questionnaire-library-item-img">
                <img
                  :src="item.previewUrl || 'https://www.hakuq.com/cdn/assets/image/default-app-image.png'"
                  alt=""
                />
              </div>
            </Tooltip>
            <!-- 问卷信息 -->
            <div class="questionnaire-library-item-body">
              <div class="questionnaire-library-item-body-header">
                <span v-if="item.appType" class="questionnaire-library-item-body-apptype">{{ getTypeTitle(item.appType) }}</span>
                <!-- 版本号 -->
                <span class="questionnaire-library-item-body-version">v{{item.version}}</span>
                <!-- 问卷标题 -->
                <span class="questionnaire-library-item-body-title">
                  {{ item.title }}
                </span>
                <span class="questionnaire-library-item-body-update-date">更新日期：{{ dateFormat(item.updatedTime) }}</span>
                <div class="questionnaire-library-item-body-tools">
                  <div class="questionnaire-library-item-body-tool tool-primary" @click="loadData(item)">
                    <i class="iconfont icon-zidingyi"></i>
                    编辑
                  </div>
                  <div class="questionnaire-library-item-body-tool tool-red">
                    <i class="iconfont icon-shanchu"></i>
                    删除
                  </div>
                </div>
              </div>
              <!-- 问卷标签 -->
              <!-- <div class="questionnaire-library-item-body-tags">
                <Tag v-for="tag in (item.tags || [])" :key="tag">{{ tag }}</Tag>
                <Tag color="#FF4D4F">模板</Tag>
                <Tag color="#108EE9">普通</Tag>
              </div> -->
              <!-- 问卷描述 -->
              <span class="questionnaire-library-item-body-description">{{ item.description }}</span>
            </div>
          </div>
        </div>

        <Pagination v-model:current="state.pagination.current" show-quick-jumper :total="state.pagination.total" @change="search" />
      </div>
    </Modal>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { reactive, watch, PropType, Ref, onMounted } from "vue";
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { getQuestionary, listQuestionary } from "@/api/questionnaire";
import { dateFormat } from '@/tools/common';
import { InputSearch, message, Modal, Pagination, Tag, Tooltip, ConfigProvider, CheckboxGroup } from "ant-design-vue";
import { state as globalState } from '@/common/global';
import SearchOutlined from "@ant-design/icons-vue/SearchOutlined";
import { getApp, getAppsByPage } from "@/api/app";
import { AppInfoDto, appInfoDto2AppBody } from "@/model/app-info-dto";

const props = defineProps({
  /** 是否显示 */
  visible: {
    type: [Boolean, Object] as PropType<boolean | Ref<boolean>>,
    default: false
  }
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
}>();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 筛选项 */
  filter: {
    searchTxt: '',
    tags: []
  },
  /** 分页配置 */
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  },
  /** 筛选Tag */
  filterTags: [
    { label: '官方', value: 'a' },
    { label: '医疗问卷', value: 'b' },
  ],
  /** 查询列表 */
  dataList: [] as AppInfoDto[],
});

const onClose = () => {
  emit('update:visible', false);
};

/** 获取类型名称 */
const getTypeTitle = (type: string) => {
  return {
    questionnaire: '问卷',
    canvas: '画布',
  }[type.toLowerCase()];
};

/** 加载数据 */
const loadData = (data: AppInfoDto) => {
  const hide = message.loading('加载中...');
  state.isLoading = true;
  getApp(data.id).then(appInfo => {
    const _appInfo = appInfoDto2AppBody(appInfo);
    editorService.loadAppBody(data.id, _appInfo);
    onClose();
  }).finally(() => {
    state.isLoading = false;
    hide();
  });
};

watch(() => props.visible, (count, prevCount) => {
  if (count) {
    search();
  }
});

const search = (pageNum?: number, pageSize?: number) => {
  if (!pageNum || !pageSize) {
    state.pagination.current = 1;
  } else {
    state.pagination.current = pageNum;
    state.pagination.pageSize = pageSize;
  }
  
  getAppsByPage({
    pageIndex: state.pagination.current,
    pageSize: state.pagination.pageSize,
    filters: [
      { key: 'title', value: state.filter.searchTxt, type: 'contains' },
      { key: 'formJson', value: state.filter.searchTxt, type: 'contains' },
    ],
    orders: ['updatedTime'],
  }).then(d => {
    state.dataList = d.data;
    state.pagination.total = d.totalCount;
  });
};

onMounted(() => {
  search();
});
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

/** 问卷库面板 */
.questionnaire-library-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  > .ant-pagination {
    text-align: center;
  }

  > .questionnaire-library-search {
    padding: 10px 30px 15px 30px;
  }

  > .questionnaire-library-filter {
    padding: 0px 30px 20px 30px;

    > .questionnaire-library-filter-label {
      display: inline-block;
      padding-right: 10px;
    }
  }

  > .questionnaire-library-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 25px;

    > .questionnaire-library-item {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;
      padding: 15px;
      border: 1px solid #DDD;
      border-radius: 6px;
      transition: @animation-duration-slow;

      &:hover {
        box-shadow: @card-shadow;
      }

      + .questionnaire-library-item {
        margin-top: 15px;
      }

      > .questionnaire-library-item-img {
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        width: 200px;
        height: 150px;
        padding: 10px;
        margin-right: 20px;
        background-color: #F5F5F5;

        > img {
          position: relative;
          width: 100%;
          object-fit: cover;
          object-position: top center;
        }
      }

      > .questionnaire-library-item-body {
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        width: 100%;

        > .questionnaire-library-item-body-header {
          margin-bottom: 8px;

          > .questionnaire-library-item-body-apptype {
            display: inline-block;
            padding: 2px 6px;
            background-color: #F9F0FF;
            color: #531DAB;
            border-radius: 3px;
            margin-right: 10px;
            font-size: 13px;
            line-height: 16px;
            font-weight: bold;
            vertical-align: text-bottom;
          }

          > .questionnaire-library-item-body-version {
            margin: 0 8px 0 0px;
            color: #000000d9;
            font-feature-settings: "tnum";
            display: inline-block;
            padding: 0 4px;
            font-size: 13px;
            line-height: 16px;
            border: 1px solid #91d5ff;
            border-radius: 4px;
            color: #1890ff;
            background: #e6f7ff;
          }

          > .questionnaire-library-item-body-title {
            display: inline-block;
            font-size: 22px;
            margin-right: 15px;
          }
          > .questionnaire-library-item-body-update-date {
            font-size: 13px;
            color: #888;
          }
          > .questionnaire-library-item-body-tools {
            float: right;

            > .questionnaire-library-item-body-tool {
              cursor: pointer;
              display: inline-block;
              font-size: 14px;
              margin-left: 5px;
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
                color: #FF9B02;

                &:hover {
                  color: #F47E34;
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
        }

        > .questionnaire-library-item-body-tags {
          padding: 0px 0px 8px 0px;
        }

        > .questionnaire-library-item-body-description {
          font-size: 14px;
        }
      }
    }
  }
}

.questionnaire-library-item-preview {
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
</style>