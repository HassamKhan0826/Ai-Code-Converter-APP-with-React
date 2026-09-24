import { AppHeader } from "./components/layout/AppHeader.jsx";
import { AppFooter } from "./components/layout/AppFooter.jsx";
import { useHashRoute } from "./hooks/useHashRoute";
import ConverterPage from "./pages/ConverterPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const ROUTES = {
  "/": ConverterPage,
  "/privacy": PrivacyPage,
};

/** The app shell: header, the current page, footer. */
export default function App() {
  const path = useHashRoute();
  const Page = ROUTES[path] ?? NotFoundPage;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-marigold focus:px-3 focus:py-2 focus:text-ink-950"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <AppHeader currentPath={path} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Page />
      </main>
      <AppFooter />
    </div>
  );
}
