import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: () => import('../views/Home.vue'), },
  { path: '/login', component: () => import('../views/Login.vue'), },
  { path: '/callback', name: 'CallBack', component: () => import('../views/CallBack.vue') },
  {
    path: '/test',
    component: () => import('../views/Test.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
