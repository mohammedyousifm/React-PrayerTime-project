// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Define the translation files (can be expanded to include more languages)
const resources = {
  en: {
    translation: {
      "Fajr": "Fajr",
      "Dhuhr": "Dhuhr",
      "Asr": "Asr",
      "Maghrib": "Maghrib",
      "Isha": "Isha",

      "date": "date",

      "PM": "PM",

      "AM": "AM",

      "City": "City",

      "Loading": "Loading...",

      "Upcoming_Prayer": "Upcoming Prayer",

    },
  },
  ar: {
    translation: {
      "Fajr": "الفجر",
      "Dhuhr": "الظهر",
      "Asr": "العصر",
      "Maghrib": "المغرب",
      "Isha": "العشاء",

      "date": "التاريخ",

      "PM": "م",

      "AM": "ص",

      "City": "المدينة",

      "Loading": "جاري التحميل...",

      "Upcoming_Prayer": "الصلاة القادمة",

    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language"), // Default language is English
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
