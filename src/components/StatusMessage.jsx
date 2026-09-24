import { CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";

const STYLES = {
  converting: { icon: LoaderCircle, className: "text-mist", spin: true },
  success: { icon: CircleCheck, className: "text-mint" },
  stopped: { icon: Info, className: "text-mist" },
  info: { icon: Info, className: "text-mist" },
  error: { icon: CircleAlert, className: "text-coral" },
};

/**
 * One line of feedback under the editors. `aria-live` makes screen readers
 * announce changes. The status *type* decides colour and icon, instead of
 * checking for emoji inside the text like the tutorial version did.
 */
export function StatusMessage({ status }) {
  const style = STYLES[status.type];
  const Icon = style?.icon;

  return (
    <div aria-live="polite" className="min-h-6">
      {status.message && style && (
        <p className={`flex items-center gap-2 text-sm ${style.className}`}>
          <Icon className={`h-4 w-4 shrink-0 ${style.spin ? "animate-spin" : ""}`} aria-hidden="true" />
          {status.message}
        </p>
      )}
    </div>
  );
}
