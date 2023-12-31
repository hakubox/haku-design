import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/design' },
  { path: '/design', component: () => import('../views/DesignView.vue') },
  { path: '/preview', component: () => import('../views/Preview.vue') },
  { path: '/print', component: () => import('../views/PrintPage.vue') },
  { path: '/scoring', component: () => import('../views/Scoring.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },

  // 示例/测试页面

  { 
    path: '/example',
    component: () => import('../views/example/index.vue'),
    redirect: '/example/background',
    children: [
      { path: 'dragbox', component: () => import('../views/example/DragBox_example.vue') },
      { path: 'background', component: () => import('../views/example/Background_example.vue') },
      { path: 'timeaxis', component: () => import('../views/example/TimeAxis_example.vue') },
      { path: 'themechange', component: () => import('../views/example/ThemeChange_example.vue') },
      { path: 'drag-basic', component: () => import('../views/example/Customdrag_example.vue') },
      { path: 'drag-list', component: () => import('../views/example/Customdrag2_example.vue') },
      { path: 'drag-editor', component: () => import('../views/example/editor-drag-example/Customdrag3_example.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
