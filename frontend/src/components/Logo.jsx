import React from 'react';

const Logo = ({ className = "w-8 h-8", shieldColorLeft = "#4db8ff", shieldColorRight = "#0073e6" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 110" 
      className={className}
      fill="none"
    >
      {/* 3D Shield Base - Left Half (Lighter) */}
      <path 
        d="M50 10 L10 20 L10 60 C10 80 45 105 50 110 Z" 
        fill={shieldColorLeft} 
      />
      {/* 3D Shield Base - Right Half (Darker) */}
      <path 
        d="M50 10 L90 20 L90 60 C90 80 55 105 50 110 Z" 
        fill={shieldColorRight} 
      />

      {/* Inner Dark Shield background */}
      <path 
        d="M50 18 L18 26 L18 60 C18 76 46 95 50 99 L50 18 Z" 
        fill="#1a2530" 
      />
      <path 
        d="M50 18 L82 26 L82 60 C82 76 54 95 50 99 L50 18 Z" 
        fill="#0f172a" 
      />

      {/* Circuit lines connecting to nodes */}
      <g stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Left lines */}
        <polyline points="30,40 40,40 40,48" />
        <circle cx="28" cy="40" r="1.5" fill="#facc15" />
        
        <polyline points="24,55 35,55 40,50" />
        <circle cx="22" cy="55" r="1.5" fill="#facc15" />

        <polyline points="36,75 42,65 42,60" />
        <circle cx="34" cy="77" r="1.5" fill="#facc15" />

        <polyline points="30,30 38,35 44,35" />
        <circle cx="28" cy="29" r="1.5" fill="#facc15" />

        {/* Right lines */}
        <polyline points="70,40 60,40 60,48" />
        <circle cx="72" cy="40" r="1.5" fill="#facc15" />
        
        <polyline points="76,55 65,55 60,50" />
        <circle cx="78" cy="55" r="1.5" fill="#facc15" />

        <polyline points="64,75 58,65 58,60" />
        <circle cx="66" cy="77" r="1.5" fill="#facc15" />

        <polyline points="70,30 62,35 56,35" />
        <circle cx="72" cy="29" r="1.5" fill="#facc15" />
      </g>

      <g stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Left light blue lines */}
        <polyline points="20,48 30,48 35,50" />
        <circle cx="18" cy="48" r="1.5" fill="#38bdf8" />

        <polyline points="30,65 45,65 45,60" />
        <circle cx="28" cy="65" r="1.5" fill="#38bdf8" />

        {/* Right light blue lines */}
        <polyline points="80,48 70,48 65,50" />
        <circle cx="82" cy="48" r="1.5" fill="#38bdf8" />

        <polyline points="70,65 55,65 55,60" />
        <circle cx="72" cy="65" r="1.5" fill="#38bdf8" />
      </g>

      {/* Center Square */}
      <rect x="42" y="42" width="16" height="16" rx="2" fill="#38bdf8" />
      
      {/* Center 'V' */}
      <path 
        d="M45 46 L48 54 L51 46 L54 46 L49 56 L47 56 L42 46 Z" 
        fill="#0f172a" 
      />
    </svg>
  );
};

export default Logo;
