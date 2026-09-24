import { Component } from "react";

/**
 * Catches rendering errors anywhere below it, so one bug shows a
 * recovery screen instead of a blank white page.
 * (Error boundaries still have to be class components in React.)
 */
export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unexpected UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div role="alert" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
        <h1 className="text-2xl font-semibold">Something broke on this page</h1>
        <p className="text-mist">Reload to start again. Code you typed that wasn't converted yet will be lost.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="h-10 w-fit rounded-lg bg-marigold px-4 font-semibold text-ink-950"
        >
          Reload the page
        </button>
      </div>
    );
  }
}
