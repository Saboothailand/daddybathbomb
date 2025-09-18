import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; delay: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 3
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}
      
      {/* Floating comic elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-[#FFD700] rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-[#00FF88] rotate-45 opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-10 h-10 bg-[#FF2D55] rounded-full opacity-20 animate-ping" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-20 right-1/3 w-12 h-12 border-2 border-[#007AFF] rounded-full opacity-30 animate-spin" style={{ animationDuration: '8s' }}></div>
      
      {/* Additional floating shapes */}
      <div className="absolute top-60 left-1/3 w-4 h-4 bg-[#AF52DE] rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-80 right-1/4 w-6 h-6 bg-[#FFD700] rotate-45 opacity-35 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
    </div>
  );
}