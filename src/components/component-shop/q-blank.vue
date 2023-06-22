<template>
  <Tooltip placement="bottom" :title="$attrs.title">
    <span
      class="q-blank-component"
      :style="{
        position: isAbsolute ? 'absolute' : 'relative',
        minHeight: minHeight,
      }"
    >
      <span v-if="description" class="q-blank-description">{{ description }}</span>
    </span>
  </Tooltip>
</template>

<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue';

const props = defineProps({
  /** 最小高度 */
  minHeight: {
    type: String,
    default: '0px',
  },
  /** 是否采用绝对定位 */
  isAbsolute: {
    type: Boolean,
    default: true,
  },
  /** 描述 */
  description: {
    type: String,
    default: '暂无子组件',
  },
});
</script>

<style lang="less" scoped>
// 空组件
.q-blank-component {
  position: relative;
  top: 0;
  left: 1px;
  bottom: 0;
  right: 1px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 2px);
  height: 100%;
  background: repeating-linear-gradient(45deg, #0000, #0000 10px, #f5f5f5 10px, #f5f5f5 calc(2 * 10px)), white;

  &:before {
    content: '';
    position: relative;
    display: block;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K');
    background-size: 55px 35px;
    background-position: 50%;
    background-repeat: no-repeat;
    width: 100%;
    height: 35px;
    text-align: center;
  }

  > .q-blank-description {
    content: '';
    position: relative;
    display: block;
    width: 100%;
    text-align: center;
    color: rgba(0, 0, 0, 0.25);
    font-size: 13px;
    margin-top: 5px;
  }
}
</style>
