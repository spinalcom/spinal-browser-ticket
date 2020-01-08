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

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
Vue.use(VueI18n)
import ElementLocale from 'element-ui/lib/locale'
export const i18n = new VueI18n({})

const loadedLanguages = [] // our default language that is preloaded
const elementLang = {
  'en': () => {
    return Promise.all([
      import('element-ui/lib/locale/lang/en'),
      import('../local/en')
    ])
  },
  'fr': () => {
    return Promise.all([
      import('element-ui/lib/locale/lang/fr'),
      import('../local/fr')
    ])
  },
}

function setI18nLanguage(lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(lang) {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }
  return elementLang[lang]().then((langs) => {
    setLang(lang);
    const msg = {
      ...langs[0].default,
      ...langs[1].default
    }
    i18n.setLocaleMessage(lang, msg)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}

function getFirstBrowserLanguage() {
  var nav = window.navigator, i, language,
    browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return language;
      }
    }
  }
  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }
  return null;
};

function getLang() {
  const lang = window.localStorage.getItem('spinal-lang');
  if (!lang) {
    const lang = getFirstBrowserLanguage();
    console.log('getFirstBrowserLanguage', lang);
    const languages = ['en', 'fr']
    for (const language of languages) {
      if (lang.toLocaleLowerCase().startsWith(language)) {
        return language;
      }
    }
    return 'en';
  }
  return lang;
}
function setLang(lang) {
  window.localStorage.setItem('spinal-lang', lang);
}

export function getDefaultLanguage() {
  return loadLanguageAsync(getLang())
}
ElementLocale.i18n((key, value) => i18n.t(key, value))
