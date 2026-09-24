import { ArrowLeftRight, LoaderCircle, Play, Square } from "lucide-react";
import { Button } from "./Button.jsx";

/**
 * The column between the two editors: convert (or stop), and swap.
 * On small screens it becomes a row between the stacked editors.
 */
export function ConvertControls({ isConverting, canConvert, onConvert, onStop, onSwap, targetLabel }) {
  return (
    <div className="flex items-center justify-center gap-3 lg:flex-col lg:justify-start lg:pt-16">
      {isConverting ? (
        <Button variant="secondary" size="lg" onClick={onStop} className="lg:w-40 lg:justify-center">
          <Square className="h-4 w-4 fill-current" aria-hidden="true" />
          Stop
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={onConvert}
          disabled={!canConvert}
          className="lg:w-40 lg:justify-center"
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          Convert
        </Button>
      )}

      <Button
        variant="ghost"
        size="md"
        onClick={onSwap}
        disabled={isConverting}
        title="Swap languages and use the result as new input"
        className="lg:w-40 lg:justify-center"
      >
        <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        Swap
      </Button>

      <p className="hidden text-center text-xs leading-relaxed text-mist lg:block">
        {isConverting ? (
          <span className="inline-flex items-center gap-1.5">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Working on {targetLabel}
          </span>
        ) : (
          <>
            <kbd className="rounded border border-ink-700 bg-ink-800 px-1 font-mono">Ctrl</kbd> +{" "}
            <kbd className="rounded border border-ink-700 bg-ink-800 px-1 font-mono">Enter</kbd>
            <br />
            to convert
          </>
        )}
      </p>
    </div>
  );
}
