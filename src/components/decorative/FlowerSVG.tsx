import React from 'react';

interface FlowerSVGProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlowerSVG: React.FC<FlowerSVGProps> = ({ className = "", color = "#FBCFE8", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <svg 
      viewBox="0 0 80 80" 
      className={`absolute ${sizeClasses[size]} ${className} animate-float-reverse`}
      style={{ fill: color, opacity: 0.8 }}
    >
      <circle cx="40" cy="20" r="12"/>
      <circle cx="40" cy="60" r="12"/>
      <circle cx="20" cy="40" r="12"/>
      <circle cx="60" cy="40" r="12"/>
      <circle cx="30" cy="30" r="10"/>
      <circle cx="50" cy="30" r="10"/>
      <circle cx="30" cy="50" r="10"/>
      <circle cx="50" cy="50" r="10"/>
      <circle cx="40" cy="40" r="8" fill="#FEF9C3"/>
      <circle cx="40" cy="40" r="4" fill="white" opacity="0.8"/>
    </svg>
  );
};