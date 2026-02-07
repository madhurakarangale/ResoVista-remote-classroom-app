import { useState, useEffect } from "react";
import logoImage from "figma:asset/338617c2b7ec5356fb321555f6e0695b4f0ae91b.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out animation to complete
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 35%, #10b981 70%, #f59e0b 100%)'
      }}
    >
      <div className="text-center">
        <div className="animate-pulse">
          <img 
            src={logoImage} 
            alt="ResoVista Logo" 
            className="w-96 h-96 mx-auto object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* Loading indicator */}
        <div className="mt-8">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-white mt-4 text-lg opacity-90">
            Connecting to your future...
          </p>
        </div>
      </div>
    </div>
  );
}