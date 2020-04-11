import Vue from 'vue';
import App from '@renderer/App.vue';
import router from '@renderer/router';
import store from '@renderer/store';
import i18n from './i18n';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
