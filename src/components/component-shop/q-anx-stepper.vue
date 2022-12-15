<template>
  <q-basic
    class="component-anx-stepper"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="''"
    :componentDescription="''"
    :className="$attrs.className"
  >
    <div class="anx-stepper">
      <img
        class="anx-stepper-img"
        src="data:image/png;base64,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"
        alt=""
      />

      <div class="anx-stepper__option">
        <span v-if="props.options[props.currentStep]" class="anx-stepper__option-info">{{
          props.options[props.currentStep].label
        }}</span>
      </div>

      <div class="anx-stepper__count">
        <span class="anx-stepper__current-step">{{ props.currentStep + 1 }}</span>
        <span class="anx-stepper__all-step">/{{ options.length }}</span>
      </div>
    </div>
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';
import { getQBasicProps } from '@/tools/common';

const props = defineProps({
  /** 步骤列表 */
  options: {
    type: Array as PropType<{ label: string }[]>,
    default: () => [],
  },
  /** 当前步骤索引 */
  currentStep: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/app-variable.less';

.anx-stepper {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--anx-stepper-padding);
  box-sizing: border-box;
  width: 100%;

  .anx-stepper-img {
    width: var(--anx-stepper-image-size);
    margin-right: var(--anx-stepper-image-option-space);
  }

  .anx-stepper__option {
    width: 0;
    flex-grow: 1;
    display: flex;
    align-items: center;

    .anx-stepper__option-info {
      height: var(--anx-stepper-option-height);
      color: var(--anx-text-content-color);
      font-size: var(--anx-stepper-option-font-size);
      line-height: var(--anx-stepper-option-height);
      background: #ffffff;
      box-shadow: 0 4px 12px 0 #f0f1fa;
      border-radius: var(--anx-stepper-option-border-radius);
      padding: var(--anx-stepper-option-padding);
    }
  }

  .anx-stepper__count {
    font-size: var(--anx-stepper-step-font-size);

    .anx-stepper__current-step {
      color: var(--anx-text-primary-color);
    }

    .anx-stepper__all-step {
      color: var(--anx-text-title-color);
    }
  }
}
</style>
