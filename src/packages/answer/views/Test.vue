<template>
  <div>
    <AnswerCanvas
      ref="refQuestionare"
      :target-id="state.qid"
      :userId="state.userId"
      :empty="state.empty"
      :autoSave="state.autoSave"
      :showTitle="state.showTitle"
      :answerId="state.answerId"
      :showProgress="state.showProgress"
      :useRequest="state.useRequest"
      :showAnswer="state.showAnswer"
      :isScoring="state.isScoring"
      @onComplete="onComplete"
      @onEvent="onEvent"
    >
      <template v-slot:header>header</template>
      <template v-slot:footer>footer</template>
    </AnswerCanvas>
  </div>
  <Button block type="primary" size="large" @click="submitForm()">自定义提交</Button>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { put } from '@/lib/api';
import { Button } from 'vant';

const refQuestionare = ref() as any;

const props = defineProps({
  /** 问卷Id */
  qid: {
    type: String,
    required: true,
  }
});

const state = reactive({
  // qid: '1010',
  qid: '1072',
  userId: '1',
  answerId: '',
  empty: '未查询到数据', 
  autoSave: 0,
  showTitle: true,
  showProgress: true,
  useRequest: true,
  showAnswer: true,
  isScoring: false,
});

/** 确认保存 */
const onComplete = (e: Record<string, any>) => {
  console.log(e);
  if (state.isScoring) {
    const scores = e?.scores || [];
    const answerScore = [] as any;
    Object.keys(scores).forEach(key => {
      answerScore.push({
        questionId: scores[key].componentId,
        score: scores[key].score,
      })
    });
    const _data = {
      answerId: refQuestionare?.value.getAnswerInfo()?.id,
      answerScoreDTOList: answerScore,
      hospitalId: 0
    }
    console.log(_data);
    put('/questionary/questionaryAnswer/score', _data).then();
  } else {
    if (e?.isComplete){
      // post(`/questionary/questionaryAnswer/base-info`, { 
      //   questionaryId: state.qid,
      //   patientId: state.userId,
      //   answer: e.data,
      // }).then();
    }
  }
};

/** 通用事件 */
const onEvent = (eventName: string, targetId: string, attrs?: Record<string, any>) => {
  console.log(eventName, targetId, attrs);
};

/** 中途提交 */
const submitForm  = () => {
  refQuestionare.value.submitForm(false).then(res => {
    refQuestionare.value.mergeAnswer();
  })
}

onMounted(() => {
});

</script>

<style lang="less">
</style>
