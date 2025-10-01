import React from 'react';

interface CloudSVGProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CloudSVG: React.FC<CloudSVGProps> = ({ className = "", color = "#FBCFE8", size = "md" }) => {
  const sizeClasses = {
    sm: "w-16 h-10",
    md: "w-24 h-16", 
    lg: "w-32 h-20"
  };

  return (
    <svg 
      viewBox="0 0 200 120" 
      className={`absolute ${sizeClasses[size]} ${className}`}
      style={{ fill: color, opacity: 0.7 }}
    >
      <ellipse cx="70" cy="80" rx="50" ry="30"/>
      <ellipse cx="120" cy="80" rx="60" ry="35"/>
      <ellipse cx="50" cy="60" rx="35" ry="25"/>
      <ellipse cx="140" cy="60" rx="40" ry="30"/>
      <ellipse cx="95" cy="50" rx="45" ry="28"/>
      <ellipse cx="85" cy="45" rx="25" ry="18" fill="white" opacity="0.3"/>
    </svg>
  );
};