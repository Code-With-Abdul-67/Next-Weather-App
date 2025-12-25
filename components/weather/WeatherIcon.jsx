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

export function SunriseIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="8 6 12 2 16 6" />
    </svg>
  );
}

export function SunsetIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="9" x2="12" y2="2" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="16 5 12 9 8 5" />
    </svg>
  );
}

export function EyeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function ThermometerIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

export function ActivityIcon({ className = "w-5 h-5" }) {
  return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
  );
}
