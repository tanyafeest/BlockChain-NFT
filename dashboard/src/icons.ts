import Vue from 'vue';

import {
  faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload,
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faPlus, faTimes, faCaretDown, faCaretUp, faMinus,
  faFile, faBook, faCodeBranch, faSearch, faQuestionCircle,
  faExternalLinkAlt, faArrowUp, faTools, faCheck, faSeedling
} from '@fortawesome/free-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload,
  faCopy, faAngleDoubleLeft, faAngleDoubleRight,
  faPlus, faTimes, faCaretDown, faCaretUp,
  faMinus, faFile, faBook, faCodeBranch, faSearch, faQuestionCircle,
  faExternalLinkAlt, faTwitter, faArrowUp, faTools, faCheck, faSeedling);

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
Vue.component('vue-fontawesome', FontAwesomeIcon);  
