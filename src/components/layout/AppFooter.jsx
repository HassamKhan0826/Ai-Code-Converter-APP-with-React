export function AppFooter() {
  return (
    <footer className="border-t border-ink-700/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>AI conversions run through your own Puter account. This app has no server and stores nothing about you.</p>
        <a href="#/privacy" className="rounded text-paper underline decoration-ink-600 underline-offset-4 hover:decoration-marigold">
          How your code is handled
        </a>
      </div>
    </footer>
  );
}
