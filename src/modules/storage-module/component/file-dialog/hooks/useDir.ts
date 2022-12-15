import { state as storageState, service as storageService } from '@/modules/storage-module';
import { computed } from '@vue/reactivity';
import type { AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent, TreeDataItem } from 'ant-design-vue/lib/tree';
import { reactive, toRefs, watch, watchEffect } from 'vue';

export type DirTreeDataItem = TreeDataItem & { parent?: DirTreeDataItem }

/** 根目录id */
export const ROOT_ID = '0';

/** 文件夹id和文件夹数据的映射 */
export const dirIdItemMap = {} as {[key in string]: DirTreeDataItem}

/** 文件夹相关hooks */
export const useDir = () => {
  const state = reactive({
    /** 文件夹导航前进栈 */
    dirForwardStack: [] as string[],
    /** 文件夹导航后退栈 */
    dirBackwardStack: [ROOT_ID] as string[],
  });

  /** 原始目录tree数据转换成组件所需tree结构 */
  const tranDirTree = (dirTreeData: typeof storageState.dirTree, parent: DirTreeDataItem) => {
    return dirTreeData.map((item) => {
      const itemData = {
        title: item.data.resourceName,
        key: item.data.id.toString(),
        parent,
      } as DirTreeDataItem;
      itemData.children =  tranDirTree(item.children, itemData);
      dirIdItemMap[itemData.key] = itemData;
      return itemData;
    });
  };
  /** 文件夹树数据 */
  const treeData = computed(
    () => {
      const rootNode = { title: '根目录', key: ROOT_ID};
      const root = { ...rootNode, children: tranDirTree(storageState.dirTree, rootNode) } as DirTreeDataItem;
      dirIdItemMap[ROOT_ID] = root;
      return [root];
    },
  );
  /** 当前文件夹id */
  const curDirId = computed(() => state.dirBackwardStack[state.dirBackwardStack.length - 1] || ROOT_ID);
  /** 当前选中的文件夹key */
  const selectedKeys = computed(() => [curDirId.value]);

  /** 拖拽文件夹节点 */
  const onDirDragEnter = (info: AntTreeNodeDragEnterEvent) => {
    console.log('onDirDragEnter', info);
  };

  /** 拖拽文件夹节点 */
  const onDirDrop = (info: AntTreeNodeDropEvent) => {
    const dragNode = info.dragNode;
    const targetNode = info.node;
    storageService.moveResource({
      id: dragNode.key as string,
      parentId: targetNode.key as string,
      dirName: dragNode.title,
    });
  };

  /** 主动切换文件夹 */
  const switchDir = (dirId: string) => {
    state.dirBackwardStack.push(dirId);
    state.dirForwardStack = [];
  };

  /** 文件夹导航 - 后退 */
  const dirBack = () => {
    const dirId = state.dirBackwardStack.pop();
    if (dirId) {
      state.dirForwardStack.push(dirId);
    }
  };

  /** 文件夹导航 - 前进 */
  const dirForward = () => {
    const dirId = state.dirForwardStack.pop();
    if (dirId) {
      state.dirBackwardStack.push(dirId);
    }
  };

  /** 复制文件 */
  const copyFile = (fileId: string, dirId: string) => {
    storageService.copyFile(fileId, dirId);
  };

  /** 切换文件夹时，更新文件列表 */
  watchEffect(() => {
    storageService.updateFileList(curDirId.value ?? ROOT_ID);
  });

  return {
    ...toRefs(state),
    treeData,
    curDirId,
    selectedKeys,
    onDirDragEnter,
    onDirDrop,
    switchDir,
    dirBack,
    dirForward,
    copyFile,
  };
};
