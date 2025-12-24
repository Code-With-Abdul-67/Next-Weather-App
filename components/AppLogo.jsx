export const AppLogo = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Soft Glow Sun Gradient */}
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffed4a" />
        <stop offset="70%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </radialGradient>
      
      {/* Glassmorphism Cloud Gradient */}
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
      </linearGradient>

      {/* Subtle Shadow */}
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="1" dy="2" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <g filter="url(#dropShadow)">
      {/* Glowing Sun */}
      <circle cx="65" cy="35" r="22" fill="url(#sunGlow)" opacity="0.9" />
      
      {/* Frosted Glass Cloud */}
      <path
        d="M20,65 Q20,45 40,45 Q45,30 65,30 Q85,30 90,50 Q105,50 105,70 Q105,90 85,90 L35,90 Q20,90 20,65 Z"
        fill="url(#glassGradient)"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="0.5"
        transform="translate(-10, -5) scale(0.85)"
      />

      {/* Rain Drops */}
      <g fill="#60a5fa" opacity="0.8">
        <circle cx="35" cy="82" r="2.5" />
        <circle cx="55" cy="85" r="2.5" />
        <circle cx="75" cy="82" r="2.5" />
      </g>
    </g>
  </svg>
);
