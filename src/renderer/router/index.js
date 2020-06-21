import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/main',
    component: () => import(/* webpackChunkName: "main" */ '../views/MainView.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/main/Home.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/main/Settings.vue'),
      },
    ],
  },
  {
    path: '/board',
    component: () => import(/* webpackChunkName: "board" */ '../views/BoardView.vue'),
    children: [
      {
        path: 'departures',
        name: 'Departures',
        component: () => import(/* webpackChunkName: "departures" */ '../views/board/Departures.vue'),
      },
      {
        path: 'arrivals',
        name: 'Arrivals',
        component: () => import(/* webpackChunkName: "arrivals" */ '../views/board/Arrivals.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
