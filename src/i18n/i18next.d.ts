// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import en from "../../public/locales/en/translation.json";
import ge from "../../public/locales/ge/translation.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "translation";
    // custom resources type
    fallbackLng: "ge";
    resources: {
      en: typeof en;
      ge: typeof ge;
    };
    // other
  }
}