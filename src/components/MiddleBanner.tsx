// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { cmsService } from '../lib/supabase';

export default function MiddleBanner({ language = 'th' }) {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  const loadBanners = useCallback(async () => {
    try {
      const middleBanners = await cmsService.getBanners('middle');
      setBanners(middleBanners);
    } catch (error) {
      console.error('Error loading middle banners:', error);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    const handleBannersUpdated = () => {
      loadBanners();
    };

    window.addEventListener('cms:bannersUpdated', handleBannersUpdated);
    return () => {
      window.removeEventListener('cms:bannersUpdated', handleBannersUpdated);
    };
  }, [loadBanners]);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 8000); // 8초마다 변경
      
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[currentBanner];

  return (
    <section className="relative overflow-hidden h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-full object-cover"
          style={{ minHeight: '100%', maxHeight: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
            {banner.title}
          </h2>
          {banner.description && (
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              {banner.description}
            </p>
          )}
          
          {banner.link_url && (
            <div className="animate-fade-in-up animation-delay-400">
              <a
                href={banner.link_url}
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                {language === 'th' ? 'ดูเพิ่มเติม' : 'Learn More'}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 좌우 화살표 네비게이션 - 호버 시에만 표시 */}
      {banners.length > 1 && (
        <>
          {/* 이전 버튼 */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 bg-black/30 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* 다음 버튼 */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 bg-black/30 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* 하단 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentBanner ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                onClick={() => setCurrentBanner(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/20 text-6xl animate-float">
        ✨
      </div>
      <div className="absolute bottom-10 right-10 text-white/20 text-4xl animate-float animation-delay-1000">
        🛁
      </div>
    </section>
  );
}
