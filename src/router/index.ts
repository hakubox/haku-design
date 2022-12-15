import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/design' },
  { path: '/design', component: () => import('../views/DesignView.vue') },
  { path: '/preview', component: () => import('../views/Preview.vue') },
  { path: '/print', component: () => import('../views/PrintPage.vue') },
  { path: '/scoring', component: () => import('../views/Scoring.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/test', component: () => import('../views/TestPage.vue') },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
