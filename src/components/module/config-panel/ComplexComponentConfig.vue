<template>
  <div class="property-collapse">
    <div class="property-collapse-item">
      <label class="property-collapse-item-title"> 基础配置 </label>
      <div class="property-collapse-item-content">
        <!-- 面板标题 -->
        <!-- <label class="attr-editor-item">
            <span class="attr-editor-item-label">面板标题</span>
            <div class="attr-editor-item-value">
                <Input size="small" placeholder="表单标题" allowClear v-model.lazy="appConfig.canvasTitle" />
            </div>
        </label> -->
        <!-- 组件标题 -->
        <label class="attr-editor-item">
          <div class="attr-editor-item-panel">
            <span class="attr-editor-item-label">组件标题</span>
            <div class="attr-editor-item-value">
              <Input
                v-model:value.lazy="editorState.appConfig.appTitle"
                size="small"
                placeholder="组件标题"
                allow-clear
              />
            </div>
          </div>
        </label>
        <!-- 版本号 -->
        <label class="attr-editor-item">
          <div class="attr-editor-item-panel">
            <span class="attr-editor-item-label">组件版本号</span>
            <div class="attr-editor-item-value">
              <span class="txt-value">1</span>
            </div>
          </div>
        </label>
        <!-- 组件描述 -->
        <label class="attr-editor-item">
          <div class="attr-editor-item-panel">
            <span class="attr-editor-item-label">组件描述</span>
            <div class="attr-editor-item-value">
              <Textarea
                v-model:value.lazy="editorState.appConfig.description"
                size="small"
                placeholder="请填写组件描述"
                allow-clear
              />
            </div>
          </div>
        </label>
        <!-- 问卷备注 -->
        <label class="attr-editor-item">
          <div class="attr-editor-item-panel">
            <span class="attr-editor-item-label">问卷备注</span>
            <div class="attr-editor-item-value">
              <Textarea
                v-model:value.lazy="editorState.appConfig.remark"
                size="small"
                placeholder="请填写备注"
                allow-clear
              />
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { state as editorState } from '@/modules/editor-module';
import { Input, Textarea } from 'ant-design-vue';
</script>
