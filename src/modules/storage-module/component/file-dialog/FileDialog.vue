<template>
  <div>
    <!-- 产品预览 -->
    <Modal
      wrapClassName="file-dialog"
      :width="1080"
      :visible="fileDialogState.visible"
      :title="null"
      :footer="false"
      :centered="true"
      @cancel="onClose"
    >
      <div class="file-dialog-header">
        <!-- @edit="onEdit" -->
        <Tabs v-model:activeKey="state.currentLibraryId" type="card">
          <!--  :closable="pane.closable" -->
          <TabPane v-for="pane in state.storageLibrarys" :key="pane.key" :tab="pane.title">
            {{ pane.content }}
          </TabPane>
        </Tabs>
      </div>
      <div class="file-dialog-body">
        <!-- 顶部操作栏/面包屑 -->
        <div class="file-dialog-tools">
          <!-- 图标按钮组（主要包含前进后退） -->
          <div class="file-dialog-icon-btns">
            <Tooltip>
              <template #title>后退</template>
              <i :class="`iconfont icon-undo ${dirBackwardStack.length > 1 ? 'active' : ''}`" @click="dirBack"></i>
            </Tooltip>
            <Tooltip>
              <template #title>前进</template>
              <i :class="`iconfont icon-redo ${dirForwardStack.length ? 'active' : ''}`" @click="dirForward"></i>
            </Tooltip>
          </div>
          <DirPathBreadcrumb :cur-dir-id="curDirId" @switch-dir="switchDir"/>
          <!-- 按钮组 -->
          <div class="file-dialog-btns">
            <Button type="default" @click="toogleAddNewDirModal">新建文件夹</Button>
            <Button type="primary" @click="toogleUploadFileModal">
              <template #icon><PlusOutlined /></template>
              上传文件
            </Button>
          </div>
        </div>
        <div class="file-dialog-content">
          <!-- 左侧内容 -->
          <div class="file-dialog-content-left">
            <!-- 文件夹结构 -->
            <div class="file-dialog-folder">
              <Tree
                :selectedKeys="selectedKeys"
                draggable
                block-node
                :show-line="true"
                :default-expanded-keys="['sound-effect-a']"
                :defaultExpandAll="true"
                :tree-data="treeData"
                @dragenter="onDirDragEnter"
                @drop="onDirDrop"
                @select="(keys) => switchDir(keys[0] as string)"
                class="file-dialog-folder-tree"
              >
              </Tree>
            </div>
            <!-- 存储空间 -->
            <div class="file-dialog-storage-capacity">
              <Progress :percent="sizePercent" size="small" :show-info="false" />
              <span class="file-dialog-storage-capacity-label">{{ totalSize }} / {{ maxSize }}</span>
            </div>
          </div>
          <!-- 右侧内容 -->
          <div class="file-dialog-content-right">
            <!-- 筛选输入框与排序按钮 -->
            <FileFilter v-model:sortType="sortType" v-model:sortOrder="sortOrder" />
            <!-- 文件列表 -->
            <FileContent
              :cur-dir-id="curDirId"
              v-model:file-list="sortedList"
              @double-click-dir="switchDir"
              :dir-progress-state="dirProgressState"
            />
          </div>
        </div>
      </div>
      <!-- 上传文件弹窗 -->
      <FileUploadModal
        :visible="state.uploadFileModalVisible"
        @ok="onUploadFileSubmit"
        @cancel="toogleUploadFileModal"
      />
      <!-- 添加新文件夹弹窗-->
      <AddNewDirModal
        :dir-tree="treeData"
        :parent-dir-id="curDirId"
        :visible="state.addNewDirModalVisible"
        @ok="onAddNewDir"
        @cancel="toogleAddNewDirModal"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useFileSize } from './hooks/useFileSize';
import { ROOT_ID, useDir } from './hooks/useDir';
import { service as storageService } from '@/modules/storage-module';
import { message, UploadFile, Tree, Modal, Tooltip, Progress, Button, Tabs, TabPane } from 'ant-design-vue';
import { useFileSort } from './hooks/useFileSort';
import { fileDialogState } from './fileDialogController';
import { useFile } from './hooks/useFile';
import { PlusOutlined } from '@ant-design/icons-vue';
import FileUploadModal, { UploadFileForm } from './components/FileUploadModal.vue';
import AddNewDirModal, { AddNewDirForm } from './components/AddNewDirModal.vue';
import FileContent from './components/file-content/index.vue';
import FileFilter from './components/FileFilter.vue';
import DirPathBreadcrumb from './components/DirPathBreadcrumb.vue';

// 文件夹相关逻辑
const {
  selectedKeys,
  treeData,
  curDirId,
  dirBackwardStack,
  dirForwardStack,
  onDirDragEnter,
  onDirDrop,
  switchDir,
  dirBack,
  dirForward,
} = useDir();
const { fileList, dirProgressState, uploadFile } = useFile(curDirId);

// 文件容量显示
const { totalSize, maxSize, sizePercent, checkFileSize } = useFileSize();

// 文件排序
const { sortedList, sortOrder, sortType } = useFileSort(fileList);

const state = reactive({
  /** 是否加载中 */
  isLoading: false,
  /** 存储库列表 */
  storageLibrarys: [{ key: 'main', title: '凝动私人存储库' }] as Record<string, any>[],
  /** 当前存储库Id */
  currentLibraryId: 'main',
  /** 文件显示方式（list/table） */
  fileShowType: 'list' as 'table',
  /** 上传文件弹窗显示 */
  uploadFileModalVisible: false,
  /** 新增文件夹显示 */
  addNewDirModalVisible: false,
});

const toogleUploadFileModal = () => {
  state.uploadFileModalVisible = !state.uploadFileModalVisible;
};

const onUploadFileSubmit = async (uploadFileForm: UploadFileForm) => {
  // 当前文件夹内，是否有正在上传的同名文件
  const hasSameNameFile = dirProgressState.value.findIndex((item) => item.filename === uploadFileForm?.file?.name) > -1;
  if (hasSameNameFile) {
    message.error('已有相同文件正在上传');
  } else if (!checkFileSize(uploadFileForm.file?.size ?? 0)) {
    message.error('文件大小超出容量限制');
  } else {
    toogleUploadFileModal();
    await uploadFile({
      file: uploadFileForm.file as UploadFile,
      tags: uploadFileForm.customTags,
      dirId: curDirId.value,
      remark: uploadFileForm.des,
    });
  }
};

const toogleAddNewDirModal = () => {
  state.addNewDirModalVisible = !state.addNewDirModalVisible;
};
const onAddNewDir = async (addNewDirForm: AddNewDirForm) => {
  toogleAddNewDirModal();
  await storageService.addNewDir({
    dirName: addNewDirForm.dirName,
    parentId: addNewDirForm.parentDirId,
    remark: addNewDirForm.des,
  });
};

const onClose = () => {
  fileDialogState.visible = false;
};

onMounted(() => storageService.initFileModule(ROOT_ID));
</script>

<style lang="less">
@import '/src/assets/less/variable.less';

@border-radius: 6px;

.file-dialog {
  > .ant-modal {
    > .ant-modal-content {
      border-radius: @border-radius;

      > .ant-modal-close {
        > .ant-modal-close-x {
          width: 40px;
          height: 40px;

          > .anticon {
            line-height: 46px;
            vertical-align: top;
          }
        }
      }

      > .ant-modal-body {
        display: flex;
        flex-direction: column;
        padding: 0px;
        height: 650px;

        > .file-dialog-header {
          flex-shrink: 0;
          flex-grow: 0;
        }

        > .file-dialog-body {
          flex-shrink: 1;
          flex-grow: 1;
          display: flex;
          flex-direction: column;

          > .file-dialog-tools {
            flex-shrink: 0;
            flex-grow: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid #eee;

            > .file-dialog-icon-btns {
              flex-shrink: 0;
              flex-grow: 0;
              border-right: 1px solid #eee;
              padding-right: 10px;

              > .iconfont {
                display: inline-block;
                font-size: 14px;
                color: #666;
                width: 28px;
                height: 28px;
                line-height: 30px;
                vertical-align: middle;
                text-align: center;
                transition: 0.1s;

                + .iconfont {
                  margin-left: 4px;
                }
                &.active {
                  color: @primary-color;
                }
              }
            }

            > .file-dialog-btns {
              flex-shrink: 0;
              flex-grow: 0;
              text-align: right;
              margin-right: 5px;

              > .ant-btn {
                + .ant-btn {
                  margin-left: 10px;
                }
              }
            }
          }

          > .file-dialog-content {
            flex-shrink: 1;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            > .file-dialog-content-left {
              flex-shrink: 0;
              flex-grow: 0;
              display: flex;
              flex-direction: column;
              width: 250px;
              border-right: 1px solid #eee;

              > .file-dialog-folder {
                flex-shrink: 1;
                flex-grow: 1;
                padding: 10px;
                overflow-y: auto;
                overflow-x: auto;
                height: 100px;
                .file-dialog-folder-tree {
                  .ant-tree-title {
                    white-space: nowrap !important; /*强制span不换行*/
                    display: inline-block !important;
                  }
                }
              }

              > .file-dialog-storage-capacity {
                flex-shrink: 0;
                flex-grow: 0;
                border-top: 1px solid #ddd;
                padding: 6px 10px 14px 10px;

                > .file-dialog-storage-capacity-label {
                  display: flex;
                  flex-direction: row;
                  justify-content: flex-end;
                  font-size: 13px;
                  color: #888;
                }
              }
            }

            > .file-dialog-content-right {
              flex-shrink: 1;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
            }
          }
        }
      }
    }
  }
  .split-row {
    display: inline-block;
    width: 1px;
    height: 24px;
    border-left: 1px solid #ddd;
    padding-left: 10px;
    margin-left: 10px;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
