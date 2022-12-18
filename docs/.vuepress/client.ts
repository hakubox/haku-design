import { defineClientConfig } from '@vuepress/client';
import DemoBlock from './components/DemoBlock.vue';

const autoImport = async (app) => {

  const modules = import.meta.glob('@/components/component-shop/**/*.vue', { eager: false });

  await Promise.all(Object.keys(modules).map(async (name) => {
    const componentName = name.substring(name.lastIndexOf('/') + 1).replace(/\.\/|\.(js|ts|vue)/g, '');
    const _module: any = await modules[name]();
    app.component(componentName, _module.default);
  }));
}

export default defineClientConfig({
  setup() {
  },
  async enhance({ app, router, siteData }) {
    app.component('DemoBlock', DemoBlock);
    // await autoImport(app);
  },
  rootComponents: [
  ],
})