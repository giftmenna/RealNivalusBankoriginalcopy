import React, { useEffect, useState } from 'react';

interface CircularLoaderProps {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function CircularLoader({ 
  duration = 20, 
  onComplete,
  size = 'md',
  showPercentage = true,
  primaryColor,
  secondaryColor
}: CircularLoaderProps) {
  const [progress, setProgress] = useState(0);
  
  // Set size dimensions based on the size prop
  const dimensions = {
    sm: { outer: 80, inner: 60 },
    md: { outer: 120, inner: 92 },
    lg: { outer: 160, inner: 124 }
  };
  
  const { outer, inner } = dimensions[size];
  
  // Use either custom colors or default theme colors
  const primary = primaryColor || 'var(--primary)';
  const secondary = secondaryColor || '#e6e6e6';
  
  useEffect(() => {
    const totalTime = duration * 1000;
    const interval = 50; // Update every 50ms for smoother animation
    const steps = totalTime / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    
    const timer = setInterval(() => {
      currentProgress += increment;
      const roundedProgress = Math.min(Math.round(currentProgress), 100);
      setProgress(roundedProgress);
      
      if (roundedProgress >= 100) {
        clearInterval(timer);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 300); // Small delay to see 100% briefly
        }
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [duration, onComplete]);
  
  const fontSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';
  
  return (
    <div className="relative">
      <div 
        className="relative rounded-full flex items-center justify-center"
        style={{ 
          height: `${outer}px`, 
          width: `${outer}px`,
          background: `conic-gradient(${primary} ${3.6 * progress}deg, ${secondary} 0deg)` 
        }}
      >
        <div className="absolute rounded-full bg-background" style={{ height: `${inner}px`, width: `${inner}px` }}></div>
        {showPercentage && (
          <span className={`relative ${fontSize} font-semibold`}>{progress}%</span>
        )}
      </div>
    </div>
  );
}
