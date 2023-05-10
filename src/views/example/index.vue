<template>
  <div class="example-page">
    <div class="example-header">
      <span style="display: inline-block; margin-right: 20px;">示例列表：</span>
      <Button
        v-for="item in state.pageList"
        :type="item.url === route.path ? 'primary' : 'default'"
        @click="router.push(item.url)"
      >{{ item.title }}</Button>
    </div>
    <div class="example-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from 'ant-design-vue';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const state = reactive({
  /** 示例/测试页面列表 */
  pageList: [
    { title: '背景模块', url: '/example/background' },
    { title: '时间轴', url: '/example/timeaxis' },
    { title: '拖拽方向识别', url: '/example/dragbox' },
    { title: '主题切换', url: '/example/themechange' },
  ]
});

</script>

<style lang="less" scoped>
.example-page {
  display: flex;
  flex-direction: column;
  width: 100%;

  > .example-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #DDD;
    margin-bottom: 20px;

    > button {

      + button {
        margin-left: 20px;
      }
    }
  }
}
</style>