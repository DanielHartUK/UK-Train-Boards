import Vue from 'vue';
import App from '@renderer/App.vue';
import router from '@renderer/router';
import store from '@renderer/store';
import VuejsDialog from 'vuejs-dialog';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import uuid from '@renderer/mixins/uuid';

import i18n from './i18n';

library.add(faPlus, faCog, faHeart);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.mixin(uuid);
Vue.use(VuejsDialog);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
