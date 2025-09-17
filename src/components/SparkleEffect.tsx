import { useEffect } from 'react'

export default function SparkleEffect() {
  useEffect(() => {
    const sparkles: HTMLElement[] = []
    
    const createSparkle = () => {
      const sparkle = document.createElement('div')
      sparkle.className = 'fixed pointer-events-none z-10'
      sparkle.style.left = Math.random() * window.innerWidth + 'px'
      sparkle.style.top = Math.random() * window.innerHeight + 'px'
      sparkle.style.width = '4px'
      sparkle.style.height = '4px'
      sparkle.style.background = 'linear-gradient(45deg, #ec4899, #8b5cf6)'
      sparkle.style.borderRadius = '50%'
      sparkle.style.animation = 'sparkle 2s ease-in-out forwards'
      
      document.body.appendChild(sparkle)
      sparkles.push(sparkle)
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle)
        }
        const index = sparkles.indexOf(sparkle)
        if (index > -1) {
          sparkles.splice(index, 1)
        }
      }, 2000)
    }
    
    // Add sparkle animation CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes sparkle {
        0% {
          opacity: 0;
          transform: scale(0) rotate(0deg);
        }
        50% {
          opacity: 1;
          transform: scale(1) rotate(180deg);
        }
        100% {
          opacity: 0;
          transform: scale(0) rotate(360deg);
        }
      }
    `
    document.head.appendChild(style)
    
    const interval = setInterval(createSparkle, 500)
    
    return () => {
      clearInterval(interval)
      sparkles.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle)
        }
      })
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return null
}
