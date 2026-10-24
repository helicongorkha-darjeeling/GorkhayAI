/** Mark: two snow peaks with a sunrise dot, drawn to sit at 28px. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#101d38" />
      <circle cx="22.5" cy="10" r="3" fill="#ff8a3d" />
      <path d="M3 26l8.5-13 4 6 3-4.5L29 26z" fill="#f4f7fb" />
      <path d="M11.5 13l-2.6 4 1.6-.8 1 1.2 1.2-1.4z" fill="#b9c5da" />
    </svg>
  );
}
