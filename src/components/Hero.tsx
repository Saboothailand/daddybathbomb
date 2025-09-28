import { useState, useEffect, useCallback, useMemo } from "react";
import type { LanguageKey, PageKey } from "../App";
import { Button } from "./ui/button";
import AnimatedBackground from "./AnimatedBackground";
import { Zap, Heart, Star, ChevronLeft, ChevronRight, Palette, Wind, Users, Sparkles, Type } from "lucide-react";
import SimpleEditable from "./SimpleEditable";
import AdminToggle from "./AdminToggle";
import HeroImageEditor from "./HeroImageEditor";
import { AdminService } from "../lib/adminService";
import { hasSupabaseCredentials } from "../lib/supabase";

// AdminService에서 HeroBanner 타입 import
import type { HeroBanner } from "../lib/adminService";

// 상수 정의
const BANNER_TRANSITION_INTERVAL = 5000;
const DEFAULT_ICON_COLOR = "#FF2D55";

// 스타일 상수
const BANNER_CLASSES = {
  container: "w-full h-full bg-gradient-to-r from-[#FF2D55]/20 via-[#007AFF]/20 to-[#FFD700]/20 rounded-2xl comic-border border-4 border-white/20 flex items-center justify-center overflow-hidden min-h-full",
  overlay: "absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 flex items-center justify-center",
  title: "font-fredoka text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-4 sm:mb-6 comic-shadow animate-bounce",
  subtitle: "font-fredoka text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#FF2D55] mb-4 sm:mb-6 comic-shadow animate-pulse",
  description: "font-nunito text-base sm:text-lg md:text-xl lg:text-2xl text-[#B8C4DB] font-medium max-w-2xl leading-relaxed"
};

const BUTTON_BASE_CLASSES = "px-10 sm:px-14 py-6 sm:py-8 text-xl sm:text-2xl lg:text-3xl font-bold font-nunito rounded-2xl comic-border comic-button border-4 border-black transform hover:scale-105 transition-all shadow-2xl";

// 하단 액션 영역 스타일
const ACTION_STYLES = {
  tagline: "font-nunito text-[#FFD700] text-xl sm:text-2xl lg:text-3xl font-bold animate-bounce",
  navItem: "font-nunito text-base sm:text-lg lg:text-xl font-bold"
};

// 아이콘 매핑
const iconMap = {
  Heart,
  Zap,
  Star,
  Palette,
  Wind,
  Users,
  Sparkles,
} as const;

// 타입 정의
type IconName = keyof typeof iconMap;

const copyMap: Record<LanguageKey, {
  headlineTop: string;
  headlineMid: string;
  headlineBottom: string;
  tagline: string;
  primaryCta: string;
  secondaryCta: string;
}> = {
  th: {
    headlineTop: "DADDY",
    headlineMid: "BATH BOMB",
    headlineBottom: "ฮีโร่อ่างอาบน้ำ",
    tagline: "สนุกสุดฟอง สดชื่นทุกสี เพื่อคุณ",
    primaryCta: "ช้อปบาธบอม",
    secondaryCta: "ดูเรื่องราวสีสัน",
  },
  en: {
    headlineTop: "DADDY",
    headlineMid: "BATH BOMB",
    headlineBottom: "Super Bath Adventures",
    tagline: "Super Fun. Super Fizzy. Super You.",
    primaryCta: "Shop Fun Bombs",
    secondaryCta: "Play in Colors",
  },
};

type HeroProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

export default function Hero({ language, navigateTo }: HeroProps) {
  // 복사본 텍스트 메모이제이션
  const copy = useMemo(() => copyMap[language], [language]);
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // 개선된 아이콘 렌더링 함수
  const renderIcon = useCallback((iconName?: string, color?: string, className: string = "w-8 h-8"): JSX.Element => {
    if (!iconName || !(iconName in iconMap)) {
      return <Heart className={className} style={{ color: color || DEFAULT_ICON_COLOR }} />;
    }
    const IconComponent = iconMap[iconName as IconName];
    return <IconComponent className={className} style={{ color: color || DEFAULT_ICON_COLOR }} />;
  }, []);

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 배너 로딩 시작...');
      
      // 항상 AdminService를 통해 데이터 로드 (Supabase 연결 상태에 따라 자동 처리)
      try {
        const bannerData = await AdminService.getHeroBanners();
        console.log('📊 받은 배너 데이터:', bannerData);
        
        if (bannerData && bannerData.length > 0) {
          const activeBanners = bannerData.filter(banner => banner.isActive).slice(0, 5);
          setBanners(activeBanners);
          console.log('✅ 배너 데이터 로드됨:', activeBanners.length, '개');
        } else {
          // 데이터가 없으면 기본 데이터 사용
          setBanners(AdminService.getDefaultHeroBanners().slice(0, 5));
          console.log('📋 기본 배너 데이터 사용');
        }
      } catch (dataError) {
        console.error('배너 로드 실패:', dataError);
        setBanners(AdminService.getDefaultHeroBanners().slice(0, 5));
        console.log('📋 오류 - 기본 데이터 사용');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading banners:', error);
      setBanners(AdminService.getDefaultHeroBanners().slice(0, 5));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // 배너 업데이트 이벤트 리스너
  useEffect(() => {
    const handleBannerUpdate = () => {
      console.log('🔄 배너 업데이트 이벤트 수신 - 배너 다시 로드');
      loadBanners();
    };

    window.addEventListener('bannerUpdated', handleBannerUpdate);
    
    return () => {
      window.removeEventListener('bannerUpdated', handleBannerUpdate);
    };
  }, [loadBanners]);

  // 현재 배너 계산을 메모이제이션
  const currentBanner = useMemo(() => {
    return banners.length > 0 ? banners[currentBannerIndex] || banners[0] : null;
  }, [banners, currentBannerIndex]);

  // 배너 업데이트 함수를 useCallback으로 래핑
  const updateBannerImage = useCallback(async (newImageUrl: string) => {
    if (!currentBanner) return;
    
    try {
      console.log('🔄 배너 이미지 업데이트 시작:', newImageUrl);
      await AdminService.updateHeroBanner(currentBanner.id, {
        ...currentBanner,
        imageUrl: newImageUrl
      });
      console.log('✅ 배너 이미지 업데이트 완료');
      
      // 배너 데이터 다시 로드
      await loadBanners();
      
      // 전역 이벤트 발생시켜 다른 컴포넌트들에게 알림
      window.dispatchEvent(new CustomEvent('bannerUpdated'));
    } catch (error) {
      console.error('Error updating banner image:', error);
    }
  }, [currentBanner, loadBanners]);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, BANNER_TRANSITION_INTERVAL);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToNextBanner = useCallback(() => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrevBanner = useCallback(() => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center w-full">
          <div className="animate-pulse">
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7] bg-white/10 rounded-2xl mb-8"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentBanner) {
    return (
      <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">No banners available</div>
          <p className="text-[#B8C4DB] mt-4">Please check back later or contact support.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] overflow-hidden py-2 sm:py-4 lg:py-6">
      
      {/* 관리자 토글 버튼 */}
      <AdminToggle />

      <div className="absolute top-4 right-4 z-20 hidden lg:block">
        <div className="bg-white rounded-full px-4 py-2 comic-border relative">
          <span className="font-fredoka text-black font-bold">POW!</span>
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white" />
        </div>
      </div>

      {/* 컨테이너 - 100% 너비로 완전 반응형 */}
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 pt-1 sm:pt-2 lg:pt-3">
        {/* 메인 배너 영역 - 이미지 비율에 맞춘 크기 */}
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] relative mb-0 sm:mb-0 lg:mb-1">
          <div className={BANNER_CLASSES.container}>
            {currentBanner.imageUrl ? (
              <div className="w-full h-[110%] relative -mt-[5%]">
                <img
                  src={currentBanner.imageUrl}
                  alt={`${currentBanner.mainTitle} - ${currentBanner.subTitle}`}
                  className="w-full h-full object-contain"
                  style={{ minHeight: '100%', maxHeight: '100%' }}
                />
                <div className={BANNER_CLASSES.overlay}>
                  <div className="text-center text-white px-4">
                    <h1 className={BANNER_CLASSES.title}>
                      {currentBanner.mainTitle}
                    </h1>
                    <h2 className={BANNER_CLASSES.subtitle}>
                      {currentBanner.subTitle}
                    </h2>
                    <p className={`${BANNER_CLASSES.description} mx-auto mt-2`}>
                      {currentBanner.description}
                    </p>
                  </div>
                </div>
                <HeroImageEditor
                  currentImageUrl={currentBanner.imageUrl}
                  currentEmoji="🦸‍♂️"
                  onSave={updateBannerImage}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center px-4">
                <div className="flex w-full">
                  {/* 왼쪽: 텍스트 콘텐츠 - 크기 증가 및 간격 조정 */}
                  <div className="flex-1 text-left pl-8 lg:pl-16 flex flex-col justify-center">
                    <h1 className={BANNER_CLASSES.title}>
                      {currentBanner.mainTitle}
                    </h1>
                    <h2 className={BANNER_CLASSES.subtitle}>
                      {currentBanner.subTitle}
                    </h2>
                    <p className={BANNER_CLASSES.description}>
                      {currentBanner.description}
                    </p>
                  </div>
                  
                  {/* 오른쪽: 슈퍼맨 아이콘 - 3배 더 크게, 우측 정렬 */}
                  <div className="flex-1 flex justify-end items-center pr-8 lg:pr-16">
                    <div className="text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] xl:text-[26rem] 2xl:text-[30rem] animate-bounce">
                      🦸‍♂️
                    </div>
                  </div>
                  
                  <HeroImageEditor
                    currentImageUrl=""
                    currentEmoji="🦸‍♂️"
                    onSave={updateBannerImage}
                    className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 opacity-50 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* 배너 네비게이션 - 배너 하단에 위치 */}
          {banners.length > 1 && (
            <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 sm:space-x-4 bg-black/70 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-white/20">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevBanner}
                className="border-gray-300 bg-white text-black hover:bg-gray-100 w-7 h-7 sm:w-8 sm:h-8 p-0"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </Button>
              
              <div className="flex space-x-1 sm:space-x-2" role="tablist" aria-label="Banner navigation">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === currentBannerIndex
                        ? "bg-[#FF2D55] scale-125"
                        : "bg-white/70 hover:bg-white/90"
                    }`}
                    aria-label={`Go to banner ${index + 1}`}
                    aria-current={index === currentBannerIndex ? "true" : "false"}
                    role="tab"
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextBanner}
                className="border-gray-300 bg-white text-black hover:bg-gray-100 w-7 h-7 sm:w-8 sm:h-8 p-0"
                aria-label="Next banner"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </Button>
            </div>
          )}
        </div>

        {/* 하단 액션 영역 - 중복 제거 및 간소화 */}
        <div className="w-full text-center relative mt-0 sm:mt-0 lg:mt-1">
          {/* 태그라인 */}
          <div className="flex items-center justify-center mb-1 sm:mb-1">
            {renderIcon(currentBanner.iconName, currentBanner.iconColor, "w-7 h-7 sm:w-8 sm:h-8 mr-3 animate-pulse")}
            <span className={ACTION_STYLES.tagline}>
              {currentBanner.tagline}
            </span>
            {renderIcon(currentBanner.iconName, currentBanner.iconColor, "w-7 h-7 sm:w-8 sm:h-8 ml-3 animate-pulse")}
          </div>

          {/* 버튼들 - 크기 증가 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-2 sm:mb-2 px-4">
            <Button
              size="lg"
              className={`bg-[#FF2D55] hover:bg-[#FF1744] text-white ${BUTTON_BASE_CLASSES}`}
              onClick={() => navigateTo("gallery")}
              aria-label={`${currentBanner.primaryButtonText} - Navigate to gallery`}
            >
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
              {currentBanner.primaryButtonText}
            </Button>
            <Button
              size="lg"
              className={`bg-[#007AFF] hover:bg-[#0051D5] text-white ${BUTTON_BASE_CLASSES}`}
              onClick={() => navigateTo("board")}
              aria-label={`${currentBanner.secondaryButtonText} - Navigate to board`}
            >
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
              {currentBanner.secondaryButtonText}
            </Button>
          </div>
          
          {/* 하단 네비게이션 섹션 - 크기 증가 */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-8 lg:space-x-12 text-white pb-1 sm:pb-1">
            <div 
              className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:scale-110 transition-transform bg-black/30 backdrop-blur-lg rounded-2xl px-6 sm:px-8 py-4 sm:py-6" 
              onClick={() => navigateTo("gallery")}
            >
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 animate-pulse text-[#FFD700]" />
              <span className={ACTION_STYLES.navItem}>
                {language === "th" ? "แกลเลอรี่" : "Gallery"}
              </span>
            </div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#FFD700] rounded-full animate-pulse" />
            <div 
              className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:scale-110 transition-transform bg-black/30 backdrop-blur-lg rounded-2xl px-6 sm:px-8 py-4 sm:py-6" 
              onClick={() => navigateTo("board")}
            >
              <Star className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 animate-spin text-[#FFD700]" />
              <span className={ACTION_STYLES.navItem}>
                {language === "th" ? "กระทู้" : "Board"}
              </span>
            </div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#FFD700] rounded-full animate-pulse" />
            <div 
              className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:scale-110 transition-transform bg-black/30 backdrop-blur-lg rounded-2xl px-6 sm:px-8 py-4 sm:py-6" 
              onClick={() => navigateTo("contact")}
            >
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 animate-bounce text-[#FFD700]" />
              <span className={ACTION_STYLES.navItem}>
                {language === "th" ? "ชุมชน" : "Community"}
              </span>
            </div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#FFD700] rounded-full animate-pulse" />
            <div 
              className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:scale-110 transition-transform bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-lg rounded-2xl px-6 sm:px-8 py-4 sm:py-6 border-2 border-purple-400/30" 
              onClick={() => navigateTo("textbg")}
            >
              <Type className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 animate-pulse text-[#9333EA]" />
              <span className={ACTION_STYLES.navItem}>
                {language === "th" ? "텍스트+배경" : "Text+BG"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
