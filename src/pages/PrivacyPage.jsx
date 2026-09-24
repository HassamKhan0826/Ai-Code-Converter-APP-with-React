const SECTIONS = [
  {
    title: "What leaves your browser",
    body: [
      "Only when you press Convert: the code in the left editor, the two language names, and fixed instructions for the AI. They go to Puter, which passes them to an AI model to write the conversion.",
      "Nothing is sent while you type, and nothing is sent if you cancel the secret warning.",
    ],
  },
  {
    title: "Why there are no API keys",
    body: [
      "Puter uses a user-pays model: you sign in with your own Puter account and AI usage counts against that account. The app itself holds no key, so there is no key to leak from the code, the build, or GitHub.",
    ],
  },
  {
    title: "What is stored, and where",
    body: [
      "This app has no server and no database. It doesn't save your code, results or settings. Reloading the page clears them.",
      "Puter.js keeps your sign-in token in this browser's local storage so you stay signed in. Sign out from the header to remove it.",
    ],
  },
  {
    title: "Secret check",
    body: [
      "Before sending, the app looks for common formats of API keys, private keys, tokens and hard-coded passwords. If it finds any, you can replace them with REDACTED_SECRET, send the code unchanged, or cancel.",
      "The check runs entirely in your browser and can't catch every secret, so treat it as a safety net.",
    ],
  },
  {
    title: "Third parties",
    body: [
      "Puter handles sign-in and the AI request under its own privacy policy, and the AI model provider it uses may process the code too. Fonts and all other files are served from this site, so no other services are contacted.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">How your code is handled</h1>
        <p className="leading-relaxed text-mist">A plain description of what this app sends, stores and never touches.</p>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.title} className="flex flex-col gap-3 border-t border-ink-700 pt-6">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="leading-relaxed text-mist">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <a href="#/" className="w-fit rounded-lg bg-marigold px-4 py-2 font-semibold text-ink-950 hover:bg-marigold-bright">
        Back to the converter
      </a>
    </article>
  );
}
