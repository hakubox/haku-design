<template>
  <div>
    <div v-for="(item, index) in formFillState.timerInfo.timeList" :key="index">
      {{item}}
    </div>
    <AnswerCanvas
      ref="ans"
      :target-id="qid"
      :use-request="true"
      user-id="1"
      @onEvent="onEvent"
      @onComplete="onComplete"
    ></AnswerCanvas>
    <button @click="submit">提交表单</button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import '../assets/sweetalert.css';
import AnswerCanvas from '../components/AnswerCanvas.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { state as formFillState } from '@haku-design/form-fill';

const route = useRoute();

const ans = ref<typeof AnswerCanvas>();

const state = reactive({
});

const submit = () => {
  ans.value!.submitForm();
}

const onComplete = (data) => {
  console.log('触发了onComplete', data);
}

const onEvent = (eventName: string, targetId: string, attrs?: Record<string, any>) => {
  console.log(eventName, targetId, attrs);
}

/** 问卷Id */
const qid = computed(() => {
  return (route.query.qid) as string;
});

onMounted(() => {
});

</script>

<style lang="less">

</style>
