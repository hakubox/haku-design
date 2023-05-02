<template>
  <div class="file-content" @click.stop @mousedown.stop="state.rightClickMenuVisible = false">
    <Empty
      v-if="!props.fileList.length"
      description="暂无文件"
      :style="{ marginTop: '120px', width: '100%', height: '330px' }"
    ></Empty>
    <VueDraggableNext
      v-else
      :list="fileList"
      class="file-dialog-file-list"
      :move="onmove"
      @end="onend"
      @dragleave="leave"
      @dragstart="dragstart"
      @drag="draging"
      @dragend="dragEnd"
      draggable=".file-dialog-file-item"
    >
      <transition-group>
        <div
          class="file-dialog-file-item"
          v-for="item in fileList"
          :key="item.id"
          :fileid="item.id"
          :class="{
            selected: state.selectedFileIds.includes(item.id),
            canMove: item.id === moveId,
          }"
          @click="onSelectFile(item.id, fileDialogState.allowMultiSelect)"
          @dblclick="onDblClick(item)"
          @contextmenu="(event) => onRightClick(event, item.id)"
        >
          <div class="file-dialog-file-item-icon">
            <img
              v-if="!isDir(item.type) && item.type === FileType.image && item.previewSrc"
              :src="item.previewSrc"
              alt=""
            />
            <svg v-else class="icon" aria-hidden="true">
              <use :xlink:href="`#${getFileIconByFileType(item.type)}`"></use>
            </svg>
          </div>
          <span class="file-dialog-file-item-name">
            <InputLable
              :show-input="showRenameInput && activeMenuFile?.id === item?.id"
              :default-value="activeMenuFile?.name ?? ''"
              @submit="handleInputConfirm"
            >
              {{ item.name }}
            </InputLable>
          </span>
        </div>
      </transition-group>
     
      <UploadProgressItem
        v-for="{ filename, progress } in dirProgressState"
        :key="filename"
        :filename="filename"
        :percent="progress.percent * 100"
      />
    </VueDraggableNext>
  </div>
  <div class="file-dialog-content-bottom">
    <div class="file-dialog-content-status">
      <span>{{ fileList.length }} 个项目</span>
      <span>选中 {{ state.selectedFileIds.length }} 个项目</span>
      <span>{{ curDirFileSize }}</span>
    </div>
    <!-- 底部选择栏 -->
    <div class="file-dialog-submit" v-if="fileDialogState.canSelectFile">
      <Button type="default" @click="onClose"> 取消 </Button>
      <Button type="primary" @click="onChecked">
        <template #icon><SendOutlined /></template>
        选择文件
      </Button>
    </div>
  </div>
  <!-- 右键菜单 -->
  <Vue3Menus v-model:open="state.rightClickMenuVisible" :event="state.menuEvent" :menus="menus" hasIcon :zIndex="9999">
  </Vue3Menus>
  <!-- 右键查看文件属性弹窗 -->
  <FileAttributeModal v-model:visible="fileAttributeModalVisible" :file-item="activeMenuFile" />
  <!-- 文件预览-->
  <FilePreview v-model:visible="showPreview" :activeMenuFile="activeMenuFile" />
</template>

<script lang="ts" setup>
/** 文件展示面板 */
import { StorageFileInfo } from '@/modules/storage-module/@types';
import { FileType, getFileIconByFileType } from '../../../../tools/fileTypeHandler';
import {
  getCurrentInstance,
  nextTick,
  onUnmounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
} from 'vue';
import InputLable from '../common/InputLable.vue';
import { Button, Empty } from 'ant-design-vue';
import { fileDialogState } from '../../fileDialogController';
import { computed } from 'vue';
import { parseByte } from '../../tools/transFileSize';
import { ProgressState } from '../../hooks/useFile';
import { VueDraggableNext } from 'vue-draggable-next';
import FileAttributeModal from './components/FileAttributeModal.vue';
import FilePreview from './components/FilePreview.vue';
import UploadProgressItem from './components/UploadProgressItem.vue';
import { useFileDrag } from './hooks/useFileDrag';
import { useRightClickMenu } from './hooks/useRightClickMenu';
import { Vue3Menus } from 'vue3-menus';
import { toast } from '@/common/message';

interface IEmits {
  (e: 'doubleClickDir', dirId: string): void;
  (e: 'update:fileList', fileList: StorageFileInfo[]): void;
}
const emits = defineEmits<IEmits>();

/** 键盘监听的key */
enum KeyboradWords {
  ctrl = 'Control',
  shift = 'Shift',
  a = 'a',
  A = 'A',
}
const props = defineProps({
  curDirId: {
    type: String,
    required: true,
  },
  fileList: {
    type: Array as PropType<StorageFileInfo[]>,
    default: () => [],
    required: true,
  },
  dirProgressState: {
    type: Array as PropType<ProgressState>,
    default: () => [],
    required: true,
  },
});
const { curDirId } = toRefs(props);
const state = reactive({
  /** 当前选中的文件id列表 */
  selectedFileIds: [] as string[],
  menuEvent: null as any,
  rightClickMenuVisible: false,
});

const fileList = computed({
  get: () => props.fileList,
  set: (newVal) => emits('update:fileList', newVal)
})

const dbClick = (id) => {
  emits('doubleClickDir', id);
};

// 右键菜单
const {
  menus,
  showRenameInput,
  activeMenuFile,
  fileAttributeModalVisible,
  onRightClickFile,
  renameFile,
  showPreview,
  viewFile,
} = useRightClickMenu(fileList, curDirId, dbClick);

const {
  moveId,
  isDraging,   
  onmove,
  leave,
  dragstart,
  draging,
  dragEnd,
  onend,
  updateFileList
} = useFileDrag({
  selectedFileIds: state.selectedFileIds,
  curDirId,
});

/** 按键状态，是否被按下 */
const keyboradEventState = reactive({
  [KeyboradWords.ctrl]: false,
  [KeyboradWords.shift]: false,
  [KeyboradWords.a]: false,
  [KeyboradWords.A]: false,
});

/** 最后选中的文件id */
const lastSelectId = ref('');

/** 当前文件夹的文件总大小 */
const curDirFileSize = computed(() => {
  const totalSize = props.fileList.map((item) => item.fileSize).reduce((a, b) => a + b, 0);
  return parseByte(totalSize).replace(/([a-zA-z]?[bB]$)/, ' $1');
});

/** 是否是文件夹 */
const isDir = (fileType: string) => {
  return fileType === FileType.dir;
};

const onRightClick = (event, id) => {
  onSelectFile(id, fileDialogState.allowMultiSelect);
  nextTick(() => {
    state.menuEvent = event;
    state.rightClickMenuVisible = true;
  });
  onRightClickFile(id);
  event.preventDefault();
};

const handleInputConfirm = (inputValue: string) => {
  renameFile(inputValue);
};

/**
 * 当前选中的文件
 * @param id 当前选中的文件id
 * @param isMultiSelect 是否多选
 */
const onSelectFile = (id: string, isMultiSelect: boolean = false) => {
  if (fileDialogState.canSelectFile) {
    const ctrl = keyboradEventState[KeyboradWords.ctrl];
    const shift = keyboradEventState[KeyboradWords.shift];
    if (isMultiSelect && (ctrl || shift)) {
      if (shift) {
        // shift多选
        const startIndex = props.fileList.findIndex((item) => item.id === lastSelectId.value);
        const endIndex = props.fileList.findIndex((item) => item.id === id);
        const rangeIds = props.fileList
          .slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
          .map((item) => item.id);
        state.selectedFileIds = rangeIds;
      } else {
        // ctrl多选
        if (state.selectedFileIds.includes(id)) {
          state.selectedFileIds = state.selectedFileIds.filter((item) => item !== id);
        } else {
          state.selectedFileIds.push(id);
        }
        lastSelectId.value = id;
      }
    } else {
      // 单选
      state.selectedFileIds = [];
      lastSelectId.value = id;
      state.selectedFileIds.push(id);
    }
    updateFileList(state.selectedFileIds);
  }
};

/** 双击文件 */
const onDblClick = (fileItem: StorageFileInfo) => {
  viewFile(fileItem);
};

/** 确认选择文件 */
const onChecked = () => {
  const selectList = props.fileList.filter((item) => state.selectedFileIds.includes(item.id));
  const hasDir = selectList.findIndex((item) => isDir(item.type)) > -1;
  if (hasDir) {
    toast('不能选择文件夹', 'error');
  } else {
    const fileList = props.fileList.filter((item) => state.selectedFileIds.includes(item.id));
    fileDialogState.onConfirm(fileList);
    fileDialogState.visible = false;
  }
};

/** 取消 */
const onClose = () => {
  fileDialogState.visible = false;
};

watchEffect(() => {
  window.addEventListener('keydown', (e) => {
    keyboradEventState[e.key] = true;
  });
  window.addEventListener('keyup', (e) => {
    keyboradEventState[e.key] = false;
  });
});

watch(showRenameInput, () => {
  if (showRenameInput.value) {
    nextTick(() => {
      if (activeMenuFile.value) {
        const ref = 'inputValue' + activeMenuFile.value.id;
        const instance = getCurrentInstance();
        if (instance && instance.refs[ref]) {
          console.log('&& instance.refs[ref]', instance.refs[ref]);
          (instance.refs[ref] as any)?.focus();
        }
      }
    });
  }
});

watch(
  () => props.curDirId,
  () => {
    state.selectedFileIds = [];
    updateFileList(state.selectedFileIds);
  },
);

onUnmounted(() => {
  window.removeEventListener('keydown', () => {});
  window.removeEventListener('keyup', () => {});
});
</script>
<style lang="less">
@import '/src/assets/less/variable.less';
.file-dialog-file-list {
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 450px;

  > .file-dialog-file-item {
    user-select: none;
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;
    display: block;
    width: 100px;
    text-align: center;
    padding-bottom: 4px;
    margin-bottom: 10px;
    border: 1px solid transparent;
    border-radius: 4px;
    margin-right: 10px;

    &:after {
      content: '';
      position: absolute;
      display: block;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }

    &.selected {
      border: 1px solid #4d8ce4;
      background-color: rgba(51, 122, 183, 0.2);
    }
    &.canMove {
      border: 1px solid red;
      background-color: rgba(51, 122, 183, 0.2);
    }

    > .file-dialog-file-item-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 70px;
      width: 100px;
      height: 90px;

      > img {
        max-width: 80px;
        max-height: 80px;
        border-radius: 0px;
        box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.15);
      }
    }

    > .file-dialog-file-item-name {
      display: block;
      font-size: 12px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0px 4px;

      > input[type='text'] {
        width: 100%;
        font-size: 12px;
      }
    }
  }
}
.content-info {
  width: 600px;
  height: 338px;
  background-color: black;
}
.moveMore {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: red;
  z-index: 9999;
}
.content-info-iframe {
  width: 0px;
  height: 0px;
}

.file-dialog-content-bottom {
  padding: 15px;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .file-dialog-content-status {
    color: @primary-color;
    display: flex;
    flex-direction: row;
    margin-left: 20px;
    > span + span {
      margin-left: 20px;
    }
  }
  // 提交层
  .file-dialog-submit {
    > .ant-btn {
      + .ant-btn {
        margin-left: 15px;
      }
    }
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
