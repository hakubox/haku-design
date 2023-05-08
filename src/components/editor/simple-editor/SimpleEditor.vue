<template>
  <div>
    <input v-if="props.type === 'text'" type="text" :value="props.value" @input="change" />
    <input v-else-if="props.type === 'text-list'" type="text" :value="props.value" @input="change" />
    <input v-else-if="props.type === 'number'" type="number" :value="props.value" @input="change" />
    <input v-else-if="props.type === 'boolean'" type="checkbox" :value="props.value" @input="change" />
    <input v-else-if="props.type === 'datetime'" type="datetime" :value="dateFormat(new Date(props.value as number), 'yyyy-MM-dd')" @change="change" />
    <div v-else-if="props.type === 'extrainfo-list'">
      {{ props.value }}
    </div>
    <div v-else>
      {{ props.value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { dateFormat } from '@/tools/common';
import { ComponentAnswerType } from '@haku-design/core/@types';

const props = defineProps({
  type: {
    type: String as PropType<ComponentAnswerType>,
    required: true,
  },
  value: {
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: 'update:value', val): void;
  (eventName: 'change', val): void;
}>()

/** 改变值 */
const change = (e) => {
  let val: any = undefined;
  switch (props.type) {
    case 'text':
      val = '' + e.target.value;
      break;
    case 'text-list':
      val = e.target.value.split(',');
      break;
    case 'number':
      val = Number(e.target.value);
      break;
    case 'boolean':
      if (e.target.checked === 'true') val = true;
      else if (e.target.checked === 'false') val = false;
      else val = Boolean(e.target.checked);
      break;
    case 'datetime':
      val = new Date(e.target.value).getTime();
      break;
    default:
      break;
  }
  emit('update:value', val);
  emit('change', val);
};
</script>

<style lang="less" scoped></style>
