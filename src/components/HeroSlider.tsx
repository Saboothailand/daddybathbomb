import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { supabase } from '../lib/supabase'

interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  button_text?: string
  button_link?: string
  order_index: number
  is_active: boolean
}

interface SliderSettings {
  slide_duration: number
  auto_play: boolean
  show_indicators: boolean
  show_arrows: boolean
  fade_effect: boolean
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [settings, setSettings] = useState<SliderSettings>({
    slide_duration: 5000,
    auto_play: true,
    show_indicators: true,
    show_arrows: true,
    fade_effect: true
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const { language, t } = useI18n()

  useEffect(() => {
    fetchSlides()
    fetchSettings()
  }, [])

  useEffect(() => {
    if (!settings.auto_play || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, settings.slide_duration)

    return () => clearInterval(interval)
  }, [slides.length, settings.slide_duration, settings.auto_play])

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setSlides(data || [])
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('slider_settings')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error
      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching slider settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const handleButtonClick = (link?: string) => {
    if (link) {
      if (link.startsWith('/')) {
        // 내부 링크
        window.dispatchEvent(new CustomEvent('navigate', { detail: link.substring(1) }))
      } else {
        // 외부 링크
        window.open(link, '_blank')
      }
    }
  }

  if (loading || slides.length === 0) {
    return (
      <section className="relative h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white max-w-4xl px-4">
                {slide.subtitle && (
                  <p className="text-xl md:text-2xl font-light mb-4 opacity-90 animate-fade-in-up">
                    {slide.subtitle}
                  </p>
                )}
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-200">
                  {slide.title}
                </h1>
                
                {slide.description && (
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                    {slide.description}
                  </p>
                )}
                
                {slide.button_text && (
                  <button
                    onClick={() => handleButtonClick(slide.button_link)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl animate-fade-in-up animation-delay-600"
                  >
                    {slide.button_text}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {settings.show_arrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {settings.show_indicators && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide Progress Bar */}
      {settings.auto_play && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              transitionDuration: `${settings.slide_duration}ms`
            }}
          />
        </div>
      )}

      {/* Floating Elements for Visual Appeal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float-slow"></div>
      </div>
    </section>
  )
}

// CSS 애니메이션을 위한 스타일 (Tailwind에 추가 필요)
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}
`

// 스타일을 head에 추가
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}
