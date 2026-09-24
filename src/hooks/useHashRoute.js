import { useSyncExternalStore } from "react";

/**
 * A tiny router for a two-page app. The page lives in the URL hash
 * (#/privacy), which works on any static host with no server setup.
 * For a bigger app, switch to a library such as React Router.
 */
function subscribe(callback) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getPath() {
  return window.location.hash.replace(/^#/, "") || "/";
}

export function useHashRoute() {
  return useSyncExternalStore(subscribe, getPath, () => "/");
}
