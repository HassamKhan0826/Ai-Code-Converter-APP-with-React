import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

/** CodeMirror colours matched to the app palette in index.css. */
export const inkTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#151D35",
    foreground: "#E8EBF4",
    caret: "#F4B63F",
    selection: "#34436B",
    selectionMatch: "#2B3759",
    lineHighlight: "#1B2440",
    gutterBackground: "#151D35",
    gutterForeground: "#56648A",
    gutterBorder: "transparent",
    fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  styles: [
    { tag: [t.comment, t.lineComment, t.blockComment], color: "#6D7BA3", fontStyle: "italic" },
    { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword], color: "#F4B63F" },
    { tag: [t.string, t.special(t.string), t.regexp], color: "#7FD8B0" },
    { tag: [t.number, t.bool, t.null, t.atom], color: "#F29E7D" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#8FC3FF" },
    { tag: [t.typeName, t.className, t.namespace], color: "#C3B1FF" },
    { tag: [t.propertyName], color: "#D6DCEC" },
    { tag: [t.operator, t.punctuation, t.bracket], color: "#A3AECB" },
    { tag: [t.meta, t.annotation, t.processingInstruction], color: "#C3B1FF" },
    { tag: t.invalid, color: "#F07F7A" },
  ],
});
