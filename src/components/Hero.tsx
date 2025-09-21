import { useState, useEffect, useCallback, useMemo } from "react";
import type { LanguageKey, PageKey } from "../App";
import { Button } from "./ui/button";
import AnimatedBackground from "./AnimatedBackground";
import { Zap, Heart, Star, ChevronLeft, ChevronRight, Palette, Wind, Users, Sparkles } from "lucide-react";
import SimpleEditable from "./SimpleEditable";
import AdminToggle from "./AdminToggle";
import HeroImageEditor from "./HeroImageEditor";
import { AdminService } from "../lib/adminService";
import { defaultBanners } from "../data/defaultBanners";

// AdminService에서 HeroBanner 타입 import
import type { HeroBanner } from "../lib/adminService";

// 상수 정의
const BANNER_TRANSITION_INTERVAL = 5000;
const DEFAULT_ICON_COLOR = "#FF2D55";

// 스타일 상수
const BANNER_CLASSES = {
  container: "w-full h-full bg-gradient-to-r from-[#FF2D55]/20 via-[#007AFF]/20 to-[#FFD700]/20 rounded-2xl comic-border border-4 border-white/20 flex items-center justify-center overflow-hidden",
  overlay: "absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 flex items-center justify-center",
  title: "font-fredoka text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 comic-shadow animate-bounce",
  subtitle: "font-fredoka text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#FF2D55] comic-shadow animate-pulse"
};

const BUTTON_BASE_CLASSES = "px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold font-nunito rounded-xl comic-border comic-button border-4 border-black transform hover:scale-105 transition-all shadow-lg";

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
      
      // 먼저 샘플 배너를 표시 (빠른 로딩)
      setBanners(defaultBanners.slice(0, 5)); // 5개만 사용
      setLoading(false);
      
      // 백그라운드에서 실제 데이터 로드 시도
      try {
        const bannerData = await AdminService.getHeroBanners();
        if (bannerData && bannerData.length > 0) {
          // 실제 데이터가 있으면 교체
          setBanners(bannerData.filter(banner => banner.isActive).slice(0, 5));
          console.log('✅ 실제 배너 데이터로 업데이트됨:', bannerData.length, '개');
        } else {
          console.log('📋 샘플 배너 데이터 사용 중');
        }
      } catch (dataError) {
        console.log('📋 실제 데이터 로드 실패, 샘플 데이터 유지:', dataError);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setBanners(defaultBanners.slice(0, 5));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // 현재 배너 계산을 메모이제이션
  const currentBanner = useMemo(() => {
    return banners.length > 0 ? banners[currentBannerIndex] || banners[0] : null;
  }, [banners, currentBannerIndex]);

  // 배너 업데이트 함수를 useCallback으로 래핑
  const updateBannerImage = useCallback(async (newImageUrl: string) => {
    if (!currentBanner) return;
    
    try {
      await AdminService.updateHeroBanner(currentBanner.id, {
        ...currentBanner,
        imageUrl: newImageUrl
      });
      await loadBanners();
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
    <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] overflow-hidden min-h-[1000px] py-8 sm:py-12 lg:py-16">
      <AnimatedBackground />
      
      {/* 관리자 토글 버튼 */}
      <AdminToggle />

      <div className="absolute top-4 right-4 z-20 hidden lg:block">
        <div className="bg-white rounded-full px-4 py-2 comic-border relative">
          <span className="font-fredoka text-black font-bold">POW!</span>
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white" />
        </div>
      </div>

      {/* 컨테이너 - 화면의 80%를 기본으로 하되 작은 화면에서는 꽉 참 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 메인 배너 영역 - 큰 임팩트 배너 */}
        <div className="w-full h-[450px] sm:h-[550px] md:h-[650px] lg:h-[700px] xl:h-[750px] relative mb-6 sm:mb-8 lg:mb-10">
          <div className={BANNER_CLASSES.container}>
            {currentBanner.imageUrl ? (
              <div className="w-full h-full relative">
                <img
                  src={currentBanner.imageUrl}
                  alt={`${currentBanner.title} - ${currentBanner.subtitle}`}
                  className="w-full h-full object-cover"
                />
                <div className={BANNER_CLASSES.overlay}>
                  <div className="text-center text-white px-4">
                    <h1 className={BANNER_CLASSES.title}>
                      {currentBanner.title}
                    </h1>
                    <h2 className={BANNER_CLASSES.subtitle}>
                      {currentBanner.subtitle}
                    </h2>
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
              <div className="w-full h-full flex items-center justify-center text-center px-4">
                <div className="relative">
                  <h1 className="font-fredoka text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 comic-shadow animate-bounce">
                    {currentBanner.title}
                  </h1>
                  <h2 className="font-fredoka text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#FF2D55] mb-6 comic-shadow animate-pulse relative">
                    {currentBanner.subtitle}
                    <Zap className="absolute -top-2 -right-4 sm:-right-8 w-8 h-8 sm:w-12 sm:h-12 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: "3s" }} />
                  </h2>
                  <p className="font-nunito text-lg sm:text-xl text-[#B8C4DB] font-medium">
                    {currentBanner.description}
                  </p>
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
            <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 sm:space-x-4 bg-black/50 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevBanner}
                className="border-white/20 text-white hover:bg-white/10 w-7 h-7 sm:w-8 sm:h-8 p-0"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
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
                className="border-white/20 text-white hover:bg-white/10 w-7 h-7 sm:w-8 sm:h-8 p-0"
                aria-label="Next banner"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 하단 콘텐츠 영역 */}
        <div className="max-w-5xl mx-auto text-center relative">
          {/* 태그라인 */}
          <div className="flex items-center justify-center mb-8">
            {renderIcon(currentBanner.iconName, currentBanner.iconColor, "w-6 h-6 sm:w-7 sm:h-7 mr-3 animate-pulse")}
            <span className="font-nunito text-[#FFD700] text-xl sm:text-2xl font-bold animate-bounce">
              {currentBanner.tagline}
            </span>
            {renderIcon(currentBanner.iconName, currentBanner.iconColor, "w-6 h-6 sm:w-7 sm:h-7 ml-3 animate-pulse")}
          </div>

          {/* 설명 */}
          <p className="font-nunito text-lg sm:text-xl text-[#B8C4DB] mb-8 sm:mb-10 leading-relaxed font-medium max-w-3xl mx-auto px-4">
            {currentBanner.description}
          </p>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
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
          
          {/* 하단 아이콘 섹션 */}
          <div className="flex items-center justify-center space-x-6 sm:space-x-12 text-white pb-8">
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:scale-110 transition-transform bg-black/20 backdrop-blur-sm rounded-full px-4 py-3" 
              onClick={() => navigateTo("gallery")}
            >
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse text-[#FFD700]" />
              <span className="font-nunito text-base sm:text-xl font-bold">
                {language === "th" ? "แกลเลอรี่" : "Gallery"}
              </span>
            </div>
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:scale-110 transition-transform bg-black/20 backdrop-blur-sm rounded-full px-4 py-3" 
              onClick={() => navigateTo("board")}
            >
              <Star className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-[#FFD700]" />
              <span className="font-nunito text-base sm:text-xl font-bold">
                {language === "th" ? "กระทู้" : "Board"}
              </span>
            </div>
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:scale-110 transition-transform bg-black/20 backdrop-blur-sm rounded-full px-4 py-3" 
              onClick={() => navigateTo("contact")}
            >
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 animate-bounce text-[#FFD700]" />
              <span className="font-nunito text-base sm:text-xl font-bold">
                {language === "th" ? "ชุมชน" : "Community"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}