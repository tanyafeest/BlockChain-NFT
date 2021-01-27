import Vue from 'vue';

import {
  faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faCopy, faAngleDoubleLeft, 
  faAngleDoubleRight, faPlus, faTimes, faCaretDown, 
  faCaretUp, faMinus, faFile, faBook, 
  faCodeBranch, faSearch, faQuestionCircle, faExternalLinkAlt, 
  faArrowUp, faTools, faCheck, faSeedling, faDatabase, faGem, 
  faInfoCircle, faExchangeAlt, faBug, faStop, faEllipsisV, faPercent,
  faUsersCog, faCoins, faAngleLeft, faAngleRight,
  faCreditCard, faStepForward, faRing, faDonate, faFileImage,
  faPenNib, faImages, faHeart

} from '@fortawesome/free-solid-svg-icons';

// throws error, idk why
// import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faTrash, faKey, faSync, faRedo,
  faCloudDownloadAlt, faPlay, faFolderOpen,
  faUsers, faAddressBook, faPaperPlane,
  faCalendarCheck, faCogs, faEye, faEyeSlash,
  faExclamationCircle, faUpload, faCopy, faAngleDoubleLeft,
  faAngleDoubleRight, faPlus, faTimes, faCaretDown, 
  faCaretUp, faMinus, faFile, faBook,
  faCodeBranch, faSearch, faQuestionCircle, faExternalLinkAlt,
  faTwitter, faArrowUp, faTools, faCheck, faSeedling, 
  faDatabase, faGem,  faInfoCircle, faExchangeAlt,
  faBug, faStop, faEllipsisV, faPercent, faUsersCog, faCoins,
  faAngleLeft, faAngleRight, faCreditCard, faStepForward, faRing,
  faDonate, faFileImage, faPenNib, faImages, faHeart
  );

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.component('vue-fontawesome', FontAwesomeIcon);  
