/**
 * One button component with a few looks, so every button in the app is
 * consistent in size, focus ring and disabled state.
 */
const VARIANTS = {
  primary:
    "bg-marigold text-ink-950 hover:bg-marigold-bright disabled:bg-ink-700 disabled:text-mist font-semibold",
  secondary:
    "border border-ink-700 bg-ink-800 text-paper hover:border-ink-600 hover:bg-ink-700 disabled:text-mist/60",
  ghost: "text-mist hover:bg-ink-800 hover:text-paper disabled:text-mist/40",
  danger: "border border-coral/40 text-coral hover:bg-coral/10",
};

const SIZES = {
  sm: "h-8 gap-1.5 px-2.5 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
  icon: "h-8 w-8 justify-center",
};

export function Button({ variant = "secondary", size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center rounded-lg transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
