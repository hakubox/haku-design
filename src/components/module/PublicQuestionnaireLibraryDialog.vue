<template>
  <ConfigProvider v-bind="globalState.antdConfigProvider">
    <!-- 产品预览 -->
    <Modal
      title="问卷库"
      :width="1080"
      :visible="typeof props.visible === 'boolean' ? props.visible : props.visible.value"
      :footer="false"
      @cancel="onClose"
    >
      <div class="public-questionnaire-library-panel">
        <!-- 搜索栏 -->
        <div class="public-questionnaire-library-search">
          <InputSearch
            v-model:value="state.filter.searchTxt"
            placeholder="请输入需要搜索问卷的关键词"
            size="large"
            @search="(str) => search()"
          >
            <template #prefix> <SearchOutlined style="color: #888" />&nbsp; </template>
            <template #enterButton>
              <SearchOutlined />&nbsp;
              <span>搜索问卷</span>
            </template>
          </InputSearch>
        </div>
        <!-- 筛选 / 排序栏 -->
        <div class="public-questionnaire-library-filter">
          <span class="public-questionnaire-library-filter-label">筛选项：</span>
          <CheckboxGroup v-model:value="state.filter.tags" name="checkboxgroup" :options="state.filterTags" />
        </div>
        <!-- 展示列表 -->
        <div class="public-questionnaire-library-list">
          <div class="public-questionnaire-library-item">
            <!-- 问卷预览图 -->
            <Tooltip overlayClassName="public-questionnaire-library-item-preview" placement="rightTop">
              <template #title>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="" />
              </template>
              <div class="public-questionnaire-library-item-img">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="" />
              </div>
            </Tooltip>
            <!-- 问卷信息 -->
            <div class="public-questionnaire-library-item-body">
              <div class="public-questionnaire-library-item-body-header">
                <!-- 版本号 -->
                <!-- <span class="public-questionnaire-library-item-body-version">v1</span> -->
                <!-- 问卷标题 -->
                <span class="public-questionnaire-library-item-body-title">问卷标题问卷标题问卷标题</span>
                <span class="public-questionnaire-library-item-body-update-date">更新日期：2022-07-07</span>
                <div class="public-questionnaire-library-item-body-tools">
                  <div class="public-questionnaire-library-item-body-tool">
                    <i class="iconfont icon-add"></i>
                    添加到
                  </div>
                  <div class="public-questionnaire-library-item-body-tool tool-orange">
                    <i class="iconfont icon-star"></i>
                    收藏
                  </div>
                </div>
              </div>
              <!-- 问卷标签 -->
              <div class="public-questionnaire-library-item-body-tags">
                <Tag color="#FF4D4F">医疗问卷</Tag>
                <Tag color="#108EE9">官方</Tag>
                <Tag color="#531DBD">焦虑症</Tag>
              </div>
              <!-- 问卷描述 -->
              <span class="public-questionnaire-library-item-body-description"
                >问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述</span
              >
            </div>
          </div>

          <div class="public-questionnaire-library-item">
            <!-- 问卷预览图 -->
            <Tooltip overlayClassName="public-questionnaire-library-item-preview" placement="rightTop">
              <template #title>
                <img src="@/assets/img/test-panel.webp" alt="" />
              </template>
              <div class="public-questionnaire-library-item-img">
                <img src="@/assets/img/test-panel.webp" alt="" />
              </div>
            </Tooltip>
            <!-- 问卷信息 -->
            <div class="public-questionnaire-library-item-body">
              <div class="public-questionnaire-library-item-body-header">
                <!-- 版本号 -->
                <!-- <span class="public-questionnaire-library-item-body-version">v1</span> -->
                <!-- 问卷标题 -->
                <span class="public-questionnaire-library-item-body-title">问卷标题问卷标题问卷标题</span>
                <span class="public-questionnaire-library-item-body-update-date">更新日期：2022-07-07</span>
                <div class="public-questionnaire-library-item-body-tools">
                  <div class="public-questionnaire-library-item-body-tool">
                    <i class="iconfont icon-add"></i>
                    添加到
                  </div>
                  <div class="public-questionnaire-library-item-body-tool tool-orange">
                    <i class="iconfont icon-star"></i>
                    收藏
                  </div>
                </div>
              </div>
              <!-- 问卷标签 -->
              <div class="public-questionnaire-library-item-body-tags">
                <Tag color="#FF4D4F">医疗问卷</Tag>
                <Tag color="#108EE9">官方</Tag>
                <Tag color="#531DBD">焦虑症</Tag>
              </div>
              <!-- 问卷描述 -->
              <span class="public-questionnaire-library-item-body-description"
                >问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述问卷描述</span
              >
            </div>
          </div>
        </div>

        <Pagination
          v-model:current="state.pagination.pageNum"
          show-quick-jumper
          :total="state.pagination.total"
          @change="changePage"
        />
      </div>
    </Modal>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, PropType, Ref } from 'vue';
import { CheckboxGroup, InputSearch, Modal, Pagination, Tag, Tooltip, ConfigProvider } from 'ant-design-vue';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import { state as globalState } from '@/common/global';

const props = defineProps({
  /** 是否显示 */
  visible: {
    type: [Boolean, Object] as PropType<boolean | Ref<boolean>>,
    default: false,
  },
});

const emit = defineEmits<{
  (event: 'update:visible', val: boolean): void;
}>();

const formRef = ref();

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 筛选项 */
  filter: {
    searchTxt: '',
    tags: [],
  },
  /** 分页配置 */
  pagination: {
    pageNum: 1,
    pageSize: 10,
    total: 100,
  },
  /** 筛选Tag */
  filterTags: [
    { label: '官方', value: 'a' },
    { label: '医疗问卷', value: 'b' },
  ],
});

const onClose = () => {
  emit('update:visible', false);
};
/** 翻页 */
const changePage = (page, pageSize) => {
  console.log(page, pageSize);
};
/** 搜索 */
const search = () => {};

watch(
  () => props.visible,
  (count, prevCount) => {
    if (count) {
    }
  },
);
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

/** 问卷库面板 */
.public-questionnaire-library-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  > .ant-pagination {
    text-align: center;
  }

  > .public-questionnaire-library-search {
    padding: 10px 30px 15px 30px;
  }

  > .public-questionnaire-library-filter {
    padding: 0px 30px 20px 30px;

    > .public-questionnaire-library-filter-label {
      display: inline-block;
      padding-right: 10px;
    }
  }

  > .public-questionnaire-library-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 25px;

    > .public-questionnaire-library-item {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      transition: @animation-duration-slow;

      &:hover {
        box-shadow: @card-shadow;
      }

      + .public-questionnaire-library-item {
        margin-top: 15px;
      }

      > .public-questionnaire-library-item-img {
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
        background-color: #f5f5f5;

        > img {
          position: relative;
          width: 100%;
          object-fit: cover;
        }
      }

      > .public-questionnaire-library-item-body {
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        width: 100%;

        > .public-questionnaire-library-item-body-header {
          > .public-questionnaire-library-item-body-version {
            display: inline-block;
            padding: 2px 6px;
            background-color: #f9f0ff;
            color: #531dab;
            border-radius: 3px;
            margin-right: 10px;
            font-size: 13px;
            line-height: 16px;
            font-weight: bold;
            vertical-align: text-bottom;
          }

          > .public-questionnaire-library-item-body-title {
            display: inline-block;
            font-size: 22px;
            margin-right: 15px;
          }
          > .public-questionnaire-library-item-body-update-date {
            font-size: 13px;
            color: #888;
          }
          > .public-questionnaire-library-item-body-tools {
            float: right;

            > .public-questionnaire-library-item-body-tool {
              cursor: pointer;
              display: inline-block;
              font-size: 14px;
              margin-left: 10px;
              padding: 4px 12px;
              color: @primary-color;
              transition: @animation-duration-fast;

              &:hover {
                color: @primary-8;
              }

              &.tool-orange {
                color: #ff9b02;

                &:hover {
                  color: #f47e34;
                }
              }

              > .iconfont {
              }

              + .public-questionnaire-library-item-body-tool {
              }
            }
          }
        }

        > .public-questionnaire-library-item-body-tags {
          padding: 8px 0px;
        }

        > .public-questionnaire-library-item-body-description {
          font-size: 14px;
        }
      }
    }
  }
}

.public-questionnaire-library-item-preview {
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
