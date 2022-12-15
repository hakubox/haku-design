<template>
  <q-basic
    class="component-card-picker"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
  >
    <div class="component-card-list">
      <div
        class="component-card-item"
        :class="{ active: isSelected(item.value), disabled: !isSelected(item.value) && props.maxCount && props.maxCount <= state.selectedInfo.length }"
        v-for="(item, index) in state.cardList"
        :key="item.value"
      >
        <Icon @click="selectItem(item)" class="selected-icon" name="success" />
        <div
          class="component-card-item-title"
          @click="selectItem(item)"
        >
          <span v-if="!item.isElse">{{ item.label }}</span>
          <div v-else class="item-title-input">
            <label v-if="props.titleLabel">{{ props.titleLabel }}</label>
            <input type="text" v-model="item.label" @change="changeElseTxt(index, $event)" />
            <!-- <span class="input-text-shadow">{{ item.label || '█' }}</span> -->
          </div>
        </div>
        <div class="component-card-item-title-props" v-if="props.extraInfo?.length && isSelected(item.value)">
          <div
            class="component-card-item-title-prop"
            v-for="prop in props.extraInfo"
            :key="prop.name"
          >
            <div class="component-card-item-title-prop-label" :class="{ required: prop.required }">{{ prop.title }}</div>
            <SimpleEditor
              class="component-card-item-title-prop-value"
              :type="prop.type"
              v-model:value="getItem(item.value).infos[prop.name]"
              @change="changeInfo"
            />
          </div>
        </div>
        <Icon v-if="item.isElse && globalState.isMobile" class="item-remove" name="cross" @click.stop="removeElseItem(index)">移除</Icon>
        <ul v-else-if="item.isElse" class="component-card-item-tool-list_pc">
          <li class="component-card-item-tool-item_pc">
            <Icon class="item-remove" name="cross" @click.stop="removeElseItem(index)">移除</Icon>
          </li>
        </ul>
      </div>
      <div
        v-if="props.hasElse"
        class="component-card-item component-card-item-add"
        @click="addItem()"
      >
        <Icon class="add-icon" name="plus" />
        <span class="add-text">添加</span>
      </div>
    </div>
  </q-basic>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
    components: { Icon }
};
</script>
<script lang="ts" setup>
import { nextTick, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import SimpleEditor from '@/components/editor/simple-editor/SimpleEditor.vue';
import { state as globalState } from '@/common/global';
import { getQBasicProps } from '@/tools/common';
import { Icon } from 'vant';

const props = defineProps({
  value: {
    type: Array as PropType<{ value: string, infos: Record<string, any>, isElse: boolean }[]>,
  },
  component: {
    type: Object,
    default: () => ({}),
  },
  /** 卡片选项列表 */
  options: {
    type: Array as PropType<any[]>
  },
  /** 附加属性 */
  extraInfo: {
    type: Array as PropType<any[]>
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 选择模式 */
  selectMode: {
    type: String as PropType<'not-choice' | 'single-choice' | 'multiple-choice'>,
    default: 'not-choice'
  },
  /** 最大选择数量 */
  maxCount: {
    type: Number,
    default: 0
  },
  /** 是否包含其他 */
  hasElse: {
    type: Boolean,
    default: false,
  },
  /** 标题标签 */
  titleLabel: {
    type: String,
  }
});

const emit = defineEmits<{
  (event: 'change', value: any): void;
  (event: 'update:value', value: any): void;
}>();

/** 修改其他项文本 */
const changeElseTxt = (optionIndex: number, e: any) => {
  const _label = state.cardList[optionIndex].label;
  const _value = state.cardList[optionIndex].value;
  if (state.cardList) {
    state.cardList[optionIndex].value = _label;
    const _index = state.selectedInfo.findIndex(i => i.value === _value);
    if (_index >= 0) {
      state.selectedInfo[_index].value = _label;
    }
  }
  emit('update:value', state.selectedInfo);
  // setTimeout(() => {
  //   console.log('e.target.focus()', e.target);
  //   e.target.focus();
  // }, 200);
};

/** 移除 */
const removeElseItem = (index: number) => {
  state.cardList.splice(index, 1);
};

/** 新增项 */
const addItem = () => {
  if (state.cardList) {
    const _value = `新增项 ${state.cardList.filter(i => i.isElse).length + 1}`
    state.cardList.push({
      label: _value,
      value: _value,
      infos: {},
      isElse: true,
    });
  }
};

/** 选择项 */
const selectItem = (item: any) => {
  if (props.selectMode === 'not-choice') return;
  const _index = state.selectedInfo.findIndex(i => i.value === item.value);
  if (props.selectMode === 'multiple-choice') {
    if (_index >= 0) {
      state.selectedInfo.splice(_index, 1);
    } else if (!props.maxCount || props.maxCount > state.selectedInfo.length) {
      state.selectedInfo.push({ value: item.value, infos: {}, isElse: false });
    }
  } else if (props.selectMode === 'single-choice') {
    if (state.selectedInfo.length === 1 && state.selectedInfo[0].value === item.value) return;
    state.selectedInfo = [{ value: item.value, infos: {}, isElse: false }];
  }
  emit('update:value', state.selectedInfo);
};

/** 获取项 */
const getItem = (value: string) => {
  const _index = state.selectedInfo.findIndex(i => i.value === value);
  return state.selectedInfo[_index];
};

/** 判断项是否选中 */
const isSelected = (value: string) => {
  return state.selectedInfo.findIndex(i => i.value === value) >= 0;
};

const changeInfo = () => {
  emit('update:value', state.selectedInfo);
};

const state = reactive({
  /** 是否显示弹出框 */
  showPicker: false,
  /** 已选择信息 */
  selectedInfo: [] as { value: string, infos: Record<string, any>, isElse: boolean }[],
  /** 卡片列表 */
  cardList: [] as { label: string, value: string, infos: Record<string, any>, isElse: boolean }[],
});

watch(() => props.options, (val, oldVal) => {
  state.cardList = (props.options || []).map(i => ({
    ...i,
    isElse: false,
  })) as typeof state.cardList;
});

watch(() => props.value, (val, oldVal) => {
  if (val !== oldVal) {
    state.selectedInfo = val ? val : [];
  }
});

onMounted(() => {
  state.cardList = (props.options || []).map(i => ({
    ...i,
    isElse: false,
  })) as typeof state.cardList;
  state.selectedInfo = props.value ? props.value : [];
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/variable.less';

.component-card-picker {

  &[layout="layout-span-1"] {
    > .component-card-list {

      > .component-card-item {
        width: calc(99.999% - 15px);
      }
    }
  }

  &[layout="layout-span-2"] {
    > .component-card-list {

      > .component-card-item {
        width: calc(49.999% - 15px);
      }
    }
  }

  &[layout="layout-span-3"] {
    > .component-card-list {

      > .component-card-item {
        width: calc(33.333% - 15px);
      }
    }
  }

  &[layout="layout-span-4"] {
    > .component-card-list {

      > .component-card-item {
        width: calc(24.999% - 15px);
      }
    }
  }

  > .component-card-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    width: 100%;
    margin-bottom: -15px;

    > .component-card-item {
      flex-shrink: 0;
      flex-grow: 0;
      position: relative;
      display: inline-flex;
      flex-direction: column;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      margin-right: 15px;
      margin-bottom: 15px;
      background-color: white;
      transition: background-color 0.2s;
      
      .mobile-style({
        width: 100%;
      });

      // 新增卡片
      &.component-card-item-add {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #FFFFFF;
        padding: 14px 15px;

        &:hover {
          background-color: #E1EFFF;
        }

        > .add-icon {
          font-size: 16px;
          text-align: center;
          width: 22px;
          height: 22px;
          line-height: 20px;
          border: 1px solid #2c3e50;
          border-radius: 50%;
        }
        > .add-text {
          display: inline-block;
          padding-left: 10px;
        }
      }

      &.disabled {
        cursor: not-allowed;
        background-color: #F5F5F5;
        color: #999999;
      }

      &.active {
        background-color: var(--primary-active-bg-color);
        border-color: var(--primary-color);

        > .selected-icon {
          color: white;
        }

        &:before {
          border-top-color: var(--primary-color);
          border-right-color: var(--primary-color);
          z-index: 0;
        }
      }

      &:before {
        content: '';
        position: absolute;
        display: block;
        top: -1px;
        right: -1px;
        width: 0px;
        height: 0px;
        border-top: 14px solid transparent;
        border-right: 14px solid transparent;
        border-bottom: 14px solid transparent;
        border-left: 14px solid transparent;
        border-top-right-radius: 4px;
        z-index: -1;
        transition: border-color 0.1s;
      }

      > .selected-icon {
        position: absolute;
        top: 0px;
        right: 0px;
        padding-left: 10px;
        padding-bottom: 10px;
        padding-top: 1px;
        padding-right: 1px;
        color: transparent;
      }

      > .component-card-item-title {
        flex-shrink: 1;
        flex-grow: 1;
        display: block;
        padding: 15px;

        > .item-title-input {
          // position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          // min-width: 80px;
          // max-width: 150px;

          > label {
            flex-grow: 0;
            flex-shrink: 0;
            white-space: nowrap;
            min-width: 50px;
            margin-right: 10px;
          }

          > input {
            flex-grow: 1;
            border: 1px solid #E0E1EC;
            border-radius: 3px;
            width: 100%;
            line-height: 16px;
            height: 24px;
            padding-left: 6px;
          }

          > .item-remove {
            cursor: pointer;
            position: absolute;
            top: 0px;
            right: 0px;
            color: #999999;
            margin-left: 10px;
            margin-right: 4px;
            font-size: 20px;
            line-height: 20px;
            transition: color 0.15s;

            &:hover {
              color: #ff4d4f;
            }
          }

          // > .input-text-shadow {
          //   display: inline-block;
          //   white-space: nowrap;
          //   padding: 0px 15px;
          //   visibility: hidden;
          // }
        }
      }

      > .component-card-item-title-props {
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 0px;
        border-top: 1px solid #F0F0F0;
        padding-bottom: 15px;

        > .component-card-item-title-prop {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          + .component-card-item-title-prop {
            margin-top: 10px;
          }

          > .component-card-item-title-prop-label {
            flex-shrink: 0;
            flex-grow: 0;
            display: inline-block;
            margin-right: 10px;
            min-width: 50px;
            font-size: 12px;

            &.required {

              &:before {
                content: '*';
                display: inline-block;
                font-weight: normal;
                font-size: 16px;
                line-height: 14px;
                padding-right: 2px;
                vertical-align: bottom;
                color: #ff4d4f;
              }
            }
          }

          > .component-card-item-title-prop-value {
            flex-shrink: 1;
            flex-grow: 1;
            display: inline-block;
            width: 100%;

            :deep(> input) {
              display: block;
              border: 1px solid #E0E1EC;
              border-radius: 3px;
              width: 100%;
              border-radius: 3px;
              height: 24px;
              padding-left: 6px;
            }
          }
        }
      }

      > .item-remove {
        cursor: pointer;
        display: flex;
        height: 40px;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #f0f0f0;
        font-size: 13px;
        color: #999;
        margin-left: 15px;
        margin-right: 15px;
        line-height: 20px;
        transition: color 0.15s;

        &:before {
          font-size: 18px;
          margin-right: 6px;
          transition: color 0.15s;
        }

        &:hover {
          color: #ff4d4f;

          &:before {
            color: #ff4d4f;
          }
        }
      }

      &:hover {

        > .component-card-item-tool-list_pc {
          visibility: visible;
          transform: translateY(10px);
          opacity: 1;
        }
      }

      > .component-card-item-tool-list_pc {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        visibility: hidden;
        opacity: 0;
        top: 100%;
        right: 0px;
        max-width: 80%;
        border-radius: 6px;
        background-color: rgba(0,0,0,0.7);
        transform: translateY(-10px);
        z-index: 9999;
        transition: 0.2s;

        &:before {
          content: '';
          position: absolute;
          display: block;
          top: -10px;
          left: 0px;
          width: 100%;
          height: 10px;
        }

        > .component-card-item-tool-item_pc {
          flex-shrink: 1;
          flex-grow: 0;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          height: 30px;

          > .item-remove {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            color: #CCC;
            margin-left: 15px;
            margin-right: 15px;
            line-height: 20px;
            transition: color 0.15s;

            &:before {
              font-size: 16px;
              margin-right: 6px;
            }

            &:hover {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }
}

</style>
