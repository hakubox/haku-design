<template>
  <div
    class="demo-block"
    :class="[blockClass, { hover: state.hovering }]"
    @mouseenter="state.hovering = true"
    @mouseleave="state.hovering = false"
  >
    <div style="padding: 24px" class="source-bg form-component visible">
      <slot name="source"></slot>
    </div>
    <div class="meta" ref="meta">
      <div class="description" v-if="$slots.default">
        <slot></slot>
      </div>
      <pre class="source-code language-html"><code>
        <slot name="sourceCode"></slot>
      </code></pre>
    </div>
    <div class="demo-block-control" ref="control" @click="state.isExpanded = !state.isExpanded">
      <transition name="arrow-slide">
        <i :class="[iconClass, { hovering: state.hovering }]"></i>
      </transition>
      <span>{{ controlText }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { reactive, onMounted, onUnmounted, nextTick, watch, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import prismjs from 'prismjs';

const props = defineProps({
  jsfiddle: {
    type: Object,
    default: () => ({}),
  },
});

const state = reactive({
  hovering: false,
  isExpanded: false,
  fixedControl: false,
  scrollParent: null as Element | null,
  langConfig: {
    'hide-text': '隐藏代码',
    'show-text': '显示代码',
  },
});

const route = useRoute();
const router = useRouter();

const meta = ref<HTMLElement>();
const control = ref<HTMLElement>();

const instance = getCurrentInstance()!;

const lang = computed(() => {
  return route.path.split('/')[1];
});

const blockClass = computed(() => {
  const _path = router.currentRoute.value.path.split('/').pop();
  return `demo-${lang.value} demo-${_path}`;
});

const iconClass = computed(() => {
  return state.isExpanded ? 'iconfont-doc icon-doc-shangjiantou' : 'iconfont-doc icon-doc-xiajiantou';
});

const controlText = computed(() => {
  return state.isExpanded ? state.langConfig['hide-text'] : state.langConfig['show-text'];
});

const codeArea = computed(() => {
  return instance.proxy!.$el.getElementsByClassName('meta')[0];
});

const codeAreaHeight = computed(() => {
  if (instance.proxy!.$el.getElementsByClassName('description').length > 0) {
    return (
      instance.proxy!.$el.getElementsByClassName('description')[0].clientHeight +
      instance.proxy!.$el.getElementsByClassName('source-code')[0].clientHeight +
      20
    );
  }
  return instance.proxy!.$el.getElementsByClassName('source-code')[0].clientHeight;
});

const scrollHandler = () => {
  const { top, bottom, left } = meta.value!.getBoundingClientRect();
  state.fixedControl = bottom > document.documentElement.clientHeight && top + 44 <= document.documentElement.clientHeight;
}

const removeScrollHandler = () => {
  state.scrollParent && state.scrollParent.removeEventListener('scroll', scrollHandler);
}

watch(() => state.isExpanded, (val, oldVal) => {
  codeArea.value.style.height = val ? `${codeAreaHeight.value + 1}px` : '0';
  if (!val) {
    state.fixedControl = false;
    control.value!.style.left = '0';
    removeScrollHandler();
    return;
  }
  setTimeout(() => {
    state.scrollParent = document.querySelector('.page-component__scroll > .el-scrollbar__wrap');
    state.scrollParent && state.scrollParent.addEventListener('scroll', scrollHandler);
    scrollHandler();
  }, 200);
});

onMounted(() => {
  nextTick(() => {
    let sourceCode = instance.proxy!.$el.getElementsByClassName('source-code')[0];
    if (instance.proxy!.$el.getElementsByClassName('description').length === 0) {
      sourceCode.style.width = '100%';
      sourceCode.borderRight = 'none';
    }

    const _code = instance.proxy!.$el.querySelector('.source-code');
    _code.firstChild.innerText = _code.firstChild.innerHTML.trim();
    prismjs.highlightElement(_code, false, (a) => {
    });
  });
});

onUnmounted(() => {
  removeScrollHandler();
});
</script>

<style lang="less">
.demo-block {
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  margin-bottom: 1.5rem;

  &.hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);

    > .demo-block-control {

      > span {
        transform: translateX(-20px);
        opacity: 1;
      }
    }
  }

  code {
    font-family: Menlo, Monaco, Consolas, Courier, monospace;
  }

  .demo-button {
    float: right;
  }

  // .source-bg {
  //   background-image: linear-gradient(
  //     -89deg,
  //     rgba(10, 18, 43, 0.05) 0%,
  //     rgba(10, 18, 43, 0.06) 26%,
  //     rgba(26, 33, 55, 0.07) 54%,
  //     rgba(26, 33, 55, 0.1) 100%
  //   );
  // }

  .source {
    padding: 24px;
  }

  .meta {
    background-color: #fafafa;
    border-top: solid 1px #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height 0.2s;
  }

  .description {
    padding: 20px;
    box-sizing: border-box;
    border: solid 1px #ebebeb;
    border-radius: 3px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
    word-break: break-word;
    margin: 10px;
    background-color: #fff;

    p {
      margin: 0;
      line-height: 26px;
    }

    code {
      color: #5e6d82;
      background-color: #e6effb;
      margin: 0 4px;
      display: inline-block;
      padding: 1px 5px;
      font-size: 12px;
      border-radius: 3px;
      height: 18px;
      line-height: 18px;
    }
  }

  .source-code {
    border-radius: 0px !important;

    pre {
      margin: 0;
    }

    code.hljs {
      margin: 0;
      border: none;
      max-height: none;
      border-radius: 0;
      line-height: 1.8;
      color: black;
      &::before {
        content: none;
      }
    }
  }

  .demo-block-control {
    border-top: solid 1px #eaeefb;
    height: 44px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    margin-top: -1px;
    color: #d3dce6;
    cursor: pointer;
    position: relative;

    &.is-fixed {
      position: fixed;
      bottom: 0;
      width: 868px;
    }

    > i {
      position: absolute;
      font-size: 16px;
      line-height: 44px;
      transition: 0.3s;
      transform: translateX(0px);

      &.hovering {
        transform: translateX(-40px);
      }
    }

    > span {
      position: absolute;
      display: inline-block;
      transform: translateX(20px);
      font-size: 14px;
      line-height: 44px;
      transition: transform 0.3s, opacity 0.3s;
      opacity: 0.0;
    }

    &:hover {
      color: #409eff;
      background-color: #f9fafc;
    }

    &.text-slide-enter,
    &.text-slide-leave-active {
      // opacity: 0;
      transform: translateX(10px);
    }

    .control-button {
      line-height: 26px;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 14px;
      padding-left: 5px;
      padding-right: 25px;
    }
  }
}
</style>
