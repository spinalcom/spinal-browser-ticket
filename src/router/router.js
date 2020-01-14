import VueRouter from 'vue-router';
import Vue from "vue";

Vue.use(VueRouter);

const AppList = () => import('./AppList/AppList.vue');
const OperationCenter = () => import('./OperationCenter/OperationCenter.vue');
const MaintenanceBook = () => import('./MaintenanceBook/MaintenanceBook.vue');
const SpaceCenter = () => import('./Space Center/spacecenter.vue');

export const routes = [
  { path: '*', redirect: { name: 'App List' } },
  { path: '/AppList', name: 'App List', component: AppList },
  { path: '/OperationCenter', name: 'Operation Center', component: OperationCenter },
  { path: '/MaintenanceBook', name: 'Maintenance Book', component: MaintenanceBook },
  { path: '/Spacecenter', name: 'Space center', component: SpaceCenter },
];

export const router = new VueRouter({
  routes
});
