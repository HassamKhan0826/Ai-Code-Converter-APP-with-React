import { useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./Button.jsx";

/**
 * Shown when the code looks like it contains secrets, before anything is
 * sent. Uses the native <dialog> element, which handles focus trapping and
 * the Escape key for us.
 */
export function SecretWarningDialog({ findings, onRedact, onSendAnyway, onCancel }) {
  const dialogRef = useRef(null);
  const open = findings.length > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      aria-labelledby="secret-dialog-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-ink-700 bg-ink-900 p-0 text-paper shadow-2xl backdrop:bg-ink-950/80"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 id="secret-dialog-title" className="text-lg font-semibold">
              This code may contain secrets
            </h2>
            <p className="text-sm leading-relaxed text-mist">
              Converting sends your code to Puter&apos;s AI service. Keys and passwords should never leave your
              machine. Nothing has been sent yet.
            </p>
          </div>
        </div>

        <ul className="max-h-40 overflow-auto rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm">
          {findings.map((finding) => (
            <li key={`${finding.line}-${finding.label}`} className="flex justify-between gap-4 py-1">
              <span>{finding.label}</span>
              <span className="font-mono text-mist">line {finding.line}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onSendAnyway}>
            Send unchanged
          </Button>
          <Button variant="primary" onClick={onRedact} autoFocus>
            Replace and convert
          </Button>
        </div>
      </div>
    </dialog>
  );
}
