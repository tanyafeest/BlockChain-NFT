import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import store from '@/store'
import MarkdownIt from 'markdown-it';

// File containing data common to ALL
// languages
const allLangDataFile = "all_lang.json";

// Data common to ALL languages
const commonData = require('./locales/' + allLangDataFile);

Vue.use(VueI18n)
const md = require('markdown-it')({
  breaks: false,
});

function loadLocaleMessages (): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: LocaleMessages = {}
  locales.keys().forEach(key => {
    if (key === allLangDataFile) {
      return;
    }
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

// toto moze brat vue s vuexu teoretisch
// const locale = store.getters.getUserLang;
export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'nl',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'nl',
  modifiers: {
    md: (str) => md.renderInline(str),
    common: (str) => str.split('.').reduce((o,i)=>o[i], commonData),
  },
  messages: loadLocaleMessages()
})
