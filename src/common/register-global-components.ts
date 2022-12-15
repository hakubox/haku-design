import { App } from 'vue';

const modules = import.meta.glob('../components/**/*.vue', { eager: false });

const install = async (app: App<Element>) => {
  await Promise.all(Object.keys(modules).map(async (name) => {
    const componentName = name.substring(name.lastIndexOf('/') + 1).replace(/\.\/|\.(js|ts|vue)/g, '');
    const _module = await modules[name]() as any;
    app.component(componentName, _module.default);
  }));
}

export default {
  install,
  ...modules,
};
