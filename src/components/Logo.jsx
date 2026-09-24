/** Brand mark: two brackets with an arrow between them. */
export function Logo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1b2440" />
      <path d="M11 9 5 16l6 7" fill="none" stroke="#e8ebf4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m21 9 6 7-6 7" fill="none" stroke="#f4b63f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 16h5m-2-2.5L19 16l-2.5 2.5" fill="none" stroke="#f4b63f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
