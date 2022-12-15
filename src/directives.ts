import { App } from "vue";

export const vBoardKey = {
  mounted(el, binding, vnode, prevVnode) {
    el.setAttribute('board-key', binding.value);
  },
};

export const directives = {
  boardKey: vBoardKey
};

export const install = (app: App<Element>) => {
  Object.entries(directives).forEach(([key, value]) => {
    app.directive(key, value);
  });
}

export default {
  install
}