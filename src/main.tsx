import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import i18n from "./i18n/config.ts";
import { I18nextProvider } from "react-i18next";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
      <I18nextProvider i18n={i18n} defaultNS={'translation'}>
        <App />
      </I18nextProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
