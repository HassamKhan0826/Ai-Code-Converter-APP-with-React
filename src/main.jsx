import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fonts are bundled with the app instead of loaded from Google Fonts,
// so visitors' browsers make no request to a third-party font server.
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./index.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
