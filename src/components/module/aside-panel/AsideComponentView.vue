<template>
  <Empty
    v-if="!editorState.pages.some(i => i.children?.length)"
    description="暂无数据"
    :style="{ marginTop: '20vh' }"
  ></Empty>
  <ul v-else class="aside-outline">
    <li class="aside-outline-tool">
      <span>大纲标签类型</span>
      <Switch
        v-model:checked="state.labelType"
        checked-value="component"
        checked-children="组件名"
        un-checked-value="title"
        un-checked-children="标题名"
      ></Switch>
    </li>
    <li
      class="aside-outline-page"
      v-for="(page, pageIndex) in editorState.pages"
      :key="page.pageTitle"
      v-show="page.children?.length > 0"
    >
      <span class="aside-outline-page-title">{{ page.pageTitle }}</span>
      <ul>
        <AsideComponentChildView
          v-for="(item, index) in page.children"
          :key="item.id"
          :component="item"
          :pageIndex="pageIndex"
          :labelType="state.labelType"
        />
      </ul>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { state as editorState } from '@haku-design/editor';
import { Empty, Switch } from 'ant-design-vue';
import { reactive } from 'vue';
import AsideComponentChildView from './AsideComponentChildView.vue';

const state = reactive({
  /** 是否显示组件名 */
  labelType: 'component' as 'component' | 'title',
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

// 左侧已配置题目列表
.aside-outline {
  padding-left: 0px;
  padding: 0px 0px;
  margin-bottom: 0px;

  > .aside-outline-tool {
    text-align: right;
    padding: 10px 15px 0px 10px;

    > span {
      display: inline-block;
      font-size: 13px;
      color: #AAA;
      margin-right: 10px;
    }
  }

  > .aside-outline-page {

    &:nth-child(2) {
      > .aside-outline-page-title {
        padding: 4px 0px 6px 15px;
      }
    }

    > .aside-outline-page-title {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 12px 0px 6px 15px;
      font-size: 12px;
      font-weight: bold;
      color: #666;
      white-space: nowrap;

      &:after {
        content: '';
        flex-shrink: 1;
        flex-grow: 1;
        position: relative;
        margin-left: 15px;
        margin-right: 20px;
        width: 100%;
        height: 0px;
        border-top: 1px solid #EEE;
      }
    }
  }
}
</style>
