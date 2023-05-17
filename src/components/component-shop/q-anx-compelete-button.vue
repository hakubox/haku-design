<template>
  <ComponentBasic
    class="component-anx-stepper"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="''"
    :componentDescription="''"
    :className="$attrs.className"
  >
    <div class="anx-complete-button">
      <div :class="['anx-button', { disabled: prevDisabled }]" @click="!prevDisabled && emit('prev')">
        <i class="arrow arrow-left"></i>
      </div>
      <div :class="['anx-button', { disabled: nextDisabled }]" @click="!nextDisabled && emit('next')">
        <i class="arrow arrow-right"></i>
      </div>
    </div>
  </ComponentBasic>
</template>

<script lang="ts" setup>
import { defineOptions } from 'vue';
import { getQBasicProps } from '@/tools/common';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  /** 禁用上一项 */
  prevDisabled: {
    type: Boolean,
    default: true,
  },
  /** 禁用下一项 */
  nextDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: 'prev'): void;
  (event: 'next'): void;
}>();
</script>

<style lang="less" scoped>
@import '/src/assets/less/app-variable.less';

.anx-complete-button {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .anx-button {
    width: var(--anx-compelete-button-size);
    height: var(--anx-compelete-button-size);
    background: var(--anx-button-primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:not(.disabled):active {
      opacity: 0.7;
    }

    &.disabled {
      background: var(--anx-button-disabled-color);
    }

    & + .anx-button {
      margin-left: var(--anx-compelete-button-space);
    }
  }

  .arrow {
    width: var(--anx-compelete-button-arrow-size);
    height: var(--anx-compelete-button-arrow-size);
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAADoElEQVRoQ+2aUYhVVRSGvz81KtFE8MWil140xELwLRzHrBBNGRuIkAbswYcSeilhVLJhaEAhfRBJ0AdhghA0ECEVKZIoNBoEbUAIKhGhVFRGR1OMFWvcI3eGmXv3vneEvfXu1/Ovc9e31zn7rL3/Kx6zoceMlybwo17xZoWbFX7EZqD5SOdQUDN7CegBlgD/Ad8CGyWdbzS/7CpsZguB74Bpo+AuA0slnWkEOitgM3sC+A2YOw7UP8BiSefqhc4N2Kv7Sw2Yi8AiSX/UA50bcBvwTQTIXwH6QoR2hCQ34AVAXyTE7wH670j9kCw3YM/nNPByJER/eKevROrzAvakzWw+8CMwPRLCJ2iJpOsx+qwqPJywmb0KHAWmxkAAJ4HXJd2spc8SOFR6KXAYeKoWRLh+Algm6XY1fbbAAXoFcBB4MhL6GLBK0p3x9FkDB+h24GtgciT0IaBd0r2x9NkDB+j3gH2Ad2IxYz+wRpL34fl+h6uRmNk6YHfCp9Qn6H1JVnnfIipcsXp/BOxIgP5S0gfFAofHuzNsHWMebdd8IenjYXFRFa6odDewOZYY6Jb0qesfAJvZ88DbwHMJi0PCb064tAOYlXDXDkm9Q8BmthbYBTydcIPSpDeAF2VmLeGEYVJpBHXk2+XAx/3opI7gEkP6HNgb7tgmvUTIypwHHPgaMKN0ksj8Bx34QFidI2OKlvU78DzgFPBM0ShxyW8f/iz5gXcvMDsurkjVXWBOZePhG+3Wh9R4jGjgJ2C6fKvYldh4bJLUU1xrGQ7rvwLeTZg413unZUUBmw3lu9e3fQmwfs79zvCBQGnAO4H1CbBuwrVJ8vd3aBQDbGZbgQ0JsN8DyyX9WxlTBLCZbQE+S4D9CXhT0uDomOyBzewTYFsC7K/Aa5IGxorJGtjMPgT8vY3N073jVklXx5ug2BslTPDESM3MV+I9CYcR7hm3SLpULYMsgc3Mv7He+cXu0d0rds/YveOqIztgM3slmOJTaiUfrrtH7LDuGdccOQK7c7CyZub3Be4NO6x7xVEjK2AzexZwrzfGVnGd/9/DPeLokRuwb1XPRmTvXrB7wu4NJ43cgGcCvspWW6z89PENSe4JJ4+sgD17M3NP2G3Sscat0C7+kEwaAnIEfgH4OezLK7kcdrUk94DrHtkBhyr7ycvnwFuAf56OAJ2S/qybNNcKNwpUKz7LCtdKupHrTeBGZq+E2GaFS6hSIzk2K9zI7JUQ+z/CHPvto3m1ZAAAAABJRU5ErkJggg==');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .arrow-left {
    transform: rotate(180deg);
  }
}
</style>
