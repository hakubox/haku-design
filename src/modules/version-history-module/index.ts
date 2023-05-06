import type { VersionHistoryInstance } from './@types';
import { getQuestionaryVersionList, setQuestionaryVersion } from "@/api/common/questionnaire";
import bus from '@/tools/bus';
import { reactive } from 'vue';
import { toast } from '@/common/message';

export const state = reactive({
  /** 版本历史列表 */
  versionHistoryList: [] as VersionHistoryInstance[],
  bus,
});

export const service = {
  /** 创建新版本历史实例 */
  createVersionHistory(): Promise<VersionHistoryInstance> {
    return new Promise((resolve, reject) => {
      const _instance: VersionHistoryInstance = {
        id: '',
        appVersion: 1,
        description: '',
        remark: '',
        createUser: '',
        updateTime: '',
      };
      resolve(_instance);
    });
  },
  /** 获取对应的版本历史 */
  getQuestionaryVersionList(id: string) {
    getQuestionaryVersionList(id).then(res => {
      state.versionHistoryList = res;
    }).catch(([err]) => {
      
    })
  },
  /** 获取对应的版本历史 */
  setQuestionaryVersion(id: string, version: number) {
    setQuestionaryVersion(id, version).then(res => {
      toast('问卷版本切换成功', 'success');
      state.bus.$emit('version_change');
      service.getQuestionaryVersionList(id);
    }).catch(([err]) => {
      
    })
  },
  getServiceInstanceName() {},
};

export default {
  state,
  service
};