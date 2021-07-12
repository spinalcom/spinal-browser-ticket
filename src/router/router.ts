/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import VueRouter from 'vue-router';
import Vue from "vue";

Vue.use(VueRouter);

const AppList = () => import('./AppList/AppList.vue');
const TicketCenter = () => import('./TicketCenter/TicketCenter.vue');
const InsightCenter = () => import('./InsightCenter/InsightCenter.vue');
const SpaceCenter = () => import('./Space Center/spacecenter.vue');
const SpaceCenterGestion = () => import('../compoments/space/component/categoryLstVue.vue');
const DataRoom = () => import("./DataRoom/DataRoom.vue")
const EquipmentCenter = () => import("./EquipmentCenter/TheEquipmentApp.vue")
export const routes = [
  { path: '*', redirect: { name: 'App List' } },
  { path: '/AppList', name: 'App List', component: AppList },
  { path: '/DataRoom', name: 'Data Room', component: DataRoom },
  { path: '/TicketCenter', name: 'Ticket Center', component: TicketCenter },
  { path: '/InsightCenter', name: 'Insight Center', component: InsightCenter },
  { path: '/Spacecenter', name: 'Space Center', component: SpaceCenter },
  { path: '/EquipmentCenter', name: 'Equipment Center', component: EquipmentCenter },
];
const realroutes = [...routes,
{ path: '/Spacecenter/Gestion', name: 'gestion', component: SpaceCenterGestion },


]
export const router = new VueRouter({
  routes: realroutes
});

router.beforeResolve(function (to, from, next) {
  document.title = `Spinal Twin - ${to.name}`
  next()
})
