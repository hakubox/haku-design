<template>
  <div class="upload-progress-item-container">
    <span>{{ filename }}</span>
    <Progress :percent="percent" size="small" :show-info="false" />
  </div>
</template>

<script lang="ts" setup>
import { Progress } from 'ant-design-vue';
interface IProps {
  filename: string;
  percent: number;
}

const props = defineProps<IProps>();
</script>
<style lang="less" scoped>
.upload-progress-item-container {
  border: 1px dashed #d9d9d9;
  background-color: #fafafa;
  width: 100px;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 30px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-radius: 4px;
  margin-right: 10px;
  > :first-child {
    font-size: 12px;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    text-align: center;
  }
}
</style>
