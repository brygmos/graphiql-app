import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from '../src/locales/en/translation.json';
import belarus from '../src/locales/by/translation.json';
import russian from '../src/locales/ru/translation.json';

let lang = localStorage.getItem('language') ?? 'en';

const resources = {
  en: {
    translation: english,
  },
  by: {
    translation: belarus,
  },
  ru: {
    translation: russian,
  }
};

i18next.use(initReactI18next).init({
  resources,
  lng: lang,
});

export default i18next;