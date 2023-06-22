<template>
  <div class="file-dialog-breadcrumb">
    <Breadcrumb>
      <BreadcrumbItem href="" v-for="(item, index) in dirFullPath" :key="index">
        <a @click="onClickItem(dirPath[index])">{{ dirPath[index].title }}</a>
        <template #overlay v-if="item?.length > 1">
          <Menu :selectedKeys="['active']">
            <MenuItem
              v-for="(childrenItem) in item" 
              :key="childrenItem.key"
              @click="onClickItem(childrenItem)"
            >
              <a>{{ childrenItem.title }}</a>
            </MenuItem>
          </Menu>
        </template>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script lang="ts" setup>
/**
 * 顶部显示文件夹路径的面包屑导航
 */
import { computed } from 'vue';
import { Breadcrumb, BreadcrumbItem, Menu, MenuItem } from 'ant-design-vue';
import { dirIdItemMap, DirTreeDataItem } from '../hooks/useDir';

interface IProps {
  curDirId: string;
}

interface IEmit {
  (e: 'switch-dir', dirId: string): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const createDirPath = (dirDataItem: DirTreeDataItem, pathArr: DirTreeDataItem[][]) => {
  const itemData = dirIdItemMap[dirDataItem.key];
  if (itemData?.children) {
    pathArr.unshift(itemData.children);
  }
  
  if (!itemData?.parent) {
    pathArr.unshift([itemData]);
    return pathArr;
  }
  return createDirPath(itemData?.parent, pathArr)
}

/** 当前文件夹全路径，包括父文件夹的所有子文件夹 */
const dirFullPath = computed(() => {
  const dirData = dirIdItemMap[props.curDirId];
  const pathArr = [] as DirTreeDataItem[][];
  if (!dirData?.parent) {
    pathArr.unshift([dirData]);
  } else {
    createDirPath(dirData.parent, pathArr);
  }
  return pathArr;
})

/** 当前文件夹路径 */
const dirPath = computed(() => {
  const dirData = dirIdItemMap[props.curDirId];
  const fn = (dirData: DirTreeDataItem, pathArr: DirTreeDataItem[]): DirTreeDataItem[] => {
    pathArr.unshift(dirData)
    if (dirData.parent){
      return fn(dirData.parent, pathArr)
    } else {
      return pathArr;
    }
  }
  return fn(dirData, []);
})

const onClickItem = (dirData: DirTreeDataItem) => { emit('switch-dir', dirData.key as string) }

</script>
<style lang="less" scoped>
.file-dialog-breadcrumb {
  flex-shrink: 1;
  flex-grow: 1;
  padding-left: 12px;
}
</style>
