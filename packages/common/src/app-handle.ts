import { reactive, h, toRefs, ConcreteComponent, ref } from 'vue';
import { destoryComponent, loadComponent } from '@haku-design/common';

/** 应用操作模块 */
export function useAppHandle() {

  /** 状态 */
  const state = reactive({
  });

  /** 显示私人问卷库弹出框 */
  async function showPrivateQuestionnaireLibraryDialog() {
    const state = reactive({
      visible: true
    });
    const PrivateQuestionnaireLibraryDialog = ((await Object.values(import.meta.glob('@/components/module/PrivateQuestionnaireLibraryDialog.vue'))[0] as any)() as any).default;
    const container = loadComponent(PrivateQuestionnaireLibraryDialog as ConcreteComponent, {
      ...toRefs(state),
      'onUpdate:visible'(value) {
        state.visible = value;
      },
      onClose() {
        destoryComponent(container);
      }
    }).dom;
  }

  /** 显示公共问卷库弹出框 */
  async function showPublicQuestionnaireLibraryDialog() {
    const state = reactive({
      visible: true
    });
    const PublicQuestionnaireLibraryDialog = ((await Object.values(import.meta.glob('@/components/module/PublicQuestionnaireLibraryDialog.vue'))[0] as any)() as any).default;
    const container = loadComponent(PublicQuestionnaireLibraryDialog as ConcreteComponent, {
      ...toRefs(state),
      'onUpdate:visible'(value) {
        state.visible = value;
      },
      onClose() {
        destoryComponent(container);
      }
    }).dom;
  }

  return {
    ...toRefs(state),
    showPrivateQuestionnaireLibraryDialog,
    showPublicQuestionnaireLibraryDialog
  };
}
