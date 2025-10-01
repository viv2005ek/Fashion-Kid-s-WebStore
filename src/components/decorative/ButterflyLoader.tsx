import React from 'react';

interface ButterflyLoaderProps {
  className?: string;
  color?: string;
}

export const ButterflyLoader: React.FC<ButterflyLoaderProps> = ({ className = "", color = "#A7F3D0" }) => {
  return (
    <svg 
      viewBox="0 0 100 80" 
      className={`absolute ${className} animate-float-slow`}
      style={{ fill: color, opacity: 0.8 }}
    >
      <ellipse cx="30" cy="25" rx="25" ry="15" transform="rotate(-20 30 25)" fill={color}/>
      <ellipse cx="70" cy="25" rx="25" ry="15" transform="rotate(20 70 25)" fill={color}/>
      <ellipse cx="35" cy="55" rx="20" ry="12" transform="rotate(-10 35 55)" fill={color}/>
      <ellipse cx="65" cy="55" rx="20" ry="12" transform="rotate(10 65 55)" fill={color}/>
      <ellipse cx="25" cy="20" rx="8" ry="5" fill="white" opacity="0.6"/>
      <ellipse cx="75" cy="20" rx="8" ry="5" fill="white" opacity="0.6"/>
      <line x1="50" y1="20" x2="50" y2="60" stroke="#374151" strokeWidth="2"/>
      <circle cx="50" cy="18" r="3" fill="#374151"/>
    </svg>
  );
};