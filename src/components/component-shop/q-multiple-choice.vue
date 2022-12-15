<template>
  <q-basic
    class="component-item-multiple-choice"
    :layout="layout"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
  >
    <CheckboxGroup :modelValue="value" :max="max" @change="changeValue" direction="horizontal">
      <Checkbox
        v-for="(item, index) in options"
        :class="{
          active: item.image && item.value === value,
          imgradio: item.image,
        }"
        :key="item.value"
        :name="item.value"
        :disabled="disabled || item.disabled || (max != 0 && value.length >= max && !value.includes(item.value))"
        shape="square"
        @click="changeValueByUser(item, index)"
      >
        {{ item.label }}
        <img
          v-if="item.image"
          class="component-single-choice-item-image"
          :src="storageService.getFileInfo(item.image)?.src"
          :style="{
            'border-radius': $attrs.borderRadius + 'px',
            'object-fit': $attrs.fillType as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down',
            'filter': `blur(${$attrs.blur}px)`
          }"
        />
      </Checkbox>
      <Checkbox
        shape="square"
        v-if="$attrs.hasElse"
        :checked="isElse"
        name="[ELSE]"
        style="height: 26px"
        @click="changeElseChecked()"
      >
        <div class="component-item-multiple-choice-else">
          <span>其他</span>
          <input
            v-if="isElse"
            class="component-item-multiple-choice-else-textbox"
            type="text"
            v-model="state.elseTxt"
            @click.stop
            @blur="changeElseValue(state.elseTxt)"
          />
        </div>
      </Checkbox>
    </CheckboxGroup>
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { defineComponent, onMounted, PropType, reactive, watch } from 'vue';
import { state as storageState, service as storageService } from '@/modules/storage-module';
import { computed } from '@vue/reactivity';
import { getQBasicProps } from '@/tools/common';
import { Checkbox, CheckboxGroup } from 'vant';

const props = defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  layout: {
    type: String,
  },
  /** 最大选项数量 */
  max: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'update:value', val: any[]): void;
}>();

const state = reactive({
  inputValue: [] as string[],
  /** 其他文本 */
  elseTxt: '',
});

/** 当前选项是否包含其他 */
const isElse = computed(() => !props.value?.every((i) => props.options.findIndex((o) => o.value == i) >= 0));

watch(() => props.value, (val, oldVal) => {
  let _val = typeof val === 'string' ? (val as string).split(',') : val;
  let _else = _val?.filter(i => props.options.findIndex(o => o.value == i) < 0);
  if (_else.length) {
    state.elseTxt = _else[0];
  }
});

const init = () => {
  state.inputValue = props.value;

  let _else = props.value?.filter((i) => props.options.findIndex((o) => o.value == i) < 0);
  if (_else.length) {
    state.elseTxt = _else[0];
  }
};
const changeValue = (val) => {
  emit('update:value', val);
};
/** 改变其他的选中状态 */
const changeElseChecked = () => {
  if (isElse) {
    emit(
      'update:value',
      props.options?.filter((i) => props.value.includes(i.value)).map((i) => i.value),
    );
    state.elseTxt = '';
  } else if (!props.value.includes('')) {
    emit('update:value', [...props.value, '']);
  }
};
/** 改变其他的值 */
const changeElseValue = (txt) => {
  let _options = props.options?.filter((i) => props.value.includes(i.value));
  emit('update:value', [..._options.map((i) => i.value), txt]);
}
const changeValueByUser = (val, index) => {
  if (val.disabled) return;
  let vals = [...props.value];
  let _index = vals.indexOf(val.value);
  if (_index >= 0) {
    vals.splice(_index, 1);
  } else if (vals.length < props.max || props.max == 0) {
    vals.push(val.value);
  }
  emit('update:value', vals);
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.van-checkbox {
  padding: 4px;

  &.imgradio {
    display: inline-block;
    margin-left: 4px;
    margin-top: 4px;
    vertical-align: bottom;

    &.active {
      background-color: rgba(51, 122, 183, 0.2);
      border-radius: 6px;
    }

    > :deep(.van-radio__icon) {
      display: inline-block;
      width: auto;
      vertical-align: bottom;
    }

    .component-single-choice-item-image {
      object-fit: cover;
      width: 100%;
      max-height: 200px;
      margin-top: 8px;
      // border: 1px solid #DDD;
      border-radius: 4px;
      // padding: 6px;
    }
  }
}

.component-item-multiple-choice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > :deep(.component-item-label) {
    margin-bottom: 0px !important;
  }

  :deep(.component-item-multiple-choice-else) {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;

    > span {
      flex-shrink: 0;
      flex-grow: 0;
      line-height: 24px;
    }

    > .component-item-multiple-choice-else-textbox {
      flex-shrink: 1;
      flex-grow: 1;
      display: inline-block;
      width: 100%;
      padding-left: 4px;
      margin-left: 12px;
      border: 1px solid #ccc;
      border-radius: 3px;
      height: 24px;
      line-height: 24px;
    }
  }
}

.van-checkbox-group {
  > .van-checkbox {
    margin-top: 10px;
  }
}
</style>
