/**
 * Every language the converter supports, in one place.
 *
 * To add a language: install its CodeMirror package and add one entry to
 * LANGUAGES. Nothing else in the app needs to change.
 */
/*
 * Each `load` uses a dynamic import(), so Vite puts every language's
 * grammar in its own small file that is only downloaded when a user picks
 * that language. The first page load stays fast.
 */
export const LANGUAGES = [
  {
    id: "javascript",
    label: "JavaScript",
    extension: "js",
    load: () => import("@codemirror/lang-javascript").then((m) => m.javascript({ jsx: true })),
  },
  {
    id: "typescript",
    label: "TypeScript",
    extension: "ts",
    load: () => import("@codemirror/lang-javascript").then((m) => m.javascript({ jsx: true, typescript: true })),
  },
  { id: "python", label: "Python", extension: "py", load: () => import("@codemirror/lang-python").then((m) => m.python()) },
  { id: "java", label: "Java", extension: "java", load: () => import("@codemirror/lang-java").then((m) => m.java()) },
  { id: "c", label: "C", extension: "c", load: () => import("@codemirror/lang-cpp").then((m) => m.cpp()) },
  { id: "cpp", label: "C++", extension: "cpp", load: () => import("@codemirror/lang-cpp").then((m) => m.cpp()) },
  { id: "go", label: "Go", extension: "go", load: () => import("@codemirror/lang-go").then((m) => m.go()) },
  { id: "rust", label: "Rust", extension: "rs", load: () => import("@codemirror/lang-rust").then((m) => m.rust()) },
  { id: "php", label: "PHP", extension: "php", load: () => import("@codemirror/lang-php").then((m) => m.php()) },
];

const BY_ID = new Map(LANGUAGES.map((lang) => [lang.id, lang]));

export function getLanguage(id) {
  const lang = BY_ID.get(id);
  if (!lang) throw new Error(`Unknown language: ${id}`);
  return lang;
}

export const DEFAULT_SOURCE = "javascript";
export const DEFAULT_TARGET = "python";

export const SAMPLE_CODE = `function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

const people = ["Ada", "Linus", "Grace"];
people.forEach((person) => greet(person));
`;
