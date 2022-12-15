<template>
  <div class="file-dialog-filter">
    <!-- 筛选输入框 -->
    <InputSearch v-model:value="searchText" placeholder="搜索文件名或标签" style="width: 300px" @search="onSearch" />
    <div class="file-dialog-filter-right">
      <Dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          {{ sortTypeTextMap[props.sortType] }}
          <DownOutlined />
        </a>
        <template #overlay>
          <Menu @click="({ key }) => onSortTypeChange(key as SortType)">
            <MenuItem :key="SortType.letter"><a>按名称</a></MenuItem>
            <MenuItem :key="SortType.size"><a>按大小</a></MenuItem>
            <MenuItem :key="SortType.date"><a>按修改日期</a></MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <div class="file-dialog-icon-group" style="margin-left: 10px">
        <i
          :class="`iconfont icon-zhengxu ${props.sortOrder === SortOrder.sequence ? 'active' : ''}`"
          style="font-size: 16px"
          @click="onChangeSortOrder(SortOrder.sequence)"
        ></i>
        <i
          :class="`iconfont icon-daoxu ${props.sortOrder === SortOrder.reverse ? 'active' : ''}`"
          style="font-size: 16px"
          @click="onChangeSortOrder(SortOrder.reverse)"
        ></i>
      </div>
      <div class="split-row"></div>
      <div class="file-dialog-icon-group">
        <i class="iconfont icon-list"></i>
        <i class="iconfont active icon-table"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 文件搜索及筛选栏
 */
 import { state as storageState, service as storageService } from '@/modules/storage-module';
import { SortType } from '@/modules/storage-module/enum';
import { DownOutlined } from '@ant-design/icons-vue';
import { Dropdown, InputSearch, Menu, MenuItem } from 'ant-design-vue';
import { PropType, ref } from 'vue';
import { ROOT_ID } from '../hooks/useDir';
import { SortOrder } from '../hooks/useFileSort';

interface IEmits {
  (e: 'update:sortType', sortType: SortType): void;
  (e: 'update:sortOrder', sortType: SortOrder): void;
}

const props = defineProps({
  sortType: {
    type: Number as PropType<SortType>,
    default: SortType.letter,
    required: true,
  },
  sortOrder: {
    type: Number as PropType<SortOrder>,
    default: SortOrder.sequence,
    required: true,
  },
});
const emits = defineEmits<IEmits>();

const sortTypeTextMap = {
  [SortType.letter]: '按名称排序',
  [SortType.size]: '按大小排序',
  [SortType.date]: '按日期排序',
};

const searchText = ref('');

/** 搜索文件 */
const onSearch = () => {
  if (searchText.value) {
    storageService.searchFile(searchText.value);
  } else {
    storageService.updateFileList(ROOT_ID);
  }
};

/** 文件按名称/大小等排序 */
const onSortTypeChange = (sortType: SortType) => {
  emits('update:sortType', sortType);
};

/** 文件正序/倒叙 */
const onChangeSortOrder = (sortOrder: SortOrder) => {
  emits('update:sortOrder', sortOrder);
};
</script>
<style lang="less" scoped>
@import '/src/assets/less/variable.less';
.file-dialog-filter {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;

  > .file-dialog-filter-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    > .file-dialog-icon-group {
      background-color: #f5f5f5;
      border-radius: 4px;

      > .iconfont {
        position: relative;
        cursor: default;
        display: inline-block;
        text-align: center;
        color: #888;
        font-size: 20px;
        line-height: 24px;
        width: 34px;
        padding: 4px;

        &.active {
          cursor: pointer;
          color: @primary-color;
        }

        + .iconfont {
          padding-left: 6px;
          margin-left: 0px;

          &:after {
            content: '';
            position: absolute;
            left: 0px;
            top: 6px;
            width: 1px;
            height: 20px;
            border-left: 1px solid #ddd;
          }
        }
      }
    }
  }
}
</style>
