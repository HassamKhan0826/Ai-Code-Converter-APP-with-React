import { ChevronDown } from "lucide-react";
import { LANGUAGES } from "../config/languages";

/** A labelled native <select>: keyboard and screen-reader friendly for free. */
export function LanguageSelect({ id, label, value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-mist">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 cursor-pointer appearance-none rounded-md border border-ink-700 bg-ink-900 py-0 pl-2.5 pr-8 text-sm font-medium text-paper hover:border-ink-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" aria-hidden="true" />
      </div>
    </div>
  );
}
