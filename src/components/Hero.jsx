import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 관리자가 설정할 수 있는 히어로 이미지들 (추후 데이터베이스에서 가져올 예정)
  const heroSlides = [
    {
      id: 1,
      title: "Premium Bath Bombs",
      subtitle: "ธรรมชาติ 100%",
      description: "สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
      buttonText: "ดูสินค้า",
      buttonAction: () => {
        console.log('Navigate to products');
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'products' }));
      }
    },
    {
      id: 2,
      title: "Luxury Spa Experience",
      subtitle: "ผ่อนคลายที่บ้าน",
      description: "เปลี่ยนห้องน้ำของคุณให้เป็นสปาส่วนตัว",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop",
      buttonText: "เริ่มช้อปปิ้ง",
      buttonAction: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'products' }))
    },
    {
      id: 3,
      title: "Natural Ingredients",
      subtitle: "ปลอดภัยสำหรับทุกคน",
      description: "ผลิตจากวัตถุดิบธรรมชาติคุณภาพสูง",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=800&fit=crop",
      buttonText: "เรียนรู้เพิ่มเติม",
      buttonAction: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'about' }))
    }
  ];

  // 자동 슬라이드 (관리자가 시간 조절 가능하도록 추후 구현)
  const slideDuration = 5000; // 5초 (추후 관리자 설정에서 변경 가능)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
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
              style={{ backgroundImage: `url(${slide.image})` }}
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
                
                {slide.buttonText && (
                  <button
                    onClick={() => {
                      console.log('Hero button clicked:', slide.buttonText);
                      if (slide.buttonAction) {
                        slide.buttonAction();
                      }
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  >
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
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
      {heroSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
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
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all ease-linear"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
            transitionDuration: `${slideDuration}ms`
          }}
        />
      </div>
    </section>
  );
}
