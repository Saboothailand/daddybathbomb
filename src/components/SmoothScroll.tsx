import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId || '');
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add sparkle effect on button click
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.comic-button');
      
      if (button) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX - 10 + 'px';
        sparkle.style.top = e.clientY - 10 + 'px';
        sparkle.style.width = '20px';
        sparkle.style.height = '20px';
        sparkle.style.fontSize = '20px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkleOut 1s ease-out forwards';
        sparkle.innerText = '✨';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('click', handleButtonClick as EventListener);

    // Add CSS for sparkle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sparkleOut {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(2) rotate(180deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleButtonClick as EventListener);
      style.remove();
    };
  }, []);

  return null;
}