import React from 'react';

export const LungsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4v8" strokeWidth="2.5" />
    <path d="M12 9c-3-2-6-1-8 2-2 3.5-.5 7 2 8s5-1 6-5" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 9c3-2 6-1 8 2 2 3.5.5 7-2 8s-5-1-6-5" fill="currentColor" fillOpacity="0.15" />
    <path d="M7 14c1 1 2 1.5 3 1.5" />
    <path d="M17 14c-1 1-2 1.5-3 1.5" />
  </svg>
);
