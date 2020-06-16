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

import "babel-polyfill";
import Vue from "vue";
import App from "./app.vue";
import ElementUI from 'element-ui';
import VTooltip from 'v-tooltip';
import { i18n } from "./services/i18n";
import spinalBackend from './services/spinalBackend';
import { router } from './router/router';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Ripple from 'vue-ripple-directive'

import 'element-ui/lib/theme-chalk/index.css';
import './app.css';

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

Ripple.zIndex = 99999999;
Vue.directive('ripple', Ripple);

Vue.use(ElementUI);
Vue.use(VTooltip);
Vue.use(BootstrapVue)
spinalBackend.init();

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app');
