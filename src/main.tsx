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
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchIntervalInBackground: true,
      refetchOnMount: true,
      staleTime: 60000 * 5,
      refetchInterval: 8000,
      retry: true
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <ThemeProvider>
      <AppWrapper>
      <I18nextProvider i18n={i18n} defaultNS={'translation'}>
        <ToastContainer className={'z-99999'} style={{zIndex: 99999}} />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </I18nextProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
