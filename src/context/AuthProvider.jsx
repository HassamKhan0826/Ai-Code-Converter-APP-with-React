import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import * as puterService from "../services/puter";

/**
 * Keeps track of whether the visitor is signed in to Puter and shares that
 * with every component (header button, converter) through React context.
 *
 * status: "checking" | "signedOut" | "signedIn" | "unavailable"
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  const refresh = useCallback(async () => {
    try {
      await puterService.loadPuter();
    } catch (error) {
      console.error("Puter SDK failed to load:", error);
      setStatus("unavailable");
      return;
    }
    if (!puterService.isSignedIn()) {
      setUser(null);
      setStatus("signedOut");
      return;
    }
    try {
      setUser(await puterService.getCurrentUser());
      setStatus("signedIn");
    } catch {
      // The stored session is no longer valid.
      setUser(null);
      setStatus("signedOut");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with an external system (Puter) on mount
    refresh();
  }, [refresh]);

  const signIn = useCallback(async () => {
    await puterService.signIn();
    await refresh();
  }, [refresh]);

  const signOut = useCallback(() => {
    puterService.signOut();
    setUser(null);
    setStatus("signedOut");
  }, []);

  /** Signs in only if needed. Call it directly from a click handler. */
  const ensureSignedIn = useCallback(async () => {
    if (puterService.isSignedIn()) return;
    await signIn();
  }, [signIn]);

  const value = useMemo(
    () => ({ status, user, signIn, signOut, ensureSignedIn }),
    [status, user, signIn, signOut, ensureSignedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
