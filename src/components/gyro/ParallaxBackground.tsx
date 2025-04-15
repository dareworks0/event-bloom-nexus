
import { useState, useEffect } from 'react';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxBackground({ children, className = '' }: ParallaxBackgroundProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if DeviceOrientation is supported
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    // Function to handle device orientation change
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Beta is the front-to-back tilt in degrees, where front is positive
      const beta = event.beta ? event.beta : 0;
      
      // Gamma is the left-to-right tilt in degrees, where right is positive
      const gamma = event.gamma ? event.gamma : 0;
      
      // Limit the rotation to a small range for subtle effect
      // We're restricting to a maximum of 10 degrees in any direction
      const xRotation = Math.min(Math.max(gamma, -10), 10) / 2;
      const yRotation = Math.min(Math.max(beta, -10), 10) / 2;
      
      setRotation({ x: xRotation, y: yRotation });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const baseClasses = "transition-transform duration-300 transform perspective-1000";
  const styleClasses = isSupported 
    ? `${baseClasses} ${className}`
    : className;

  const transformStyle = isSupported
    ? { transform: `perspective(1000px) rotateX(${rotation.y}deg) rotateY(${-rotation.x}deg)` }
    : {};

  return (
    <div className={styleClasses} style={transformStyle}>
      {children}
    </div>
  );
}
