export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 px-4 py-20 sm:px-6">
      <h1 className="text-2xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="text-mist">The link may be mistyped or out of date.</p>
      <a href="#/" className="rounded-lg bg-marigold px-4 py-2 font-semibold text-ink-950 hover:bg-marigold-bright">
        Go to the converter
      </a>
    </div>
  );
}
