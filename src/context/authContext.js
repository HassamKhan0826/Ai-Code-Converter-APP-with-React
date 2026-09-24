import { createContext } from "react";

/**
 * Shared sign-in state. Lives in its own file so that both the provider
 * (AuthProvider.jsx) and the hook (hooks/useAuth.js) can import it.
 */
export const AuthContext = createContext(null);
