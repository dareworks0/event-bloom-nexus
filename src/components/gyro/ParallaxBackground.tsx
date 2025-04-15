
import { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/use-mobile';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Controls the intensity of the parallax effect
  shadow?: boolean; // Whether to add a shadow effect
  gradient?: boolean; // Whether to add a gradient background
}

export function ParallaxBackground({ 
  children, 
  className = '',
  intensity = 1,
  shadow = false,
  gradient = false
}: ParallaxBackgroundProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(true);
  const [mouseMoveEnabled, setMouseMoveEnabled] = useState(false);
  const isMobile = useMobile();

  // Handle initial device support check
  useEffect(() => {
    // If on mobile, check if DeviceOrientation is supported
    if (isMobile) {
      if (!window.DeviceOrientationEvent) {
        setIsSupported(false);
        setMouseMoveEnabled(true); // Fallback to mouse movement on mobile if gyro not supported
      }
    } else {
      // On desktop, use mouse movement
      setMouseMoveEnabled(true);
    }
  }, [isMobile]);

  // Set up device orientation handling
  useEffect(() => {
    if (!isSupported || mouseMoveEnabled) return;

    // Function to handle device orientation change
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Beta is the front-to-back tilt in degrees, where front is positive
      const beta = event.beta ? event.beta : 0;
      
      // Gamma is the left-to-right tilt in degrees, where right is positive
      const gamma = event.gamma ? event.gamma : 0;
      
      // Limit the rotation to a small range for subtle effect
      // We're restricting to a maximum of 10 degrees in any direction
      const xRotation = Math.min(Math.max(gamma, -10), 10) / 3 * intensity;
      const yRotation = Math.min(Math.max(beta, -10), 10) / 3 * intensity;
      
      setRotation({ x: xRotation, y: yRotation });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isSupported, mouseMoveEnabled, intensity]);

  // Set up mouse movement handling (for desktop or mobile fallback)
  useEffect(() => {
    if (!mouseMoveEnabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position relative to the center of the window
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      
      // Apply intensity factor and limit movement
      const xRotation = x * 3 * intensity;
      const yRotation = y * 3 * intensity;
      
      setRotation({ x: xRotation, y: -yRotation });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseMoveEnabled, intensity]);

  // Combine all class names
  const baseClasses = "transition-transform duration-300";
  const shadowClass = shadow ? "shadow-xl hover:shadow-2xl" : "";
  const gradientClass = gradient ? "bg-gradient-to-br from-white/90 to-gray-100/80 dark:from-gray-800/90 dark:to-gray-900/80" : "";
  const styleClasses = `${baseClasses} ${shadowClass} ${gradientClass} ${className}`;

  // Apply transform style based on device orientation or mouse position
  const transformStyle = (isSupported || mouseMoveEnabled)
    ? { 
        transform: `perspective(1000px) rotateX(${rotation.y}deg) rotateY(${-rotation.x}deg)`,
        transformStyle: "preserve-3d"
      }
    : {};

  return (
    <div className={styleClasses} style={transformStyle}>
      {children}
    </div>
  );
}
