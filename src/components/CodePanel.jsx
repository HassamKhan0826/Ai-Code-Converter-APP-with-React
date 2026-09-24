import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { useLanguageExtension } from "../hooks/useLanguageExtension";
import { inkTheme } from "../theme/editorTheme";

/**
 * A titled box with a code editor inside. Used for both the input (editable)
 * and the output (read-only), so the two sides always look the same.
 */
export function CodePanel({
  labelId,
  heading,
  toolbar,
  languageId,
  value,
  onChange,
  readOnly = false,
  placeholder,
  footer,
  busy = false,
}) {
  // Syntax highlighting follows the selected language (null while loading).
  const language = useLanguageExtension(languageId);

  // useMemo keeps the same extension list between renders, so CodeMirror
  // doesn't reconfigure itself on every keystroke.
  const extensions = useMemo(() => {
    const list = [EditorView.lineWrapping, EditorView.contentAttributes.of({ "aria-labelledby": labelId })];
    if (language) list.push(language);
    return list;
  }, [language, labelId]);

  return (
    <section
      aria-labelledby={labelId}
      aria-busy={busy}
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-900"
    >
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-ink-700 bg-ink-800 px-3 py-2">
        <div className="flex items-center gap-3">
          <h2 id={labelId} className="sr-only">
            {heading}
          </h2>
          {toolbar.start}
        </div>
        <div className="flex items-center gap-1">{toolbar.end}</div>
      </div>

      <div className="relative h-[22rem] sm:h-[28rem] lg:h-[32rem]">
        {busy && (
          <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-ink-700" aria-hidden="true">
            <div className="progress-bar h-full w-2/5 bg-marigold" />
          </div>
        )}
        <CodeMirror
          className="code-editor"
          value={value}
          height="100%"
          theme={inkTheme}
          extensions={extensions}
          onChange={onChange}
          editable={!readOnly}
          readOnly={readOnly}
          placeholder={placeholder}
          basicSetup={{ foldGutter: false, highlightActiveLine: !readOnly, highlightActiveLineGutter: !readOnly }}
        />
      </div>

      {footer && <div className="border-t border-ink-700 px-3 py-2 text-xs text-mist">{footer}</div>}
    </section>
  );
}
