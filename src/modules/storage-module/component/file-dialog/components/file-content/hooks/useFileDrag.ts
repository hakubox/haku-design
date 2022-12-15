import { state as storageState, service as storageService } from '@/modules/storage-module';
import { FileType } from "@/modules/storage-module/tools/fileTypeHandler";
import { reactive, Ref, toRefs ,createVNode} from "vue";
import { Modal } from 'ant-design-vue';
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined';

/** 处理文件拖曳 */
export const useFileDrag = (params: {
  selectedFileIds: string[]; // 当前选中的文件id
  curDirId: Ref<string>; // 当前文件夹id
}) => {
  const { selectedFileIds, curDirId } = params;
  let filedIds = selectedFileIds;
  const state = reactive({
    isMove: false,
    moveId: '',
    currentId: '',
    isDraging: false,
  });
  const confirmMove = () =>{
    const title =  `是否确认将拖拽的文件，移入选中文件夹`;
    Modal.confirm({
      title: title,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '注意当前操作不可恢复'),
      onOk: () => {
        moveFile(curDirId.value, state.moveId, state.currentId).finally(()=>{
          state.moveId = '';
           state.currentId = '';
        });
      },
    });
  }
  /** 移动文件 */
  const moveFile = async (oldParentId: string, parentId: string, resourceId?: string) => {
    const fileId = resourceId ?? '';
    storageService.dragResource(
      {
        id: fileId,
        parentId: parentId,
      },
      oldParentId,
    );
  };

  const onmove = (e, originalEvent) => {
    if (!e.relatedContext.element) {
      return false;
    }
    if (e.relatedContext.element.type === FileType.dir) {
      if (state.isMove === false  && e.relatedContext.element.id !== state.currentId) {
        state.isMove = true;
        state.moveId = e.relatedContext.element.id;
      }
    } else {
      state.isMove = false;
      state.moveId = '';
    }
    return false;
  };

  const leave = (e) => {
    state.isMove = false;
    state.moveId = '';
    // state.currentId = '';
  };

  const dragstart = (e) => {
    state.isDraging = true;
    state.currentId = e.target.getAttribute("fileid");

  };
  const updateFileList = (list) => {
      filedIds = list;
    }
  const draging = (e) => {
    // const container = dragscontent.value;
    // const { clientY, clientX } = e;
    // const { clientHeight, clientWidth } = container;
    // const top = clamp(clientY - clientHeight / 2, 0, window.screen.height - clientHeight);
    // const left = clamp(clientX - clientWidth / 2, 0, window.screen.width - clientWidth);
    // container.style.top = `${top}px`;
    // container.style.left = `${left}px`;
  };
  const dragEnd = (e) => {
    state.isDraging = false;
  };
  const onend = (e) => {
    if (state.isMove) {
      if (filedIds.indexOf(state.currentId) > -1) {
        //TODO 多个文件拖拽
      } else {
        confirmMove();
      }
    } 
    state.isMove = false;
  };
  
  return {
    ...toRefs(state),
    onmove,
    leave,
    dragstart,
    draging,
    dragEnd,
    onend,
    updateFileList
  };
}