import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import messages from '../public/en'
Vue.use(VueI18n)
import ElementLocale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import frLocale from 'element-ui/lib/locale/lang/fr'
export const i18n = new VueI18n({
  messages
})

const loadedLanguages = [] // our default language that is preloaded
const elementLang = {
  'en': enLocale,
  'fr': frLocale
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
  return import(`./${lang}.js`).then(
    messages => {
      setLang(lang);
      const msg = {
        ...messages.default,
        ...elementLang[lang]
      }
      i18n.setLocaleMessage(lang, msg)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    }
  )


  // If the language hasn't been loaded yet
  // return import(`./${lang}.js`).then(
  //   messages => {
  //     setLang(lang);
  //     i18n.setLocaleMessage(lang, messages.default)
  //     loadedLanguages.push(lang)
  //     return setI18nLanguage(lang)
  //   }
  // )
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
    // default - en
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
