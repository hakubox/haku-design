<template>
  <ComponentBasic class="component-complete-score" v-bind.prop="getQBasicProps({ ...props, ...$attrs })" :componentLabel="''"
    :componentDescription="''">
    <label class="component-complete-score-content" v-html="parseHTML"></label>
  </ComponentBasic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script lang="ts" setup>
import { useAttrs, onMounted, PropType, reactive, watch } from 'vue';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { service as scoringService } from '@/modules/scoring-module';
import { getQBasicProps } from '@/tools/common';
import { computed } from 'vue';

const attrs = useAttrs();

const props = defineProps({
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  margin: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
});


const state = reactive({
  inputValue: '',
});

const parseHTML = computed(() => {
  const _txt = attrs.text as string;
  const reg = /\{\{.*?\}\}/g;
  let match: RegExpExecArray | null = reg.exec(_txt);
  let _index = 0;
  const _re: string[] = [];
  const _indexes: number[] = [];
  while (match) {
    if (!_indexes.includes(match.index)) _indexes.push(match.index);
    _indexes.push(match.index + match.toString().length);
    match = reg.exec(_txt);
  }
  _indexes.push(_txt.length);
  _index = 0;
  for (let i = 0; i < _indexes.length; i++) {
    let val = _txt.substring(_index, _indexes[i]);
    if (val === '{{score}}') {
      if (attrs.isPreview) {
        scoringService.countScore();
        val = '' + formFillState.totalScore;
      } else {
        val = '??';
      }
    }
    _re.push(val);
    _index = _indexes[i];
  }
  return _re.join('');
})
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-complete-score {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  font-size: 14px;

  >.component-complete-score-content {
    width: 100%;

    >.component-complete-score-content-value {
      color: darkorange;
      font-size: 26px;
    }
  }
}
</style>
