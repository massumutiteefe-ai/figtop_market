import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://w3.org">
        <path d="M20 25C20 22.2386 22.2386 20 25 20H45L25 65H20V25Z" fill="url(#figtopGrad1)" />
        <path d="M40 20H75C77.7614 20 80 22.2386 80 25V30L55 80H40L60 35H40V20Z" fill="url(#figtopGrad2)" />
        <circle cx="28" cy="75" r="8" fill="#3b82f6" />
        <defs>
          <linearGradient id="figtopGrad1" x1="20" y1="20" x2="45" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="figtopGrad2" x1="40" y1="20" x2="55" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-white font-black text-base tracking-wider font-sans">DIGITAL <span className="text-blue-500">FIGTOP</span></span>
        <span className="text-gray-400 text-[9px] tracking-widest uppercase font-semibold mt-0.5">Global Innovation Markets</span>
      </div>
    </div>
  );
}