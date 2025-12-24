export function RainIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="32" rx="20" ry="12" fill="#b3c6e7" />
      <line
        x1="24"
        y1="48"
        x2="24"
        y2="56"
        stroke="#4fc3f7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="48"
        x2="32"
        y2="56"
        stroke="#4fc3f7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="48"
        x2="40"
        y2="56"
        stroke="#4fc3f7"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloudIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="20" ry="12" fill="#e0e7ef" />
      <ellipse cx="44" cy="32" rx="12" ry="8" fill="#cfd8dc" />
    </svg>
  );
}

export function SunIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="12" fill="#ffe066" />
      <g stroke="#ffe066" strokeWidth="3">
        <line x1="32" y1="8" x2="32" y2="0" />
        <line x1="32" y1="56" x2="32" y2="64" />
        <line x1="8" y1="32" x2="0" y2="32" />
        <line x1="56" y1="32" x2="64" y2="32" />
        <line x1="12" y1="12" x2="4" y2="4" />
        <line x1="52" y1="12" x2="60" y2="4" />
        <line x1="12" y1="52" x2="4" y2="60" />
        <line x1="52" y1="52" x2="60" y2="60" />
      </g>
    </svg>
  );
}

export function MoonIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="40" cy="32" r="12" fill="#b3c6e7" />
      <path
        d="M40 20a12 12 0 1 0 0 24c-6.627 0-12-5.373-12-12 0-6.627 5.373-12 12-12z"
        fill="#fff"
        opacity="0.7"
      />
    </svg>
  );
}

export function HumidityIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C12 2 7 8.5 7 12a5 5 0 0010 0c0-3.5-5-10-5-10zm0 18a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
  );
}

export function WindIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 12h13a4 4 0 1 1 0 8H7" />
      <path d="M3 6h9a3 3 0 1 1 0 6H5" />
    </svg>
  );
}
