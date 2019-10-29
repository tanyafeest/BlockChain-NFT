import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faDiceD20,
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faBinoculars, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import keyring from '@vue-polkadot/vue-keyring';

import App from './App.vue';
import store from './store';
import router from './router';
import Connector from '@vue-polkadot/vue-api';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faDiceD20,
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faBinoculars, faPlus, faTimes );

Vue.component('font-awesome-icon', FontAwesomeIcon);

// later will be removed
// keyring.loadAll({
//   ss58Format: 42,
//   type: 'sr25519',
//   isDevelopment: true,
// });

Connector.createInstance();
Vue.prototype.$http = Connector.getInstance();

Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'font-awesome-icon',
  defaultFieldLabelPosition: 'inside',
  customIconPacks: {
    fas: {
      sizes: {
        'default': 'lg',
        'is-small': '1x',
        'is-medium': '2x',
        'is-large': '3x',
      },
    },
  },
});

Vue.use(VueClipboard);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
