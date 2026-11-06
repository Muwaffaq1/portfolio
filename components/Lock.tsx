export function Lock({ label = "On request" }: { label?: string }) {
  return (
    <span className="lock">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      {label}
    </span>
  );
}
