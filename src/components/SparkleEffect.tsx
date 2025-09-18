import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function SparkleEffect() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const createSparkle = (e: MouseEvent) => {
    const colors = ['#FFD700', '#FF2D55', '#007AFF', '#00FF88', '#AF52DE'];
    const newSparkle: Sparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setSparkles(prev => [...prev, newSparkle]);

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
  };

  useEffect(() => {
    const buttons = document.querySelectorAll('.comic-button');
    
    buttons.forEach(button => {
      button.addEventListener('click', createSparkle as EventListener);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', createSparkle as EventListener);
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-ping"
          style={{
            left: sparkle.x - sparkle.size / 2,
            top: sparkle.y - sparkle.size / 2,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: '50%',
            animationDuration: '1s',
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </div>
  );
}