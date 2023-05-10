<template>
  <div>
    <!-- 目前暂时用于主题修改测试 -->
    <p>示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本</p>
    <p>示例文本示例文本示例文本示例文本示例文本示例文本示例</p>
    <p>示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示文本示例文本示例文本示例文本示例文本示例文本示文本示例文本示例文本示例文本示例文本</p>
    <p>示例文本示例文本示例文本示例文本示例文本示例例文本示例文本示例文本</p>
    <p>示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本示例文本</p>

    <button @click="$event => toggleTheme($event, 'default')">明亮主题</button>&nbsp;
    <button @click="$event => toggleTheme($event, 'dark')">黑暗主题</button>&nbsp;
    <button @click="$event => toggleTheme($event, 'translucent')">半透明主题</button>&nbsp;
    <br />
    themeName: {{ state.themeName }} <br />
    prevThemeName: {{ state.prevThemeName }} <br />

    <button @click="$event => toggleTheme2($event)">切换</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import '@/assets/theme/theme-default/index.lazy.less';
import '@/assets/theme/theme-dark/index.lazy.less';
import '@/assets/theme/theme-translucent/index.lazy.less';

const state = reactive({
  themeName: 'default',
  prevThemeName: 'default',
});

const toggleTheme2 = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  let isDark: boolean;

  const transition = document['startViewTransition'](() => {
    console.log('isDark', isDark);
    const root = document.documentElement;
    isDark = root.classList.contains("dark");
    root.classList.remove(isDark ? "dark" : "light");
    root.classList.add(isDark ? "light" : "dark");
    console.log('isDark', isDark);
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    console.log('isDark', isDark);
    document.documentElement.animate({
      clipPath: isDark ? clipPath.reverse() : clipPath,
    }, {
      duration: 200,
      easing: "ease-in",
      pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
    });
  });
};

/** 切换主题 */
const toggleTheme = (event: MouseEvent, themeName: 'default' | 'dark' | 'translucent') => {
  if (themeName === state.themeName) return;
  
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  let _isReverse = false;

  const transition = document['startViewTransition'](() => {
    if (state.prevThemeName === themeName) {
      _isReverse = true;
      state.prevThemeName = themeName;
    } else {
      state.prevThemeName = state.themeName;
    }
    const root = document.documentElement;
    
    if (_isReverse) root.classList.add(`reverse`);
    else root.classList.remove(`reverse`);
    root.classList.remove(`theme-${state.themeName}`);
    root.classList.add(`theme-${themeName}`);
    state.themeName = themeName;
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate({
      clipPath: _isReverse ? clipPath.reverse() : clipPath, // 
    }, {
      duration: 500,
      easing: "ease-in",
      pseudoElement: _isReverse ? "::view-transition-old(root)" : "::view-transition-new(root)",
    });
  });
};

onMounted(() => {
});
</script>

<style lang="less">

html {
  &.light {

    > body {
      background-color: antiquewhite;

      p {
        color: darkslategray;
      }
    }
  }
  &.dark {
    > body {
      background-color: darkslategray;

      p {
        color: antiquewhite;
      }
    }
  }
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

.reverse::view-transition-old(root) {
  z-index: 999;
}
.reverse::view-transition-new(root) {
  z-index: 1;
}

::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 999;
}
</style>
