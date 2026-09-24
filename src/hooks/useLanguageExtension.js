import { useEffect, useReducer } from "react";
import { getLanguage } from "../config/languages";

// Loaded grammars are kept for the whole session, so each is downloaded once.
const loaded = new Map();
const loading = new Map();

function loadOnce(id) {
  if (!loading.has(id)) {
    loading.set(
      id,
      getLanguage(id)
        .load()
        .then((extension) => loaded.set(id, extension)),
    );
  }
  return loading.get(id);
}

/**
 * Returns the CodeMirror syntax-highlighting extension for a language,
 * or null while its grammar is still downloading.
 */
export function useLanguageExtension(id) {
  const [, rerender] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    if (loaded.has(id)) return undefined;
    let active = true;
    loadOnce(id)
      .then(() => active && rerender())
      .catch((error) => {
        loading.delete(id); // allow a retry next time
        console.error(`Couldn't load highlighting for ${id}:`, error);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return loaded.get(id) ?? null;
}
