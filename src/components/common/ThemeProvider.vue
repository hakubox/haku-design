<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

const props = defineProps({
  themeVars: {
    type: Object as PropType<Record<string, string>>,
    default: () => {},
  },
  prefix: {
    type: String,
    default: 'anx',
  },
});

const kebabCase = (key: string) =>
  key
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

const mapThemeVarsToCSSVars = (themeVars: Record<string, string>) => {
  const cssVars = {};
  Object.keys(themeVars).forEach((key) => {
    cssVars[`--${props.prefix}-${kebabCase(key)}`] = themeVars[key];
  });
  return cssVars;
};

const style = computed(() => mapThemeVarsToCSSVars(props.themeVars));
</script>

<style></style>
