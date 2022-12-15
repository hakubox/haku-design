<template>
  <div class="component-collapse layout-component">
    <div class="component-collapse-item" v-for="(item, optionIndex) in props.options" :key="optionIndex">
      <div class="component-collapse-item-header" @click="togglePanel(optionIndex)">
        <span>{{item.label}}</span>
        <i :class="item.isFold ? 'iconfont icon-arrow-right' : 'iconfont icon-arrow-left'"></i>
      </div>
      <div
        class="component-collapse-item-content"
        :class="{ hidden: item.isFold }"
        :style="{
          height: item.isFold ? `0px` : `${item.height}px`,
          overflow: item.overflowHidden ? 'hidden' : 'visible',
        }"
        ref="collapseItemEl"
      >
        <q-blank v-if="getComponents(optionIndex).length === 0" />
        <div v-else class="component-collapse-item-content-panel">
          <div v-for="(detailItem, detailIndex) in getComponents(optionIndex)" :key="detailIndex" class="component-collapse-item-content-panel-component">
            <slot :name="`child_${optionIndex}_${detailItem.id}`"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, PropType, reactive, useAttrs, onMounted, ref, watch, nextTick } from 'vue';
import { Component } from '@/@types';
import { cloneForce } from '@/lib/clone';

const props = defineProps({
  /** 当前组件 */
  component: {
    type: Object as PropType<Component>,
    required: true
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<{
      /** 标签 */
      label: string,
      /** 是否展开 */
      isFold: boolean,
      /** 是否隐藏多余部分（用于滚动） */
      overflowHidden: boolean,
      /** 高度（自动获取） */
      height: number,
    }[]>,
    default: () => [],
    required: true
  }
});

const attrs = useAttrs();

const emit = defineEmits<{
  (eventName: 'update:options', value: {
    /** 标签 */
    label: string,
    /** 是否展开 */
    isFold: boolean,
    /** 是否隐藏多余部分（用于滚动） */
    overflowHidden: boolean,
    /** 高度（自动获取） */
    height: number,
  }[]): void;
}>();

const state = reactive({
  /** 是否刷新中 */
  isRefreshing: false,
});

const collapseItemEl = ref<HTMLElement[]>();

/** 子组件列表 */
const getComponents = (groupIndex?: number) => {
  const _components = ((props.component as Component).children || []);
  if (groupIndex === undefined) {
    return _components;
  } else {
    return _components.filter((component, index) => component.slotIndex === groupIndex);
  }
};

/** 展开面板 */
const openPanel = (i: number) => {
  const _panel = props.options || [];
  _panel.map(x => x.isFold = true);
  _panel[i].isFold = false;
};

/** 收起面板 */
const closePanel = (i: number) => {
  const _panel = props.options || [];
  _panel[i].isFold = true;
  console.log(props.options);
};

const togglePanel = (index: number) => {
  const _item = props.options?.[index];
  if (_item) {
    const _childEl = collapseItemEl.value![index]?.querySelector<HTMLElement>('.component-collapse-item-content-panel') ?? null;
    const _height: number = _childEl ? (_childEl.offsetHeight + 20) : 100;
    const _options = cloneForce(props.options);
    _options[index] = {
      label: _item.label,
      height: _height,
      isFold: !_item.isFold,
      overflowHidden: true,
    };
    emit('update:options', cloneForce(_options));
    if (!_options[index].isFold) {
      setTimeout(() => {
        _options[index].overflowHidden = false;
        emit('update:options', cloneForce(_options));
      }, 300);
    }
  }
}

const refresh = () => {
  if (state.isRefreshing) return;
  state.isRefreshing = true;
  nextTick(() => {
    if (props.component.children) {
      const _options = cloneForce(props.options);
      _options.forEach((item, index) => {
        item.overflowHidden = true;
        const _childEl = collapseItemEl.value![index]?.querySelector<HTMLElement>('.component-collapse-item-content-panel') ?? null;
        const _height: number = _childEl ? (_childEl.offsetHeight + 20) : 100;
        _options[index].height = _height;
      });
      emit('update:options', cloneForce(_options));
      state.isRefreshing = false;
      setTimeout(() => {
        _options.forEach(item => {
          if (!item.isFold) item.overflowHidden = false;
        });
        emit('update:options', cloneForce(_options));
      }, 300);
    }
  });
};

watch(() => (props.component.children || []).map(i => i.id), (val, oldVal) => {
  refresh();
});

onMounted(() => {
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-collapse {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  min-height: initial;

  > .component-collapse-item {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;

    > .component-collapse-item-header {
      cursor: pointer;
      display: flex;
      padding: 12px 18px;
      justify-content: space-between;
      align-items: center;
      background-color: #F1F1F5;
      border-bottom: 1px solid #E8E8F2;

      > .iconfont {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        line-height: 16px;
        color: #969799;
        transform: rotate(90deg);
        transition: transform 0.2s;
      }
    }

    > .component-collapse-item-content {
      position: relative;
      height: 100px;
      transition: height 0.3s, overflow 0.3s, padding 0.3s;
      padding: 10px;

      &.hidden {
        height: 0px;
        overflow: hidden;
        padding: 0px 10px;

        > .component-collapse-item-content-panel {
        }
      }
      
      > .q-blank-component {

      }

      > .component-collapse-item-content-panel {
      }
    }
  }
}
</style>
